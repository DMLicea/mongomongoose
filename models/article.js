//require mongoose

var mongoose = require("mongoose");

// Save a reference to the Schema constructor

var Schema = mongoose.Schema;

// Using the Schema constructor, create a new Schema

var articleSchema = new Schema({

  title: 
    {
      type: String,
      required: true
    },

    summary: {
      type: String,
      required: true
  },

  link: 
    {
      type: String,
      required: true
    },

  note: 
  {
      type: Schema.Types.ObjectId,
      ref: "Note"
  }
  
});

//create model from above schema

var Article = mongoose.model("Article", articleSchema);

// Export the Article model

module.exports = Article;
