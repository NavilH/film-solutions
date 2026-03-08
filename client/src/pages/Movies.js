import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import toast from "react-hot-toast";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/stats/current-trending`)
      .then((response) => {
        setMovies(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setLoading(false);
      });
  }, []);

  const addToLiked = async (movie) => {
    const movieId = movie.movie_id ?? movie.id;

    if (addedIds.has(movieId)) return;

    try {
      setLoadingId(movieId);

      const response = await axios.post(`${API_BASE}/api/users/liked`, {
        movie_id: movieId,
        title: movie.title,
        poster_url: movie.poster_url,
      });

      if (response.data.message === "Already liked") {
        toast("Already liked", { icon: "ℹ️" });
      } else {
        setAddedIds((prev) => new Set(prev).add(movieId));
        toast.success("Added to Liked");
      }
    } catch (error) {
      console.error("Error adding to Liked:", error);
      toast.error("Could not add to Liked");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h2>🔥 Trending Movies Live</h2>
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => {
            const movieId = movie.movie_id ?? movie.id;

            return (
              <div key={movieId} className="movie-card">
                <img src={movie.poster_url} alt={movie.title} loading="lazy" />
                <h3>{movie.title}</h3>
                <button
                  onClick={() => addToLiked(movie)}
                  disabled={loadingId === movieId || addedIds.has(movieId)}
                >
                  {loadingId === movieId
                    ? "Liking..."
                    : addedIds.has(movieId)
                    ? "❤️Liked"
                    : "🤍Like"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Movies;