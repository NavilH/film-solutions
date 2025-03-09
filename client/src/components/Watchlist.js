import React, { useEffect, useState } from "react";
import axios from "axios";

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:5000/api/users/1/watchlist")
            .then(response => {
                setWatchlist(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching watchlist:", error);
                setLoading(false);
            });
    }, []);

    const removeFromWatchlist = (id) => {
        axios.delete(`http://localhost:5000/api/users/1/watchlist/${id}`)
            .then(() => {
                setWatchlist(watchlist.filter(movie => movie.id !== id));
            }).catch(error => {
                console.error("Error removing from watchlist:", error);
            });
    };

    return (
        <div>
            <h2>🎥 Your Watchlist</h2>
            {loading ? <p>Loading watchlist...</p> : (
                <div className="movie-grid">
                    {watchlist.length === 0 ? (
                        <p>Your watchlist is empty. Add some movies!</p>
                    ) : (
                        watchlist.map(movie => (
                            <div key={movie.id} className="movie-card">
                                <img src={movie.poster_url} alt={movie.title} />
                                <h3>{movie.title}</h3>
                                <button onClick={() => removeFromWatchlist(movie.id)}>❌ Remove</button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Watchlist;
