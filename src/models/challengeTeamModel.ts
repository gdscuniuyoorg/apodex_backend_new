import mongoose, { Document } from 'mongoose';

export interface IChallangeTeam extends Document {
  name: string;
  talents: (typeof mongoose.Schema.ObjectId)[];
  votes: number;
}

const challangeTeamSchema = new mongoose.Schema<IChallangeTeam>(
  {
    name: String,
    talents: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
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
