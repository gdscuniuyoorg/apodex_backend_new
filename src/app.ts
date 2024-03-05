import express, { Response, Request, NextFunction } from 'express';
import AppError from './utils/appError';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import globalErrorHandler from './controllers/errorController';

const app = express();

// use cors

app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.cookie('jwt', 'fdhfkjadh', { httpOnly: true });
  res.send('api is running on live port');
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const message: string = `${req.originalUrl} route cannot be found on this server`;
  return next(new AppError(message, 404));
});

app.use(globalErrorHandler.globalSendError);

export default app;
