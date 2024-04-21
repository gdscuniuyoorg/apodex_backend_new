"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const challangeTeamSchema = new mongoose_1.default.Schema({
    name: { type: String, unique: true },
    talents: {
        type: [mongoose_1.default.Schema.ObjectId],
        ref: 'User',
    },
    challengeId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'Challenge',
    },
    votes: Number,
    teamLead: mongoose_1.default.Schema.ObjectId,
    maxTalents: {
        type: Number,
        required: [true, 'Team must have a max number of talents'],
    },
    minTalents: {
        type: Number,
        required: [true, 'Team must have a min number of talents'],
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const ChallangeTeam = mongoose_1.default.model('Team', challangeTeamSchema);
exports.default = ChallangeTeam;
