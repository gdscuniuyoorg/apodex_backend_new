import { RequestHandler } from 'express';
import { CustomRequest } from './authController';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import sendReponse from '../utils/sendResponse';
import User from '../models/userModel';
import multer from 'multer';
import filterObj, { keysToExtract } from '../utils/filterObj';

class UserController {
  multerStorage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, 'public/img/users');
    },
    filename(req: CustomRequest, file, callback) {
      const extension = file.mimetype.split('/')[1];
      callback(null, `user-${req.user?.id}-${Date.now()}.${extension}`);
    },
  });

  multerFilter = (
    req: CustomRequest,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback,
  ) => {
    if (file.mimetype.startsWith('image')) {
      callback(null, true);
    } else {
      callback(new AppError('Not an image! Please upload only images', 400));
    }
  };

  // initializing multer
  upload: multer.Multer = multer({
    storage: this.multerStorage,
    fileFilter: this.multerFilter,
  });

  // constructor() {}
  updateProfile: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const user_id = req.user?.id;

      if (req.body.password || req.body.passwordConfirm) {
        return next(
          new AppError('This route is not for password updates', 400),
        );
      }

      // filter body properly
      const filterBody = filterObj(req.body, keysToExtract);
      if (req.file) filterBody.photo = req.file.filename;

      const profile = await User.findOneAndUpdate(
        { id: user_id },
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

      const profile = await User.findOne({ id: user_id });

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

  uploadProfileImage = this.upload.single('photo');
}

export default new UserController();
