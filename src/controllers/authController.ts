import { RequestHandler, Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Email from '../utils/email';
import crypto from 'crypto';
import { TokenUser } from '../types';
import querystring from 'querystring';
import axios from 'axios';
import { CookieOptions } from 'express';
import { CustomRequest } from '../types';

class AuthController {
  signToken = (user: TokenUser, isRefresh = false) => {
    return jwt.sign(
      isRefresh ? { id: user.id } : user,
      process.env.JWT_SECRET || '',
      {
        expiresIn: isRefresh
          ? process.env.JWT_COOKIE_EXPIRES_IN
          : process.env.JWT_SECRET_IN,
      },
    );
  };

  createAndSendToken = (
    user: any,
    statusCode: number,
    res: Response,
    req: Request,
    sendRes: boolean,
  ) => {
    const token = this.signToken({ id: user.id, email: user.email });
    const refreshToken = this.signToken({ id: user.id }, true);
    const cookieExpireTime = process.env.JWT_COOKIE_EXPIRES_IN;

    // check if cookie expire time is available
    if (!cookieExpireTime)
      return new AppError('Cookie expire time not found', 400);

    // set cookie options
    const cookieOptions: CookieOptions = {
      maxAge: 900000,
      sameSite: 'lax',
      domain: `.${req.get('host')}`,
      httpOnly: true,
      secure: false,
      path: '/',
    };

    // sends a secure jwt token to the browser that would be sent back to us upon every request
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);

    // this makes the password and active not show in the response it send to the browser
    user.password = undefined;
    user.confirmEmailToken = undefined;

    if (sendRes) {
      return res.status(statusCode).json({
        status: 'success',
        token,
        refreshToken,
        user,
      });
    }
  };

  fetchUserDetails: RequestHandler = catchAsync(async (req, res, next) => {
    const { userId } = req.query;

    const user = await User.findOne({ id: userId });
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    this.createAndSendToken(res, 201, res, req, true);
  });

  //   signup or signin with google
  googleSignUpInitiate: RequestHandler = catchAsync(
    async (req, res, next): Promise<void> => {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const redirectUri = process.env.GOOGLE_REDIRECT_URI;
      const scopes = ['email', 'profile']; // Define desired scopes

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&redirect_uri=${redirectUri}` +
        `&response_type=code&scope=${scopes.join('+')}`;

      res.status(200).json({ url: authUrl, status: 'success' });
    },
  );

  googleSignUpCallback: RequestHandler = catchAsync(async (req, res, next) => {
    const { code } = req.query;

    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const params: any = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    };

    const response = await axios.post(tokenUrl, querystring.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { id_token } = response.data;

    const { email, email_verified, picture, given_name, family_name } =
      jwt.decode(id_token) as JwtPayload;

    if (!email_verified) {
      return next(new AppError('Google account is not verified', 403));
    }

    const user = await User.findOneAndUpdate(
      { email: email },
      {
        email: email,
        firstName: given_name,
        lastName: family_name,
        image: picture,
        isEmailConfirmed: true,
      },
      { upsert: true, new: true },
    );

    this.createAndSendToken(user, 201, res, req, false);
    res.redirect(`${process.env.FRONTEND_URL}`);
  });

  confirmEmailAndActivateAccount: RequestHandler = catchAsync(
    async (req, res, next) => {
      const { confirmEmailToken } = req.params;

      const user: IUser | null = await User.findOne({
        confirmEmailToken,
      });

      if (!user) {
        return next(new AppError('User not found', 404));
      }
      user.isEmailConfirmed = true;
      user.save({ validateBeforeSave: false });

      res.redirect(process.env.FRONTEND_URL);
    },
  );

  signup: RequestHandler = catchAsync(async (req, res, next): Promise<void> => {
    const { email, password, passwordConfirm, role } = req.body;
    const user: IUser = await User.create({
      email,
      password,
      passwordConfirm,
      role,
    });

    if (!user) {
      return next(
        new AppError('Sign-up not successfull, an error occured', 400),
      );
    }

    // send confirmation email
    const confirmEmailToken = crypto.randomBytes(32).toString('hex');
    user.confirmEmailToken = confirmEmailToken;
    await user.save({ validateBeforeSave: false });

    //I am holding off on sending emails for the time being
    const confirmEmailUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/confirmEmail/${confirmEmailToken}`;

    // await new Email(user, confirmEmailUrl).sendVerifyAndWelcome();

    this.createAndSendToken(user, 201, res, req, true);
  });

  login: RequestHandler = catchAsync(async (req, res, next): Promise<void> => {
    const { email, password } = req.body;

    //check if email and password is valid
    if (!email || !password) {
      return next(new AppError('Please provide a password and an email', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user!.comparePassword(password))) {
      return next(new AppError('User email or password is invalid', 404));
    }

    this.createAndSendToken(user, 201, res, req, true);
  });

  forgetPassword: RequestHandler = catchAsync(
    async (req, res, next): Promise<void> => {
      // forget password
      const { email } = req.body;

      // find account to confirm availability
      const user = await User.findOne({ email });

      if (!user) {
        return next(new AppError('No record found for this email', 404));
      }

      const resetToken = user.sendPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      try {
        const resetUrl = `${req.protocol}://${req.get(
          'host',
        )}/api/v1/user/resetPassword/${resetToken}`;

        // await new Email(user, resetUrl).sendPasswordReset();

        res.status(201).json({
          status: 'success',
          message: 'Password reset token sent successfully',
        });
      } catch (err) {
        res
          .status(400)
          .json({ message: 'There was an error, try again', status: 'error' });
      }
    },
  );

  resetPassword: RequestHandler = catchAsync(
    async (req, res, next): Promise<void> => {
      // confirm the reset Token

      const { password, passwordConfirm } = req.body;

      const { resetToken } = req.params;

      const passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      const user = await User.findOne({ passwordResetToken });

      if (!user || !user.checkResetTokenExpiration()) {
        return next(new AppError('Invalid or expired reset Token', 400));
      }

      user.password = password;
      user.passwordConfirm = passwordConfirm;
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpireTime = undefined;
      await user.save();

      res.status(201).json({
        message: 'success',
      });
    },
  );

  protect: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next): Promise<void> => {
      // check the headers bearer token
      let token: string | undefined;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return next(new AppError('auth token not available in header', 404));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || '',
      ) as JwtPayload;

      const user = await User.findOne({
        _id: decoded.id,
        email: decoded.email,
      });

      if (!user) {
        return next(new AppError('The user does not exist', 400));
      }

      const isChangePassword = user.checkPasswordChange(decoded.iat as number);

      if (isChangePassword) {
        return next(
          new AppError(
            'This user is a fraud, password was changed amidst request',
            400,
          ),
        );
      }

      req.user = user;
      next();
    },
  );
  // send refresh token
  refreshToken: RequestHandler = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET || '',
    ) as JwtPayload;

    const user = await User.findOne({
      _id: decoded.id,
    });

    if (!user) {
      return next(new AppError('Refresh token is invalid', 400));
    }

    res.status(200).json({ token: this.signToken({ id: user.id }) });
  });

  restrictTo = (...roles: string[]): RequestHandler =>
    catchAsync(async (req: CustomRequest, res, next): Promise<void> => {
      if (!roles.includes(req.user?.role as string)) {
        res.status(402).json({
          message: 'Does not have permission to access resource',
          status: 'failed',
        });
      }

      next();
    });

  googleRedirect: RequestHandler = catchAsync(async (req, res, next) => {
    res.redirect(process.env.FRONTEND_URL);
  });
}

export default new AuthController();
