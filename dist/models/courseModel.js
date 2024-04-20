"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnologyCategory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var TechnologyCategory;
(function (TechnologyCategory) {
    TechnologyCategory["ProgrammingLanguages"] = "Programming Languages";
    TechnologyCategory["WebDevelopmentFrameworks"] = "Web Development Frameworks";
    TechnologyCategory["MobileAppDevelopment"] = "Mobile App Development";
    TechnologyCategory["DatabaseManagement"] = "Database Management";
    TechnologyCategory["DevOpsAndCloudComputing"] = "DevOps and Cloud Computing";
    TechnologyCategory["BackendDevelopment"] = "Backend Development";
    TechnologyCategory["FrontendDevelopment"] = "Frontend Development";
    TechnologyCategory["DataScienceAndMachineLearning"] = "Data Science and Machine Learning";
    TechnologyCategory["Cybersecurity"] = "Cybersecurity";
    TechnologyCategory["GameDevelopment"] = "Game Development";
    TechnologyCategory["TechnicalWriting"] = "Technical Writing";
    TechnologyCategory["DataAnalysis"] = "Data Analysis";
})(TechnologyCategory || (exports.TechnologyCategory = TechnologyCategory = {}));
const courseSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Course must have a name'],
    },
    category: {
        type: String,
        enum: TechnologyCategory,
        required: [true, 'Course must have a category'],
    },
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
