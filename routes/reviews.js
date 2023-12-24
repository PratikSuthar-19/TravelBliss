const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema}  = require("../schema.js")
const Listing = require("../models/Listing");
const Review = require("../models/Review");
const {validateReview , isLoggdIn , isReviewAuthor}= require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



// "/listings/:id/reviews"

//create review 
router.post("/" ,isLoggdIn, validateReview  , wrapAsync(reviewController.createReview));

//delete review
router.delete("/:reviewId",isLoggdIn , isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;