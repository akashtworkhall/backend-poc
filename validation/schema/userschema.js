import Joi from "joi"
import { joi_email_validation, joi_number_validation, joi_string_validation, past_dates, sleeper_rates_negative, sleeper_seats_negative, threeac_rates_negative, threeac_seats_negative, update_train } from "../../constant.js"

export  const booking = Joi.object().keys({
        email:joi_email_validation,
        no_of_passengers:joi_number_validation.min(1).required(),
        date:joi_string_validation.required(),
        source:joi_string_validation.required(),
        coach:joi_string_validation.valid('threeac','sleeper').required(),
        destination:joi_string_validation.required(),
        id:joi_string_validation.required()
      })  
export const cancel = Joi.object().keys({
        noofseatscancel :joi_number_validation.min(1).required()
      })  
export const showBooking = Joi.object().keys({
        email :Joi.string().email().required()
      })      
    
