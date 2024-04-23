import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import { setupSocketServer } from './socket';

import app from './app';
import connectDB from './db';

// connect to database
connectDB();

const httpServer = createServer(app);

// setup socket server
setupSocketServer(httpServer);

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
