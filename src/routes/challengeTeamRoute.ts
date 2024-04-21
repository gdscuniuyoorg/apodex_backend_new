import { Router } from 'express';
import challengeTeamController from '../controllers/challengeTeamController';
import authController from '../controllers/authController';

const router = Router();

router.route('/all/:challengeId').get(challengeTeamController.getAllTeams);

router
  .route('/add/:teamId')
  .patch(authController.protect, challengeTeamController.addTalentToTeam);

router
  .route('/remove/:teamId')
  .patch(authController.protect, challengeTeamController.addTalentToTeam);

router
  .route('/:teamId')
  .get(challengeTeamController.getTeam)
  .patch(authController.protect, challengeTeamController.updateTeamName)
  .delete(authController.protect, challengeTeamController.deleteTeam);

export default router;
