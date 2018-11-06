/*
    Activities Route
*/

var express = require("express");
var router = express.Router();

var Activity = require("../models/activity");

/*
    Get all the Activities in the Database
*/
router.get("/list", function(req, res, next) {
    Activity.find(function(err, students) {
        if(err){res.send(err);}
        res.render('listActivities',{
            title: 'List Activities',
            activities: students
        });
    });
});

/*
    Render the Add Activities Page
*/
router.get("/add", function(req, res, next) {
    res.render('addActivity', {
        title: 'Add Activity'
    });
});

/*
    Add a new Activity
*/
router.post("/add", function(req, res, next) {
    var newActivity = new Activity();

    if(!req.body.actID || !req.body.actName) {
        res.render('addActivity', {
            title: 'Add Activity',
            error: "Empty Fields Detected! Please fill out entire form!"
        });
    } else {
        newActivity.ActivityID = req.body.actID;
        newActivity.ActivityName = req.body.actName;

        newActivity.save(function(err) {
            if(err){
                res.render('addActivity', {
                    title: 'Add Activity',
                    error: "Couldn't add Activity!"
                });
            } else {
                res.render('addActivity', {
                    title: 'Add Activity',
                    msg: "Successfully Added Activity!"
                });
            }
        });
    }
});

module.exports = router;