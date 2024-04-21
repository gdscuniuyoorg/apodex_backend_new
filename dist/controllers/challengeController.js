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
const challengeModel_1 = __importDefault(require("../models/challengeModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const challenge_validate_1 = require("../helper/challenge.validate");
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const team_validate_1 = require("../helper/team.validate");
const challengeTeamModel_1 = __importDefault(require("../models/challengeTeamModel"));
class ChallengeController {
    constructor() {
        this.joinChallange = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const challenge = yield challengeModel_1.default.findById(req.body.challengeId);
            if (!challenge) {
                return next(new appError_1.default('Challenge does not exist', 404));
            }
            // join as participants
            if (challenge.participationType !== 'Team') {
                const alreadyInChallenge = challenge.participants.includes(userId);
                if (alreadyInChallenge) {
                    return next(new appError_1.default('You are already in this challenge', 400));
                }
                challenge.participants.push(userId);
                yield challenge.save();
                res.status(201).json({ message: 'Success joining challenge' });
            }
            // join as team
            const { error, value } = team_validate_1.teamValidate.validate(req.body);
            if (error) {
                return next(new appError_1.default(error.message, 400));
            }
            const alreadyInChallenge = yield challengeTeamModel_1.default.findOne({
                challengeId: value.challengeId,
                talents: userId,
            });
            if (alreadyInChallenge) {
                return next(new appError_1.default("You're already registered for this challenge with a different team.", 400));
            }
            const talentsInChallenge = yield challengeTeamModel_1.default.find({
                challengeId: value.challengeId,
                talents: { $in: value.talents },
            });
            if (talentsInChallenge.length > 0) {
                return next(new appError_1.default('One or more talents are already members of another team for this challenge', 400));
            }
            value.talents.push(userId);
            value.talents = [...new Set(value.talents)];
            if (challenge.maxTeamParticipants && challenge.minTeamParticipants) {
                if (value.talents.length > (challenge === null || challenge === void 0 ? void 0 : challenge.maxTeamParticipants) ||
                    value.talents.length < challenge.minTeamParticipants) {
                    return next(new appError_1.default('The participants are either greater then or less than ', 400));
                }
            }
            const team = yield challengeTeamModel_1.default.create(value);
            challenge.participants.push(team.id);
            res.status(201).json({
                status: 'success',
                data: {
                    team,
                },
            });
        }));
        this.addChallenge = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error, value } = challenge_validate_1.challengeValidate.validate(req.body);
            if (error) {
                return next(new appError_1.default(error.message, 400));
            }
            if (req.file) {
                value.coverPhoto = `${req.protocol}://${req.get('host')}/public/img/users/${req.file.filename}`;
            }
            const challenge = yield challengeModel_1.default.create(value);
            res.status(201).json({
                status: 'success',
                data: {
                    challenge,
                },
            });
        }));
        this.updateChallenge = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error, value } = challenge_validate_1.updateChallengeValidate.validate(req.body);
            if (error) {
                return next(new appError_1.default(error.message, 400));
            }
            if (req.file) {
                value.coverPhoto = `${req.protocol}://${req.get('host')}/public/img/users/${req.file.filename}`;
            }
            const updatedChallenge = yield challengeModel_1.default.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true });
            res.status(200).json({
                status: 'success',
                data: {
                    challenge: updatedChallenge,
                },
            });
        }));
        // Delete a challenge
        this.deleteChallenge = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield challengeModel_1.default.findByIdAndDelete(req.params.id);
            res.status(204).json({
                status: 'success',
                data: null,
            });
        }));
        // Get a single challenge by ID
        this.getChallenge = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const challenge = yield challengeModel_1.default.findById(req.params.id).populate('participants');
            if (!challenge) {
                return next(new appError_1.default('Challenge not found', 404));
            }
            res.status(200).json({
                status: 'success',
                data: {
                    challenge,
                },
            });
        }));
        // Get all challenges
        this.getAllChallenges = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const features = new apiFeatures_1.default(challengeModel_1.default.find(), req.query || {})
                .filter()
                .sort()
                .limitFields()
                .paginate()
                .search();
            const challenges = yield features.query;
            res.status(200).json({
                status: 'success',
                results: challenges.length,
                data: {
                    challenges,
                },
            });
        }));
    }
}
exports.default = new ChallengeController();
