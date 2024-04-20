import Joi from 'joi';

export const courseValidate = Joi.object({
  name: Joi.string().min(1).required(),
  category: Joi.string().min(1).required(),
  objectives: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  instructor: Joi.string().min(1).required(),
  videos: Joi.array().items(Joi.string().min(1)).required(),
  materials: Joi.array().items(Joi.string()).optional(),
});

export const updateCourseValidate = Joi.object({
  name: Joi.string().min(1),
  category: Joi.string().min(1),
  objectives: Joi.string().min(1),
  description: Joi.string().min(1),
  instructor: Joi.string().min(1),
  videos: Joi.array().items(Joi.string().min(1)),
  materials: Joi.array().items(Joi.string()),
});
