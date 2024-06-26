import Joi from 'joi';

export const teamValidate = Joi.object({
  name: Joi.string().min(1).required(),
  talents: Joi.array().items(Joi.string().min(1)).required(),
  challengeId: Joi.string().min(1).required(),
  projectName: Joi.string().min(1).required(),
});

export const updateTeamValidate = Joi.object({
  name: Joi.string().min(1),
  talents: Joi.array().items(Joi.string().min(1)),
  projectName: Joi.string().min(1),
});
