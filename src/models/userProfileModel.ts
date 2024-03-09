import mongoose, { Document } from 'mongoose';

export interface IUserProfile extends Document {
  bio: string;
  cover_photo_url: string;
  date_of_birth: string;
}

const userProfileScheme = new mongoose.Schema(
  {
    user_id: {
      ref: 'User',
      type: mongoose.Schema.ObjectId,
      required: [true, 'User Id is required'],
    },
    bio: String,
    cover_photo_url: String,
    date_of_birth: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const UserProfile = mongoose.model('UserProfile', userProfileScheme);

export default UserProfile;
