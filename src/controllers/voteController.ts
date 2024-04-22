import { RequestHandler } from 'express';
import Vote, { IVote } from '../models/voteModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { CustomRequest } from '../types';
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
  deleteVote: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const userId = req.user?.id;
      const { teamId, challangeId } = req.params;

      const vote = await Vote.findOne({ userId, teamId, challangeId });

      if (!vote) {
        return next(new AppError('Vote has not been casted yet, vote', 404));
      }

      // if vote is found, delete it
      await Vote.findByIdAndDelete(vote._id);
      res.status(204).json({
        status: 'success',
        data: null,
      });
    },
  );

  // Get a single vote by ID
  getVoteByTeam: RequestHandler = catchAsync(async (req, res, next) => {
    const { teamId, challangeId } = req.params;
    const votes = await Vote.find({ teamId, challangeId });
    if (!votes) {
      return next(new AppError('Votes not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        votes,
      },
    });
  });

  // Get all votes
  getAllVotes: RequestHandler = catchAsync(async (req, res, next) => {
    const { challangeId } = req.params;

    const votes: IVote[] = await Vote.find({ challangeId });

    console.log(votes);

    const groupedVotes = await Vote.aggregate([
      {
        $match: { challangeId },
      },
      {
        $group: {
          _id: '$teamId',
          votes: { $push: '$$ROOT' },
        },
      },
      {
        $lookup: {
          from: 'ChallangeTeam', // The collection to join
          localField: '_id', // Field from the current collection (Vote) to match
          foreignField: '_id', // Field from the joined collection (ChallangeTeam) to match
          as: 'teamInfo', // Output array field name
        },
      },
    ]);

    // break votes into teams and send the different arrays of the teams

    res.status(200).json({
      status: 'success',
      data: {
        votes: groupedVotes,
      },
    });
  });
}

export default new VoteController();
