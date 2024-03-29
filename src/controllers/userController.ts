import { RequestHandler } from 'express';
import { CustomRequest } from './authController';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import sendReponse from '../utils/sendResponse';
import User from '../models/userModel';
import filterObj, { keysToExtract } from '../utils/filterObj';

import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';

import fs from 'fs';
class UserController {
  // constructor() {}
  updateProfile: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const id = req.user?.id;

      if (req.body.password || req.body.passwordConfirm) {
        return next(
          new AppError('This route is not for password updates', 400),
        );
      }

      // filter body properly
      const filterBody = filterObj(req.body, keysToExtract);
      if (req.file)
        filterBody.image = `${req.protocol}://${req.get(
          'host',
        )}/public/img/users/${req.file.filename}`;

      const profile = await User.findOneAndUpdate(
        { _id: id },
        { $set: filterBody },
      );

      if (!profile) {
        return next(new AppError('Profile not found', 404));
      }

      sendReponse(res, 201, profile);
    },
  );
  getProfile: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const { user_id } = req.params;

      const profile = await User.findOne({ _id: user_id });

      if (!profile) {
        return next(new AppError('An error occured fetching userProfile', 400));
      }

      sendReponse(res, 200, profile);
    },
  );

  getUsers: RequestHandler = catchAsync(async (req, res, next) => {
    // paginate these response

    console.log(req.cookies);
    const users = await User.find().select(
      '-password -__v -confirmEmailToken -isEmailConfirmed -role',
    );
    if (!users) {
      return next(new AppError('User profiles does not exist', 404));
    }

    sendReponse(res, 200, users);
  });

  resizePhoto: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      if (!req.file) return next();

      // always set the filename
      req.file.filename = `user-${req.user?.id}-${Date.now()}.jpeg`;

      await imagemin
        .buffer(req.file.buffer, {
          plugins: [imageminJpegtran({ progressive: true })],
        })
        .then((buffer) => {
          // Write the buffer to a file
          fs.writeFile(
            `./public/img/users/${req?.file?.filename}`,
            buffer,
            (err) => {
              if (err) {
                console.error('Error writing file:', err);
                return next(err);
              }
              next();
            },
          );
        });
    },
  );
}

export default new UserController();
