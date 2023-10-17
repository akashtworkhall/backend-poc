
import express from "express"
import {admin} from "../middleware.js/admin.js"
import {validate ,validatesearch} from "../validation/validationMiddleware.js"
import { add_train, delete_train,train_search , update_seats, update_train } from "../constant.js"
import { seats_update, train_add, train_delete, train_update ,search_train } from "../service/admin.service.js"
import {Train,search ,trainUpdate} from "../validation/schema/trainschema.js"



const trainRouter = express.Router()

trainRouter.get(train_search , validatesearch(search),search_train)
trainRouter.post(add_train ,admin,validate(Train) ,train_add)
trainRouter.put(update_train,admin,validate(trainUpdate),train_update)
trainRouter.put(update_seats ,admin ,seats_update);
trainRouter.delete(delete_train,admin,train_delete)

export default trainRouter
  
