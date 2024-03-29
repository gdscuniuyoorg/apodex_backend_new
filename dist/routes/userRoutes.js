"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const authController_1 = __importDefault(require("../controllers/authController"));
router.post('/signup', authController_1.default.signup);
router.post('/login', authController_1.default.login);
router.get('/google/initiate', authController_1.default.googleSignUpInitiate);
router.get('/google/callback', authController_1.default.googleSignUpCallback);
router.post('/refresh', authController_1.default.refreshToken);
router.patch('/forgetPassword', authController_1.default.forgetPassword);
router.get('/confirmEmail/:confirmEmailToken', authController_1.default.confirmEmailAndActivateAccount);
router.patch('/resetPassword/:resetToken', authController_1.default.resetPassword);
router.get('/redirect', authController_1.default.googleRedirect);
exports.default = router;
