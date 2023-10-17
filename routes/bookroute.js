import express from "express";
import {  train_booking  } from "../constant.js";
import { auth } from "../middleware.js/admin.js";
import { validate} from "../validation/validationMiddleware.js";
import { booking } from "../validation/schema/userschema.js";

import { book_train } from "../service/user.service.js";


const book_router = express.Router();

book_router.post(train_booking, auth,validate(booking), book_train)

export  default book_router