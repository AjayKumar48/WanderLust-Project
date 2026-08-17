const User = require("../models/user");
const passport = require("passport");


module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        //  this below written function is used for automatic login of any sigin user
        req.login(registeredUser, (err) => {        // login function ka use (inbuilt passport function used for login)
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch(e) {
        console.log(registeredUser);
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res) =>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res) =>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"    // esme ya to default value listings aaege or redirectUrl ki value aaige
    res.redirect(redirectUrl);  
};

module.exports.logout = (req,res,next) =>{
    req.logout((err) => {      // logout function ka use (inbuilt passport function used for logout)
        if(err){
            return next(err);
        }
        req.flash("success","You logged out!")
        res.redirect("/listings");
    });
};