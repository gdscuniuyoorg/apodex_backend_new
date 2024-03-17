import { Router } from 'express';
import userController from '../controllers/userController';
import authController from '../controllers/authController';

const router = Router();

router
  .route('/')
  .get(userController.getUsers)
  .patch(userController.updateProfile);

router
  .route('/:user_id')
  .get(userController.getProfile)
  .patch(userController.uploadProfileImage);

router.patch(
  '/image',
  authController.protect,
  userController.uploadProfileImage,
  userController.updateProfile,
);

export default router;
