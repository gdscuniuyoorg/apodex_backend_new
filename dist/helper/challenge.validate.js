"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChallengeValidate = exports.challengeValidate = void 0;
const joi_1 = __importDefault(require("joi"));
exports.challengeValidate = joi_1.default.object({
    name: joi_1.default.string().min(1).required(),
    description: joi_1.default.string().min(1).required(),
    participants: joi_1.default.array().items(joi_1.default.string().min(1)),
    participationType: joi_1.default.string().min(1).required(),
    startTime: joi_1.default.date().iso().required(),
    endTime: joi_1.default.date().iso().required(),
    rules: joi_1.default.string().min(1).required(),
    minTeamParticipants: joi_1.default.number().min(1).optional(),
    maxTeamParticipants: joi_1.default.number().min(1).optional(),
});
exports.updateChallengeValidate = joi_1.default.object({
    name: joi_1.default.string().min(1),
    description: joi_1.default.string().min(1),
    participants: joi_1.default.array().items(joi_1.default.string().min(1)),
    participationType: joi_1.default.string().min(1),
    startTime: joi_1.default.date().iso(),
    endTime: joi_1.default.date().iso(),
    rules: joi_1.default.string().min(1),
    minTeamParticipants: joi_1.default.number().min(1),
    maxTeamParticipants: joi_1.default.number().min(1),
});
