import { RequestHandler } from 'express';
import ChallangeTeam, { IChallangeTeam } from '../models/challengeTeamModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

class TeamController {
  // Add a new team
  addTeam: RequestHandler = catchAsync(async (req, res, next) => {
    const newTeam = await ChallangeTeam.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        team: newTeam,
      },
    });
  });

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
