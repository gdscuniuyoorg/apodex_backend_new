import Joi from 'joi';

export const courseValidate = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  coverPhoto: Joi.string().min(1).required(),
  teams: Joi.array().items(Joi.string().min(1)),
});

export const updateCourseValidate = Joi.object({
  name: Joi.string().min(1),
  description: Joi.string().min(1),
  coverPhoto: Joi.string().min(1),
  teams: Joi.array().items(Joi.string().min(1)),
});
