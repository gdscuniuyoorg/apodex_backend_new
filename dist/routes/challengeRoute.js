"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const router = (0, express_1.Router)();
const challengeController_1 = __importDefault(require("../controllers/challengeController"));
const authController_1 = __importDefault(require("../controllers/authController"));
router.patch('/join', authController_1.default.protect, challengeController_1.default.joinChallange);
router.patch('/exit/:challengeId', authController_1.default.protect, challengeController_1.default.exitChallenge);
router
    .route('/')
    .post(authController_1.default.protect, (0, uploadController_1.singleUpload)('coverPhoto'), uploadController_1.cloudinaryUpload, challengeController_1.default.addChallenge)
    .get(challengeController_1.default.getAllChallenges);
router
    .route('/:challengeId')
    .get(challengeController_1.default.getChallenge)
    .patch(authController_1.default.protect, (0, uploadController_1.singleUpload)('coverPhoto'), uploadController_1.cloudinaryUpload, challengeController_1.default.updateChallenge)
    .delete(authController_1.default.protect, challengeController_1.default.deleteChallenge);
exports.default = router;
