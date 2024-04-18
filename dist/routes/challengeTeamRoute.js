"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const challengeTeamController_1 = __importDefault(require("../controllers/challengeTeamController"));
const authController_1 = __importDefault(require("../controllers/authController"));
const router = (0, express_1.Router)();
router
    .route('/')
    .get(challengeTeamController_1.default.getAllTeams)
    .post(authController_1.default.protect, challengeTeamController_1.default.addTeam);
router
    .route('/:id')
    .get(challengeTeamController_1.default.getTeam)
    .patch(authController_1.default.protect, challengeTeamController_1.default.updateTeam)
    .delete(authController_1.default.protect, challengeTeamController_1.default.deleteTeam);
exports.default = router;
