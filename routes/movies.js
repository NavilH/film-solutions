const express = require("express");
const axios = require("axios");
const db = require("../db/db");
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function fetchAndStoreTrendingRun() {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY is missing. Check your .env and server startup.");
  }

  // 1) Fetch trending movies
  const trendingResponse = await axios.get(
    "https://api.themoviedb.org/3/trending/movie/day",
    { params: { api_key: TMDB_API_KEY } }
  );

  // 2) Fetch genre list (id -> name)
  const genreResponse = await axios.get(
    "https://api.themoviedb.org/3/genre/movie/list",
    { params: { api_key: TMDB_API_KEY } }
  );

  const genreMap = {};
  (genreResponse.data.genres || []).forEach((g) => {
    genreMap[g.id] = g.name;
  });

  const movies = trendingResponse.data.results || [];

  // Return a promise so caller can await DB writes
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`INSERT INTO trending_runs DEFAULT VALUES`, function (err) {
        if (err) return reject(err);

        const runId = this.lastID;

        const movieStmt = db.prepare(`
          INSERT INTO trending_history (run_id, movie_id, title, poster_url, tmdb_rank)
          VALUES (?, ?, ?, ?, ?)
        `);

        const genreStmt = db.prepare(`
          INSERT INTO movie_genres_history (run_id, movie_id, genre)
          VALUES (?, ?, ?)
        `);

        movies.forEach((movie, idx) => {
          movieStmt.run(
            runId,
            movie.id,
            movie.title,
            `https://image.tmdb.org/t/p/w500${movie.poster_path || ""}`,
            idx + 1
          );

          (movie.genre_ids || []).forEach((gid) => {
            const genreName = genreMap[gid] || "Unknown";
            genreStmt.run(runId, movie.id, genreName);
          });
        });

        movieStmt.finalize((movieErr) => {
          if (movieErr) return reject(movieErr);

          genreStmt.finalize((genreErr) => {
            if (genreErr) return reject(genreErr);

            console.log(
              `✅ Trending run ${runId} saved with genres (${movies.length} movies).`
            );

            resolve({ runId, moviesCount: movies.length });
          });
        });
      });
    });
  });
}

router.get("/trending", async (req, res) => {
  try {
    const result = await fetchAndStoreTrendingRun();
    res.json({ message: "Trending fetched and stored", ...result });
  } catch (error) {
    console.error("Error fetching trending movies:", error.message);
    res.status(500).json({ error: "Failed to fetch trending movies" });
  }
});

router.get("/trending/saved", (req, res) => {
  db.get(
    `SELECT id FROM trending_runs ORDER BY fetched_at DESC LIMIT 1`,
    [],
    (err, run) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!run) return res.json([]);

      db.all(
        `SELECT movie_id, title, poster_url, tmdb_rank
         FROM trending_history
         WHERE run_id = ?
         ORDER BY tmdb_rank ASC`,
        [run.id],
        (err2, rows) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json(rows);
        }
      );
    }
  );
});

module.exports = { router, fetchAndStoreTrendingRun };
