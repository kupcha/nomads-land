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
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    fun: {
        type: String,
        required: true
    },
    food: {
        type: String,
        required: true
    },
    sights: {
        type: String,
        required: true
    },
    locals: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    enviro: {
        type: String,
        required: true
    },
    mscEnviro: {
        type: String,
        required: false
    },
    // activityRecs: {
    //     type: Array[activitySchema],
    //     required: false
    // },
    // foodRecs: {
    //     type: Array[foodRecSchema],
    //     required: false
    // },
    // sightRecs: {
    //     type: Array[sightRecSchema],
    //     required: false
    // }
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;