/*
    Index Route
*/

var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
    res.render("index", {title:"COMP 3913 Admin Site"});
});

module.exports = router;