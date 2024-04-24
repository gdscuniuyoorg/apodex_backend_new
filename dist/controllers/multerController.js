"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUpload = exports.multipleUpload = exports.singleUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
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
const multerStorage = multer_1.default.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: multerStorage });
// Multer single file upload middleware
const singleUpload = (fieldName) => {
    return upload.single(fieldName);
};
exports.singleUpload = singleUpload;
// Multer multiple files upload middleware
const multipleUpload = (fieldName, maxCount) => {
    return upload.array(fieldName, maxCount);
};
exports.multipleUpload = multipleUpload;
exports.cloudinaryUpload = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.file);
    if (!req.file) {
        return next(new appError_1.default('No file uploaded', 400));
    }
    cloudinary_1.default.uploader.upload(req.file.path, (error, result) => {
        if (error) {
            console.error('Error uploading file to Cloudinary:', error);
            return next(new appError_1.default('Error uploading file to Cloudinary', 500));
        }
        req.image = result.secure_url;
        next();
    });
}));
