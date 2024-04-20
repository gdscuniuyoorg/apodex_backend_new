"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseValidate = exports.courseValidate = void 0;
const joi_1 = __importDefault(require("joi"));
exports.courseValidate = joi_1.default.object({
    name: joi_1.default.string().min(1).required(),
    description: joi_1.default.string().min(1).required(),
    coverPhoto: joi_1.default.string().min(1).required(),
    teams: joi_1.default.array().items(joi_1.default.string().min(1)),
});
exports.updateCourseValidate = joi_1.default.object({
    name: joi_1.default.string().min(1),
    description: joi_1.default.string().min(1),
    coverPhoto: joi_1.default.string().min(1),
    teams: joi_1.default.array().items(joi_1.default.string().min(1)),
});
