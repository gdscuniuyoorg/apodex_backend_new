import nodemailer, { Transporter } from 'nodemailer';

interface optionsTypes {
  email: string;
  message?: string;
  subject: string;
  html?: string;
}

const sendEmail = async (options: optionsTypes) => {
  const transporter: Transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    secure: false,
    auth: {
      pass: process.env.MAILTRAP_PASSWORD,
      user: process.env.MAILTRAP_USERNAME,
    },
  });

  const mailOptions = {
    from: 'Reset Password by Hoot Quiz <regnalukpabio@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
