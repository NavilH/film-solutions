const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const db = require("../db/db");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: "Too many login attempts. Please try again in 15 minutes." },
});

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is not set");

/**
 * POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Username and password are required" });

  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters" });

  try {
    const hashed = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashed],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE"))
            return res.status(409).json({ error: "Username already taken" });
          return res.status(500).json({ error: err.message });
        }

        const token = jwt.sign(
          { userId: this.lastID, username },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.status(201).json({ token, userId: this.lastID, username });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/auth/login
 */
router.post("/login", loginLimiter, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Username and password are required" });

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: "Invalid username or password" });

    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ error: "Invalid username or password" });

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ token, userId: user.id, username: user.username });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

module.exports = router;
