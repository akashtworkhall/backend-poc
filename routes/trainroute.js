//admin route.js
import express from "express"
import {admin} from "../middleware.js/admin.js"
import {validate ,validatesearch} from "../validation/validationMiddleware.js"
import { add_train, delete_train,train_search, joi_array_validation, joi_number_validation, joi_string_validation, past_dates, sleeper_rates_negative, sleeper_seats_negative, threeac_rates_negative, threeac_seats_negative, update_seats, update_train } from "../constant.js"
import { seats_update, train_add, train_delete, train_update } from "../service/admin.service.js"
import {Train,search ,trainUpdate} from "../validation/schema/trainschema.js"
import {search_train } from "../service/admin.service.js"


const trainRouter = express.Router()

trainRouter.get(train_search , validatesearch(search),search_train)
trainRouter.post(add_train ,admin,validate(Train) ,train_add)
trainRouter.put(update_train,admin,validate(trainUpdate),train_update)
trainRouter.put(update_seats ,admin ,seats_update);
trainRouter.delete(delete_train,admin,train_delete)

export default trainRouter
  
