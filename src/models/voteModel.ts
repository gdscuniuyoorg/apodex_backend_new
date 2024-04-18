import mongoose, { Document } from 'mongoose';

export interface IVote extends Document {
  teamId: typeof mongoose.Schema.ObjectId;
  userId: typeof mongoose.Schema.ObjectId;
  challangeId: typeof mongoose.Schema.ObjectId;
}

const voteSchema = new mongoose.Schema<IVote>(
  {
    teamId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Team',
      required: [true, 'A vote must have teamId'],
    },

    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A vote must have a userId'],
    },
    challangeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Challange',
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Vote = mongoose.model<IVote>('Course', voteSchema);
export default Vote;
