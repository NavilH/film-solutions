const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");
require("dotenv").config();

const db = new sqlite3.Database("./db/database.sqlite");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

db.all("SELECT DISTINCT movie_id FROM trending_movies", async (err, rows) => {
  if (err) {
    console.error("❌ DB error:", err.message);
    return;
  }

  for (const { movie_id } of rows) {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}`, {
        params: { api_key: TMDB_API_KEY }
      });

      const genres = response.data.genres || [];

      for (const genre of genres) {
        db.run("INSERT INTO movie_genres (movie_id, genre) VALUES (?, ?)", [movie_id, genre.name]);
      }

      console.log(`✅ Genres saved for movie ${movie_id}`);
    } catch (error) {
      console.error(`⚠️ TMDB error for movie ${movie_id}:`, error.message);
    }
  }

  db.close(() => console.log("✅ Done inserting genres!"));
});
