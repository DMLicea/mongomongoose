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
  // us axios to get the homepage
  axios.get("https://www.echojs.com/").then(function(response) {
  
    // cheerio

    var $ = cheerio.load(response.data);
  
    // emptyobject

    var results = [];
  
    // With cheerio, find each div-tag with the class "post-content" and loop through the results
    $("div.post-content").each(function(i, element) 
    
    {
      // empty object
      var stories = {};
  
      // title
      stories.title = $(element).children("h3.post-title").text();
      // summary
      stories.teaser = $(element).children("p").text();
      // link
      stories.link = $(element).children("h3.post-title").children().attr("href");

      // create database based on stories
      db.Stories.create(stories)

        .then(function(dbStories) {
          
          // log
          
          console.log(dbStories);

        })

        .catch(function(err) {
          
          // error log
          
          console.log(err);
        
        });
    });

  });

  console.log(req.body);

  res.send("Scrape complete");

});

// route for getting all the pastas fom the db

router.get("/stories", function(req, res) {

  db.Stories.find({})
  
  .then(function(dbStories) {

    // send back

    res.json(dbStories)

  })

  .catch(function(err) {

    res.json(err);
  
  });

});

router.get("/stories/:id", function(req, res) {
  
  db.Stories.findOne({ _id: req.params.id })
  
  .populate("notes")
  
  .then(function(dbPasta) {
    
    // send back
    
    res.json(dbPasta);
  
  })

  .catch(function(err) {
    
    // error
    
    res.json(err);
  
  });

});

// post route to add a note 
router.post("/stories/:id", function(req, res) {
// new note
db.Notes.create({

  body: req.body.body

})
  
.then(function(dbNote) {
    // If a Note was created successfully, find one pasta with an `_id` equal to `req.params.id`. Update the pasta to be associated with the new Note
    // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
    
    return db.Pasta.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
})
.then(function(dbStories) {
  
 // send back
  
  res.json(dbStories);

})

.catch(function(err) {
  
  // error

  res.json(err);

});

})

module.exports = router;