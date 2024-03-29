"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ENV = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL || '',
    EMAIL_USERNAME: process.env.EMAIL_USERNAME || '',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
    EMAIL_HOST: process.env.EMAIL_HOST || '',
    EMAIL_PORT: process.env.EMAIL_PORT || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_SECRET_IN: process.env.JWT_SECRET_IN || '',
    JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN || '',
    NODE_ENV: process.env.NODE_ENV || '',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || '',
    FRONTEND_URL: process.env.FRONTEND_URL || '',
};
exports.default = ENV;
