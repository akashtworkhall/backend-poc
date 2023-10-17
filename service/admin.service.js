import { dbConnection } from "../db.js";


import { ObjectId } from "mongodb";
import { destination_before_source, destination_invalid, past_dates, past_dates_update,  source_destination_equal, source_invalid,  train_already_present, train_departured, trains_not_found } from "../constant.js";


async function search_train(req,res){
  const train_name = req.query.train_name;
const train_no = req.query.train_no;
const date = req.query.date;

const source = req.query.source;
const destination = req.query.destination;
console.log(req.query)

let sourceIndex;
let destinationindex;
if (source && destination){
 
  const data = await dbConnection.collection("train_details");
  const result = await data
    .find({
      $and: [{ date: date }, { stations: { $in: [source, destination] } }],
    })
    .toArray();

  if (result.length === 0) {
    return res
      .status(400)
      .json({"message":trains_not_found});
  }

  if (result[0].stations.includes(source)) {
    sourceIndex = result[0].stations.indexOf(source);
    console.log("source", sourceIndex);
  }

  if (result[0].stations.includes(destination)) {
    destinationindex = result[0].stations.indexOf(destination);
    console.log("destination", destinationindex);
  }
  if (sourceIndex ===undefined) {
    return res.status(422).json({"message":source_invalid});
  }
  if (destinationindex === undefined) {
    return res.status(422).json({"message":destination_invalid});
  }
  if (source === destination){
    return res.status(422).json({"message":source_destination_equal});
  }
  console.log(sourceIndex);
  console.log(destinationindex);
  if (sourceIndex < destinationindex) {
    return res.send(result);
  } else {
    return res.json({"message":destination_before_source});
  }
}
let result;
let name;
let resulttrain;
let no;
try {
  const data = await dbConnection.collection("train_details");
  if (train_name) {
    name = await data
      .find(
       
          {
            train_name: {$regex :new RegExp(train_name, 'i')},    //pattern wise searching in train name
          },
        
      )
      .toArray();

    if (name.length === 0) {
      return res.status(404).json({
        "message":trains_not_found,
       
      });
    } else {
      return res.send(name);
    }
  }

  if (train_no) {
    no = await data
      .find(
        
          {
            train_no: {$regex :new RegExp(train_no, 'i')},
          },
        
      )
      .toArray();
 
    console.log(no)
    if (no.length === 0) {
      return res.status(404).json({
       "message" :trains_not_found,
       "request":"failure"
      });
    } else{
      return res.send(no);
    }
  }

  if (date && (!train_name || train_no)) {
    result = await data.find({ date: date }).toArray();
    if (!result) {
      return res.status(404).json({"message":trains_not_found});
    } else {
      return res.send(result);
    }
  }

  if (!(train_name && train_no)) {
    return res.json({
     "message":train_info_search,
     "request":"failure"
  });
  } else {
    resulttrain = await data
      .find({
        trainname: train_name,
        trainno: train_no,
      })
      .toArray();
  }
  if (!resulttrain) {
    return res.status(404).json({"message":trains_not_found});
  }

  res.send(resulttrain);
} catch (error) {
  console.error("Error querying data from MongoDB", error);
}
}

 async function train_add(req,res){
let { train_name, train_no, no_of_seats, stations, rate, date } = req.body;
    try {
      const trainInfo = await dbConnection.collection("train_details");
      const find = await trainInfo.findOne( {$and :[{date:date,train_no:train_no}]});
      const name= await trainInfo.findOne({$and : [{train_name:train_name ,date:date}]});
      const no = await trainInfo.findOne( {$or :[{train_no:train_no ,train_name:train_name}]});

      console.log(find)
      if(find){
       return res.status(409).json({ 
        "message":train_already_present
      })   
      }
      if(  name && name.train_name === train_name){
        return res.status(409).json({
          "message":train_already_present,
          
        })
      }
      if(no){
        return res.status(409).json({
          "message":train_already_present
        })
      }
     
  
     const currentDate = new Date();
      console.log(currentDate.getMonth());
      const inputDate = new Date(date);
      console.log(inputDate.getMonth())
     
      if(  (inputDate.getFullYear()<  currentDate.getFullYear() ) || (inputDate.getMonth()< currentDate.getMonth() ) ||  (inputDate.getDate()< currentDate.getDate() ) ){
        return res.status(422).send({"message":past_dates}) 
      }
    
      const addtrain = await trainInfo.insertOne({
        train_name,
        train_no,
        no_of_seats,
        stations,
        rate,
        date
      });

      res.status(201).json({
        "message":"train added "
      });
      const train  = await trainInfo.findOne({_id : new ObjectId(addtrain.insertedId)})
      console.log(train)
      
    } catch (err) {
      console.log(err);
    }

}
 async function train_update  (req,res){
  const { train_name, train_no,date} = req.body;
  console.log(train_name);
  console.log(train_no);
  console.log(date)
  try {
    const updatestaion = await dbConnection.collection("train_details");
    console.log(updatestaion);
    let settrainname;
    let settrainno;
    let setdate;
    const train  = await  updatestaion.findOne({
      _id:new ObjectId(req.params.id)
    })
    let currentDate = new Date();
  console.log(currentDate.getMonth(),"cuurent")
  // console.log(train.date)
  const trainDate = new Date(train.date);
  console.log(trainDate,"traindate")
  
 
      console.log(currentDate.getMonth(),"currenmonth");
      const inputDate = new Date(date);
      console.log((inputDate.getFullYear()<  currentDate.getFullYear() )  || (inputDate.getMonth()< currentDate.getMonth() )|| (inputDate.getDate()< currentDate.getDate() ))
     
      if( (inputDate.getFullYear()<  currentDate.getFullYear() )  )
      {
        return res.status(422).json({"message" :past_dates_update})
      }
      if(   (inputDate.getMonth()< currentDate.getMonth() ) ){
        return res.status(422).json({"message":past_dates_update}) 
      }
      if(  (inputDate.getFullYear()<  currentDate.getFullYear() ) || (inputDate.getMonth()< currentDate.getMonth() ) ||  (inputDate.getDate()< currentDate.getDate() ) ){
        return res.status(422).send({"message":past_dates_update}) 
      }
    
    
  if (train_name  || train_no || date ) {
      settrainname =  train_name ;
      setdate = date;
      settrainno = train_no     
    
    }
   
    console.log({ settrainname ,settrainno ,setdate});
    const updated = await updatestaion.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { train_name:settrainname ,train_no:settrainno ,date:setdate } },
      { upsert: true }
    )
    res.status(201).json({
      "message":"train details updated",
      "updated": updated
    });
    
  } catch (err) {
    res.send(err);
  }


}
 async function seats_update(req,res){
  const { sleeperseats ,threeacseats} = req.body

       console.log(sleeperseats ,threeacseats);

       let setSleeeper ;
       let setThreeac;

       
    if(sleeperseats || threeacseats){
      setSleeeper = sleeperseats;
      setThreeac = threeacseats;
    }
    const updatetrain  =  await dbConnection.collection("train_details");
    const train  = await updatetrain.findOne({_id:new ObjectId(req.params.id)})
    let currentDate = new Date();
    console.log(currentDate)
    console.log(train.date)
    const trainDate = new Date(train.date);
   
    console.log(trainDate)
    
    if(trainDate.getDate()< currentDate.getDate()){
      return res.send(train_departured)
    }
    if(setSleeeper){

    const  updateSeats = await updatetrain.updateOne(
      {
      _id: new ObjectId(req.params.id),

      }
      ,
      {
        $set :{
          "no_of_seats.sleeper":setSleeeper,
          "no_of_seats.threeac":train.no_of_seats["threeac"]
        }
      }

    )
  
    return res.send(updateSeats)
  }


  if(setThreeac){

    const  updateSeats = await updatetrain.updateOne(
      {
      _id: new ObjectId(req.params.id),

      }
      ,
      {
        $set :{
          "no_of_seats.sleeper":train.no_of_seats["sleeper"],
          "no_of_seats.threeac":setThreeac,
        }
      }

    )
  
    return res.send(updateSeats)
  }

    


}

async function train_delete(req,res){
  const trainDelete = await dbConnection.collection("train_details");
  
    const deletetrain = await trainDelete.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.send(deletetrain);
 
}
async function change_role(req,res){
  const role = req.body.role
  const user = await dbConnection.collection("train_user");
  const changerole = await user.updateOne({
    _id:new ObjectId(req.params.id)
  },
  {
    $set:{
      role:role
    }
  }
)
res.status(200).json({
  "message":"role successfully changed",
  "changerole":changerole
  

})

}
export {train_add ,search_train ,train_delete ,seats_update,train_update ,change_role}