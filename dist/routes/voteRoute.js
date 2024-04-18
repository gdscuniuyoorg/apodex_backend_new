"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voteController_1 = __importDefault(require("../controllers/voteController"));
const router = (0, express_1.Router)();
router.route('/').get(voteController_1.default.getAllVotes);
router.post('/:challangeId/:teamId', voteController_1.default.addVote);
