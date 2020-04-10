const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  personal: { type: Boolean },
  category: { type: [String] },
  created: { type: Date, required: true },
  updated: { type: Date, required: true },
  rank: { type: Number, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User001", required: true },
});

module.exports = mongoose.model('Note004', noteSchema);
