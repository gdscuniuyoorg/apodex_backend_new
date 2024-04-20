import nodemailer, { Transporter } from 'nodemailer';
import { IUser } from '../models/userModel';
import pug from 'pug';

class Email {
  to: string;
  url: string;
  from: string;
  firstName: string;

  constructor(user: IUser, url: string) {
    this.to = user.email;
    this.url = url;
    this.from = `Apodex <mfoniso@gmail.com>`;
    this.firstName = user.firstName;
  }

  newTransport() {
    // if(process.env.NODE_ENV ==='production'){
    //   return 1
    // }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: +process.env.EMAIL_PORT,
      secure: false,
      auth: {
        pass: process.env.EMAIL_PASSWORD,
        user: process.env.EMAIL_USERNAME,
      },
    });
  }
  async send(template: string, subject: string) {
    // 1: Render html based on file
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
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

    await this.newTransport().sendMail(mailOptions);
  }

  async sendVerifyAndWelcome() {
    await this.send(`confirmEmail`, 'Email Confirmation');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
}

export default Email;
