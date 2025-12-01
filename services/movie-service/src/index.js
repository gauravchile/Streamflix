import express from "express";
import connectDB from "./db.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config(); // ✅ Load .env file

const app = express();
app.use(express.json());

// Movie schema (for local DB storage, optional)
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
  res.send("🎬 Movie Service Running with TMDB API integration");
});

// ✅ TMDB API Integration
app.get("/movies/popular", async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "TMDB API key missing" });

    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error("Error fetching TMDB movies:", err);
    res.status(500).json({ error: "Error fetching movies from TMDB" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎥 Movie Service running on port ${PORT}`);
});
