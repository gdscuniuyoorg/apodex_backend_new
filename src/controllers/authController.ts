import { RequestHandler, Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import sendEmail from '../utils/email';
import crypto from 'crypto';
import { ICookieOption, TokenUser } from '../types';
import confirmEmailTemplate from '../utils/confirmEmailTemplate';
import ENV from '../env_files';
import querystring from 'querystring';
import axios from 'axios';

export interface CustomRequest extends Request {
  user?: IUser;
}

class AuthController {
  signToken = (user: TokenUser, isRefresh = false) => {
    return jwt.sign(isRefresh ? { id: user.id } : user, ENV.JWT_SECRET || '', {
      expiresIn: isRefresh ? ENV.JWT_COOKIE_EXPIRES_IN : ENV.JWT_SECRET_IN,
    });
  };

  createAndSendToken = (
    user: any,
    statusCode: number,
    res: Response,
    sendRes: boolean,
  ) => {
    const token = this.signToken({ id: user.id, email: user.email });
    const refreshToken = this.signToken({ id: user.id }, true);
    const cookieExpireTime = ENV.JWT_COOKIE_EXPIRES_IN;

    // check if cookie expire time is available
    if (!cookieExpireTime)
      return new AppError('Cookie expire time not found', 400);

    // set cookie options
    const cookieOptions = {
      expires: new Date(
        Date.now() + parseFloat(cookieExpireTime) * 24 * 60 * 60 * 1000,
      ),
    };

    // sends a secure jwt token to the browser that would be sent back to us upon every request
    // if (ENV.NODE_ENV === 'production') cookieOptions.secure = true;

    res.set('Set-Cookie', [token, refreshToken]);
    res.cookie('jwt', token, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);

    // this makes the password and active not show in the response it send to the browser
    user.password = undefined;

    if (sendRes) {
      return res.status(statusCode).json({
        status: 'success',
        token,
        refreshToken,
        user,
      });
    }
  };

  //   signup or signin with google
  googleSignUpInitiate: RequestHandler = catchAsync(
    async (req, res, next): Promise<void> => {
      const clientId = ENV.GOOGLE_CLIENT_ID;
      const redirectUri = ENV.GOOGLE_REDIRECT_URI;
      const scopes = ['email', 'profile']; // Define desired scopes

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&redirect_uri=${redirectUri}` +
        `&response_type=code&scope=${scopes.join('+')}`;

      // Return the URL to frontend
      res.status(200).json({ url: authUrl, status: 'success' });
    },
  );

  googleSignUpCallback: RequestHandler = catchAsync(async (req, res, next) => {
    const { code } = req.query;

    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const params: any = {
      code,
      client_id: ENV.GOOGLE_CLIENT_ID,
      client_secret: ENV.GOOGLE_CLIENT_SECRET,
      redirect_uri: ENV.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    };

    const response = await axios.post(tokenUrl, querystring.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { id_token } = response.data;

    const { email, email_verified, picture, name } = jwt.decode(
      id_token,
    ) as JwtPayload;

    if (!email_verified) {
      return next(new AppError('Google account is not verified', 403));
    }

    const user = await User.findOneAndUpdate(
      { email: email },
      {
        email: email,
        name: name,
        image: picture,
        isEmailConfirmed: true,
      },
      { upsert: true, new: true },
    );

    this.createAndSendToken(user, 201, res, false);
    res.redirect(ENV.FRONTEND_URL);
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

      res.redirect(ENV.FRONTEND_URL);
    },
  );

  signup: RequestHandler = catchAsync(async (req, res, next): Promise<void> => {
    const { name, email, password, passwordConfirm, role } = req.body;
    const user: IUser = await User.create({
      name,
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

    const confirmEmailUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/confirmEmail/${confirmEmailToken}`;

    const html = confirmEmailTemplate(confirmEmailUrl);
    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Confirmation',
        html,
      });

      res.status(201).json({
        status: 'success',
        message: 'Email Confirmation token sent successfully',
      });
    } catch (err: any) {
      res.status(400).json({
        message: err.message || 'There was an error sending email, try again',
        status: 'error',
        error: err,
      });
    }
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

    this.createAndSendToken(user, 201, res, true);
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

      const resetUrl = `${req.protocol}://${req.get(
        'host',
      )}/api/v1/user/resetPassword/${resetToken}`;

      const message = `Forget your password, Visit this link to reset your password : ${resetUrl} \nIf you didnt forget your password, ignore this email`;

      try {
        await sendEmail({
          email: user.email,
          subject: 'Reset Password',
          message,
        });

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

      const decoded = jwt.verify(token, ENV.JWT_SECRET || '') as JwtPayload;

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
      ENV.JWT_SECRET || '',
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
}

export default new AuthController();
