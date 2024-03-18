import express, { Response, Request, NextFunction } from 'express';
import AppError from './utils/appError';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/userProfileRoutes';
import globalErrorHandler from './controllers/errorController';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10kb' }));

// GLOBAL MIDDLEWARES
//comes in here to find the specified filed to be served as static content
app.use(express.static(path.join(__dirname, 'public')));
// hence you cannot use 127.0.0.1:3000/public/overview because express would think of this as a normal route and find a route handler for it

// set security http
app.use(helmet());
//including global middleware

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour',
});

// rate limiter
app.use('/api', limiter);

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/profiles', profileRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'App is running successfully',
  });
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const message: string = `${req.originalUrl} route cannot be found on this server`;
  return next(new AppError(message, 404));
});

app.use(globalErrorHandler.globalSendError);

export default app;
