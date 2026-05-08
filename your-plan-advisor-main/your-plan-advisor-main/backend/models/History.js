const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  userId: String,
  feature: String,
  inputData: Object,
  result: Object,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("History", HistorySchema);