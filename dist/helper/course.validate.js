"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const courseValidate = joi_1.default.object({
    name: joi_1.default.string().min(1).required(),
    category: joi_1.default.string().min(1).required(),
    objectives: joi_1.default.string().min(1).required(),
    description: joi_1.default.string().min(1).required(),
    instructor: joi_1.default.string().min(1).required(),
    videos: joi_1.default.array().items(joi_1.default.string().min(1)).required(),
    materials: joi_1.default.array().items(joi_1.default.string()).optional(),
});
exports.default = courseValidate;
