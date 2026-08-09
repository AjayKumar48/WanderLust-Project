const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
       type: String,
       required: true,
    },
    description: String ,
    image: {
        type: String,
        default:"https://images.unsplash.com/photo-1670589953882-b94c9cb380f5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG91c2UlMjBhbmQlMjB2aWxsYXN8ZW58MHx8MHx8fDA%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1670589953882-b94c9cb380f5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG91c2UlMjBhbmQlMjB2aWxsYXN8ZW58MHx8MHx8fDA%3D" :v,
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
});


//  This is used for deleting the reviews array and all the reviews present in array if the listing(jis listing ke vo reviews hai) is deleted
listingSchema.post("findOneAndDelete",async (listing) =>{
    if (listing) {
        await Review.deleteMany({_id: {$in: listing.reviews} });
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;