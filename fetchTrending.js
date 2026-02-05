// fetchTrending.js
require("dotenv").config();
const axios = require("axios");
const db = require("./db/db");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function fetchAndStoreTrending() {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/day`, {
      params: { api_key: TMDB_API_KEY }
    });

    const movies = response.data.results;

    db.serialize(() => {
      movies.forEach(movie => {
        db.run(
          `INSERT INTO trending_movies (movie_id, title, poster_url) 
           VALUES (?, ?, ?)`,
          [movie.id, movie.title, `https://image.tmdb.org/t/p/w500${movie.poster_path}`],
          err => {
            if (err) {
              console.error("Insert error:", err.message);
            }
          }
        );
      });
    });

    console.log("Trending movies saved.");
  } catch (error) {
    console.error("Failed to fetch trending movies:", error.message);
  }
}

fetchAndStoreTrending();
