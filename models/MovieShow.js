const mongoose = require("mongoose");

const movieShowSchema = new mongoose.Schema({
  show_id: {
    type: Number,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["movie", "tvshow"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  director: String,
  cast: String,
  country: String,
  date_added: Date,
  release_year: Number,
  rating: {
    type: String,
    enum: ["TV-MA", "TV-14", "TV-PG", "TV-G", "TV-Y7", "TV-Y"],
  },
  duration: String,
  listed_in: String,
  description: String,
});

module.exports = mongoose.model("Show", movieShowSchema);
