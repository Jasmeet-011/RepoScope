const mongoose = require("mongoose");

const repoHistorySchema = new mongoose.Schema({
  url: { type: String, required: true },
  stats: {
    stars: { type: Number, required: true },
    forks: { type: Number, required: true },
    languages: { type: Object, required: true },
    contributors: { type: [String], required: true }, // Array of strings
  },
  suggestions: { type: [String], required: true }, // Array of strings
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RepoHistory", repoHistorySchema);
