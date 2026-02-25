import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

import MovieList from "./components/MovieList";
import Watchlist from "./components/Watchlist";
import Recommendations from "./components/Recommendations";
import Stats from "./components/Stats";
import { Toaster } from "react-hot-toast";

import "./styles.css";

const App = () => {
  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <Router>
      <Toaster
  position="top-right"
  toastOptions={{
    style: {
      background: "#111827",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.1)"
    }
  }}
/>
      <header>
        <nav className=".nav">
          <div className="brand">Film Solutions</div>

          <div className="nav-links">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>

            <NavLink to="/watchlist" className={linkClass}>
              Watchlist
            </NavLink>

            <NavLink to="/recommendations" className={linkClass}>
              Recommendations
            </NavLink>

            <NavLink to="/stats" className={linkClass}>
              Stats
            </NavLink>
          </div>
        </nav>
      </header>

        <div className="page">
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="*" element={<h2>404 — Page Not Found</h2>} />
        </Routes>
        </div>
    </Router>
  );
};

export default App;
