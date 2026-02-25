console.log("Starting Film Solutions backend...");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const moviesModule = require("./routes/movies");
const userRoutes = require("./routes/users");
const statsRoutes = require("./routes/stats");


console.log("Dependencies loaded...");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(",").map(s => s.trim()) || ["http://localhost:3000"],
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/stats", statsRoutes);

console.log("Middleware applied...");

// Routes
app.use("/api/movies", moviesModule.router);
app.use("/api/users", userRoutes);

console.log("Routes registered...");

app.get("/", (req, res) => {
  res.send("🎬 Welcome to Film Solutions API! Use /api/movies/trending to get trending movies.");
});


// Start the server
app.get("/test", (req, res) => res.send("🚀 Server is working!"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

