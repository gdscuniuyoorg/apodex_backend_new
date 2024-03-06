import { Router } from 'express';

const router = Router();

import authController from '../controllers/authController';

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/google/initiate', authController.googleSignUpInitiate);

router.get('/google/callback', authController.googleSignUpCallback);

router.post('/refresh', authController.refreshToken);

router.patch('/forgetPassword', authController.forgetPassword);

router.get(
  '/confirmEmail/:confirmEmailToken',
  authController.confirmEmailAndActivateAccount,
);

router.patch('/resetPassword/:resetToken', authController.resetPassword);

export default router;
