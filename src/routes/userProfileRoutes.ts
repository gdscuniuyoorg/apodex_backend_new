import { Router } from 'express';
import userController from '../controllers/userController';
import authController from '../controllers/authController';
import multer from 'multer';
import { CustomRequest } from '../controllers/authController';
import AppError from '../utils/appError';

const router = Router();

// const multerStorage = multer.diskStorage({
//   destination(req: CustomRequest, file, callback) {
//     callback(null, 'public/img/users');
//   },
//   filename(req: CustomRequest, file, callback) {
//     const extension = file.mimetype.split('/')[1];
//     callback(null, `user-${req.user?.id}-${Date.now()}.${extension}`);
//   },
// });

// the memory storage saves the file in memory until the manupulation with sharp is done, and it is saved as a buffer
const multerStorage = multer.memoryStorage();

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

router
  .route('/')
  .get(userController.getUsers)
  .patch(userController.updateProfile);

router.route('/:user_id').get(userController.getProfile);

router.patch(
  '/image',
  authController.protect,
  upload.single('photo'),
  userController.resizePhoto,
  userController.updateProfile,
);

export default router;
