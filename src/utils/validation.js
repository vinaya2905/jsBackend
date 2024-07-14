import Joi from "joi";

export const location = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  prefix: Joi.string().alphanum().min(3).max(5).required(),
  sequence: Joi.number().allow(null),
});
