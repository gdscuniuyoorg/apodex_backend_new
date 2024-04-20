import mongoose, { Document } from 'mongoose';

export interface IChallange extends Document {
  name: string;
  description: string;
  coverPhoto: string;
  teams: (typeof mongoose.Schema.ObjectId)[];
  startTime: Date;
  endTime: Date;
  rules: string;
}

const challangeSchema = new mongoose.Schema<IChallange>(
  {
    name: {
      type: String,
      required: [true, 'Course must have a name'],
    },
    description: String,
    coverPhoto: String,
    teams: { type: [mongoose.Schema.ObjectId], ref: 'Team' },
    startTime: {
      type: Date,
      required: [true, 'Challenge must have a Start Time'],
    },
    endTime: {
      type: Date,
      required: [true, 'Challenge must have an endtime'],
    },

    rules: String,
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Challange = mongoose.model<IChallange>('Challange', challangeSchema);
export default Challange;
