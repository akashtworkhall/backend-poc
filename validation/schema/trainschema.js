import Joi from "joi"
import { add_train, delete_train, joi_array_validation, joi_number_validation, joi_string_validation, past_dates, sleeper_rates_negative, sleeper_seats_negative, threeac_rates_negative, threeac_seats_negative, update_train } from "../../constant.js"
export const Train = Joi.object().keys({
    train_name: joi_string_validation.min(3).max(20).required(),
    train_no: joi_number_validation.required(),
  
    no_of_seats: Joi.object().keys({
      sleeper :joi_number_validation.min(1).required(),
      threeac :joi_number_validation.min(1).required()
    }).required(),
  
    stations: joi_array_validation.unique(),
    
    rate: Joi.object().keys({
      sleeper :joi_number_validation.min(1).required(),
      threeac :joi_number_validation.min(1).required()
    }).required(),
  
    date:Joi.date().required()
  }).options({abortEarly:false});

  export const  trainUpdate = Joi.object().keys({
    train_name: joi_string_validation.min(3).max(20).required(),
    train_no: joi_number_validation.required(),
    date:Joi.date().required()
  }).options({abortEarly:false});
  

export const search = Joi.object().keys({
    
  source:joi_string_validation,
  destination:joi_string_validation,
  date:joi_string_validation,

  train_name:joi_string_validation,
  train_no:Joi.number(),
  


}).xor('source','train_name','train_no').and('source','destination','date');