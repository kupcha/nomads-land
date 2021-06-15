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
        type: Number,
        required: true
    },
    tripLongitude: {
        type: Number,
        required: true
    },
    recsMade: {
        type: Number,
        required: true
    },
    activityRecsMade: {
        type: Number,
        required: true
    },
    foodRecsMade: {
        type: Number,
        required: true
    },
    sightRecsMade: {
        type: Number,
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


const UpdatedReview = mongoose.model('UpdatedReview', reviewSchema);

module.exports = UpdatedReview;