var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var NoteSchema = new Schema({
  // `title` is of type String
  title: String,
  // `body` is of type String
  body: String,

///888EXAMPLE
// Add a reference to the user to whom this todo belongs
// user: {
//   type: Schema.Types.ObjectId,
//   ref: "User",
//   required: true
// }
////example
  article: {
    type: Schema.Types.ObjectId,   ////TYPE IS THE FOREIGN KEY ON WHICH WE"LL SEARCH
    ref: "Article",
    required: true
  }

});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
