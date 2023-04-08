const express = require("express");
const router = express.Router();
const Show = require("../models/MovieShow");

//* Retrieving all movies and shows
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 15, type } = req.query;
    const age = req.user && req.user.age;

    const validTypes = ["Movie", "TV Show"];

    if (type && !validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type parameter" });
    }

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    if (
      isNaN(parsedPage) ||
      isNaN(parsedLimit) ||
      parsedPage < 1 ||
      parsedLimit < 1
    ) {
      return res
        .status(400)
        .json({ message: "Invalid page or limit parameter" });
    }

    const startIndex = (parsedPage - 1) * parsedLimit;
    const endIndex = parsedPage * parsedLimit;

    const query = type ? { type } : {};

    if (age < 18) {
      query.rated = { $ne: "R" };
    }

    const movieShows = await Show.find(query)
      .skip(startIndex)
      .limit(parsedLimit)
      .exec();

    const totalCount = await Show.countDocuments(query);

    res.status(200).json({
      totalCount,
      results: movieShows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//* Searching for movies or TV shows
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q; // Get search query from URL parameter
    const regex = new RegExp(query, "i"); // Create case-insensitive regex pattern for query

    const results = await Show.find({ title: regex }).exec(); // Find all shows that match the regex pattern

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//* Retrieve a single movie or show by id
router.get("/:id", async (req, res) => {
  try {
    const movieShow = await Show.findById(req.params.id);
    if (!movieShow) {
      return res.status(404).json({ message: "Movie or show not found" });
    }
    res.status(200).json(movieShow);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
