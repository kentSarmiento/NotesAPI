const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User001",
    required: true,
  },

  id: { type: String },
  title: { type: String, required: true },
  category: { type: String },
  currency: { type: String },
  amount: { type: Number, required: true },
  date: { type: Date },
  description: { type: String },
  label: { type: String },

  rank: { type: Number },
  version: { type: Number },
  locked: { type: Boolean },
  personal: { type: Boolean }
});

module.exports = mongoose.model('Expense001', expenseSchema);
