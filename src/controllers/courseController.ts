import { RequestHandler } from 'express';
import Course, { ICourse } from '../models/courseModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { TechnologyCategory } from '../models/courseModel';
import courseValidate from '../helper/course.validate';

class CourseController {
  // Add a new course

  getAvailableCategories: RequestHandler = catchAsync(
    async (req, res, next) => {
      const categories = await Course.distinct('category');

      if (!categories) {
        return next(new AppError('Categories not found', 404));
      }
      res.status(200).json({
        status: 'success',
        data: {
          categories,
          length: categories.length,
        },
      });
    },
  );

  getCategories: RequestHandler = catchAsync(async (req, res, next) => {
    const enumToArray = (enumType: any): { key: string; value: string }[] => {
      return Object.keys(enumType).map((key) => enumType[key]);
    };

    const categories = enumToArray(TechnologyCategory);

    res.status(200).json({
      status: 'success',
      data: {
        categories,
        length: categories.length,
      },
    });
  });

  addCourse: RequestHandler = catchAsync(async (req, res, next) => {
    // validate course body
    const { error } = courseValidate.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    const newCourse = await Course.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        course: newCourse,
      },
    });
  });

  // Update an existing course
  updateCourse: RequestHandler = catchAsync(async (req, res, next) => {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    res.status(200).json({
      status: 'success',
      data: {
        course: updatedCourse,
      },
    });
  });

  // Delete a course
  deleteCourse: RequestHandler = catchAsync(async (req, res, next) => {
    await Course.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  // Get a single course by ID
  getCourse: RequestHandler = catchAsync(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(new AppError('Course not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        course,
      },
    });
  });

  // Get all courses
  getAllCourses: RequestHandler = catchAsync(async (req, res, next) => {
    const courses = await Course.find();
    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
        courses,
      },
    });
  });
}

export default new CourseController();
