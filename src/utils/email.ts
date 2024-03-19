import nodemailer, { Transporter } from 'nodemailer';
import ENV from '../env_files';
import { IUser } from '../models/userModel';
import pug from 'pug';
import htmlToText from 'html-to-text';

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
    // if(ENV.NODE_ENV ==='production'){
    //   return 1
    // }
    return nodemailer.createTransport({
      host: ENV.EMAIL_HOST,
      port: +ENV.EMAIL_PORT,
      secure: false,
      auth: {
        pass: ENV.EMAIL_PASSWORD,
        user: ENV.EMAIL_USERNAME,
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
