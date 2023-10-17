import { date_not_valid, destination_before_source, destination_invalid, fields_mandatory, id_not_valid,succesfully_registered, passengers_greater_than_seats, proper_inputs, seats_less_than_zero, source_destination_equal, source_invalid, succes, tickets_to_be_cancel, trains_not_found  ,email_not_found} from "../constant.js";
import { dbConnection } from "../db.js";
import { validatesearch ,validate} from "../validation/validationMiddleware.js";
import Joi from "joi";
import bcrypt from  "bcrypt"
import { ObjectId } from "mongodb";
import { updateseats } from "../entity/delete.entity.js";


async function create_user(req,res){
  const { name, email, password } = req.body;
  console.log(req.body)
  try{
    console.log(req.body);
    const user = await dbConnection.collection("train_user").findOne({ email });

  if (user) {
     return res.json({"message":email_not_found});
    
  }
  

  const salt = await bcrypt.genSalt(10);
  console.log(salt, typeof salt);
  console.log(password, typeof password);
  const hassedpassword = await bcrypt.hash(password, salt);
  console.log(hassedpassword ,"jhkj");
  
  const trainuser = await dbConnection.collection("train_user");
  const data = await trainuser.insertOne({
    name: name,
    email: email,
    password: hassedpassword,
  });
  

  const trainuserdata = await trainuser.findOne({ _id: data.insertedId });
  console.log(trainuserdata);
  if (data) {
   

    return res.json({"message":succesfully_registered});

    
  } else {
    console.log("error");
  }}
  catch(err){
  console.log(err)
  }
}

async function book_train(req,res){

    let {
        email,
        no_of_passengers,
        id,
        coach,
        source,
        destination,
        date,
      } = req.body;
    
      let destinationindex;
      let remainingnoofseatsinsleeper;
      let remainingnoofseatsinthreeac;
      let sourceindex;
      if(!ObjectId.isValid(id)){
           return res.status(422).json({"message":id_not_valid})
      }
      
      const user = await dbConnection.collection("train_user");
    
      let finalrate;
    
      const traindetails = await dbConnection.collection("train_details");
      console.log("date", date);
    
      const train = await traindetails.findOne(
         { _id:new ObjectId(id)},
      );
      console.log(train);
    
      if (!train) {
        return res.status(400).json({"message":id_not_valid});
      }
    
     if(train.date != date){
      return res.status(422).json({
        "message":date_not_valid,
        
      })
     }
    
      if (!train.stations.includes(source)) {
        return res.status(422).json({"message":source_invalid});
      }
      if (!train.stations.includes(destination)) {
        return res.status(422).json({"message":destination_invalid});
      }
      if (source === destination) {
        return res.status(422).json({"message":source_destination_equal});
      }
    
      let rate;
      if (coach === "threeac"){
        if (no_of_passengers > train.no_of_seats["threeac"]) {
          return res
            .status(422)
            .json({"message":passengers_greater_than_seats});
        }
        rate = train.rate["threeac"];
    
        if (train.stations.includes(source)) {
          sourceindex = train.stations.indexOf(source);
          console.log(sourceindex);
        }
    
        if (train.stations.includes(destination)) {
          destinationindex = train.stations.indexOf(destination);
          console.log(destinationindex);
        }
    
        if (sourceindex > destinationindex) {
          return res.status(422).json({"message":destination_before_source});
        }
        if (destinationindex - sourceindex === 1) {
          let index = destinationindex - sourceindex;
          let fixedrate = train.rate["threeac"] / train.stations.length;
          console.log(fixedrate);
          rate = index * fixedrate * no_of_passengers;
    
          remainingnoofseatsinthreeac = train.no_of_seats["threeac"] - no_of_passengers;
          console.log(remainingnoofseatsinthreeac, "remaining");
    
          finalrate = rate;
    
          res.json( {"message":succes,
          "finalrate" :finalrate.toString()});
        } else {
          let index = destinationindex - sourceindex + 1;
          let fixedrate = train.rate["threeac"] / train.stations.length;
          rate = index * fixedrate * no_of_passengers;
    
          finalrate = rate;
          res.json({
            "tickets status": succes,
            rate: finalrate.toString(),
          });
        }
        console.log(train.no_of_seats['threeac'])
        remainingnoofseatsinthreeac = train.no_of_seats["threeac"] - no_of_passengers;
        console.log(remainingnoofseatsinthreeac, "remaining");
      }
      if (coach === "sleeper") {
        if (no_of_passengers > train.no_of_seats["sleeper"]) {
          return res
            .status(422)
            .json({"message":passengers_greater_than_seats});
        }
        rate = train.rate[" sleeper"];
    
        if (train.stations.includes(source)) {
          sourceindex = train.stations.indexOf(source);
          console.log(sourceindex);
        }
    
        if (train.stations.includes(destination)){
          destinationindex = train.stations.indexOf(destination);
          console.log(destinationindex);
        }
    
        if (sourceindex > destinationindex) {
          return res.status(422).json({"message":destination_before_source});
        }
    
        if (destinationindex - sourceindex === 1) {
          let index = destinationindex - sourceindex;
          let fixedrate = train.rate["sleeper"] / train.stations.length;
          rate = index * fixedrate * no_of_passengers;
          finalrate = rate;
          res.json({"message": succes ,
          "rate":finalrate.toString()});
          remainingnoofseatsinsleeper = train.no_of_seats["sleeper"] - no_of_passengers;
          console.log(remainingnoofseatsinsleeper);
        } else {
          let index = destinationindex - sourceindex + 1;
          let fixedrate = train.rate["sleeper"] / train.stations.length;
          rate = index * fixedrate * no_of_passengers;
    
          finalrate = rate;
          res.json({
            "ticketsstatus": succes,
            rate: finalrate.toString(),
          });
          console.log("1",train.no_of_seats["sleeper"])
          remainingnoofseatsinsleeper = train.no_of_seats["sleeper"] - no_of_passengers;
          console.log("remaining",remainingnoofseatsinsleeper)
        }
      }
    
      const userbooking = await dbConnection.collection("train_bookings");
    
      const trainbooking = await userbooking.insertOne({
        email,
        trainname:train.train_name  ,
        train_no :train.train_no,
        no_of_passengers,
        coach,
        source,
        destination,
        finalrate,
        date,
      });
    
      if (coach === "sleeper") {
        console.log(train.no_of_seats["threeac"], "threeac seats");
        const seatsupdatesleeper = await traindetails.updateOne(
          { _id:new ObjectId(id)},
          {
            $set: {
              "no_of_seats.sleeper": remainingnoofseatsinsleeper,
              "no_of_seats.threeac": train.no_of_seats["threeac"],
            },
          }
        );
        console.log(seatsupdatesleeper ,remainingnoofseatsinsleeper);
      }
    
      if (coach === "threeac") {
        console.log(train.no_of_seats["sleeper"], "sleeper");
        const seatsupdatethreeac = await traindetails.updateOne(
          { _id:new ObjectId(id) },
          {
            $set: {
              "no_of_seats.sleeper": train.no_of_seats["sleeper"],
              "no_of_seats.threeac": remainingnoofseatsinthreeac,
            },
          }
        );
        console.log(seatsupdatethreeac);
      }

}

async function show_booked(req,res){
   console.log(req.email)
  const booking = await dbConnection.collection("train_bookings");
  const bookdetails = await booking
    .find({email: req.email})
    .toArray();
    if(bookdetails.length ===0){
      return res.json({
        "message":"no bookings found"
      })
    }
  return res.send(bookdetails);
}

 async function delete_tickets(req,res){
    const noofseatscancel = req.body.noofseatscancel;
    if(noofseatscancel <0){
     return res.status(422).json({
   
       "message":seats_less_than_zero
       
      })
  }

  const id = req.params.id;
  if(!ObjectId.isValid(id)){
    return res.json({
      "message":id_not_valid
    })
  }
  
  const train = await dbConnection.collection("train_bookings");
  const ogtrain = await dbConnection.collection("train_details");
  const findtrain = await train.findOne({
    _id: new ObjectId(req.params.id),
  });
  if(!findtrain){
    return res.json({
      "message":id_not_valid
    })
  }
  console.log(findtrain)
  console.log(findtrain.train_no ,"trainno");
  //

  const train_no = findtrain.train_no;
  console.log(train_no);
  const date = findtrain.date;
  console.log("date", date);
  const findogtrain = await ogtrain.findOne({
    $and: [
      {
        train_no: train_no,
        date: date,
      },
    ],
  });
  if(!findogtrain){
    return res.json({"message ":id_not_valid})
  }
  console.log(findogtrain,"null");
  console.log(findogtrain.no_of_seats.threeac)

  if (parseInt(noofseatscancel) > findtrain.no_of_passengers) {
    return res
      .status(400)
      .json({
        "message":
        tickets_to_be_cancel
      }
      );
  }
  if(noofseatscancel === findtrain.no_of_passengers){

  if(findtrain.coach ==="threeac"){
   // const {updatethreeac ,updatepassengers} = updateseats(findogtrain.no_of_seats.threeac,findtrain.no_of_passengers,noofseatscancel);
    const updatethreeac = parseInt(findogtrain.no_of_seats.threeac) + noofseatscancel
    const updatepassengers = parseInt(findtrain.no_of_passengers)-noofseatscancel
    console.log(updatethreeac ,"updatethreeac")
    const updatetrain = await ogtrain.updateOne(
      {
        _id: new ObjectId(findogtrain._id),
      },
      { $set: { "no_of_seats.threeac": updatethreeac } }
    );
    
    


  }
  else{
  //  const {updatesleeper ,updatepassengers} = updateseats(findogtrain,findtrain,noofseatscancel);  
      const updatesleeper = parseInt(findogtrain.no_of_seats.sleeper) + noofseatscancel
    console.log("sleeper",updatesleeper)
    const updatetrain = await ogtrain.updateOne(
      {
        _id: new ObjectId(findogtrain._id),
      },
      { $set: { "no_of_seats.sleeper": updatesleeper } }
    );

  }
  const canceltrain = await train.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  return res.json({
    "message":`booking  for the provided ${new ObjectId(req.params.id)}has been cancelled`,
    "request":succes
    
  })
}
else{
     
  if(findtrain.coach ==="threeac"){
    console.log(findogtrain.no_of_seats.threeac,"noof threeac")
    const updatethreeac = parseInt(findogtrain.no_of_seats.threeac) + noofseatscancel
    console.log("updatedthreeac",updatethreeac)
  
    const updatepassengers = parseInt(findtrain.no_of_passengers)-noofseatscancel
    const updatetrain = await ogtrain.updateOne(
      {
        _id: new ObjectId(findogtrain._id),
      },
      { $set: { "no_of_seats.threeac": updatethreeac } }
    );
    console.log(updatetrain)
    const updatebooking = await train.updateOne(
      {
        _id:new ObjectId(req.params.id)
      },
      { $set: { "no_of_passengers": updatepassengers } }
    );


  }
  else{
    const updatesleeper = parseInt(findogtrain.no_of_seats.sleeper) + noofseatscancel
    const updatepassengers = parseInt(findtrain.no_of_passengers)-noofseatscancel
    const updatetrain = await ogtrain.updateOne(
      {
        _id: new ObjectId(findogtrain._id),
      },
      { $set: { "no_of_seats.sleeper": updatesleeper } }
    );
    const updatebooking = await train.updateOne(
      {
        _id:new ObjectId(req.params.id)
      },
      { $set: { "no_of_passengers": updatepassengers } }
    );}
       return res.json({
        "message":`${noofseatscancel}  tickets has been succesfully cancelled from the booking`
       })
  

}

}
export {show_booked,delete_tickets,book_train ,create_user}