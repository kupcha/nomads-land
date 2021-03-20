const mongoose = require('mongoose');
 

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
    },

});


const ActivityRec = mongoose.model('ActivityRec', activitySchema);
module.exports = ActivityRec;