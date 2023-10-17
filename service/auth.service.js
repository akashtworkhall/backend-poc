import { dbConnection } from "../db.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken"
import { already_logined, cookies_not_found, email_not_found, internal_server_error, logout_succesfull, password_invalid, refreshtoken_not_found, succesfully_loggedin, succesfully_registered } from "../constant.js";
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from "mongodb";

// export async function create(){
//   const { name, email, password } = req.body;
//   console.log(req.body)
//   try{
//     console.log(req.body);
//     const user = await dbConnection.collection("train_user").findOne({ email });

//   if (user) {
//      return res.json({"message":email_not_found});
    
//   }
//   const save = await dbConnection.insertOne({
//     name:name,
//     email:email,
//     password:password
//   })
// console.log(save);
// }
//   catch{

//   }
  

//   const salt = await bcrypt.genSalt(10);
//   console.log(salt, typeof salt);
//   console.log(password, typeof password);
//   const hassedpassword = await bcrypt.hash(password, salt);
//   console.log(hassedpassword ,"jhkj");
  
//   const trainuser = await dbConnection.collection("train_user");
//   const data = await trainuser.insertOne({
//     name: name,
//     email: email,
//     password: hassedpassword,
//   });
  

// }

 async function login_user(req,res){

  

    if(req.cookies.acesstoken){
     
        return res.json({"message":already_logined})
      }
      const  { email, password  } = req.body;
     
      const user = await dbConnection.collection("train_user").findOne({ email });
      
       
      if (!user) {
        res.status(400).json({"message":"email not found"});
        return;
      }
     console.log(user)
     console.log(password ,user.password)
      const validpassword = await bcrypt.compare(password, user.password);
     
      if (!validpassword) {
        return res.status(400).json({"message":password_invalid});
      }
    
      // const expiretime =new Date();
      // const expire = expiretime.setMinutes(expiretime.getMilliseconds() + 15 )
      // console.log(expiretime.getMinutes);
      
      const accestoken = Jwt.sign(
        { _id: user._id, role: user.role ,email:user.email ,refreshtoken :user.refreshtoken  },
        "privateaccesskey",
        {
          expiresIn: "1d",
        }
      );
      let expiredAt = new Date();

      expiredAt.setSeconds(
        expiredAt.getSeconds() + 120
      );
    let _token = uuidv4()
   
      const reftoken = ({
      usertoken :_token,
      userid : user._id,
       useremail :user.email,
       userrole :user.role,
        expiryDate : expiredAt.getTime()
 })

  
    
   
     
  
      // const refreshtoken = Jwt.sign(
      //   { _id: user._id, role: user.role,email:user.email},
      //   "privatekey",
      //   {
      //     expiresIn: "1yr",
      //   }
      // );
      const data = await dbConnection.collection("train_user");
      const ref = await dbConnection.collection("user_token");
      const token = await ref.insertOne(
        
       reftoken
        
      );
     
      // const reftoken = await ref.insertOne({
      //   refreshtoken :refreshtoken
      // }) 
      // console.log("ref token added to the user token collection" ,reftoken)
      res.cookie("acesstoken", accestoken, {
        httpOnly: true,
        path: "/",
         maxAge : 8640000
      } ,
      );

      return res.json({"message":succesfully_loggedin});
}

async function logout_user(req,res){
    try {
        if(req.cookies.acesstoken){
          console.log(req.cookies.acesstoken)
         
        
       
        res.clearCookie('acesstoken',{
          
          path: "/",
        });
    
       
    
        return res.status(200).json({ "message": logout_succesfull })
      }else{
        return res.status(404).json({"message":cookies_not_found})
      }; 
  
      } catch (error) {
        return res.status(500).json({ message: internal_server_error });
      }
    
}

async function refreshToken (req,res){

  const usertoken = req.params;
  console.log(usertoken.refreshtoken )
   
  if(usertoken.refreshtoken === null){
    return res.status(403).json({
      "message":refreshtoken_not_found
    })
  }
 
  const ref = await dbConnection.collection("user_token");
  console.log(ref)
  const tokens = await ref.findOne({usertoken : usertoken.refreshtoken});
  console.log(tokens ,"tokens")
  if(tokens === null){
    res.send("data not found")
  }
  const time =tokens.expiryDate
  const currenttime =new Date()
  console.log(time)

  let accestoken = Jwt.sign({_id:tokens.userid, role :tokens.userrole ,email:tokens.useremail} ,
    "privateaccesskey",
    {
      expiresIn: "1d",
    } ) 
  res.cookie("acesstoken", accestoken,{
    httpOnly: true,
    path: "/",
     maxAge : 8640000
  } ,
  );
 res.send("access token changed")
}

export {
  login_user,logout_user ,refreshToken
}