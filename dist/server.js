"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = require("http");
const socket_1 = require("./socket");
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./db"));
// connect to database
(0, db_1.default)();
const httpServer = (0, http_1.createServer)(app_1.default);
// setup socket server
(0, socket_1.setupSocketServer)(httpServer);
const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
    console.log(`Server has started on port ${port}`);
});
