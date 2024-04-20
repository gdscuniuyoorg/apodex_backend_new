"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const challangeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Course must have a name'],
    },
    description: String,
    coverPhoto: String,
    teams: { type: [mongoose_1.default.Schema.ObjectId], ref: 'Team' },
    startTime: {
        type: Date,
        required: [true, 'Challenge must have a Start Time'],
    },
    endTime: {
        type: Date,
        required: [true, 'Challenge must have an endtime'],
    },
    rules: String,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const Challange = mongoose_1.default.model('Challange', challangeSchema);
exports.default = Challange;
