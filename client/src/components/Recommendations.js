import React, { useEffect, useState } from "react";
import axios from "axios";
const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5001").replace(/\/$/, "");

const Recommendations = ({ userId = 1 }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/users/${userId}/recommendations`)
      .then(response => setMovies(response.data))
      .catch(error => console.error("Error fetching recommendations:", error));
  }, [userId]);

  return (
    <div>
      <h2>🎯 Recommended for You</h2>
      <div className="movie-grid">
        {movies.length === 0 ? (
          <p>No recommendations yet. Add movies to your watchlist!</p>
        ) : (
          movies.map(movie => (
            <div key={movie.id} className="movie-card">
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <h3>{movie.title}</h3>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Recommendations;
