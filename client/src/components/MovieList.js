import React, { useEffect, useState } from "react";
import axios from "axios";

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:5000/api/movies/trending")
            .then(response => {
                setMovies(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching movies:", error);
                setLoading(false);
            });
    }, []);

    const addToWatchlist = (movie) => {
        axios.post(`http://localhost:5000/api/users/1/watchlist`, {
            movie_id: movie.id,
            title: movie.title,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        }).then(() => {
            alert(`${movie.title} added to watchlist!`);
        }).catch(error => {
            console.error("Error adding to watchlist:", error);
        });
    };

    return (
        <div>
            <h2>🔥 Trending Movies</h2>
            {loading ? <p>Loading movies...</p> : (
                <div className="movie-grid">
                    {movies.map(movie => (
                        <div key={movie.id} className="movie-card">
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                            <h3>{movie.title}</h3>
                            <button onClick={() => addToWatchlist(movie)}>➕ Add to Watchlist</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieList;
