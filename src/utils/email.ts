import nodemailer, { Transporter } from 'nodemailer';
import ENV from '../env_files';
import { isNullOrUndefined } from 'util';

interface optionsTypes {
  email: string;
  message?: string;
  subject: string;
  html?: string;
}

const sendEmail = async (options: optionsTypes) => {
  const transporter: Transporter = nodemailer.createTransport({
    host: ENV.EMAIL_HOST,
    port: +ENV.EMAIL_PORT,
    secure: false,
    auth: {
      pass: ENV.EMAIL_PASSWORD,
      user: ENV.EMAIL_USERNAME,
    },
  });

  const mailOptions = {
    from: 'Apodex by GDSC, Uniuyo <regnalukpabio@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
