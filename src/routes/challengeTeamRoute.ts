import { Router } from 'express';
import challengeTeamController from '../controllers/challengeTeamController';
import authController from '../controllers/authController';

const router = Router();

router.route('/').get(challengeTeamController.getAllTeams);

router
  .route('/:id')
  .get(challengeTeamController.getTeam)
  .patch(authController.protect, challengeTeamController.updateTeam)
  .delete(authController.protect, challengeTeamController.deleteTeam);

export default router;
