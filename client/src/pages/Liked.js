import React, { useEffect, useState } from "react";
import axios from "axios";

const Liked = () => {
    const [liked, setLiked] = useState([]);
    const userId = 1; 

    useEffect(() => {
        axios.get("/api/users/${userId}/liked")
            .then(response => setLiked(response.data))
            .catch(error => console.error("Error fetching Liked:", error));
    }, []);

    return (
        <div>
            <h2>❤️ Liked</h2>
            <div className="movie-grid">
                {liked.length === 0 ? (
                    <p>Liked is empty. Like some movies!</p>
                ) : (
                    liked.map(movie => (
                        <div key={movie.movie_id ?? movie.id} className="movie-card">
                            <img src={movie.poster_url} alt={movie.title} />
                            <h3>{movie.title}</h3>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Liked;
