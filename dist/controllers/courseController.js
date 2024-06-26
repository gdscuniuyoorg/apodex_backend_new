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
const courseModel_1 = __importDefault(require("../models/courseModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const courseModel_2 = require("../models/courseModel");
const course_validate_1 = require("../helper/course.validate");
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
class CourseController {
    constructor() {
        this.getAvailableCategories = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const categories = yield courseModel_1.default.distinct('category');
            if (!categories) {
                return next(new appError_1.default('Categories not found', 404));
            }
            res.status(200).json({
                status: 'success',
                data: {
                    categories,
                    length: categories.length,
                },
            });
        }));
        this.getCategories = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const enumToArray = (enumType) => {
                return Object.keys(enumType).map((key) => enumType[key]);
            };
            const categories = enumToArray(courseModel_2.TechnologyCategory);
            res.status(200).json({
                status: 'success',
                data: {
                    categories,
                    length: categories.length,
                },
            });
        }));
        this.addCourse = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error, value } = course_validate_1.courseValidate.validate(req.body);
            if (error) {
                return next(new appError_1.default(error.message, 400));
            }
            const newCourse = yield courseModel_1.default.create(value);
            res.status(201).json({
                status: 'success',
                data: {
                    course: newCourse,
                },
            });
        }));
        // Update an existing course
        this.updateCourse = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error, value } = course_validate_1.updateCourseValidate.validate(req.body);
            if (error) {
                return next(new appError_1.default(error.message, 400));
            }
            const updatedCourse = yield courseModel_1.default.findByIdAndUpdate(req.params.id, value, {
                new: true,
                runValidators: true,
            });
            res.status(200).json({
                status: 'success',
                data: {
                    course: updatedCourse,
                },
            });
        }));
        // Delete a course by Id
        this.deleteCourse = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const course = yield courseModel_1.default.findByIdAndDelete(req.params.id);
            if (!course) {
                return next(new appError_1.default('Course no found', 404));
            }
            res.status(204).json({
                status: 'success',
                data: null,
            });
        }));
        // Get a single course by ID
        this.getCourse = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const course = yield courseModel_1.default.findOne({ _id: id }).populate('instructor');
            if (!course) {
                return next(new appError_1.default('Course not found', 404));
            }
            res.status(200).json({
                status: 'success',
                data: {
                    course,
                },
            });
        }));
        // Get all courses
        this.getAllCourses = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const features = new apiFeatures_1.default(courseModel_1.default.find(), req.query || {})
                .filter()
                .sort()
                .limitFields()
                .paginate()
                .search();
            // populate the instructor field
            const courses = yield features.query.populate('instructor', 'name');
            res.status(200).json({
                status: 'success',
                results: courses.length,
                data: {
                    courses,
                },
            });
        }));
    }
}
exports.default = new CourseController();
