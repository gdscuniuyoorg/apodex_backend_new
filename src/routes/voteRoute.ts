import { Router } from 'express';
import voteController from '../controllers/voteController';
import authController from '../controllers/authController';

const router = Router();

router.get('/:challengeId', voteController.getAllVotes);

router
  .route('/:challangeId/:teamId')
  .get(voteController.getVoteByTeam)
  .post(authController.protect, voteController.addVote)
  .delete(authController.protect, voteController.deleteVote);

export default router;
