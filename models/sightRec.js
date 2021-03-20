const mongoose = require('mongoose');
 

const sightRecSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
    },

});


const SightRec = mongoose.model('SightRec', sightRecSchema);
module.exports = SightRec;