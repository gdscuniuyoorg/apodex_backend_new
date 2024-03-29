"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_files_1 = __importDefault(require("./env_files"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./db"));
// connect to database
(0, db_1.default)();
app_1.default.listen(env_files_1.default.PORT, () => {
    console.log(`Server started successfully at port ${env_files_1.default.PORT}`);
});
