import express from "express";
import { joi_string_validation,joi_email_validation, user_register,joi_number_validation, train_search, train_booking, tickets_delete, train_info_search, show_booking } from "../constant.js";
import { auth } from "../middleware.js/admin.js";
import { validatesearch ,validate} from "../validation/validationMiddleware.js";
import { booking ,cancel } from "../validation/schema/userschema.js";
import { registerPerson } from "../validation/schema/authschema.js";
import { book_train, delete_tickets, show_booked } from "../service/user.service.js";
import { login_user, logout_user} from "../service/auth.service.js"

const book_router = express.Router();

book_router.post(train_booking, auth,validate(booking), book_train)

export  default book_router