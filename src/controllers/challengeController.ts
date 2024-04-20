import { RequestHandler } from 'express';
import Challenge from '../models/challengeModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import {
  challengeSchema,
  updateChallengeSchema,
} from '../helper/challenge.validate';

class ChallengeController {
  addChallenge: RequestHandler = catchAsync(async (req, res, next) => {
    const { error, value } = challengeSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    if (req.file) {
      value.coverPhoto = `${req.protocol}://${req.get(
        'host',
      )}/public/img/users/${req.file.filename}`;
    }

    const challenge = await Challenge.create(value);

    res.status(201).json({
      status: 'success',
      data: {
        challenge,
      },
    });
  });

  updateChallenge: RequestHandler = catchAsync(async (req, res, next) => {
    const { error, value } = updateChallengeSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    if (req.file) {
      value.coverPhoto = `${req.protocol}://${req.get(
        'host',
      )}/public/img/users/${req.file.filename}`;
    }

    const updatedChallenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      value,
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
    await Challenge.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  // Get a single challenge by ID
  getChallenge: RequestHandler = catchAsync(async (req, res, next) => {
    const challenge = await Challenge.findById(req.params.id);

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
    const challenges = await Challenge.find();
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
