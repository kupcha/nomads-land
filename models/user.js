const mongoose = require('mongoose');
 

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
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
    },
    shownAboutScreen: {
    type: Number,
    required: true,
    default: 0
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;