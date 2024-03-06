import dotenv from 'dotenv';
dotenv.config();

type IENV = {
  PORT: string | number;
  DB_URL: string;
  EMAIL_USERNAME: string;
  EMAIL_PASSWORD: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number | string;
  JWT_SECRET: string;
  JWT_SECRET_IN: string;
  JWT_COOKIE_EXPIRES_IN: string;
  NODE_ENV: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_REDIRECT_URI: string;
  GOOGLE_CLIENT_SECRET: string;
};

const ENV: IENV = {
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
};

export default ENV;
