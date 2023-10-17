import Jwt from "jsonwebtoken"
import express from "express"
import cookieParser from "cookie-parser"
import { dbConnection } from "../db.js";




const app = express();
app.use(cookieParser())

export const auth = (req,res,next)=>{
     const acesstoken = req?.cookies.acesstoken;
   if(!acesstoken){
       return res.status(401).json({"message":"Not yet logged in"})
       

      }
      
 const userrole = Jwt.verify(acesstoken,"privateaccesskey" ,function(err ,decoded){
     if(err){return res.status(401).json({"message":err})}
     req.email = decoded.email
     console.log(userrole)
     next()
 }
 )
 
      
      

 
} 




export const bookingauth = (req,res)=>{
   const reftoken = req?.cookies.refreshToken;
   
 const userrole = Jwt.verify(reftoken,"privateaccesskey")
 return userrole._id


}
const  refresh =async(req,res ,next)=>{
   const accestoken = req?.cookies.acesstoken;
   if(!req?.cookies.acesstoken){
      return res.send("error")
   }
   console.log("acesstoken1 ");
   const  access = Jwt.verify(accestoken ,"privateaccesskey" );
   req.email = access.email

    const ref = await dbConnection.collection("train_user");
    const reftoken = await ref.findOne({email : req.email});
    console.log(reftoken,"reftoken")
    console.log(reftoken.refreshtoken)
    if(reftoken.email === req.email){
       req.reftoken  = reftoken.refreshtoken
    }
    console.log(req.reftoken)
    next()


}
const admin = (req,res ,next)=>{
 const acesstoken = req?.cookies.acesstoken
 const userrole = Jwt.verify(acesstoken,"privateaccesskey" ,function(err,decoded){
   if(err){
      return res.status(404).json({
         "message":err
      })
   }
   if(decoded.role!="admin"){
      return res.status(401).json({"message":"acess denied"});
   }
   
   next()


 })

 


}
export  { admin ,refresh }