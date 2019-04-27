var mongoose = require("mongoose");

// schema

var Schema = mongoose.Schema;

//create a noteschema using schema

var NoteSchema = new Schema({
 
  title: String,
  body: String

});


var Note = mongoose.model("Note", NoteSchema);

// Export
module.exports = Note;