"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multerController_1 = require("../controllers/multerController");
const router = (0, express_1.Router)();
const challengeController_1 = __importDefault(require("../controllers/challengeController"));
const authController_1 = __importDefault(require("../controllers/authController"));
router
    .route('/')
    .post(authController_1.default.protect, (0, multerController_1.singleUpload)('coverPhoto'), challengeController_1.default.addChallenge)
    .get(challengeController_1.default.getAllChallenges);
router
    .route('/:id')
    .get(challengeController_1.default.getChallenge)
    .patch(authController_1.default.protect, (0, multerController_1.singleUpload)('coverPhoto'), challengeController_1.default.updateChallenge)
    .delete(authController_1.default.protect, challengeController_1.default.deleteChallenge);
exports.default = router;
