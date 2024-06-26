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
const pug_1 = __importDefault(require("pug"));
const Brevo = require('@getbrevo/brevo');
class Email {
    constructor(user, url) {
        this.to = user.email;
        this.url = url;
        this.from = `Apodex <gdscuniuyo@gmail.com>`;
        this.name = user.name;
        this.apiInstance = new Brevo.TransactionalEmailsApi();
        this.apiKey = this.apiInstance.authentications['apiKey'];
        this.apiKey.apiKey = process.env.BREVO_API_KEY;
    }
    send(template, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = pug_1.default.renderFile(`${__dirname}/../views/email/${template}.pug`, {
                firstName: this.name,
                url: this.url,
                subject,
            });
            const sendSmtpEmail = new Brevo.SendSmtpEmail();
            sendSmtpEmail.subject = subject;
            sendSmtpEmail.htmlContent = html;
            sendSmtpEmail.sender = {
                name: 'GDSC UNIUYO',
                email: 'gdscuniuyo@gmail.com',
            };
            sendSmtpEmail.to = [{ email: this.to, name: this.name }];
            yield this.apiInstance.sendTransacEmail(sendSmtpEmail);
        });
    }
    sendVerifyAndWelcome() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.send(`confirmEmail`, 'Email Confirmation');
        });
    }
    sendPasswordReset() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
        });
    }
}
exports.default = Email;
