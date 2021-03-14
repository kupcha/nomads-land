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
        required: false
    },
    year: {
        type: Number,
        required: false
    },
    funRating: {
        type: Number,
        required: false
    },
    activities:{
        type: Array[ActivitySchema],
        required: false
    },
    foodRating: {
        type: Number,
        required: false
    },
    foodRec:{
        type: Array[String],
        required: false
    },














    
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;