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
exports.UserRole = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: [true, 'User must have an email'],
        unique: true,
        trim: true,
        validate: [validator_1.default.isEmail, 'Please provide a valid email'],
    },
    image: String,
    password: {
        type: String,
        required: [true, 'User must have a password'],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'User must input a passwordConfirm'],
        validate: {
            validator: function (val) {
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
        default: UserRole.USER,
    },
    passwordResetAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpireTime: Date,
    // user profile information
    bio: String,
    coverPhotoUrl: String,
    dateOfBirth: Date,
    techInterests: [String],
    currentRole: String,
    company: String,
    twitterUrl: String,
    portfolioUrl: String,
    linkedInUrl: String,
    location: String,
    displayPhoto: String,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return next();
        }
        const hashPassword = yield bcrypt_1.default.hash(this.password, 12);
        this.password = hashPassword;
        this.passwordConfirm = undefined;
        next();
    });
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew || !this.isModified('password')) {
            return next();
        }
        this.passwordResetAt = new Date(Date.now());
        next();
    });
});
userSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
userSchema.methods.compareResetPasswordTime = function (time) {
    return __awaiter(this, void 0, void 0, function* () { });
};
// Send reset password Token
userSchema.methods.sendPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    // hash to token that is sent to the database
    this.passwordResetToken = crypto_1.default
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
userSchema.methods.checkPasswordChange = function (JWTExpireTime) {
    return new Date(this.passwordResetAt).getTime() / 1000 > JWTExpireTime;
};
userSchema.methods.checkConfirmEmailToken = function () {
    return '';
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
