import { RequestHandler } from 'express';
import Course, { ICourse } from '../models/courseModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

class CourseController {
  // Add a new course

  getCategories: RequestHandler = catchAsync(async (req, res, next) => {
    console.log('food');

    const categories = await Course.distinct('category');

    if (!categories) {
      return next(new AppError('Categories not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        categories,
      },
    });
  });

  addCourse: RequestHandler = catchAsync(async (req, res, next) => {
    const {
      name,
      category,
      description,
      objectives,
      instructor,
      videos,
      materials,
    } = req.body;

    const newCourse = await Course.create({
      name,
      category,
      description,
      objectives,
      instructor,
      videos,
      materials,
    });

    
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
