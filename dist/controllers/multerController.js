"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipleUpload = exports.singleUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const appError_1 = __importDefault(require("../utils/appError"));
const multerStorage = multer_1.default.diskStorage({
    destination(req, file, callback) {
        callback(null, 'public/img/users');
    },
    filename(req, file, callback) {
        var _a;
        const extension = file.mimetype.split('/')[1];
        callback(null, `user-${(_a = req.user) === null || _a === void 0 ? void 0 : _a.id}-${Date.now()}.${extension}`);
    },
});
const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    }
    else {
        callback(new appError_1.default('Not an image! Please upload only images', 400));
    }
};
// initializing multer
const upload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
});
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
