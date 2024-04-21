import { RequestHandler } from 'express';
import Challenge, { IChallenge } from '../models/challengeModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import {
  challengeValidate,
  updateChallengeValidate,
} from '../helper/challenge.validate';
import APIFeatures, { QueryString } from '../utils/apiFeatures';
import { teamValidate } from '../helper/team.validate';
import { CustomRequest } from './authController';
import ChallangeTeam from '../models/challengeTeamModel';

class ChallengeController {
  joinChallange: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const userId = req.user?.id;
      const challenge: IChallenge | null = await Challenge.findById(
        req.body.challengeId,
      );

      if (!challenge) {
        return next(new AppError('Challenge does not exist', 404));
      }

      // join as participants
      if (challenge.participationType !== 'Team') {
        const alreadyInChallenge = challenge.participants.includes(userId);

        if (alreadyInChallenge) {
          return next(new AppError('You are already in this challenge', 400));
        }

        challenge.participants.push(userId);
        await challenge.save();

        res.status(201).json({ message: 'Success joining challenge' });
      }

      // join as team
      const { error, value } = teamValidate.validate(req.body);
      if (error) {
        return next(new AppError(error.message, 400));
      }

      const alreadyInChallenge = await ChallangeTeam.findOne({
        challengeId: value.challengeId,
        talents: userId,
      });

      if (alreadyInChallenge) {
        return next(
          new AppError(
            "You're already registered for this challenge with a different team.",
            400,
          ),
        );
      }

      const talentsInChallenge = await ChallangeTeam.find({
        challengeId: value.challengeId,
        talents: { $in: value.talents },
      });

      if (talentsInChallenge.length > 0) {
        return next(
          new AppError(
            'One or more talents are already members of another team for this challenge',
            400,
          ),
        );
      }

      value.talents.push(userId);
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
      challenge.participants.push(team.id);

      res.status(201).json({
        status: 'success',
        data: {
          team,
        },
      });
    },
  );
  addChallenge: RequestHandler = catchAsync(async (req, res, next) => {
    const { error, value } = challengeValidate.validate(req.body);

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
    const { error, value } = updateChallengeValidate.validate(req.body);

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
    const challenge = await Challenge.findById(req.params.id).populate(
      'participants',
    );

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
    const features = new APIFeatures(
      Challenge.find(),
      (req.query as QueryString) || {},
    )
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search();

    const challenges = await features.query;
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
