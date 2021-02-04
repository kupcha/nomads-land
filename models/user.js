const mongoose = require('mongoose');

// schema for mongoDB to describe a single user
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        maxlength: 20
    },
    phone:{
        type: Number,
        required: true,
        maxlength: 15
    },
    password:{
        type: String,
        required: true,
        maxlength: 15
    },

    elevation:{
        type: Number,
        required: true,
        default: 0
    },
    referrals:{
        type: Number,
        required: true,
        default: 0

    }
});
const User = mongoose.model('user', userSchema);

module.exports = User;