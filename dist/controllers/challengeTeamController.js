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
const challengeTeamModel_1 = __importDefault(require("../models/challengeTeamModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const challengeModel_1 = __importDefault(require("../models/challengeModel"));
const team_validate_1 = require("../helper/team.validate");
class TeamController {
    constructor() {
        // Add a new team
        this.joinChallange = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
            const { error, value } = team_validate_1.teamValidate.validate(req.body);
            if (error) {
                return next(new appError_1.default(error.message, 400));
            }
            const challenge = yield challengeModel_1.default.findById(value.challengeId);
            if (!challenge) {
                return next(new appError_1.default('Challenge does not exist', 404));
            }
            if (challenge.participationType !== 'Team') {
                return next(new appError_1.default('This challenge does not allow teams', 400));
            }
            // adding yourself to team
            value.talents.push(email);
            value.talents = [...new Set(value.talents)];
            if (challenge.maxTeamParticipants && challenge.minTeamParticipants) {
                if (value.talents.length > (challenge === null || challenge === void 0 ? void 0 : challenge.maxTeamParticipants) ||
                    value.talents.length < challenge.minTeamParticipants) {
                    return next(new appError_1.default('The participants are either greater then or less than ', 400));
                }
            }
            const team = yield challengeTeamModel_1.default.create(value);
            res.status(201).json({
                status: 'success',
                data: {
                    team,
                },
            });
        }));
        // Update an existing team
        this.updateTeam = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const updatedTeam = yield challengeTeamModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            res.status(200).json({
                status: 'success',
                data: {
                    team: updatedTeam,
                },
            });
        }));
        // Delete a team
        this.deleteTeam = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield challengeTeamModel_1.default.findByIdAndDelete(req.params.id);
            res.status(204).json({
                status: 'success',
                data: null,
            });
        }));
        // Get a single team by ID
        this.getTeam = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const team = yield challengeTeamModel_1.default.findById(req.params.id);
            if (!team) {
                return next(new appError_1.default('Team not found', 404));
            }
            res.status(200).json({
                status: 'success',
                data: {
                    team,
                },
            });
        }));
        // Get all teams
        this.getAllTeams = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const teams = yield challengeTeamModel_1.default.find();
            res.status(200).json({
                status: 'success',
                results: teams.length,
                data: {
                    teams,
                },
            });
        }));
    }
}
exports.default = new TeamController();
