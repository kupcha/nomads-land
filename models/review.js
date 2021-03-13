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
    month: {
        type: Number,
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
        required: false
    },
    foodRating: {
        type: Number,
        required: true
    },
    foodRec:{
        type: Array[String],
        required: false
    },














    
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;