//required pacckages

var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");

// // Require all models

var db = require("./models");

//port

var PORT = 3000;

//Express

var app = express();

// handlebars 

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use morgan logger for logging requests

app.use(logger("dev"));

// Parse request body as JSON

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// Make public a static folder

app.use(express.static("public"));

// If deployed, use the deployed database, if not, use local
// Connect to the Mongo DB

mongoose.connect("mongodb://localhost/3000", { useNewUrlParser: true });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


// Controller

var controller = require("./controllers/html-routes");

 app.use(controller);

// Start the server

app.listen(PORT, function() 

  {
   
    console.log("App running on port " + PORT + "!");
 
  });