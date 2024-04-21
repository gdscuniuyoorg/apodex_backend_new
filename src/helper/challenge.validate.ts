import Joi from 'joi';

export const challengeValidate = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  participants: Joi.array().items(Joi.string().min(1)),
  participationType: Joi.string().min(1).required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().required(),
  rules: Joi.string().min(1).required(),
  minTeamParticipants: Joi.number().min(1),
  maxTeamParticipants: Joi.number().min(1),
});

export const updateChallengeValidate = Joi.object({
  name: Joi.string().min(1),
  description: Joi.string().min(1),
  participants: Joi.array().items(Joi.string().min(1)),
  participationType: Joi.string().min(1),
  startTime: Joi.date().iso(),
  endTime: Joi.date().iso(),
  rules: Joi.string().min(1),
  minTeamParticipants: Joi.number().min(1),
  maxTeamParticipants: Joi.number().min(1),
});
