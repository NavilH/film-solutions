import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import toast from "react-hot-toast";

const Liked = () => {
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
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

  const removeLiked = async (likedId) => {
    setRemovingId(likedId);
    try {
      await api.delete(`/api/users/${user.userId}/liked/${likedId}`);
      setLiked((prev) => prev.filter((m) => m.id !== likedId));
      toast("Removed from Liked", { icon: "💔" });
    } catch (error) {
      console.error("Error removing liked:", error);
      toast.error("Could not remove movie");
    } finally {
      setRemovingId(null);
    }
  };

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
              <div key={movie.id} className="movie-card">
                <img src={movie.poster_url} alt={movie.title} />
                <h3>{movie.title}</h3>
                <button
                  onClick={() => removeLiked(movie.id)}
                  disabled={removingId === movie.id}
                >
                  {removingId === movie.id ? "Removing..." : "💔 Unlike"}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Liked;
