const express = require("express");
const router = express.Router();
const db = require("../db/db");
const axios = require("axios");

router.get("/:user_id/recommendations", async (req, res) => {
  const { user_id } = req.params;
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  db.all("SELECT movie_id FROM watchlist WHERE user_id = ?", [user_id], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.json([]);

    const genreCounts = {};
    const castCounts = {};
    const watchlistIds = rows.map(row => row.movie_id);

    // Step 1: Collect genres and cast members
    for (const { movie_id } of rows) {
      try {
        const detailRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}`, {
          params: { api_key: TMDB_API_KEY }
        });

        const castRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/credits`, {
          params: { api_key: TMDB_API_KEY }
        });

        // Count genres
        detailRes.data.genres.forEach(g => {
          genreCounts[g.id] = (genreCounts[g.id] || 0) + 1;
        });

        // Count top 3 cast members
        castRes.data.cast.slice(0, 3).forEach(actor => {
          castCounts[actor.id] = (castCounts[actor.id] || 0) + 1;
        });

      } catch (error) {
        console.error(`Error fetching movie ${movie_id}:`, error.message);
      }
    }

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id)
      .join(',');
    const topCast = Object.entries(castCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id)
      .join(',');

    // Step 2: Discover movies based on top genres and cast
    try {
      const discoverRes = await axios.get("https://api.themoviedb.org/3/discover/movie", {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: topGenres,
          with_cast: topCast,
          sort_by: "popularity.desc"
        }
      });

      const candidates = discoverRes.data.results;

      // Step 3: Score and filter
      const scored = candidates
        .filter(movie => !watchlistIds.includes(movie.id)) // Exclude already watched
        .map(movie => {
          const genreScore = movie.genre_ids.some(id => genreCounts[id]) ? 1 : 0;
          const castMatch = movie.id in castCounts ? 1 : 0;
          const score = genreScore + castMatch + (genreScore && castMatch ? 1 : 0); // bonus if both

          return { ...movie, score };
        });

      // Step 4: Sort by score and return top 10
      const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 10);
      res.json(sorted);

    } catch (error) {
      console.error("Error fetching recommendations:", error.message);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });
});
