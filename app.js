// For express
const express = require("express");
const app = express();

//  For mongoose
const mongoose = require("mongoose");

// Requiring Model
const Listing  = require("./models/listing.js");

const path = require("path");

// for ejs
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// Middleware added
app.use(express.urlencoded({extended:true}));

//  For Methodoveride module 
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// for ejs mate
const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);

// For public folder
app.use(express.static(path.join(__dirname,"/public")));

// These below 2 are for error middlewares and custom error messages
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

// Requiring listingSchema for schema validation(taaki sare fields par error check ho ske)
const {listingSchema} = require("./schema.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() =>{
    console.log("Connected to db");
}).catch((err) =>{
    console.log(err);
});


async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res) =>{
    res.send("Hi, i am root");
});

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,err.Msg);
    }
    else{
        next();
    }
}


// Index Route
app.get("/listings", wrapAsync (async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));


//New Route  and create route is below show route
app.get("/listings/new",(req,res) =>{
    res.render("./listings/new.ejs");
});



//show route
app.get("/listings/:id", wrapAsync (async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));



// Create Route :- Checking for errors by try and catch block
app.post("/listings",validateListing, wrapAsync (async (req,res,next) =>{
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);

 


// Edit Route
app.get("/listings/:id/edit", wrapAsync (async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));



// Update route
app.put("/listings/:id",validateListing, wrapAsync (async(req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


// Delete  Route
app.delete("/listings/:id", wrapAsync (async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));



// app.get("/testListing",async (req,res) =>{
//     let sampleListing = new Listing ({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful");
// });





// This is error for invalid route request
app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404,"Page not found!"));
});

//  Error Middleware
app.use((err,req,res,next) =>{
    let { statusCode = 500 , message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080,() =>{
    console.log("listning to port 8080");
});