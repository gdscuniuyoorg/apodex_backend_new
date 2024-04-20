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
class ChallengeController {
    constructor() {
        this.addChallenge = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error, value } = challenge_validate_1.challengeSchema.validate(req.body);
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
            const { error, value } = challenge_validate_1.updateChallengeSchema.validate(req.body);
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
            const challenge = yield challengeModel_1.default.findById(req.params.id);
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
            const challenges = yield challengeModel_1.default.find();
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
