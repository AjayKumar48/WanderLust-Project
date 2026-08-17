const express = require("express");
const router = express.Router();
//  requiring middleware for authentication
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

// These below 2 are for error middlewares and custom error messages
const wrapAsync = require("../utils/wrapAsync.js");

// Requiring Schema and Model
const Listing  = require("../models/listing.js");

const listingController = require("../controllers/listings.js");


const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index Route and Create route using router.route(compact tareeka likhne ka jinke bhi route path same ho use same me likhdo)
router.route("/")
.get(wrapAsync (listingController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync (listingController.createListing));



//New Route  and create route is below show route
router.get("/new",isLoggedIn, listingController.renderNewForm);

//show route, update route and delete route using (router.route)
router.route("/:id")
.get( wrapAsync (listingController.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync (listingController.updateListing))
.delete(isLoggedIn, isOwner,wrapAsync (listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));


module.exports = router;