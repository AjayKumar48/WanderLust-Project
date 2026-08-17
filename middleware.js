const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");

// Requiring listingSchema for schema validation(taaki sare fields par error check ho ske)   Requiring listingSchema for schema validation(taaki sare fields par error check ho ske)
const {listingSchema, reviewSchema} = require("./schema.js");



module.exports.isLoggedIn = (req, res,next) => {
    if (!req.isAuthenticated()) {
        //  redirect url
        req.session.redirectUrl = req.originalUrl;    // req.originalUrl ki value session.redirectUrl variable me store krenge
        req.flash("error", "You must be logged in for accessing this page");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this Listing");
        return res.redirect(`/listings/${id}`);
    };
    next();
};

// For passing errors in schema (validation error of schema) 
// Using Joi methods (joi module is used for validation of schema)
module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");    // taaki other useful message bhi error se extract ho jai
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");    // taaki other useful message bhi error se extract ho jai
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor = async (req,res,next) =>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    };
    next();
};
