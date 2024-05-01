import { number } from 'joi';
import mongoose, { Document } from 'mongoose';

export interface IChallangeTeam extends Document {
  name: string;
  talents: (typeof mongoose.Schema.ObjectId)[];
  challengeId: typeof mongoose.Schema.ObjectId;
  votes: number;
  teamLead?: typeof mongoose.Schema.ObjectId;
  maxTalents: number;
  minTalents: number;
  projectName: string;
}

const challangeTeamSchema = new mongoose.Schema<IChallangeTeam>(
  {
    name: { type: String, unique: true },

    talents: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
    },
    challengeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Challenge',
    },
    votes: Number,
    teamLead: mongoose.Schema.ObjectId,
    projectName: String,

    maxTalents: {
      type: Number,
      required: [true, 'Team must have a max number of talents'],
    },
    minTalents: {
      type: Number,
      required: [true, 'Team must have a min number of talents'],
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const ChallangeTeam = mongoose.model<IChallangeTeam>(
  'Team',
  challangeTeamSchema,
);
export default ChallangeTeam;
