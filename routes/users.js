const express = require("express");
const axios = require("axios");
const db = require("../db/db"); // Import database connection
const router = express.Router();
const authMiddleware = require("../middleware/auth");

/**
 * POST /api/users/:user_id/liked
 * Add a movie to the user's liked
 */
router.post("/:user_id/liked", authMiddleware, (req, res) => {
  const userId = Number(req.params.user_id);
  const { movie_id, title, poster_url } = req.body;

  if (!movie_id || !title || !poster_url) {
    return res.status(400).json({ error: "All movie details are required" });
  }

  db.run(
    `INSERT OR IGNORE INTO liked (user_id, movie_id, title, poster_url)
     VALUES (?, ?, ?, ?)`,
    [userId, movie_id, title, poster_url],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (this.changes === 0) {
        return res.status(200).json({ message: "Already liked" });
      }

      return res.status(201).json({ message: "Liked" });
    }
  );
});


/**
 * GET /api/users/:user_id/liked
 * Retrieve a user's liked
 */
router.get("/:user_id/liked", authMiddleware, (req, res) => {
    const { user_id } = req.params;

    db.all("SELECT * FROM liked WHERE user_id = ?", [user_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(rows);
    });
});


router.get("/:user_id/recommendations", async (req, res) => {
  const { user_id } = req.params;

  db.all("SELECT movie_id FROM liked WHERE user_id = ?", [user_id], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.json([]);

    const TMDB_API_KEY = process.env.TMDB_API_KEY;

    try {
      const results = await Promise.all(
        rows.map(row => axios.get(`https://api.themoviedb.org/3/movie/${row.movie_id}/similar`, {
          params: { api_key: TMDB_API_KEY }
        }))
      );

      const recommendedMovies = results.flatMap(r => r.data.results.slice(0, 2));

      const seen = new Set();
      const uniqueRecs = recommendedMovies.filter(movie => {
        if (seen.has(movie.id)) return false;
        seen.add(movie.id);
        return true;
      });

      res.json(uniqueRecs);
    } catch (error) {
      console.error("TMDB recommendation fetch failed:", error.message);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });
});


module.exports = router;
