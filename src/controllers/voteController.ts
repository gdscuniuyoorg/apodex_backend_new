import { RequestHandler } from 'express';
import Vote, { IVote } from '../models/voteModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

class VoteController {
  // Add a new vote
  addVote: RequestHandler = catchAsync(async (req, res, next) => {
    const newVote = await Vote.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        vote: newVote,
      },
    });
  });

  // Update an existing vote
  updateVote: RequestHandler = catchAsync(async (req, res, next) => {
    const updatedVote = await Vote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        vote: updatedVote,
      },
    });
  });

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
