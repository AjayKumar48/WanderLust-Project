const Listing  = require("../models/listing.js");
const axios = require("axios");

module.exports.index = async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res) =>{
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate: {path: "author"},}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for doesn't exist!");
        return res.redirect("/listings");
    };
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req,res,next) =>{
      const { location } = req.body.listing;
      console.log(location);
      console.log(req.body);
    // Convert address to coordinates
    const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: location,
                format: "json",
                limit: 1
            },
            headers: {
                "User-Agent": "MyListingApp/1.0"
            }
        }
    );

    if (response.data.length === 0) {
        return res.send("Location not found");
    }

    const latitude = Number(response.data[0].lat);
    const longitude = Number(response.data[0].lon);

        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing({ ...req.body.listing, geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
        }
        });
        newListing.owner = req.user._id;   // new listing koi bhi user create krega uska name aaiga as owner name
        newListing.image = {url, filename};

        let savedListing = await newListing.save();
        console.log(savedListing);
        req.flash("success","New Listing Created Successfully!");
        res.redirect("/listings");
    };

module.exports.renderEditForm = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested to edit can't get!");
        res.redirect("/listings");
    };

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.updateListing = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success","Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings");
};