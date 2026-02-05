const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/trending-count", (req, res) => {
  const query = `
    SELECT title, COUNT(*) as appearances
    FROM trending_movies
    GROUP BY movie_id, title
    ORDER BY appearances DESC
    LIMIT 10
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
router.get("/test", (req, res) => {
    res.send("Stats route works!");
  });
  router.get("/weekly-trending", (req, res) => {
    const query = `
      SELECT strftime('%Y-%W', timestamp) AS week, COUNT(*) AS count
      FROM trending_movies
      GROUP BY week
      ORDER BY week ASC
    `;
  
    db.all(query, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });
  router.get("/genre-distribution", (req, res) => {
    const query = `
      SELECT genre, COUNT(*) as count
      FROM movie_genres
      GROUP BY genre
      ORDER BY count DESC
      LIMIT 10
    `;
  
    db.all(query, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });
  router.get("/debug-genres", (req, res) => {
    db.all("SELECT * FROM movie_genres LIMIT 5", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });
  
  
  
console.log("✅ stats.js route loaded");
module.exports = router;