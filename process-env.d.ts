export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      PORT: string;
      DB_URL: string;
      NODE_ENV: string;
      EMAIL_USERNAME: string;
      EMAIL_PASSWORD: string;
      EMAIL_HOST: string;
      EMAIL_PORT: string;
      JWT_SECRET: string;
      JWT_SECRET_IN: string;
      JWT_COOKIE_EXPIRES_IN: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_REDIRECT_URI: string;
      FRONTEND_URL: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_SECRET: string;
      BREVO_API_KEY: string;
      BREVO_HOST: string;
      BREVO_PORT: string;
      BREVO_EMAIL: string;
    }
  }
}
