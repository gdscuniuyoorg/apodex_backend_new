"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const env_files_1 = __importDefault(require("../env_files"));
class ErrorController {
    constructor(env) {
        // SEND THE GLOBAL ERROR
        this.globalSendError = (err, req, res, next) => {
            err.statusCode = err.statusCode || 500;
            err.status = err.status || 'error';
            if (this.env === 'development') {
                return this.sendDevError(err, res);
            }
            if (this.env === 'production') {
                let error;
                if (err.name === 'CastError') {
                    error = this.handleCastErrorDB(err);
                }
                else if (err.code === 11000) {
                    error = this.handleDuplicateFieldsDB(err);
                }
                else if (err.name === 'ValidationError') {
                    error = this.handleValidateErrorDB(err);
                }
                else if (err.name === 'JsonWebTokenError') {
                    error = this.hendleJWTError();
                }
                else if (err.name === 'TokenExpiredError') {
                    error = this.handleJWTExpireError();
                }
                return this.sendProdError(error || err, res);
            }
        };
        // HANDLE PRODUCTION ERROR
        this.sendProdError = (error, res) => {
            const err = Object.assign(error);
            if (err.isOperational) {
                res.status(err.statusCode).json({
                    status: err.status,
                    message: err.message,
                });
            }
            else {
                res.status(500).json({
                    status: 'error',
                    message: 'Something really went wrong',
                });
            }
        };
        // HANDLE DEVELOPMENT ERROR
        this.sendDevError = (err, res) => {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
                error: err,
            });
        };
        this.handleJWTExpireError = () => {
            return new appError_1.default('jwt has expired', 404);
        };
        this.handleCastErrorDB = (err) => {
            return new appError_1.default(`Invalid ${err.path}: ${err.value}`, 400);
        };
        this.handleDuplicateFieldsDB = (err) => {
            const value = err.message
                ? err.message.match(/(["'])(\\?.)*?\1/)[0]
                : null;
            return new appError_1.default(`Duplicate field value: ${value}. Please use another value!`, 400);
        };
        this.handleValidateErrorDB = (err) => {
            const errors = Object.values(err.errors).map((el) => el.message);
            const message = `Invalid input data. ${errors.join('. ')}`;
            return new appError_1.default(message, 400);
        };
        this.hendleJWTError = () => {
            return new appError_1.default('Invalid Token, Please log in again', 401);
        };
        this.env = env;
    }
}
const errorController = new ErrorController(env_files_1.default.NODE_ENV || '');
exports.default = errorController;
