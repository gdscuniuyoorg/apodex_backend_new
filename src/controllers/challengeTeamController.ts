import { RequestHandler } from 'express';
import ChallangeTeam from '../models/challengeTeamModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import Challenge, { IChallenge } from '../models/challengeModel';
import { teamValidate } from '../helper/team.validate';
import { CustomRequest } from './authController';

class TeamController {
  // Add a new team
  joinChallange: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const email = req.user?.email;
      const { error, value } = teamValidate.validate(req.body);

      if (error) {
        return next(new AppError(error.message, 400));
      }

      const challenge: IChallenge | null = await Challenge.findById(
        value.challengeId,
      );

      if (!challenge) {
        return next(new AppError('Challenge does not exist', 404));
      }

      if (challenge.participationType !== 'Team') {
        return next(new AppError('This challenge does not allow teams', 400));
      }

      // adding yourself to team
      value.talents.push(email);
      value.talents = [...new Set(value.talents)];

      if (challenge.maxTeamParticipants && challenge.minTeamParticipants) {
        if (
          value.talents.length > challenge?.maxTeamParticipants ||
          value.talents.length < challenge.minTeamParticipants
        ) {
          return next(
            new AppError(
              'The participants are either greater then or less than ',
              400,
            ),
          );
        }
      }

      const team = await ChallangeTeam.create(value);
      res.status(201).json({
        status: 'success',
        data: {
          team,
        },
      });
    },
  );

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

  // Delete a team
  deleteTeam: RequestHandler = catchAsync(async (req, res, next) => {
    await ChallangeTeam.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  // Get a single team by ID
  getTeam: RequestHandler = catchAsync(async (req, res, next) => {
    const team = await ChallangeTeam.findById(req.params.id);
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
    const teams = await ChallangeTeam.find();
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
