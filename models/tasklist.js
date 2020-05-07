const mongoose = require('mongoose');

const listSchema = mongoose.Schema({

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User001",
    required: true,
  },

  title: { type: String, required: true },
  rank: { type: Number },
  updated: { type: Date },
  version: { type: Number },
  locked: { type: Boolean },
  personal: { type: Boolean }
});

module.exports = mongoose.model('List010', listSchema);
