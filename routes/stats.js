const express = require("express");
const router = express.Router();
const db = require("../db/db");
const { fetchAndStoreTrendingRun } = require("./movies");

// Helper: get latest run id
function getLatestRunId() {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, fetched_at FROM trending_runs ORDER BY fetched_at DESC LIMIT 1`,
      [],
      (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      }
    );
  });
}

router.get("/test", (req, res) => {
  res.send("Stats route works!");
});

// ✅ Current trending list (latest run, ordered by TMDB rank)
router.get("/current-trending", async (req, res) => {
  try {
    let latest = await getLatestRunId();

    // Auto-seed if DB is empty
    if (!latest) {
      await fetchAndStoreTrendingRun();
      latest = await getLatestRunId();
      if (!latest) return res.json([]); // if TMDB failed
    }

    db.all(
      `SELECT movie_id, title, tmdb_rank, poster_url
       FROM trending_history
       WHERE run_id = ?
       ORDER BY tmdb_rank ASC`,
      [latest.id],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ Top 10 most frequently trending movies (last 30 days)
router.get("/trending-count", (req, res) => {
  const query = `
    SELECT h.title, COUNT(*) as appearances
    FROM trending_history h
    JOIN trending_runs r ON r.id = h.run_id
    WHERE r.fetched_at >= datetime('now', '-30 days')
    GROUP BY h.movie_id, h.title
    ORDER BY appearances DESC
    LIMIT 10
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ✅ Weekly count of trending movies recorded (history-based)
router.get("/weekly-trending", (req, res) => {
  const query = `
    SELECT strftime('%Y-%W', r.fetched_at) AS week,
           COUNT(*) AS count
    FROM trending_history h
    JOIN trending_runs r ON r.id = h.run_id
    GROUP BY week
    ORDER BY week ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get("/genre-distribution", (req, res) => {
  db.get(
    `SELECT id FROM trending_runs ORDER BY fetched_at DESC LIMIT 1`,
    [],
    (err, run) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!run) return res.json([]);

      db.all(
        `SELECT genre, COUNT(*) as count
         FROM movie_genres_history
         WHERE run_id = ?
         GROUP BY genre
         ORDER BY count DESC
         LIMIT 10`,
        [run.id],
        (err2, rows) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json(rows);
        }
      );
    }
  );
});

router.get("/debug-genres-history", (req, res) => {
  db.all(
    "SELECT run_id, movie_id, genre FROM movie_genres_history ORDER BY id DESC LIMIT 20",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});



console.log("✅ stats.js route loaded (HISTORY)");
module.exports = router;
