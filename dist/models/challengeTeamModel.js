"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const challangeTeamSchema = new mongoose_1.default.Schema({
    name: String,
    talents: {
        type: [mongoose_1.default.Schema.ObjectId],
        ref: 'User',
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const ChallangeTeam = mongoose_1.default.model('Course', challangeTeamSchema);
exports.default = ChallangeTeam;
