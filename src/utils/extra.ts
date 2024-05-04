import nodemailer from 'nodemailer';
import { IUser } from '../models/userModel';
import pug from 'pug';
import brevo from '@getbrevo/brevo';

class Email {
  to: string;
  url: string;
  from: string;
  name: string;

  constructor(user: IUser, url: string) {
    this.to = user.email;
    this.url = url;
    this.from = `Apodex <gdscuniuyo@gmail.com>`;
    this.name = user.name;
  }

  newTransport() {
    // if(process.env.NODE_ENV ==='production'){
    //   return 1
    // }

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: +process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    return transport;
  }
  async send(template: string, subject: string) {
    // 1: Render html based on file

    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.name,
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

    return await this.newTransport().sendMail(mailOptions);
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
