const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const noteSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  personal: { type: Boolean },
  category: { type: [String] },
  created: { type: Date, required: true },
  updated: { type: Date, required: true },
  rank: { type: Number, required: true, unique: true},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User001", required: true },
});

noteSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Note005', noteSchema);
