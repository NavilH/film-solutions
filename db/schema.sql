CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS watchlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    movie_id INTEGER,
    title TEXT,
    poster_url TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
CREATE TABLE IF NOT EXISTS trending_movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER,
    title TEXT,
    poster_url TEXT,
    fetched_at TEXT
);

CREATE TABLE IF NOT EXISTS movie_genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER,
    genre TEXT,
    fetched_at TEXT
);
