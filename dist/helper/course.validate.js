"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseValidate = exports.courseValidate = void 0;
const joi_1 = __importDefault(require("joi"));
exports.courseValidate = joi_1.default.object({
    name: joi_1.default.string().min(1).required(),
    category: joi_1.default.string().min(1).required(),
    objectives: joi_1.default.string().min(1).required(),
    description: joi_1.default.string().min(1).required(),
    instructor: joi_1.default.string().min(1).required(),
    videos: joi_1.default.array().items(joi_1.default.string().min(1)).required(),
    materials: joi_1.default.array().items(joi_1.default.string()).optional(),
});
exports.updateCourseValidate = joi_1.default.object({
    name: joi_1.default.string().min(1),
    category: joi_1.default.string().min(1),
    objectives: joi_1.default.string().min(1),
    description: joi_1.default.string().min(1),
    instructor: joi_1.default.string().min(1),
    videos: joi_1.default.array().items(joi_1.default.string().min(1)),
    materials: joi_1.default.array().items(joi_1.default.string()),
});
