import express from "express";
import {  user_register,tickets_delete,  show_booking, user_role } from "../constant.js";
import { auth ,admin } from "../middleware.js/admin.js";
import { validate} from "../validation/validationMiddleware.js";
import { cancel  } from "../validation/schema/userschema.js";
import { registerPerson } from "../validation/schema/authschema.js";
import {delete_tickets,  show_booked ,create_user} from "../service/user.service.js";
import { change_role } from "../service/admin.service.js";
const user_router  = express.Router();

user_router.post(user_register,validate(registerPerson),create_user)
user_router.get(show_booking,auth ,show_booked);
user_router.delete(tickets_delete,auth, validate(cancel) ,delete_tickets)
user_router.put(user_role,admin,change_role)

export default user_router;