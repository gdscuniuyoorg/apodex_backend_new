"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const userModel_1 = __importDefault(require("../models/userModel"));
const filterObj_1 = __importStar(require("../utils/filterObj"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
class UserController {
    constructor() {
        // constructor() {}
        this.updateProfile = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const image = req === null || req === void 0 ? void 0 : req.image;
            if (req.body.password || req.body.passwordConfirm) {
                return next(new appError_1.default('This route is not for password updates', 400));
            }
            // filter body properly
            const filterBody = (0, filterObj_1.default)(req.body, filterObj_1.keysToExtract);
            if (req.file && image) {
                filterBody.displayPhoto = image;
                // filterBody.displayPhoto = `${req.protocol}://${req.get(
                //   'host',
                // )}/public/img/users/${req.file.filename}`;
            }
            const profile = yield userModel_1.default.findOneAndUpdate({ _id: id }, { $set: filterBody }, { new: true }).select('-password -__v -confirmEmailToken -isEmailConfirmed -role');
            if (!profile) {
                return next(new appError_1.default('Profile not found', 404));
            }
            (0, sendResponse_1.default)(res, 201, profile);
        }));
        this.getProfile = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.params;
            const profile = yield userModel_1.default.findOne({ _id: user_id }).select('-password -__v -confirmEmailToken -isEmailConfirmed -role');
            if (!profile) {
                return next(new appError_1.default('An error occured fetching userProfile', 400));
            }
            (0, sendResponse_1.default)(res, 200, profile);
        }));
        this.getProfiles = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const features = new apiFeatures_1.default(userModel_1.default.find().select('-password -__v -confirmEmailToken -isEmailConfirmed -role'), req.query)
                .filter()
                .sort()
                .limitFields()
                .paginate()
                .search();
            const users = yield features.query;
            if (!users) {
                return next(new appError_1.default('User profiles does not exist', 404));
            }
            (0, sendResponse_1.default)(res, 200, { length: users.length, users });
        }));
        this.getMe = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const user = yield userModel_1.default.findOne({ _id: id });
            if (!user) {
                return next(new appError_1.default('User not found', 404));
            }
            (0, sendResponse_1.default)(res, 200, user);
        }));
    }
}
exports.default = new UserController();
