import { Router } from 'express';
import {
  cloudinaryUpload,
  singleUpload,
} from '../controllers/uploadController';
const router = Router();

import challengeController from '../controllers/challengeController';
import authController from '../controllers/authController';

router.patch(
  '/join',
  authController.protect,
  challengeController.joinChallange,
);

router.patch(
  '/exit/:challengeId',
  authController.protect,
  challengeController.exitChallenge,
);

router
  .route('/')
  .post(
    authController.protect,
    singleUpload('coverPhoto'),
    cloudinaryUpload,
    challengeController.addChallenge,
  )
  .get(challengeController.getAllChallenges);

router
  .route('/:challengeId')
  .get(challengeController.getChallenge)
  .patch(
    authController.protect,
    singleUpload('coverPhoto'),
    cloudinaryUpload,
    challengeController.updateChallenge,
  )
  .delete(authController.protect, challengeController.deleteChallenge);

export default router;
