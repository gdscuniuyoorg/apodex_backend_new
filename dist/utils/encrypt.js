"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
// Encrypt function using AES
const encryptUserId = (userId, secretKey) => {
    const iv = crypto_1.default.randomBytes(16); // Initialization vector
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encryptedUserId = cipher.update(userId, 'utf8', 'hex');
    encryptedUserId += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encryptedUserId };
};
// Decrypt function using AES
const decryptUserId = (encryptedData, iv, secretKey) => {
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv, 'hex'));
    let decryptedUserId = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedUserId += decipher.final('utf8');
    return decryptedUserId;
};
