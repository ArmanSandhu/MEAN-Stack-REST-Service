/*
    Calendar Route - For Client Site only
*/

var express = require("express");
var router = express.Router();

var Event = require("../models/event");

//grab all the events populated with their activities
router.get("/", function(req, res, next){

    var eventArray = [];
    Event.find({'isActive':true}).populate('Activity').exec(function (err, event){
        if(err){res.send(err);}
        for(var i=0; i < event.length; i++){
            var singleEvent = {};            
            singleEvent["id"] = event[i]["EventID"];
            singleEvent["title"] = event[i]["Activity"]["ActivityName"];
            singleEvent["start"] = event[i]["EventStartDate"];
            singleEvent["end"] = event[i]["EventEndDate"];
            eventArray[i] = singleEvent;
        };
        res.json(eventArray);
    });
});

module.exports = router;