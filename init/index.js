const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/Listing.js");



const mongooseURL = "mongodb://127.0.0.1:27017/travelBliss";

main()
.then(()=>{
     console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})


//conecting to database 

async function main(){
    await mongoose.connect(mongooseURL);
}

const initDB = async() =>{

    await Listing.deleteMany({});

     initData.data = initData.data.map((obj)=>({...obj , owner : "65321b3fe0fd743bbe7b1118"}));

    await Listing.insertMany(initData.data);
   console.log("data is initialized");
}

initDB();