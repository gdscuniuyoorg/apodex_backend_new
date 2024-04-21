import { Router } from 'express';
import userController from '../controllers/userController';
import authController from '../controllers/authController';
import { singleUpload } from '../controllers/multerController';

const router = Router();

router
  .route('/')
  .get(userController.getUsers)
  .patch(authController.protect, userController.updateProfile);

router.route('/:user_id').get(userController.getProfile);

router.patch(
  '/image',
  authController.protect,
  singleUpload('photo'),
  userController.updateProfile,
);

export default router;
