"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voteModel_1 = __importDefault(require("../models/voteModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const challengeTeamModel_1 = __importDefault(require("../models/challengeTeamModel"));
class VoteController {
    constructor() {
        // Add a new vote
        this.addVote = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { teamId, challangeId } = req.params;
            //   check if team exist
            const team = yield challengeTeamModel_1.default.findOne({ _id: teamId });
            if (!team) {
                return next(new appError_1.default('Team does not exist', 404));
            }
            let vote = yield voteModel_1.default.findOne({ userId, teamId, challangeId });
            if (vote) {
                vote = yield voteModel_1.default.findOneAndUpdate({ userId, teamId, challangeId }, { $set: { userId, teamId, challangeId } }, { new: true, runValidators: true });
            }
            else {
                vote = yield voteModel_1.default.create({ teamId, userId, challangeId });
            }
            res.status(201).json({
                status: 'success',
                data: {
                    vote,
                },
            });
        }));
        // Delete a vote
        this.deleteVote = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { teamId, challangeId } = req.params;
            const vote = yield voteModel_1.default.findOne({ userId, teamId, challangeId });
            if (!vote) {
                return next(new appError_1.default('Vote has not been casted yet, vote', 404));
            }
            // if vote is found, delete it
            yield voteModel_1.default.findByIdAndDelete(vote._id);
            res.status(204).json({
                status: 'success',
                data: null,
            });
        }));
        // Get a single vote by ID
        this.getVoteByTeam = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { teamId, challangeId } = req.params;
            const votes = yield voteModel_1.default.find({ teamId, challangeId });
            if (!votes) {
                return next(new appError_1.default('Votes not found', 404));
            }
            res.status(200).json({
                status: 'success',
                data: {
                    votes,
                },
            });
        }));
        // Get all votes
        this.getAllVotes = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { challangeId } = req.params;
            const votes = yield voteModel_1.default.find({ challangeId });
            console.log(votes);
            const groupedVotes = yield voteModel_1.default.aggregate([
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
        }));
    }
}
exports.default = new VoteController();
