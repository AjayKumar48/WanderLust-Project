const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const flash = require("connect-flash");

// for ejs
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//  requiring express session
const session = require("express-session");

const router = express.Router();

// //  cookie-parser used 
// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));    // secretcode isliye pass for sending signed cookies(means unintenital change se bachane k liye)

// //  Practice of setting the cookies name and value pair with secretecode (takki koi bhi aakar values change na kr de and if change krdega then hume pta chal jaiga)

// //  Sending signed cookies
// app.get("/getsignedcookies",(req,res) => {
//     res.cookie("made-in","India", {signed:true});
//     res.cookie("color","Red", {signed:true});
//     res.send("done!");
// })


// //  Verifying signed cookies
// app.get("/verify",(req,res) =>{
//     res.send(req.signedCookies);
//     console.log(req.signedCookies);
// })


// //  Practice of setting the cookies name and value pair
// app.get("/setcookies",(req,res) =>{
//     res.cookie("made-in","India");
//     res.cookie("name","Ajay Parashar");
//     res.send("We sent some cookies!");
// })


// //  Practice of getting the cookies name and value pair on terminal
// app.get("/getcookies",(req,res) =>{
//     console.dir(req.cookies);
//     res.send("Got the cookies!");
// })

// app.get("/",(req,res) =>{
//     res.send("This is root");
// })

// // Users Routes
// app.use("/users", users);

// // Posts Routes
// app.use("/posts", posts);



                                            //  Practice of Express sessions
const sessionOptions = {
    secret: "mysupersecretstring" ,
    resave: false,
    saveUninitialized: true,
};


app.use(session(sessionOptions));

app.get("/test",(req,res) =>{
    res.send("something tested!");
});


//  Small activity of counting the number of times we sent request to the same page using express session.count

// app.get("/reqcount",(req,res) =>{
//     if(req.session.count){
    //     }else{
//         req.session.count = 1
//     }
//     res.send(`You sent a request ${req.session.count} number of times`);
// });



//  Storing and using the stored information of Express Session
//  using connect-flash for popping up some message 
app.use(flash());

//  Passing res.locals as a Middleware so that the route code may not become bulkier
app.use((req, res, next) =>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});
app.get("/register",(req,res) =>{
    let {name="anonymous"} = req.query;
    req.session.name = name;
    if(req.session.name === "anonymous"){
        req.flash("error","User is Not Registered");
    }else{
        req.flash("success","User is registered successfully");
    }
    res.redirect("/hello");
});

//  using the stored information in hello route
app.get("/hello",(req,res) =>{
    res.render("page.ejs",{name:req.session.name});
});


app.listen(3000,() =>{
    console.log("Listening requests at 3000");
});