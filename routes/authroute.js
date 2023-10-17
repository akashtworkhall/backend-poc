import express from "express";
import { validate } from "../validation/validationMiddleware.js";
import { user_login,changeaccesstoken ,user_logout} from "../constant.js";

import { loginPerson } from "../validation/schema/authschema.js";
import { login_user, logout_user,refreshToken} from "../service/auth.service.js"
import { refresh } from "../middleware.js/admin.js";

const authrouter = express.Router();

authrouter.post(user_login ,validate(loginPerson),login_user)
authrouter.post(user_logout,logout_user)
authrouter.post(changeaccesstoken,refresh ,refreshToken);

export default authrouter
