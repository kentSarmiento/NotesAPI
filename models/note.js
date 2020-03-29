const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String }, // TODO: set to required
  author: { type: String },
});

module.exports = mongoose.model('Note', noteSchema);