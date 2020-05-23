const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User001",
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book001",
    required: true,
  },

  id: { type: String },
  title: { type: String, required: true },
  content: { type: String },
  personal: { type: Boolean },
  locked: { type: Boolean },
  created: { type: Date },
  updated: { type: Date },
  rank: { type: Number },
  version: { type: Number },

});

module.exports = mongoose.model('Note010', noteSchema);