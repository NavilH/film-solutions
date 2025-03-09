const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "database.sqlite");
console.log("🔍 Using database file:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection error:", err);
    } else {
        console.log("✅ Connected to SQLite database.");
    }
});

// Ensure tables exist on startup
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL
        )
    `);
    
    db.run(`
        CREATE TABLE IF NOT EXISTS watchlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            movie_id INTEGER,
            title TEXT,
            poster_url TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
});

module.exports = db;
