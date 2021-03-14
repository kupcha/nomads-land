const mongoose = require('mongoose');
 

const reviewSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    season: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    funRating: {
        type: Number,
        required: true
    },
    activities:{
        type: Array[ActivitySchema],
        required: true
    },
    foodRating: {
        type: Number,
        required: true
    },
    foodRec:{
        type: Array[String],
        required: true
    },














    
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;