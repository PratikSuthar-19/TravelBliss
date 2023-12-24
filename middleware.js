const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema }  = require("./schema.js");
const Listing = require("./models/Listing.js");
const Review = require("./models/Review.js");

module.exports.validateListing  = (req , res , next) =>{
   let result = listingSchema.validate(req.body);
    //  console.log(result);
    if(result.error){
   throw new ExpressError(400 , result.error);
    }else{
        next();
    }
}

module.exports.validateReview  = (req , res , next) =>{
    
    let result = reviewSchema.validate(req.body);
    // console.log(result);
    if(result.error){
     throw new ExpressError(400 , result.error);
    }else{
        next();
    }
  
}

module.exports.isLoggdIn = (req , res , next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectURL = req.originalUrl;
        req.flash("error" , "You must be loggd in to create new listing");
       return res.redirect("/login");
    }
    next();
    }

module.exports.saveRedirectURL = (req , res , next)=>{
    if(req.session.redirectURL){
    res.locals.redirectURL = req.session.redirectURL;

    }
    next();
}
module.exports.isOwner = async(req , res , next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(! listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not a owner of this Listing");
        res.redirect(`/listings/${id}`);
        return;
    }
    next();
}    

module.exports.isReviewAuthor = async(req , res , next)=>{
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(! review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not a author of this review");
        return  res.redirect(`/listings/${id}`);
       
    }
    next();
}  