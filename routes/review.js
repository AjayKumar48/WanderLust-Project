const express = require("express");
const router = express.Router({ mergeParams : true});

// These below 2 are for error middlewares and custom error messages
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

// Requiring listingSchema for schema validation(taaki sare fields par error check ho ske)
const {reviewSchema} = require("../schema.js");

// Requiring Schema and Model
const Listing  = require("../models/listing.js");

// Requiring Reviews Model and Schema
const Review  = require("../models/review.js");


const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");    // taaki other useful message bhi error se extract ho jai
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

// Reviews Post route
router.post("/", validateReview,wrapAsync(async(req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review added successfully");
    res.redirect(`/listings/${listing._id}`); 
}));


// Delete Review Route
router.delete("/:reviewId",wrapAsync(async(req,res) =>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;