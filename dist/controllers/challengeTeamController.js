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
class TeamController {
    constructor() {
        // Add a new team
        this.addTeam = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const newTeam = yield challengeTeamModel_1.default.create(req.body);
            res.status(201).json({
                status: 'success',
                data: {
                    team: newTeam,
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
