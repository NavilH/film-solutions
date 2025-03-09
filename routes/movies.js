require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/**
 * GET /api/movies/trending
 * Fetch trending movies from TMDB
 */
router.get("/trending", async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/day`, {
            params: { api_key: TMDB_API_KEY },
        });
        res.json(response.data.results);
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        res.status(500).json({ error: "Unable to fetch trending movies" });
    }
});

/**
 * GET /api/movies/search
 * Search movies by title
 */
router.get("/search", async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query parameter is required" });

    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: { api_key: TMDB_API_KEY, query },
        });
        res.json(response.data.results);
    } catch (error) {
        console.error("Error searching movies:", error);
        res.status(500).json({ error: "Unable to search movies" });
    }
});

/**
 * GET /api/movies/:id
 * Fetch details for a specific movie
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
            params: { api_key: TMDB_API_KEY },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching movie details:", error);
        res.status(500).json({ error: "Unable to fetch movie details" });
    }
});

module.exports = router;
