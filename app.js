// if(process.env.NODE_ENV != 'production'){
    require("dotenv").config();
// }




const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/Listing");
const Review = require("./models/Review");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError");
const { listingSchema , reviewSchema}  = require("./schema.js")
const listingsRouter  = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User");



const app = express();

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended :true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));


const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto :{
        secret :'mysupersecretstring'
    },
    touchAfter : 24 * 3600,
})

store.on("error" , ()=>{
    console.log("ERROR in MONGO SESSION STORE" , err)
})

const sessionOption =
{   
    store,
    secret : "mysupersecretstring" ,
    resave : false ,
    saveUninitialized :true ,
    cookie :{
        expires : Date.now() + 7*24*60*60*1000,
        maxAge :Date.now() + 7*24*60*60*1000,
        httpOnly: true
    }
}


app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req , res , next)=>{
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      res.locals.currUser = req.user;
      next();
})

let port = 8081;

// const mongooseURL = "mongodb://127.0.0.1:27017/travelBliss";


main()
.then(()=>{
     console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

//conecting to database 

async function main(){
    await mongoose.connect(dbUrl);
}




//router
app.get("/" , async (req , res)=>{
    
    const allListing =  await Listing.find({});
    res.render("listings/index.ejs" , {allListing} );
   
})
app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews" , reviewsRouter);
app.use("/" , userRouter);

//if the request path dosent match any path than this path will match
app.all("*" , (req ,res , next)=>{
    next(new ExpressError(404 , "page not found !"));
})

//error handling middleware
app.use((err , req , res , next)=>{
    let{statusCode=500 , message="something went wrong!"} = err;
    res.status(statusCode);
    res.render("error.ejs" , {message});
   
})

//listen to the port
app.listen(port , ()=>{
    console.log("app is listning at" , port);
})


// const validateListing  = (req , res , next) =>{
    
//     let result = listingSchema.validate(req.body);
//     console.log(result);
//     if(result.error){
//    throw new ExpressError(400 , result.error);
//     }else{
//         next();
//     }
  
// }

// const validateReview  = (req , res , next) =>{
    
//     let result = reviewSchema.validate(req.body);
//     console.log(result);
//     if(result.error){
//      throw new ExpressError(400 , result.error);
//     }else{
//         next();
//     }
  
// }



// //index route 
// app.get("/listings" , async (req , res)=>{
//     const allListing =  await Listing.find({});
//     res.render("listings/index.ejs" , {allListing} );
   
// })

// app.post("/listings" , validateListing ,  wrapAsync( async  (req,res,next)=>{
     
//         console.log(req.body);
//         //  if(!req.body.listing){
//         //     throw new ExpressError(400 , "Send valid data for listing !");
//         //  }
    
//         const new_Listing = new Listing(req.body.Listing);
//         await new_Listing.save();
//         // console.log(new_Listing);
    
//         // await newListing.save();
//         //  console.log(newListing);
//         res.redirect("/listings");

// }))

// //new route

// app.get("/listings/new" , (req ,res)=>{
//     res.render("listings/new.ejs");
// })

// //show route


// app.get("/listings/:id" , wrapAsync(async (req ,res)=>{

//     let { id }= req.params;
//     const listing =  await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs" , {listing});
// }))




// //edit
// app.get("/listings/:id/edit"  , wrapAsync( async(req,res)=>{
//     let{id} = req.params;
//     const listing = await Listing.findById(id);

    
  
//     res.render("listings/edit.ejs", {listing}) ; 
// }))

// //update
// app.put("/listings/:id" ,validateListing ,  wrapAsync(async (req ,res)=>{

//     // if(!req.body.listing){
//     //     throw new ExpressError(400 , "Send valid data for listing !");
//     //  }
     
//     let {id} = req.params;
//    await  Listing.findByIdAndUpdate(id , {...req.body.listing});
//    res.redirect(`/listings/${id}`);
// }))

// //delete

// app.delete("/listings/:id" , wrapAsync(async(req ,res)=>{
//     let {id} = req.params;
//       await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// }))




// //review 
// app.post("/listings/:id/reviews" , validateReview  , wrapAsync( async(req , res)=>{
    
//     let listing = await Listing.findById(req.params.id);

//     let newReview = new Review(req.body.review);

//     await listing.reviews.push(newReview);
//      await newReview.save();
//     await listing.save();

//     console.log("new review saved");
//      res.redirect(`/listings/${listing._id}`)


// }))

// //delete review

// app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(  async (req , res)=>{
//     let {id , reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id , {$pull :{ reviews : reviewId}});
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
// }

// ))









