import Joi from 'joi';

const courseValidate = Joi.object({
  name: Joi.string().min(1).required(),
  category: Joi.string().min(1).required(),
  objectives: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  instructor: Joi.string().min(1).required(),
  videos: Joi.array().items(Joi.string().min(1)).required(),
  materials: Joi.array().items(Joi.string()).optional(),
});

export default courseValidate;
