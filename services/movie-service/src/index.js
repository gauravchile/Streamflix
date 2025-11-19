import express from "express";
import connectDB from "./db.js";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

// Movie schema
const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  description: String,
  banner: String
});

const Movie = mongoose.model("Movie", movieSchema);

// Connect DB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Movie Service Running");
});

app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Error fetching movies" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Movie Service running on port 5000");
});
