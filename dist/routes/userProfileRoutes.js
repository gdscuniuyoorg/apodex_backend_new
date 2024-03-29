"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const authController_1 = __importDefault(require("../controllers/authController"));
const multer_1 = __importDefault(require("multer"));
const appError_1 = __importDefault(require("../utils/appError"));
const router = (0, express_1.Router)();
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
const multerStorage = multer_1.default.memoryStorage();
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
router
    .route('/')
    .get(userController_1.default.getUsers)
    .patch(userController_1.default.updateProfile);
router.route('/:user_id').get(userController_1.default.getProfile);
router.patch('/image', authController_1.default.protect, upload.single('photo'), userController_1.default.resizePhoto, userController_1.default.updateProfile);
exports.default = router;
