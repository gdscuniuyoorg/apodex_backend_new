"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileController_1 = __importDefault(require("../controllers/profileController"));
const authController_1 = __importDefault(require("../controllers/authController"));
const uploadController_1 = require("../controllers/uploadController");
const router = (0, express_1.Router)();
router.get('/me', authController_1.default.protect, profileController_1.default.getMe);
router
    .route('/')
    .get(profileController_1.default.getProfiles)
    .patch(authController_1.default.protect, profileController_1.default.updateProfile);
router.route('/:user_id').get(profileController_1.default.getProfile);
router.patch('/image', authController_1.default.protect, (0, uploadController_1.singleUpload)('photo'), uploadController_1.cloudinaryUpload, profileController_1.default.updateProfile);
exports.default = router;
