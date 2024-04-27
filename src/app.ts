import express, { Response, Request, NextFunction } from 'express';
import AppError from './utils/appError';
import cors from 'cors';

import globalErrorHandler from './controllers/errorController';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import morgan from 'morgan';

// importing routes
import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/profileRoutes';
import teamRoutes from './routes/challengeTeamRoute';
import voteRoutes from './routes/voteRoute';
import challengeRoutes from './routes/challengeRoute';
import courseRoutes from './routes/courseRoute';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10kb' }));

// GLOBAL MIDDLEWARES

// set security http
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//including global middleware

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour',
});

// rate limiter
app.use('/api', limiter);

//comes in here to find the specified filed to be served as static content
app.use('/public', express.static(path.join(__dirname, './../public')));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/challenges', challengeRoutes);
app.use('/api/v1/votes', voteRoutes);
app.use('/api/v1/teams', teamRoutes);

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
