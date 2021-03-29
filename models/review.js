const mongoose = require('mongoose');
 

const reviewSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    seasons: {
        type: String,
        required: false
    },
    year: {
        type: Number,
        required: false
    },
    fun: {
        type: String,
        required: false
    },
    food: {
        type: String,
        required: false
    },
    sights: {
        type: String,
        required: false
    },
    locals: {
        type: String,
        required: false
    },
    price: {
        type: String,
        required: false
    },
    enviro: {
        type: String,
        required: false
    },
    mscEnviro: {
        type: String,
        required: false
    },
    activityRecs: {
        type: [],
        required: false,
        default: undefined
    },
    foodRecs: {
        type: [],
        required: false,
        default: undefined
    },
    sightRecs: {
        type: [],
        required: false,
        default: undefined
    }
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;