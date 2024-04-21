import { NextFunction, RequestHandler } from 'express';
import ChallangeTeam, { IChallangeTeam } from '../models/challengeTeamModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import Challenge, { IChallenge } from '../models/challengeModel';
import { teamValidate } from '../helper/team.validate';
import { CustomRequest } from './authController';
import { UserRole } from '../models/userModel';

class TeamController {
  checkRole = async (
    req: CustomRequest,
    next: NextFunction,
  ): Promise<IChallangeTeam | void> => {
    const userId = req.user?.id;
    const role = req.user?.role;
    const { teamId } = req.params;

    const team = await ChallangeTeam.findById(teamId);

    if (!team) {
      return next(new AppError('This team does not exist', 404));
    }

    if (role !== UserRole.ADMIN || team.teamLead?.toString() !== userId) {
      return next(
        new AppError('You dont have permission to delete this team', 400),
      );
    }

    return team;
  };
  // Update an existing team
  updateTeam: RequestHandler = catchAsync(async (req, res, next) => {
    const updatedTeam = await ChallangeTeam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    res.status(200).json({
      status: 'success',
      data: {
        team: updatedTeam,
      },
    });
  });

  removeTalentFromTeam: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const { talentId } = req.body;

      const team = await this.checkRole(req, next);

      if (!team) {
        return next(new AppError('Team not found', 404));
      }

      const index = team.talents.findIndex((el) => el.toString() === talentId);

      if (!index || index < 0) {
        return next(
          new AppError('This talent is not a memeber of this team', 404),
        );
      }

      team.talents.splice(index, 1);
      if (team.talents.length < team.minTalents) {
        return next(new AppError('Number of talents too little', 400));
      }

      await team.save();

      res.status(201).send('success removing talent from team');
    },
  );

  addTalentToTeam: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const { talentId } = req.body;

      const team = await this.checkRole(req, next);

      if (!team) {
        return next(new AppError('Team not found', 404));
      }

      team.talents.push(talentId);
      if (team.talents.length > team.maxTalents) {
        return next(new AppError('Number of talents too large', 400));
      }

      await team.save();

      res.status(201).send('success add talent to team');
    },
  );

  // Delete a team
  deleteTeam: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const team = await this.checkRole(req, next);

      if (!team) {
        return next(new AppError('Team does not exist', 404));
      }

      await team.deleteOne();
      res.status(204).json({
        status: 'success',
        data: null,
      });
    },
  );

  // Get a single team by ID
  getTeam: RequestHandler = catchAsync(async (req, res, next) => {
    const team = await ChallangeTeam.findById(req.params.teamId).populate(
      'talents',
    );

    if (!team) {
      return next(new AppError('Team not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        team,
      },
    });
  });

  // Get all teams
  getAllTeams: RequestHandler = catchAsync(async (req, res, next) => {
    const { challengeId } = req.params;
    const teams = await ChallangeTeam.find({ challengeId });

    res.status(200).json({
      status: 'success',
      results: teams.length,
      data: {
        teams,
      },
    });
  });
}

export default new TeamController();
