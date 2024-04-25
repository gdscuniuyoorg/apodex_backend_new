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
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const path_1 = __importDefault(require("path"));
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
const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    }
    else {
        callback(new appError_1.default('Not an image! Please upload only images', 400));
    }
};
// USING CLOUDINARY
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: (req, file) => {
        const folderPath = `apodex`;
        const fileExtension = path_1.default.extname(file.originalname).substring(1);
        const publicId = `${file.fieldname}-${Date.now()}`;
        return {
            folder: folderPath,
            public_id: publicId,
            format: fileExtension,
        };
    },
});
// initializing multer
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, //filesize less then 2mb
    fileFilter: multerFilter,
});
const singleUpload = (fieldName) => {
    return upload.single(fieldName);
};
exports.singleUpload = singleUpload;
const multipleUpload = (fieldName, maxCount) => {
    return upload.array(fieldName, maxCount);
};
exports.multipleUpload = multipleUpload;
exports.cloudinaryUpload = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return next(new appError_1.default('No file uploaded', 400));
    }
    const result = yield cloudinary_1.default.uploader.upload(req.file.path);
    req.image = result.secure_url;
    next();
}));
