import React, { useEffect, useState } from "react";
import axios from "axios";

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const userId = 1; // Replace with dynamic user ID if needed

    useEffect(() => {
        axios.get(`http://localhost:5000/api/users/${userId}/watchlist`)
            .then(response => setWatchlist(response.data))
            .catch(error => console.error("Error fetching watchlist:", error));
    }, []);

    return (
        <div>
            <h2>🎥 Your Watchlist</h2>
            <div className="movie-grid">
                {watchlist.length === 0 ? (
                    <p>Your watchlist is empty. Add some movies!</p>
                ) : (
                    watchlist.map(movie => (
                        <div key={movie.movie_id} className="movie-card">
                            <img src={movie.poster_url} alt={movie.title} />
                            <h3>{movie.title}</h3>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Watchlist;
