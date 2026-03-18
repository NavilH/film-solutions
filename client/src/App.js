import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import MovieList from "./pages/Movies";
import Liked from "./pages/Liked";
import Recommendations from "./pages/Recommendations";
import Stats from "./pages/Stats";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./styles.css";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const Nav = () => {
  const { user, logout } = useAuth();
  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <header>
      <nav className="nav">
        <div className="brand">Film Solutions</div>

        <div className="nav-links">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/movies" className={linkClass}>Movies</NavLink>

          {user && (
            <>
              <NavLink to="/liked" className={linkClass}>Liked</NavLink>
              <NavLink to="/recommendations" className={linkClass}>Recommendations</NavLink>
            </>
          )}

          <NavLink to="/stats" className={linkClass}>Stats</NavLink>
        </div>

        <div className="nav-auth">
          {user ? (
            <>
              <span className="nav-username">👤 {user.username}</span>
              <button className="nav-logout" onClick={logout}>Sign Out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Sign In</NavLink>
              <NavLink to="/register" className="nav-link nav-register">Register</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111827",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />

        <Nav />

        <div className="page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/liked" element={
              <ProtectedRoute><Liked /></ProtectedRoute>
            } />
            <Route path="/recommendations" element={
              <ProtectedRoute><Recommendations /></ProtectedRoute>
            } />

            <Route path="*" element={<h2>404 — Page Not Found</h2>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
