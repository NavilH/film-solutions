import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import toast from "react-hot-toast";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [likedMap, setLikedMap] = useState({}); // movieId -> liked row id
  const { user } = useAuth();

  useEffect(() => {
    api
      .get("/api/stats/current-trending")
      .then((response) => {
        setMovies(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user) return;
    api
      .get(`/api/users/${user.userId}/liked`)
      .then((response) => {
        const map = {};
        response.data.forEach((m) => { map[m.movie_id] = m.id; });
        setLikedMap(map);
      })
      .catch((error) => console.error("Error fetching liked:", error));
  }, [user]);

  const toggleLike = async (movie) => {
    if (!user) {
      toast.error("Sign in to like movies");
      return;
    }

    const movieId = movie.movie_id ?? movie.id;
    setLoadingId(movieId);

    try {
      if (likedMap[movieId]) {
        await api.delete(`/api/users/${user.userId}/liked/${likedMap[movieId]}`);
        setLikedMap((prev) => { const next = { ...prev }; delete next[movieId]; return next; });
        toast("Removed from Liked", { icon: "💔" });
      } else {
        const response = await api.post(`/api/users/${user.userId}/liked`, {
          movie_id: movieId,
          title: movie.title,
          poster_url: movie.poster_url,
        });
        if (response.data.message === "Already liked") {
          toast("Already liked", { icon: "ℹ️" });
        } else {
          setLikedMap((prev) => ({ ...prev, [movieId]: response.data.id }));
          toast.success("Added to Liked");
        }
      }
    } catch (error) {
      console.error("Error toggling liked:", error);
      toast.error("Something went wrong");
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
            const isLiked = !!likedMap[movieId];

            return (
              <div key={movieId} className="movie-card">
                <img src={movie.poster_url} alt={movie.title} loading="lazy" />
                <h3>{movie.title}</h3>
                <button
                  onClick={() => toggleLike(movie)}
                  disabled={loadingId === movieId}
                >
                  {loadingId === movieId
                    ? "..."
                    : isLiked
                    ? "❤️ Liked"
                    : "🤍 Like"}
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
