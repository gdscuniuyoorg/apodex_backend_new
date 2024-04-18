import { Router } from 'express';
import voteController from '../controllers/voteController';

const router = Router();

router.get('/:challengeId', voteController.getAllVotes);

router
  .route('/:challangeId/:teamId')
  .get(voteController.getVoteByTeam)
  .post(voteController.addVote)
  .delete(voteController.deleteVote);
