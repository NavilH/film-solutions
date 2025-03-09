const express = require("express");
const db = require("../db/db"); // Import database connection
const router = express.Router();

/**
 * POST /api/users
 * Create a new user
 */
router.post("/", (req, res) => {
    const { username } = req.body;

    if (!username) return res.status(400).json({ error: "Username is required" });

    db.run("INSERT INTO users (username) VALUES (?)", [username], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ user_id: this.lastID, username });
    });
});

/**
 * GET /api/users/:user_id
 * Get user details
 */
router.get("/:user_id", (req, res) => {
    const { user_id } = req.params;

    db.get("SELECT * FROM users WHERE id = ?", [user_id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "User not found" });

        res.json(row);
    });
});

/**
 * POST /api/users/:user_id/watchlist
 * Add a movie to the user's watchlist
 */
router.post("/:user_id/watchlist", (req, res) => {
    const { user_id } = req.params;
    const { movie_id, title, poster_url } = req.body;

    if (!movie_id || !title || !poster_url) {
        return res.status(400).json({ error: "All movie details are required" });
    }

    db.run(
        "INSERT INTO watchlist (user_id, movie_id, title, poster_url) VALUES (?, ?, ?, ?)",
        [user_id, movie_id, title, poster_url],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ watchlist_id: this.lastID, user_id, movie_id, title, poster_url });
        }
    );
});

/**
 * GET /api/users/:user_id/watchlist
 * Retrieve a user's watchlist
 */
router.get("/:user_id/watchlist", (req, res) => {
    const { user_id } = req.params;

    db.all("SELECT * FROM watchlist WHERE user_id = ?", [user_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(rows);
    });
});

/**
 * DELETE /api/users/:user_id/watchlist/:watchlist_id
 * Remove a movie from the user's watchlist
 */
router.delete("/:user_id/watchlist/:watchlist_id", (req, res) => {
    const { watchlist_id } = req.params;

    db.run("DELETE FROM watchlist WHERE id = ?", [watchlist_id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Movie removed from watchlist" });
    });
});

module.exports = router;
