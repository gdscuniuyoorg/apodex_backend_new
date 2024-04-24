"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const authController_1 = __importDefault(require("../controllers/authController"));
const multerController_1 = require("../controllers/multerController");
const router = (0, express_1.Router)();
router
    .route('/')
    .get(userController_1.default.getUsers)
    .patch(authController_1.default.protect, userController_1.default.updateProfile);
router.route('/:user_id').get(userController_1.default.getProfile);
router.patch('/image', authController_1.default.protect, (0, multerController_1.singleUpload)('photo'), multerController_1.cloudinaryUpload, userController_1.default.updateProfile);
exports.default = router;
