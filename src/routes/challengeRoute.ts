import { Router } from 'express';
const router = Router();

import challengeController from '../controllers/challengeController';
import authController from '../controllers/authController';

router
  .route('/')
  .post(authController.protect, challengeController.addChallenge)
  .get(challengeController.getAllChallenges);

router
  .route('/:id')
  .get(challengeController.getChallenge)
  .patch(authController.protect, challengeController.updateChallenge)
  .delete(authController.protect, challengeController.deleteChallenge);

export default router;
