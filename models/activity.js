/*
    Activity Model
*/
var mongoose = require("mongoose");

var ActivitySchema = new mongoose.Schema({
    ActivityID: {
        type: String
    },
    ActivityName: {
        type: String
    },
    CreationDate: {
        type: Date,
        default: Date.now
    }
}, {collection: 'activities'});

module.exports = mongoose.model('Activity', ActivitySchema);