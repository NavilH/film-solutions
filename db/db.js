const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "..", "db", "database.sqlite");
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
            UNIQUE(user_id, movie_id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // One row per trending refresh
db.run(`
    CREATE TABLE IF NOT EXISTS trending_runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
`);

// Historical trending movies per run
db.run(`
    CREATE TABLE IF NOT EXISTS trending_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id INTEGER NOT NULL,
        movie_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        poster_url TEXT,
        tmdb_rank INTEGER,
        FOREIGN KEY (run_id) REFERENCES trending_runs(id)
    )
`);

db.run(`
    CREATE INDEX IF NOT EXISTS idx_trending_history_run_id 
    ON trending_history(run_id)
`);

db.run(`
    CREATE INDEX IF NOT EXISTS idx_trending_history_movie_id 
    ON trending_history(movie_id)
`);

// Historical genres per run
db.run(`
  CREATE TABLE IF NOT EXISTS movie_genres_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    genre TEXT NOT NULL,
    FOREIGN KEY (run_id) REFERENCES trending_runs(id)
  )
`);

db.run(`
  CREATE INDEX IF NOT EXISTS idx_movie_genres_history_run_id
  ON movie_genres_history(run_id)
`);


});

module.exports = db;
