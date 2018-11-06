/*
    Events Route
*/

var express = require("express");
var router = express.Router();

var Activity = require("../models/activity");
var Event = require("../models/event");

var eventFunctions = require("../eventFunctions.js");

var eventCollection = [];

/*
    Grab Activities to populate select tag.
*/
router.get("/add", function(req, res, next) {
    Activity.find(function(err, someActivities) {
        if(err){res.send(err);}
        res.render('addEvent',{
            title: 'Add Event',
            activities: someActivities
        });
    })
});

/*
    Add an Event
*/
router.post("/add", function(req, res, next) {
    if(!req.body.eventID || !req.body.eventDate || !req.body.eventStart || !req.body.eventEnd) {
        Activity.find(function(err, someActivities) {
            if(err){res.send(err);}
            res.render('addEvent',{
                title: 'Add Event',
                activities: someActivities,
                error: "Empty Fields Detected! Please fill out entire form!"
            });
        })
    } else if (eventFunctions.isValidDate(req.body.eventDate) && eventFunctions.isValidHour(req.body.eventStart) && eventFunctions.isValidHour(req.body.eventEnd)) {
        // Parse the Date and Time
        var startDate = eventFunctions.parseDateHour(req.body.eventDate, req.body.eventStart);
        var endDate = eventFunctions.parseDateHour(req.body.eventDate, req.body.eventEnd);
        // If the End Date Hour is smaller than the Start Date Hour then add an extra Day to the End Date
        if (startDate.getUTCHours() >= endDate.getUTCHours()) { endDate.setDate(endDate.getDate() + 1); }

        Activity.findOne({'ActivityName': req.body.activity}, function(err, activity) {
            if(err) { res.send(err); }
            var newEvent = new Event();
            newEvent.EventID = req.body.eventID;
            newEvent.EventStartDate = startDate;
            newEvent.EventEndDate = endDate;
            newEvent.Activity = activity._id;
            if(eventFunctions.isWithinCurrentWeek(startDate)) {
                newEvent.isActive = true;
            } else {
                newEvent.isActive = false;
            }
            newEvent.save(function(err) {
                if(err) { res.send(err); }
                console.log("Event Created");
                Activity.find(function(err, someActivities) {
                    if(err){res.send(err);}
                    res.render('addEvent',{
                        title: 'Add Event',
                        activities: someActivities,
                        msg: "Successfully Created Event!"
                    });
                })
            });
        });
    } else {
        console.log("Validation Error");
        Activity.find(function(err, someActivities) {
            if(err){res.send(err);}
            res.render('addEvent',{
                title: 'Add Event',
                activities: someActivities,
                error: "Validation Error! Please enter valid data!"
            });
        })
    }
});

/*
    Populate the Events Update page.
*/
router.get("/update", function(req, res, next) {
    Event.find().populate('Activity', 'ActivityName').exec(function (err, event) {
        if(err){res.send(err);}
        eventCollection = event;
        res.render('updateEvent', {
            title: 'Update Event',
            events: event
        });
    });
});

/*
    AJAX call for update page to grab specific Event to populate form values
*/
router.get("/update/:id", function(req, res, next) {
    var id = req.params.id;
    var foundEvent = eventCollection.find(event => event.EventID === id);
    // Filter found Event so only necessary data is sent back
    var filteredEvent = {};
    filteredEvent.startDate = foundEvent.EventStartDate;
    filteredEvent.endDate = foundEvent.EventEndDate;
    filteredEvent.isActive = foundEvent.isActive;
    return res.end(JSON.stringify(filteredEvent));
});

/*
    Update an Event
*/
router.post("/update", function(req, res, next) {
    if(!req.body.eventID || !req.body.eventDate || !req.body.eventStart || !req.body.eventEnd || !req.body.optradio){
        Event.find().populate('Activity', 'ActivityName').exec(function (err, event) {
            if(err){res.send(err);}
            res.render('updateEvent', {
                title: 'Update Event',
                events: event,
                error: "Empty Fields Detected! Please fill out entire form!"
            });
        });
    } else if (eventFunctions.isValidDate(req.body.eventDate) && eventFunctions.isValidHour(req.body.eventStart) && eventFunctions.isValidHour(req.body.eventEnd)) {
        // Parse the Date and Time
        var startDate = eventFunctions.parseDateHour(req.body.eventDate, req.body.eventStart);
        var endDate = eventFunctions.parseDateHour(req.body.eventDate, req.body.eventEnd);
        // If the End Date Hour is smaller than the Start Date Hour then add an extra Day to the End Date
        if (startDate.getUTCHours() >= endDate.getUTCHours()) { endDate.setDate(endDate.getDate() + 1); }

        Activity.findOne({'ActivityName': req.body.event}, function(err, activity) {
            var bool;
            if (req.body.optradio == "active") {
                bool = true;
            } else if (req.body.optradio == "inactive") {
                bool = false;
            }
            Event.findOneAndUpdate({'Activity': activity._id, "EventID": req.body.eventID}, {$set:{"EventStartDate": startDate, "EventEndDate": endDate, "isActive": bool}}, {new:true}, function(err, event) {
                if(err){
                    Event.find().populate('Activity', 'ActivityName').exec(function (err, event) {
                        if(err){res.send(err);}
                        res.render('updateEvent', {
                            title: 'Update Event',
                            events: event,
                            error: "Unable to Update Event!"
                        });
                    });
                } else {
                    Event.find().populate('Activity', 'ActivityName').exec(function (err, event) {
                        if(err){res.send(err);}
                        res.render('updateEvent', {
                            title: 'Update Event',
                            events: event,
                            msg: "Succesfully Updated Event!"
                        });
                    });
                }
            });
        });
    } else {
        Event.find().populate('Activity', 'ActivityName').exec(function (err, event) {
            if(err){res.send(err);}
            res.render('updateEvent', {
                title: 'Update Event',
                events: event,
                error: "Validation Error! Please enter valid data!"
            });
        });
    }
});

/*
    Populate the Events Delete Page
*/
router.get("/delete", function(req, res, next) {
    Event.find().populate('Activity', 'ActivityName').exec(function (err, event) {
        if(err){res.send(err);}
        res.render('deleteEvent', {
            title: 'Delete Event',
            events: event
        });
    });
});

/*
    Delete an Event
*/
router.post("/delete", function(req, res, next) {
    Activity.findOne({'ActivityName': req.body.event}, function(err, activity) {
        Event.findOneAndRemove({'Activity': activity._id}, function(err, event) {
            if(err) {
                Event.find().populate('Activity', 'ActivityName').exec(function (err, event) {
                    if(err){res.send(err);}
                    res.render('deleteEvent', {
                        title: 'Delete Event',
                        events: event,
                        error: "Unable to Remove Event!"
                    });
                });
            } else {
                Event.find().populate('Activity', 'ActivityName').exec(function (err, event) {
                    if(err){res.send(err);}
                    res.render('deleteEvent', {
                        title: 'Delete Event',
                        events: event,
                        msg: "Succesfully Removed Event!"
                    });
                });
            }
        });
    });
});


module.exports = router;