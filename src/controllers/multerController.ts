import multer from 'multer';
import { CustomRequest } from '../types';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { RequestHandler } from 'express';
import cloudinary from '../utils/cloudinary';

// const multerStorage = multer.diskStorage({
//   destination(req: CustomRequest, file, callback) {
//     callback(null, 'public/img/users');
//   },
//   filename(req: CustomRequest, file, callback) {
//     const extension = file.mimetype.split('/')[1];
//     callback(null, `user-${req.user?.id}-${Date.now()}.${extension}`);
//   },
// });

// const multerFilter = (
//   req: CustomRequest,
//   file: Express.Multer.File,
//   callback: multer.FileFilterCallback,
// ) => {
//   if (file.mimetype.startsWith('image')) {
//     callback(null, true);
//   } else {
//     callback(new AppError('Not an image! Please upload only images', 400));
//   }
// };

// // initializing multer
// const upload: multer.Multer = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// USING CLOUDINARY
const multerStorage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

// Multer single file upload middleware
export const singleUpload = (fieldName: string) => {
  return upload.single(fieldName);
};

// Multer multiple files upload middleware
export const multipleUpload = (fieldName: string, maxCount: number) => {
  return upload.array(fieldName, maxCount);
};

export const cloudinaryUpload: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    console.log(req.file);
    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }

    cloudinary.uploader.upload(req.file.path, (error: Error, result: any) => {
      if (error) {
        console.error('Error uploading file to Cloudinary:', error);
        return next(new AppError('Error uploading file to Cloudinary', 500));
      }

      req.image = result.secure_url;
      next();
    });
  },
);
