import multer from 'multer';
import { CustomRequest } from '../types';
import AppError from '../utils/appError';

const multerStorage = multer.diskStorage({
  destination(req: CustomRequest, file, callback) {
    callback(null, 'public/img/users');
  },
  filename(req: CustomRequest, file, callback) {
    const extension = file.mimetype.split('/')[1];
    callback(null, `user-${req.user?.id}-${Date.now()}.${extension}`);
  },
});


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

// initializing multer
const upload: multer.Multer = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Multer single file upload middleware
export const singleUpload = (fieldName: string) => {
  return upload.single(fieldName);
};

// Multer multiple files upload middleware
export const multipleUpload = (fieldName: string, maxCount: number) => {
  return upload.array(fieldName, maxCount);
};
