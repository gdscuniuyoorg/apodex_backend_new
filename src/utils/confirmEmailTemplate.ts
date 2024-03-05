const confirmEmailTemplate = (confirmEmailUrl: string): string => {
  return `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <h1 style="color: #333333;">Confirm your email to Apodex</h1>
    <p>Hello! Once you've confirmed your email address, you'll be the newest member of Apodex!!!</p>
    <a href="${confirmEmailUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Confirm Email</a>

    <p>If you have any questions, simply reply to this email. We'd love to help.</p>
    <p>If you didn’t request this email, there’s nothing to worry about — you can safely ignore it.</p>  
  </div>`;
};

export default confirmEmailTemplate;
