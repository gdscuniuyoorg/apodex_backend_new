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
            yield voteModel_1.default.findByIdAndDelete(req.params.id);
            res.status(204).json({
                status: 'success',
                data: null,
            });
        }));
        // Get a single vote by ID
        this.getVoteByTeam = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const vote = yield voteModel_1.default.findById(req.params.id);
            if (!vote) {
                return next(new appError_1.default('Vote not found', 404));
            }
            res.status(200).json({
                status: 'success',
                data: {
                    vote,
                },
            });
        }));
        // Get all votes
        this.getAllVotes = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const votes = yield voteModel_1.default.find();
            res.status(200).json({
                status: 'success',
                results: votes.length,
                data: {
                    votes,
                },
            });
        }));
    }
}
exports.default = new VoteController();
