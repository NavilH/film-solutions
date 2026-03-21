import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

const Recommendations = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    api
      .get(`/api/users/${user.userId}/recommendations`)
      .then((response) => {
        setMovies(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error);
        setError("Could not load recommendations. Please try again.");
        setLoading(false);
      });
  }, [user]);

  return (
    <div>
      <h2>🎯 Recommended for You</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="movie-grid">
          {movies.length === 0 ? (
            <p>No recommendations yet. Like some movies!</p>
          ) : (
            movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <h3>{movie.title}</h3>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
