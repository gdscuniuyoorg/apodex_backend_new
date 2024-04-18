import { Router } from 'express';
import voteController from '../controllers/voteController';

const router = Router();

router.route('/').get(voteController.getAllVotes);

router.post('/:challangeId/:teamId', voteController.addVote)
