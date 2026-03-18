import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

const Liked = () => {
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    api
      .get(`/api/users/${user.userId}/liked`)
      .then((response) => {
        setLiked(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Liked:", error);
        setLoading(false);
      });
  }, [user]);

  return (
    <div>
      <h2>❤️ Liked</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="movie-grid">
          {liked.length === 0 ? (
            <p>Liked is empty. Like some movies!</p>
          ) : (
            liked.map((movie) => (
              <div key={movie.movie_id ?? movie.id} className="movie-card">
                <img src={movie.poster_url} alt={movie.title} />
                <h3>{movie.title}</h3>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Liked;
