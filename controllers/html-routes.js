var express = require("express");
var router = express.Router();

// Require all models
var db = require("../models");

// default route
router.get("/", function(req, res){
    // console.log(req);
    res.render("index");
});


var axios = require("axios");
var cheerio = require("cheerio");

//get
router.get("/scrape", function(req, res) {
    
    axios.get("http://www.echojs.com/").then(function(response) {
    
      // Load the body of the HTML into cheerio
      var $ = cheerio.load(response.data);
    
      // Empty object to save our scraped data
      var results = [];
    
      // With cheerio, find each div-tag with the class "post-content" and loop through the results
      $("div.post-content").each(function(i, element) {
        // save an empty pasta object
        var story = {};
    
        // save the title text
        story.title = $(element).children("h3.post-title").text();
        // save the teaser text in the p tag
        story.teaser = $(element).children("p").text();
        // save the link from the title
        story.link = $(element).children("h3.post-title").children().attr("href");

        // create a new Pasta using the object we just built
        db.Stories.create(story)
          .then(function(dbStories) {
            // view the added result in the console
            console.log(dbStories);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
    });
    // console.log(req.body);
    res.send("Scrape complete");
});

// route for getting all the pastas fom the db
router.get("/stories", function(req, res) {
  db.Stories.find({})
    .then(function(dbStories) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbStories)
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/stories/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Stories.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("notes")
    .then(function(dbStories) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbStories);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// post route to add a note 
router.post("/stories/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Notes.create({
    body: req.body.body
  })
    .then(function(dbNote) {
      // If a Note was created successfully, find one pasta with an `_id` equal to `req.params.id`. Update the pasta to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Stories.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  })
  .then(function(dbStories) {
    // If we were able to successfully update an Article, send it back to the client
    res.json(dbStories);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
})

module.exports = router;