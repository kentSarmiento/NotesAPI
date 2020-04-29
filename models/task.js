const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const taskSchema = mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User001",
    required: true,
    unique: true
  },
  tasksInfo: { type: String },
  listsInfo: { type: String },
  highrank: { type: Number },
  updated: { type: Date, required: true },
});

taskSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Task005', taskSchema);
