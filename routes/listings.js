const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/Listing");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema}  = require("../schema.js");
const{isLoggdIn , isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage} = require("../cloudConfig.js");
const upload = multer({storage});


// /listings


//index route and create route
router.route("/")
      .get( listingController.index)
      .post(isLoggdIn ,  upload.single('Listing[image]'),validateListing, wrapAsync(listingController.newListing));
      
     
//new route
router.get("/new", listingController.newListingForm);

//show route , update route , delete route
router.route("/:id")
      .get(wrapAsync( listingController.showListing))
      .put( isLoggdIn, isOwner, upload.single('Listing[image]'),validateListing,  wrapAsync(listingController.updateListing))
      .delete(isLoggdIn, isOwner,wrapAsync(listingController.destroyListing));

//edit
router.get("/:id/edit" ,isLoggdIn , isOwner,wrapAsync( listingController.editForm));  

module.exports= router;











//index route 
// router.get("/" , listingController.index);

//create route
// router.post("/" ,  wrapAsync(listingController.newListing));

//new route
// router.get("/new", listingController.newListingForm);

//show route
// router.get("/:id", wrapAsync( listingController.showListing));

//edit
// router.get("/:id/edit" ,isLoggdIn , isOwner,wrapAsync( listingController.editForm));

//update
// router.put("/:id" , validateListing  ,isLoggdIn, isOwner,  wrapAsync(listingController.updateListing));

//delete
// router.delete("/:id" ,isLoggdIn, isOwner,wrapAsync(listingController.destroyListing))

