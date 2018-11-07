var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

//Require Routes
var index = require("./routes/index");
var activities = require("./routes/activities");
var events = require("./routes/events");
var calendar = require("./routes/calendar");

//Require Config
var config = require("./config");
var cors = require("./config/cors");

//Set up connection to MongoDB
var mongoose = require("mongoose");
var mongoURL = config.database;
mongoose.connect(mongoURL, function(err) {
    if(err) {
        console.log("Error connecting to MongoDB");
        process.exit(1);
    }
}); 

var app = express();

//View Engine
var ejsEngine = require("ejs-locals");
app.engine("ejs", ejsEngine);
app.set("view engine", "ejs");

//Set static folder
app.use(express.static(path.join(__dirname, "client")));

//Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Enable CORS
app.use(cors.permission);

//Use Routes
app.use("/", index);
app.use("/activities", activities);
app.use("/events", events);
app.use("/calendar", calendar);

//Listen to Port
app.listen(config.port, function(){
    console.log("Server started on port " + config.port);
});
