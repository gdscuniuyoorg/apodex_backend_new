import multer from 'multer';
import { CustomRequest } from '../types';
import AppError from '../utils/appError';
import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import cloudinary from '../utils/cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';

// const multerStorage = multer.diskStorage({
//   destination(req: CustomRequest, file, callback) {
//     callback(null, 'public/img/users');
//   },
//   filename(req: CustomRequest, file, callback) {
//     const extension = file.mimetype.split('/')[1];
//     callback(null, `user-${req.user?.id}-${Date.now()}.${extension}`);
//   },
// });

// // initializing multer
// const upload: multer.Multer = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

const multerFilter = (
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

// USING CLOUDINARY
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const folderPath = `apodex`;
    const fileExtension = path.extname(file.originalname).substring(1);
    const publicId = `${file.fieldname}-${Date.now()}`;

    return {
      folder: folderPath,
      public_id: publicId,
      format: fileExtension,
    };
  },
});

// initializing multer
const upload: multer.Multer = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, //filesize less then 2mb
  fileFilter: multerFilter,
});

export const singleUpload = (fieldName: string) => {
  return upload.single(fieldName);
};

export const multipleUpload = (fieldName: string, maxCount: number) => {
  return upload.array(fieldName, maxCount);
};

export const cloudinaryUpload: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    req.image = result.secure_url;
    next();
  },
);
