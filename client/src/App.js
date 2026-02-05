import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MovieList from "./components/MovieList";
import Watchlist from "./components/Watchlist";
import Recommendations from "./components/Recommendations";
import Stats from "./components/Stats";
import "./styles.css"; // Import global styles

const App = () => {
    return (
        <Router>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/watchlist">Watchlist</Link>
                <Link to="/recommendations">Recommendations</Link>
                <Link to="/stats">Stats</Link>
            </nav>

            <Routes>
                <Route path="/" element={<MovieList />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/stats" element={<Stats />} />
            </Routes>
        </Router>
    );
};

export default App;
