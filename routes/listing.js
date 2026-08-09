const express = require("express");
const router = express.Router();

// These below 2 are for error middlewares and custom error messages
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

// Requiring listingSchema for schema validation(taaki sare fields par error check ho ske)
const {listingSchema} = require("../schema.js");

// Requiring Schema and Model
const Listing  = require("../models/listing.js");


// For passing errors in schema (validation error of schema) 
// Using Joi methods (joi module is used for validation of schema)
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");    // taaki other useful message bhi error se extract ho jai
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}


// Index Route
router.get("/", wrapAsync (async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));


//New Route  and create route is below show route
router.get("/new",(req,res) =>{
    res.render("./listings/new.ejs");
});



//show route
router.get("/:id", wrapAsync (async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error", "Listing you requested for doesn't exist!");
        return res.redirect("/listings");
    };
    res.render("listings/show.ejs",{listing});
}));



// Create Route :- Checking for errors by try and catch block
router.post("/",validateListing, wrapAsync (async (req,res,next) =>{
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success","New Listing Created Successfully!");
        res.redirect("/listings");
    })
);


// Edit Route
router.get("/:id/edit", wrapAsync (async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested to edit can't get!");
        res.redirect("/listings");
    };
    res.render("listings/edit.ejs",{listing});
}));


// Update route
router.put("/:id",validateListing, wrapAsync (async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
}));


// Delete  Route
router.delete("/:id", wrapAsync (async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings");
}));


module.exports = router;