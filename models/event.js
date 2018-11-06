/*
    Event Model. References Activity Model
*/
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventSchema = new mongoose.Schema({
    EventID: {
        type: String
    },
    EventStartDate: {
        type: Date
    },
    EventEndDate: {
        type: Date
    },
    Activity: {
        type: Schema.Types.ObjectId,
        ref: 'Activity'
    },
    isActive: {
        type: Boolean
    },
    CreationDate: {
        type: Date,
        default: Date.now
    }
}, {collection: 'events'});

module.exports = mongoose.model('Event', EventSchema);