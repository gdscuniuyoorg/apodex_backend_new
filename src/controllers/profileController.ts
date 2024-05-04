import { RequestHandler } from 'express';
import { CustomRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import sendReponse from '../utils/sendResponse';
import User from '../models/userModel';
import filterObj, { keysToExtract } from '../utils/filterObj';
import APIFeatures, { QueryString } from '../utils/apiFeatures';

class UserController {
  // constructor() {}
  updateProfile: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const id = req.user?.id;
      const image = req?.image;

      if (req.body.password || req.body.passwordConfirm) {
        return next(
          new AppError('This route is not for password updates', 400),
        );
      }

      // filter body properly
      const filterBody = filterObj(req.body, keysToExtract);
      if (req.file && image) {
        filterBody.displayPhoto = image;
        // filterBody.displayPhoto = `${req.protocol}://${req.get(
        //   'host',
        // )}/public/img/users/${req.file.filename}`;
      }

      const profile = await User.findOneAndUpdate(
        { _id: id },
        { $set: filterBody },
        { new: true },
      ).select('-password -__v -confirmEmailToken -isEmailConfirmed -role');

      if (!profile) {
        return next(new AppError('Profile not found', 404));
      }

      sendReponse(res, 201, profile);
    },
  );

  getProfile: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const { user_id } = req.params;

      const profile = await User.findOne({ _id: user_id }).select(
        '-password -__v -confirmEmailToken -isEmailConfirmed -role',
      );

      if (!profile) {
        return next(new AppError('An error occured fetching userProfile', 400));
      }

      sendReponse(res, 200, profile);
    },
  );

  getProfiles: RequestHandler = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(
      User.find().select(
        '-password -__v -confirmEmailToken -isEmailConfirmed -role',
      ),
      req.query as QueryString,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search();

    const users = await features.query;
    if (!users) {
      return next(new AppError('User profiles does not exist', 404));
    }

    sendReponse(res, 200, { length: users.length, users });
  });

  getMe: RequestHandler = catchAsync(async (req: CustomRequest, res, next) => {
    const id = req.user?.id;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    sendReponse(res, 200, user);
  });
}

export default new UserController();
