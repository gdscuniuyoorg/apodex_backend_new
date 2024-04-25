import { RequestHandler } from 'express';
import Challenge, {
  IChallenge,
  ParticipationType,
} from '../models/challengeModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import {
  challengeValidate,
  updateChallengeValidate,
} from '../helper/challenge.validate';
import APIFeatures, { QueryString } from '../utils/apiFeatures';
import { teamValidate } from '../helper/team.validate';
import { CustomRequest } from '../types';
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

      if (challenge.participationType !== ParticipationType.Team) {
        if (challenge.participants.includes(userId)) {
          return next(new AppError('You are already in this challenge', 400));
        }

        challenge.participants.push(userId);
        await challenge.save();

        res.status(201).json({ message: 'Success joining challenge' });
        return;
      }

      // Join as team
      const { error, value } = teamValidate.validate(req.body);
      if (error) {
        return next(new AppError(error.message, 400));
      }

      // Check if the user is already part of another team for the same challenge
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

      // Check if any talent in the team is already a member of another team for this challenge
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

      // Check if the number of talents in the team falls within the min and max team participants range specified in the challenge
      if (
        challenge.maxTeamParticipants &&
        challenge.minTeamParticipants &&
        (value.talents.length > challenge.maxTeamParticipants ||
          value.talents.length < challenge.minTeamParticipants)
      ) {
        return next(
          new AppError(
            `The number of participants does not meet the requirements, you need atleast ${challenge.minTeamParticipants} and at most ${challenge.maxTeamParticipants}`,
            400,
          ),
        );
      }

      value.talents.push(userId);
      value.talents = [...new Set(value.talents)];
      value.teamLead = userId;
      value.maxTalents = challenge.maxTeamParticipants;
      value.minTalents = challenge.minTeamParticipants;

      const team = await ChallangeTeam.create(value);

      challenge.participants.push(team.id);
      await challenge.save();

      // Respond with success message and team data
      res.status(201).json({
        status: 'success',
        data: {
          team,
        },
      });
    },
  );

  exitChallenge: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const userId = req.user?.id;
      const { challengeId } = req.params;

      const challenge: IChallenge | null =
        await Challenge.findById(challengeId);

      if (!challenge) {
        return next(new AppError('Challenge does not exist', 404));
      }

      // Individuals
      if (challenge.participationType !== ParticipationType.Team) {
        if (!challenge.participants.includes(userId)) {
          return next(new AppError("You're not in this challenge", 404));
        }

        const index = challenge.participants.findIndex(
          (el) => el.toString() === userId,
        );

        challenge.participants.splice(index, 1);
        await challenge.save();

        res.status(201).json({ message: 'success exiting challange' });
        return;
      }

      // exit teams
      const team = await ChallangeTeam.findOne({
        challengeId,
        talents: {
          $elemMatch: { $in: [userId] },
        },
      });

      if (!team) {
        return next(new AppError('You are not part of the challenge', 404));
      }

      const index = team.talents.findIndex((el) => el.toString() === userId);
      team.talents.splice(index, 1);
      // remove the teamlead if nah him
      if (team.teamLead && team.teamLead.toString() === userId) {
        team.teamLead = undefined;
      }

      await team.save();

      res.status(201).json({ message: 'Success exiting challange' });
    },
  );

  addChallenge: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const { error, value } = challengeValidate.validate(req.body);
      const image = req?.image;

      if (error) {
        return next(new AppError(error.message, 400));
      }

      if (req.file && image) {
        value.coverPhoto = image;
        // value.coverPhoto = `${req.protocol}://${req.get(
        //   'host',
        // )}/public/img/users/${req.file.filename}`;
      }

      const challenge = await Challenge.create(value);

      res.status(201).json({
        status: 'success',
        data: {
          challenge,
        },
      });
    },
  );

  updateChallenge: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const { error, value } = updateChallengeValidate.validate(req.body);
      const image = req?.image;

      if (error) {
        return next(new AppError(error.message, 400));
      }

      if (req.file && image) {
        value.coverPhoto = image;
        // value.coverPhoto = `${req.protocol}://${req.get(
        //   'host',
        // )}/public/img/users/${req.file.filename}`;
      }

      const updatedChallenge = await Challenge.findByIdAndUpdate(
        req.params.challengeId,
        value,
        { new: true, runValidators: true },
      );
      res.status(200).json({
        status: 'success',
        data: {
          challenge: updatedChallenge,
        },
      });
    },
  );

  // Delete a challenge
  deleteChallenge: RequestHandler = catchAsync(async (req, res, next) => {
    await Challenge.findByIdAndDelete(req.params.challengeId);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  // Get a single challenge by ID
  getChallenge: RequestHandler = catchAsync(async (req, res, next) => {
    const challenge = await Challenge.findById(req.params.challengeId).populate(
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
