const mongoose = require('mongoose');
 

const reviewSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
    },
    elevation: {
        type: Number,
        required: true,
        default: 0,
    },
    referrals: {
        type: Number,
        required: true,
        default: 0,
    },
    trips: {
        type: Number,
        required: true,
        default: 0
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;