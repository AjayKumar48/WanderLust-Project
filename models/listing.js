const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
       type: String,
       required: true,
    },
    description: String ,
    image: {
        type: String,
        default:"https://in.images.search.yahoo.com/search/images?p=house+images&fr=mcafee&type=E210IN714G91918&imgurl=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F1396122%2Fpexels-photo-1396122.jpeg%3Fcs%3Dsrgb%26dl%3Darchitecture-bungalow-daylight-1396122.jpg%26fm%3Djpg#id=10&iurl=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F1396122%2Fpexels-photo-1396122.jpeg%3Fcs%3Dsrgb%26dl%3Darchitecture-bungalow-daylight-1396122.jpg%26fm%3Djpg&action=click",
        set: (v) => v === "" ? "https://in.images.search.yahoo.com/search/images?p=house+images&fr=mcafee&type=E210IN714G91918&imgurl=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F1396122%2Fpexels-photo-1396122.jpeg%3Fcs%3Dsrgb%26dl%3Darchitecture-bungalow-daylight-1396122.jpg%26fm%3Djpg#id=10&iurl=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F1396122%2Fpexels-photo-1396122.jpeg%3Fcs%3Dsrgb%26dl%3Darchitecture-bungalow-daylight-1396122.jpg%26fm%3Djpg&action=click" :v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;

