import { Router } from 'express';
import UserController from '../controllers/UserController';
import authController from '../controllers/authController';

const router = Router();

router.use(authController.protect);
router
  .route('/')
  .get(UserController.getUsers)
  .patch(UserController.updateProfile);

router.route('/:user_id').get(UserController.getProfile);
