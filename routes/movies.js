const express = require("express");
const axios = require("axios");
const db = require("../db/db"); // Import SQLite database connection
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY; // Get API key from .env file

// Fetch and store trending movies
router.get("/trending", async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/day`, {
            params: { api_key: TMDB_API_KEY }
        });

        const movies = response.data.results;

        // Save trending movies to SQLite
        db.serialize(() => {
            movies.forEach(movie => {
                db.run(
                    `INSERT INTO trending_movies (movie_id, title, poster_url) 
                    VALUES (?, ?, ?)`,
                    [movie.id, movie.title, `https://image.tmdb.org/t/p/w500${movie.poster_path}`],
                    (err) => {
                        if (err) {
                            console.error("Error saving movie:", err.message);
                        }
                    }
                );
            });
        });

        res.json(movies); // Return trending movies to the frontend
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        res.status(500).json({ error: "Failed to fetch trending movies" });
    }
});

// Fetch saved trending movies from SQLite
router.get("/trending/saved", (req, res) => {
    db.all("SELECT * FROM trending_movies ORDER BY timestamp DESC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

module.exports = router;
