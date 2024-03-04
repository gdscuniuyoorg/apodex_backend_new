import mongoose, { Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface IUser extends Document {
  name: String;
  email: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordResetAt: Date;
  role: UserRole;
  isEmailConfirmed: boolean;
  comparePassword: (password: string) => Promise<boolean>;
  compareResetPasswordTime: (time: Date) => boolean;
  passwordResetToken: string | undefined;
  passwordResetTokenExpireTime: Date | undefined;
  sendPasswordResetToken: () => string;
  checkResetTokenExpiration: () => boolean;
  checkPasswordChange: (time: number) => boolean;
  confirmEmailToken: string;
  checkConfirmEmailToken: () => string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: [true, 'User must have a name'] },
    email: {
      type: String,
      required: [true, 'User must have an email'],
      unique: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'User must have a password'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'User must input a passwordConfirm'],
      validate: {
        validator: function (this: IUser, val: string): boolean {
          return val === this.password;
        },
        message: 'Password Confirm must match Password',
      },
    },
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    confirmEmailToken: String,
    role: {
      type: String,
      required: [true, 'User must be assigned a role'],
      enum: Object.values(UserRole),
      default: UserRole.ADMIN,
    },
    passwordResetAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpireTime: Date,
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre('save', async function (this: IUser & Document, next) {
  if (!this.isModified('password')) {
    return next();
  }

  const hashPassword = await bcrypt.hash(this.password, 12);
  this.password = hashPassword;
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', async function (this: IUser & Document, next) {
  if (this.isNew || !this.isModified('password')) {
    return next();
  }
  this.passwordResetAt = new Date(Date.now());
  next();
});
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.compareResetPasswordTime = async function (time: Date) {};

// Send reset password Token
userSchema.methods.sendPasswordResetToken = function (this: IUser) {
  const resetToken = crypto.randomBytes(32).toString('hex');
  // hash to token that is sent to the database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // creating a token expire time 5 mins after it was created
  this.passwordResetTokenExpireTime = new Date(Date.now() + 5 * 60 * 1000);
  return resetToken;
};

userSchema.methods.checkResetTokenExpiration = function () {
  return Date.now() < this.passwordResetTokenExpireTime;
};

userSchema.methods.checkPasswordChange = function (JWTExpireTime: number) {
  return new Date(this.passwordResetAt).getTime() / 1000 > JWTExpireTime;
};

userSchema.methods.checkConfirmEmailToken = function () {
  return '';
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
