const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  personal: { type: Boolean, default: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User001", required: true }
});

module.exports = mongoose.model('Note001', noteSchema);
