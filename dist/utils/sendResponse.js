"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendReponse = (res, statusCode, data, message = "success") => {
    res.status(statusCode).json({ status: message, data });
};
exports.default = sendReponse;
