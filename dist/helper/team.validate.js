"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeamValidate = exports.teamValidate = void 0;
const joi_1 = __importDefault(require("joi"));
exports.teamValidate = joi_1.default.object({
    name: joi_1.default.string().min(1).required(),
    talents: joi_1.default.array().items(joi_1.default.string().min(1)).required(),
    challengeId: joi_1.default.string().min(1).required(),
});
exports.updateTeamValidate = joi_1.default.object({
    name: joi_1.default.string().min(1),
    talents: joi_1.default.array().items(joi_1.default.string().min(1)),
});
