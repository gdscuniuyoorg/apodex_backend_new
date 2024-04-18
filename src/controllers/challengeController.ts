import { RequestHandler } from 'express';
import Challange, { IChallange } from '../models/challengeModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

class ChallengeController {
  // Add a new challenge
  addChallenge: RequestHandler = catchAsync(async (req, res, next) => {
    const newChallenge = await Challange.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        challenge: newChallenge,
      },
    });
  });

  // Update an existing challenge
  updateChallenge: RequestHandler = catchAsync(async (req, res, next) => {
    const updatedChallenge = await Challange.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    res.status(200).json({
      status: 'success',
      data: {
        challenge: updatedChallenge,
      },
    });
  });

  // Delete a challenge
  deleteChallenge: RequestHandler = catchAsync(async (req, res, next) => {
    await Challange.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  // Get a single challenge by ID
  getChallenge: RequestHandler = catchAsync(async (req, res, next) => {
    const challenge = await Challange.findById(req.params.id);
    if (!challenge) {
      return next(new AppError('Challenge not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        challenge,
      },
    });
  });

  // Get all challenges
  getAllChallenges: RequestHandler = catchAsync(async (req, res, next) => {
    const challenges = await Challange.find();
    res.status(200).json({
      status: 'success',
      results: challenges.length,
      data: {
        challenges,
      },
    });
  });
}

export default new ChallengeController();
