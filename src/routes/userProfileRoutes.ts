import { Router } from 'express';
import UserController from '../controllers/userController';
import authController from '../controllers/authController';

const router = Router();

router
  .route('/')
  .get(UserController.getUsers)
  .patch(authController.protect, UserController.updateProfile);

router.route('/:user_id').get(UserController.getProfile);


export default router;
