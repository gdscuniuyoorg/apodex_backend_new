import { RequestHandler } from 'express';
import Vote, { IVote } from '../models/voteModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { CustomRequest } from './authController';
import ChallangeTeam from '../models/challengeTeamModel';

class VoteController {
  // Add a new vote
  addVote: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const userId = req.user?.id;
      const { teamId, challangeId } = req.params;

      //   check if team exist
      const team = await ChallangeTeam.findOne({ _id: teamId });

      if (!team) {
        return next(new AppError('Team does not exist', 404));
      }

      let vote = await Vote.findOne({ userId, teamId, challangeId });

      if (vote) {
        vote = await Vote.findOneAndUpdate(
          { userId, teamId, challangeId },
          { $set: { userId, teamId, challangeId } },
          { new: true, runValidators: true },
        );
      } else {
        vote = await Vote.create({ teamId, userId, challangeId });
      }

      res.status(201).json({
        status: 'success',
        data: {
          vote,
        },
      });
    },
  );

  // Delete a vote
  deleteVote: RequestHandler = catchAsync(async (req, res, next) => {
    await Vote.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  // Get a single vote by ID
  getVoteByTeam: RequestHandler = catchAsync(async (req, res, next) => {
    const vote = await Vote.findById(req.params.id);
    if (!vote) {
      return next(new AppError('Vote not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        vote,
      },
    });
  });

  // Get all votes
  getAllVotes: RequestHandler = catchAsync(async (req, res, next) => {
    const votes = await Vote.find();
    res.status(200).json({
      status: 'success',
      results: votes.length,
      data: {
        votes,
      },
    });
  });
}

export default new VoteController();
