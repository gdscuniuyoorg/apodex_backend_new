import crypto from 'crypto';

// Encrypt function using AES
const encryptUserId = (userId: string, secretKey: string) => {
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(secretKey),
    iv,
  );
  let encryptedUserId = cipher.update(userId, 'utf8', 'hex');
  encryptedUserId += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encryptedUserId };
};

// Decrypt function using AES
const decryptUserId = (encryptedData: string, iv:string, secretKey: string) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(secretKey),
    Buffer.from(iv, 'hex'),
  );
  let decryptedUserId = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedUserId += decipher.final('utf8');
  return decryptedUserId;
};
