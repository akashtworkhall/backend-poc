import { MongoClient, ObjectId } from "mongodb";
import { db_uri } from "./constant.js";
const uri =db_uri
let dbConnection;
const connecttodb = () => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db("trainbooking");
        console.log("mongodb connected in db.js ");
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  };
connecttodb()
export {dbConnection};
  