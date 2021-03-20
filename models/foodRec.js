const mongoose = require('mongoose');
 

const foodRecSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
    },

});


const FoodRec = mongoose.model('FoodRec', foodRecSchema);
module.exports = FoodRec;