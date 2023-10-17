import Joi from "joi";
export const registerPerson = Joi.object().keys({
    name: Joi.string().min(3).max(40).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(9).required(),
  }).options({abortEarly:false});
export const loginPerson = Joi.object().keys({
    
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).options({abortEarly:false});
  