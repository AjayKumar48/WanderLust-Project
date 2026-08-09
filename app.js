// For express
const express = require("express");
const app = express();

//  For mongoose
const mongoose = require("mongoose");

const path = require("path");

//  requiring express-session
const session = require("express-session");

// requiring connect-flash
const flash = require("connect-flash");


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

// For public folder( eske ander css (for all) and js(code hai for form error checking) )
app.use(express.static(path.join(__dirname,"/public")));

// These below 2 are for error middlewares and custom error messages
const ExpressError = require("./utils/ExpressError.js");


//  Requiring listings from routes(restructure kr raha hai)
const listingRouter = require("./routes/listing.js");

//  Requiring reviews from routes(restructure kr raha hai)
const reviewRouter = require("./routes/review.js");

//  Requiring users from routes(restructure kr raha hai)
const userRouter = require("./routes/user.js");

//  requiring passport
const passport = require("passport");
//  requiring passport-local
const LocalStrategy = require("passport-local");
//  requiring User
const User = require("./models/user.js");

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



//  creating a sessionOptions 
const sessionOptions = {
    secret: "mysupersecretstring" ,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
}
//  using sessionOptions in session 
app.use(session(sessionOptions));
//  using flash 
app.use(flash());
// A middleware that initialize passport
app.use(passport.initialize());
// use to identitify users as they browse from page to page
app.use(passport.session());
// jo bhi users aae vo authenticate ho jae
passport.use(new LocalStrategy(User.authenticate()));
//  for serialze user into session  and deserialze(removing info of user)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Middleware for flash locals
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


//  demo user for testing
// app.get("/demouser",async (req,res) =>{
//     let fakeUser = new User({
//         email: "delta-student@123",
//         username: "Ajay Parashar",
//     });

//     let registeredUser = await User.register(fakeUser,"HelloWorld");
//     res.send(registeredUser);
// });


//  Using this line to get all data of listing.js
app.use("/listings", listingRouter);

//  Using this line to get all data of review.js
app.use("/listings/:id/reviews", reviewRouter);

//  Using this line to get all data of user.js
app.use("/", userRouter);

//  Ese delete bhi kr sakte h just normal starting code tha ye
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