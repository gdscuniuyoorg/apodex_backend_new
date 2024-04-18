"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voteController_1 = __importDefault(require("../controllers/voteController"));
const authController_1 = __importDefault(require("../controllers/authController"));
const router = (0, express_1.Router)();
router.get('/:challengeId', voteController_1.default.getAllVotes);
router
    .route('/:challangeId/:teamId')
    .get(voteController_1.default.getVoteByTeam)
    .post(authController_1.default.protect, voteController_1.default.addVote)
    .delete(authController_1.default.protect, voteController_1.default.deleteVote);
exports.default = router;
