import express from "express";
import {admin} from "./middleware.js/admin.js";

import userrouter from "./routes/userroutes.js"
import user from './routes/authroute.js'
import authrouter from './routes/authroute.js'
import cookieParser from "cookie-parser";

import trainRouter from "./routes/trainroute.js";
import book_router from "./routes/bookroute.js";

const app = express();
const router =express.Router()
app.use(express.json());
app.use(cookieParser());


app.use("/auth",authrouter);
app.use("/train", trainRouter);
app.use("/user" ,userrouter)
app.use("/book",book_router)




const port = 8080;

//server listening
app.listen(port, () => {
  console.log("server running");
});
