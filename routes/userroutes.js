import express from "express";
import { joi_string_validation,joi_email_validation, user_register,joi_number_validation, train_search, train_booking, tickets_delete, train_info_search, show_booking, user_role } from "../constant.js";
import { auth } from "../middleware.js/admin.js";
import { validatesearch ,validate} from "../validation/validationMiddleware.js";
import { booking ,cancel,showBooking  } from "../validation/schema/userschema.js";
import { registerPerson } from "../validation/schema/authschema.js";
import { book_train, delete_tickets,  show_booked } from "../service/user.service.js";
import {create_user} from "../service/user.service.js"
import {admin} from "../middleware.js/admin.js"
import { change_role } from "../service/admin.service.js";
const user_router  = express.Router();

user_router.post(user_register,validate(registerPerson),create_user)
user_router.get(show_booking,auth ,show_booked);
user_router.delete(tickets_delete,auth, validate(cancel) ,delete_tickets)
user_router.put(user_role,admin,change_role)

export default user_router;