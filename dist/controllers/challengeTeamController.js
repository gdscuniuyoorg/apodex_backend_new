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
const userModel_1 = require("../models/userModel");
class TeamController {
    constructor() {
        this.checkRole = (req, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
            const { teamId } = req.params;
            const team = yield challengeTeamModel_1.default.findById(teamId);
            if (!team) {
                return next(new appError_1.default('This team does not exist', 404));
            }
            if (role !== userModel_1.UserRole.ADMIN || ((_c = team.teamLead) === null || _c === void 0 ? void 0 : _c.toString()) !== userId) {
                return next(new appError_1.default('You dont have permission to delete this team', 400));
            }
            return team;
        });
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
        this.removeTalentFromTeam = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { talentId } = req.body;
            const team = yield this.checkRole(req, next);
            if (!team) {
                return next(new appError_1.default('Team not found', 404));
            }
            const index = team.talents.findIndex((el) => el.toString() === talentId);
            if (!index || index < 0) {
                return next(new appError_1.default('This talent is not a memeber of this team', 404));
            }
            team.talents.splice(index, 1);
            if (team.talents.length < team.minTalents) {
                return next(new appError_1.default('Number of talents too little', 400));
            }
            yield team.save();
            res.status(201).send('success removing talent from team');
        }));
        this.addTalentToTeam = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { talentId } = req.body;
            const team = yield this.checkRole(req, next);
            if (!team) {
                return next(new appError_1.default('Team not found', 404));
            }
            team.talents.push(talentId);
            if (team.talents.length > team.maxTalents) {
                return next(new appError_1.default('Number of talents too large', 400));
            }
            yield team.save();
            res.status(201).send('success add talent to team');
        }));
        // Delete a team
        this.deleteTeam = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const team = yield this.checkRole(req, next);
            if (!team) {
                return next(new appError_1.default('Team does not exist', 404));
            }
            yield team.deleteOne();
            res.status(204).json({
                status: 'success',
                data: null,
            });
        }));
        // Get a single team by ID
        this.getTeam = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const team = yield challengeTeamModel_1.default.findById(req.params.teamId).populate('talents');
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
            const { challengeId } = req.params;
            const teams = yield challengeTeamModel_1.default.find({ challengeId });
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
