import mongoose, { Document } from 'mongoose';

enum TechnologyCategory {
  ProgrammingLanguages = 'Programming Languages',
  WebDevelopmentFrameworks = 'Web Development Frameworks',
  MobileAppDevelopment = 'Mobile App Development',
  DatabaseManagement = 'Database Management',
  DevOpsAndCloudComputing = 'DevOps and Cloud Computing',
  BackendDevelopment = 'Backend Development',
  FrontendDevelopment = 'Frontend Development',
  DataScienceAndMachineLearning = 'Data Science and Machine Learning',
  Cybersecurity = 'Cybersecurity',
  GameDevelopment = 'Game Development',
  TechnicalWriting = 'Technical Writing',
  DataAnalysis = 'Data Analysis',
}

export interface ICourse extends Document {
  name: string;
  category: TechnologyCategory;
  description: string;
  objectives: string[];
  instructor: typeof mongoose.Schema.ObjectId;
  videos: string[];
  materials: string[];
}

const courseSchema = new mongoose.Schema<ICourse>(
  {
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
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A Course must have an instructor'],
    },
    videos: [String],
    materials: [String],
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Course = mongoose.model<ICourse>('Course', courseSchema);
export default Course;
