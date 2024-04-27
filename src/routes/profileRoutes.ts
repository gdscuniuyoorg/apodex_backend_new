import { Router } from 'express';
import userController from '../controllers/profileController';
import authController from '../controllers/authController';
import {
  cloudinaryUpload,
  singleUpload,
} from '../controllers/uploadController';

const router = Router();

router
  .route('/')
  .get(userController.getProfiles)
  .patch(authController.protect, userController.updateProfile);

router.route('/:user_id').get(userController.getProfile);

router.patch(
  '/image',
  authController.protect,
  singleUpload('photo'),
  cloudinaryUpload,
  userController.updateProfile,
);

export default router;
