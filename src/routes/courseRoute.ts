import { Router } from 'express';
const router = Router();

import courseController from '../controllers/courseController';
import authController from '../controllers/authController';

router.get('/categories', courseController.getCategories);

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(authController.protect, courseController.addCourse);

router
  .route('/:id')
  .get(courseController.getCourse)
  .patch(authController.protect, courseController.updateCourse)
  .delete(authController.protect, courseController.deleteCourse);

export default router;
