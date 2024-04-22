import { Router } from 'express';
import challengeTeamController from '../controllers/challengeTeamController';
import authController from '../controllers/authController';

const router = Router();

router.route('/all/:challengeId').get(challengeTeamController.getAllTeams);

router
  .route('/add/:teamId')
  .patch(
    authController.protect,
    challengeTeamController.checkRole,
    challengeTeamController.addTalentToTeam,
  );

router
  .route('/remove/:teamId')
  .patch(
    authController.protect,
    challengeTeamController.checkRole,
    challengeTeamController.removeTalentFromTeam,
  );

router
  .route('/:teamId')
  .get(challengeTeamController.getTeam)
  .patch(
    authController.protect,
    challengeTeamController.checkRole,
    challengeTeamController.updateTeamName,
  )
  .delete(
    authController.protect,
    challengeTeamController.checkRole,
    challengeTeamController.deleteTeam,
  );

export default router;
