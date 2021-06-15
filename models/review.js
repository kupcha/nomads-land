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
    tripLatitude: {
        type: Double,
        required: true
    },
    tripLongitude: {
        type: Double,
        required: true
    },
    recsMade: {
        type: Integer,
        required: true
    },
    activityRecsMade: {
        type: Integer,
        required: true
    },
    foodRecsMade: {
        type: Integer,
        required: true
    },
    sightRecsMade: {
        type: Integer,
        required: true
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