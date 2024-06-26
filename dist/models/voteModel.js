"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const voteSchema = new mongoose_1.default.Schema({
    teamId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'Team',
        required: [true, 'A vote must have teamId'],
    },
    userId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A vote must have a userId'],
    },
    challangeId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'Challange',
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const Vote = mongoose_1.default.model('Vote', voteSchema);
exports.default = Vote;
