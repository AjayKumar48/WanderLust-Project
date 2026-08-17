const mongoose = require("mongoose");
const Review = require("./review.js");
const { urlencoded } = require("express");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
       type: String,
       required: true,
    },
    description: String ,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId ,  // ye reviews Collection/schema se aayega data
            ref: "Review",
        },
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});


//  This is used for deleting the reviews array and all the reviews present in array if the listing(jis listing ke vo reviews hai) is deleted
listingSchema.post("findOneAndDelete",async (listing) =>{
    if (listing) {
        await Review.deleteMany({_id: {$in: listing.reviews} });
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;