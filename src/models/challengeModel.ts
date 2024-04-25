import mongoose, { Document } from 'mongoose';

export enum ParticipationType {
  Team = 'Team',
  Individual = 'Individual',
}

export interface IChallenge extends Document {
  name: string;
  description: string;
  coverPhoto: string;
  participationType: ParticipationType;
  startTime: Date;
  endTime: Date;
  rules: string;
  minTeamParticipants: number | undefined;
  maxTeamParticipants: number | undefined;
  participants: (typeof mongoose.Schema.ObjectId)[];
}

const challengeSchema = new mongoose.Schema<IChallenge>(
  {
    name: {
      type: String,
      required: [true, 'Challenge must have a name'],
    },
    description: String,
    coverPhoto: String,
    participationType: {
      type: String,
      enum: ParticipationType,
      default: ParticipationType.Individual,
    },
    participants: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
        },
      ],
      default: [],
    },
    startTime: {
      type: Date,
      required: [true, 'Challenge must have a start time'],
    },
    endTime: {
      type: Date,
      required: [true, 'Challenge must have an end time'],
    },
    rules: String,
    minTeamParticipants: { type: Number, default: 1 },
    maxTeamParticipants: { type: Number, default: 6 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

challengeSchema.pre('save', async function (this: IChallenge) {
  const refModel =
    this.participationType === ParticipationType.Team ? 'Team' : 'User';

  // add ref to participants based on participationType
  this.schema.paths.participants.options.ref = refModel;
});

const Challenge = mongoose.model<IChallenge>('Challenge', challengeSchema);
export default Challenge;
