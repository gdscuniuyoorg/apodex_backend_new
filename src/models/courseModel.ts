import mongoose, { Document } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  category: string;
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
    category: String,
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
