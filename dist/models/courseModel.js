"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const courseSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Course must have a name'],
    },
    category: String,
    description: String,
    objectives: [String],
    instructor: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A Course must have an instructor'],
    },
    videos: [String],
    materials: [String],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const Course = mongoose_1.default.model('Course', courseSchema);
exports.default = Course;
