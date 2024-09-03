import { IUser } from '../models/userModel';
import pug from 'pug';
const Brevo = require('@getbrevo/brevo');

class Email {
  to: string;
  url: string;
  from: string;
  name: string;
  apiInstance: any;
  apiKey: any;

  constructor(user: IUser, url: string) {
    this.to = user.email;
    this.url = url;
    this.from = `Apodex <gdscuniuyo@gmail.com>`;
    this.name = user.name;

    this.apiInstance = new Brevo.TransactionalEmailsApi();

    this.apiKey = this.apiInstance.authentications['apiKey'];
    this.apiKey.apiKey = process.env.BREVO_API_KEY;
  }

  async send(template: string, subject: string) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
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

    await this.apiInstance.sendTransacEmail(sendSmtpEmail);
  }

  async sendVerifyAndWelcome() {
    return await this.send(`confirmEmail`, 'Email Confirmation');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
}

export default Email;
