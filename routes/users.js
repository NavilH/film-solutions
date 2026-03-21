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


const TMDB_GENRE_IDS = {
  "Action": 28, "Adventure": 12, "Animation": 16, "Comedy": 35,
  "Crime": 80, "Documentary": 99, "Drama": 18, "Family": 10751,
  "Fantasy": 14, "History": 36, "Horror": 27, "Music": 10402,
  "Mystery": 9648, "Romance": 10749, "Science Fiction": 878,
  "Thriller": 53, "War": 10752, "Western": 37,
};

router.get("/:user_id/recommendations", async (req, res) => {
  const { user_id } = req.params;

  db.all("SELECT movie_id FROM liked WHERE user_id = ?", [user_id], async (err, likedRows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (likedRows.length === 0) return res.json([]);

    const likedIds = likedRows.map(r => r.movie_id);
    const placeholders = likedIds.map(() => "?").join(",");
    const TMDB_API_KEY = process.env.TMDB_API_KEY;

    db.all(
      `SELECT genre, COUNT(*) as count FROM movie_genres_history
       WHERE movie_id IN (${placeholders})
       GROUP BY genre ORDER BY count DESC LIMIT 3`,
      likedIds,
      async (err2, genreRows) => {
        if (err2) return res.status(500).json({ error: err2.message });

        try {
          let results;

          if (genreRows.length > 0) {
            const genreIds = genreRows
              .map(g => TMDB_GENRE_IDS[g.genre])
              .filter(Boolean)
              .join(",");

            const response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
              params: {
                api_key: TMDB_API_KEY,
                with_genres: genreIds,
                sort_by: "vote_average.desc",
                "vote_count.gte": 100,
                page: 1,
              },
            });
            results = response.data.results;
          } else {
            // Fallback: /similar for each liked movie
            const similarResults = await Promise.all(
              likedRows.map(row =>
                axios.get(`https://api.themoviedb.org/3/movie/${row.movie_id}/similar`, {
                  params: { api_key: TMDB_API_KEY },
                })
              )
            );
            results = similarResults.flatMap(r => r.data.results.slice(0, 2));
          }

          // Filter out already-liked movies and deduplicate
          const likedSet = new Set(likedIds);
          const seen = new Set();
          const recommendations = results.filter(movie => {
            if (likedSet.has(movie.id) || seen.has(movie.id)) return false;
            seen.add(movie.id);
            return true;
          });

          res.json(recommendations);
        } catch (error) {
          console.error("TMDB recommendation fetch failed:", error.message);
          res.status(500).json({ error: "Failed to fetch recommendations" });
        }
      }
    );
  });
});


module.exports = router;
