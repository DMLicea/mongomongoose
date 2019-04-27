//require mongoose

var mongoose = require("mongoose");

// create schema with mongoose

var Schema = mongoose.Schema;

//create a noteschema based on previous schema

var noteSchema = new Schema({
 
  title: String,
  
  body: String

});


var Note = mongoose.model("Note", noteSchema);

// Export

module.exports = Note;