"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = __importDefault(require("../utils/email"));
const crypto_1 = __importDefault(require("crypto"));
const querystring_1 = __importDefault(require("querystring"));
const axios_1 = __importDefault(require("axios"));
class AuthController {
    constructor() {
        this.signToken = (user, isRefresh = false) => {
            return jsonwebtoken_1.default.sign(isRefresh ? { id: user.id } : user, process.env.JWT_SECRET || '', {
                expiresIn: isRefresh
                    ? process.env.JWT_COOKIE_EXPIRES_IN
                    : process.env.JWT_SECRET_IN,
            });
        };
        this.createAndSendToken = (user, statusCode, res, req, sendRes) => {
            const token = this.signToken({ id: user.id, email: user.email });
            const refreshToken = this.signToken({ id: user.id }, true);
            const cookieExpireTime = process.env.JWT_COOKIE_EXPIRES_IN;
            // check if cookie expire time is available
            if (!cookieExpireTime)
                return new appError_1.default('Cookie expire time not found', 400);
            // set cookie options
            const cookieOptions = {
                maxAge: 900000,
                sameSite: 'lax',
                domain: `.${req.get('host')}`,
                httpOnly: true,
                secure: false,
                path: '/',
            };
            // sends a secure jwt token to the browser that would be sent back to us upon every request
            if (process.env.NODE_ENV === 'production')
                cookieOptions.secure = true;
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
        this.fetchUserDetails = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.query;
            const user = yield userModel_1.default.findOne({ id: userId });
            if (!user) {
                return next(new appError_1.default('User not found', 404));
            }
            this.createAndSendToken(res, 201, res, req, true);
        }));
        //   signup or signin with google
        this.googleSignUpInitiate = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const clientId = process.env.GOOGLE_CLIENT_ID;
            const redirectUri = process.env.GOOGLE_REDIRECT_URI;
            const scopes = ['email', 'profile']; // Define desired scopes
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
                `client_id=${clientId}&redirect_uri=${redirectUri}` +
                `&response_type=code&scope=${scopes.join('+')}`;
            res.status(200).json({ url: authUrl, status: 'success' });
        }));
        this.googleSignUpCallback = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { code } = req.query;
            const tokenUrl = 'https://oauth2.googleapis.com/token';
            const params = {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
            };
            const response = yield axios_1.default.post(tokenUrl, querystring_1.default.stringify(params), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            const { id_token } = response.data;
            const { email, email_verified, picture, given_name, family_name } = jsonwebtoken_1.default.decode(id_token);
            if (!email_verified) {
                return next(new appError_1.default('Google account is not verified', 403));
            }
            const user = yield userModel_1.default.findOneAndUpdate({ email: email }, {
                email: email,
                firstName: given_name,
                lastName: family_name,
                image: picture,
                isEmailConfirmed: true,
            }, { upsert: true, new: true });
            this.createAndSendToken(user, 201, res, req, false);
            res.redirect(`${process.env.FRONTEND_URL}`);
        }));
        this.confirmEmailAndActivateAccount = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { confirmEmailToken } = req.params;
            const user = yield userModel_1.default.findOne({
                confirmEmailToken,
            });
            if (!user) {
                return next(new appError_1.default('User not found', 404));
            }
            user.isEmailConfirmed = true;
            user.save({ validateBeforeSave: false });
            res.redirect(process.env.FRONTEND_URL);
        }));
        this.signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password, passwordConfirm, role } = req.body;
            const user = yield userModel_1.default.create({
                email,
                password,
                passwordConfirm,
                role,
            });
            if (!user) {
                return next(new appError_1.default('Sign-up not successfull, an error occured', 400));
            }
            // send confirmation email
            const confirmEmailToken = crypto_1.default.randomBytes(32).toString('hex');
            user.confirmEmailToken = confirmEmailToken;
            yield user.save({ validateBeforeSave: false });
            //I am holding off on sending emails for the time being
            const confirmEmailUrl = `${req.protocol}://${req.get('host')}/api/v1/users/confirmEmail/${confirmEmailToken}`;
            // await new Email(user, confirmEmailUrl).sendVerifyAndWelcome();
            this.createAndSendToken(user, 201, res, req, true);
        }));
        this.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            //check if email and password is valid
            if (!email || !password) {
                return next(new appError_1.default('Please provide a password and an email', 400));
            }
            const user = yield userModel_1.default.findOne({ email }).select('+password');
            if (!user || !(yield user.comparePassword(password))) {
                return next(new appError_1.default('User email or password is invalid', 404));
            }
            this.createAndSendToken(user, 201, res, req, true);
        }));
        this.forgetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // forget password
            const { email } = req.body;
            // find account to confirm availability
            const user = yield userModel_1.default.findOne({ email });
            if (!user) {
                return next(new appError_1.default('No record found for this email', 404));
            }
            const resetToken = user.sendPasswordResetToken();
            yield user.save({ validateBeforeSave: false });
            try {
                const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`;
                yield new email_1.default(user, resetUrl).sendPasswordReset();
                res.status(201).json({
                    status: 'success',
                    message: 'Password reset token sent successfully',
                });
            }
            catch (err) {
                res
                    .status(400)
                    .json({ message: 'There was an error, try again', status: 'error' });
            }
        }));
        this.resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // confirm the reset Token
            const { password, passwordConfirm } = req.body;
            const { resetToken } = req.params;
            const passwordResetToken = crypto_1.default
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');
            const user = yield userModel_1.default.findOne({ passwordResetToken });
            if (!user || !user.checkResetTokenExpiration()) {
                return next(new appError_1.default('Invalid or expired reset Token', 400));
            }
            user.password = password;
            user.passwordConfirm = passwordConfirm;
            user.passwordResetToken = undefined;
            user.passwordResetTokenExpireTime = undefined;
            yield user.save();
            res.status(201).json({
                message: 'success',
            });
        }));
        this.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // check the headers bearer token
            let token;
            if (req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
            }
            if (!token) {
                return next(new appError_1.default('auth token not available in header', 404));
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
            const user = yield userModel_1.default.findOne({
                _id: decoded.id,
                email: decoded.email,
            });
            if (!user) {
                return next(new appError_1.default('The user does not exist', 400));
            }
            const isChangePassword = user.checkPasswordChange(decoded.iat);
            if (isChangePassword) {
                return next(new appError_1.default('This user is a fraud, password was changed amidst request', 400));
            }
            req.user = user;
            next();
        }));
        // send refresh token
        this.refreshToken = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.body;
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET || '');
            const user = yield userModel_1.default.findOne({
                _id: decoded.id,
            });
            if (!user) {
                return next(new appError_1.default('Refresh token is invalid', 400));
            }
            res.status(200).json({ token: this.signToken({ id: user.id }) });
        }));
        this.restrictTo = (...roles) => (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!roles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
                res.status(402).json({
                    message: 'Does not have permission to access resource',
                    status: 'failed',
                });
            }
            next();
        }));
        this.googleRedirect = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            res.redirect(process.env.FRONTEND_URL);
        }));
    }
}
exports.default = new AuthController();
