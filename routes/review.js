const express = require("express");
const router = express.Router({ mergeParams : true});

// These below 2 are for error middlewares and custom error messages
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");


// Requiring Schema and Model
const Listing  = require("../models/listing.js");

// Requiring Reviews Model and Schema
const Review  = require("../models/review.js");

const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


// Reviews Post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;