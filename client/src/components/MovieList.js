import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const API_BASE = (process.env.REACT_APP_URL || "http://localhost:5001").replace(/\/$/,"");
const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/api/stats/current-trending`)
            .then(response => {
                setMovies(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching movies:", error);
                setLoading(false);
            });
    }, []);

const [loadingId, setLoadingId] = useState(null);
const [addedIds, setAddedIds] = useState(new Set());

const addToWatchlist = async (movie) => {
  const movieId = movie.movie_id ?? movie.id;

  if (addedIds.has(movieId)) return;

  try {
    setLoadingId(movieId);

    const response = await axios.post(
      `http://localhost:5001/api/users/1/watchlist`,
      {
        movie_id: movieId,
        title: movie.title,
        poster_url: movie.poster_url
      }
    );

    if (response.data.message === "Already in watchlist") {
      toast("Already in watchlist", { icon: "ℹ️" });
    } else {
      setAddedIds(prev => new Set(prev).add(movieId));
      toast.success("Added to watchlist");
    }

  } catch (error) {
    console.error("Error adding to watchlist:", error);
    toast.error("Could not add to watchlist");
  } finally {
    setLoadingId(null);
  }
};


    return (
        <div>
            <h2>🔥 Trending Movies</h2>
            {loading ? <p>Loading movies...</p> : (
                <div className="movie-grid">
                    {movies.map(movie => (
                        <div key={movie.movie_id ?? movie.id} className="movie-card">
                            <img src={movie.poster_url} alt={movie.title} loading="lazy" />
                            <h3>{movie.title}</h3>
                            <button
  onClick={() => addToWatchlist(movie)}
  disabled={loadingId === (movie.movie_id ?? movie.id) || addedIds.has(movie.movie_id ?? movie.id)}
>
  {loadingId === (movie.movie_id ?? movie.id)
    ? "Adding..."
    : addedIds.has(movie.movie_id ?? movie.id)
    ? "Added ✓"
    : "Add to Watchlist"}
</button>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieList;
