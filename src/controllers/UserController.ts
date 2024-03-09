import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import UserProfile from '../models/userProfileModel';
import AppError from '../utils/appError';
import { CustomRequest } from './authController';
import sendReponse from '../utils/sendResponse';

class UserController {
  updateProfile: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const user_id = req.user?.id;
      const updateFields = req.body;

      delete updateFields.user_id;
      const schemaPaths = Object.keys(UserProfile.schema.paths);
      const filteredUpdateFields = Object.fromEntries(
        Object.entries(updateFields).filter(([key]) =>
          schemaPaths.includes(key),
        ),
      );

      const profile = await UserProfile.findOneAndUpdate(
        { user_id },
        { $set: filteredUpdateFields },
        { new: true },
      );

      if (!profile) {
        return next(new AppError('Profile not found', 404));
      }

      sendReponse(res, 201, profile);
    },
  );
  getProfile: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const user_id = req.params;

      let profile = await UserProfile.findOneAndUpdate(
        { user_id },
        { $setOnInsert: { user_id } },
        { upsert: true, new: true },
      );

      sendReponse(res, 200, profile);
    },
  );

  getUsers: RequestHandler = catchAsync(async (req, res, next) => {
    // paginate these response
    const users = await UserProfile.find();

    if (!users) {
      return next(new AppError('User profiles does not exist', 404));
    }

    sendReponse(res, 200, users);
  });
}

export default new UserController();
