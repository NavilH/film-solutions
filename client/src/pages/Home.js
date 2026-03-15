import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="badge">Full-Stack Movie Discovery App</span>
          <h1>Film Solutions</h1>
          <p className="hero-text">
            Discover trending movies, save favorites, explore recommendations,
            and view movie insights through a polished full-stack app built with
            React, Node.js, Express, SQLite, and AWS.
          </p>

          <div className="hero-actions">
            <Link to="/movies" className="hero-link primary-link">
              Browse Movies
            </Link>
            <Link to="/stats" className="hero-link secondary-link">
              View Stats
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-mini-card">
            <h3>What this project shows</h3>
            <p>Frontend development, backend APIs, charting, deployment, and cloud hosting.</p>
          </div>

          <div className="hero-mini-card">
            <h3>Live features</h3>
            <p>Trending movies, liked list, recommendations, and visual analytics.</p>
          </div>
        </div>
      </section>

      <section className="home-section">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Trending Movies</h3>
            <p>Browse movie data in a clean, responsive interface.</p>
          </div>

          <div className="feature-card">
            <h3>Liked List</h3>
            <p>Save movies you enjoy and build your own watch preference history.</p>
          </div>

          <div className="feature-card">
            <h3>Recommendations</h3>
            <p>Get suggestions based on shared genre and cast similarities.</p>
          </div>

          <div className="feature-card">
            <h3>Stats Dashboard</h3>
            <p>Visualize trends, genre distribution, and movie activity over time.</p>
          </div>
        </div>
      </section>

      <section className="home-section">
        <h2>Tech Stack</h2>
        <div className="stack-grid">
          <div className="stack-card">
            <h3>Frontend</h3>
            <p>React, React Router, Recharts</p>
          </div>

          <div className="stack-card">
            <h3>Backend</h3>
            <p>Node.js, Express</p>
          </div>

          <div className="stack-card">
            <h3>Database</h3>
            <p>SQLite, Prisma</p>
          </div>

          <div className="stack-card">
            <h3>Deployment</h3>
            <p>AWS EC2, PM2, Route 53, HTTPS</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;