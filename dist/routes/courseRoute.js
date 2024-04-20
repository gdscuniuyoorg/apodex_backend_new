"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const courseController_1 = __importDefault(require("../controllers/courseController"));
const authController_1 = __importDefault(require("../controllers/authController"));
router.get('/categories', courseController_1.default.getCategories);
router.get('/available-categories', courseController_1.default.getAvailableCategories);
router
    .route('/')
    .get(courseController_1.default.getAllCourses)
    .post(authController_1.default.protect, courseController_1.default.addCourse);
router
    .route('/:id')
    .get(courseController_1.default.getCourse)
    .patch(authController_1.default.protect, courseController_1.default.updateCourse)
    .delete(authController_1.default.protect, courseController_1.default.deleteCourse);
exports.default = router;
