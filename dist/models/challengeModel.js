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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const Challange = mongoose_1.default.model('Course', challangeSchema);
exports.default = Challange;
