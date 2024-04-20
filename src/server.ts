import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './db';

// connect to database
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server started successfully at port ${process.env.PORT}`);
});
