"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketServer = void 0;
const socket_io_1 = require("socket.io");
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://create.localhost:5173',
        'https://hoot-quiz.vercel.app/',
    ],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE'],
};
const setupSocketServer = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, { cors: corsOptions });
    io.on('connection', (socket) => {
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
exports.setupSocketServer = setupSocketServer;
