"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const pug_1 = __importDefault(require("pug"));
class Email {
    constructor(user, url) {
        this.to = user.email;
        this.url = url;
        this.from = `Apodex <mfoniso@gmail.com>`;
        this.firstName = user.firstName;
    }
    newTransport() {
        // if(process.env.NODE_ENV ==='production'){
        //   return 1
        // }
        return nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: +process.env.EMAIL_PORT,
            secure: false,
            auth: {
                pass: process.env.EMAIL_PASSWORD,
                user: process.env.EMAIL_USERNAME,
            },
        });
    }
    send(template, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1: Render html based on file
            const html = pug_1.default.renderFile(`${__dirname}/../views/email/${template}.pug`, {
                firstName: this.firstName,
                url: this.url,
                subject,
            });
            const mailOptions = {
                from: this.from,
                to: this.to,
                subject: subject,
                html,
                // text: htmlToText.fromString(html)
                text: '123',
            };
            yield this.newTransport().sendMail(mailOptions);
        });
    }
    sendVerifyAndWelcome() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send(`confirmEmail`, 'Email Confirmation');
        });
    }
    sendPasswordReset() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
        });
    }
}
exports.default = Email;
