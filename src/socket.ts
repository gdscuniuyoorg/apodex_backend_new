import { Server, Socket } from 'socket.io';
import { CorsOptions } from 'cors';
import { Server as HttpServer } from 'http';

const corsOptions: CorsOptions = {
  origin: [
    'http://localhost:5173',
    'http://create.localhost:5173',
    'https://hoot-quiz.vercel.app/',
  ],
  methods: ['GET', 'POST', 'DELETE', 'UPDATE'],
};

export const setupSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, { cors: corsOptions });

  io.on('connection', (socket: Socket) => {
    socket.on('vote', (gameId, userName) => {
      // socket.join(gameId);
      // io.to(gameId).emit('showPlayers');

      socket.broadcast.emit('vote');
    });

    socket.on('startElection', (gameId) => {
      socket.broadcast.emit('startElection');
    });
  });
};
