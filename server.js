console.log("Starting Film Solutions backend...");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const movieRoutes = require("./routes/movies");
const userRoutes = require("./routes/users");
const statsRoutes = require("./routes/stats");


console.log("Dependencies loaded...");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/stats", statsRoutes);

console.log("Middleware applied...");

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);

console.log("Routes registered...");

app.get("/", (req, res) => {
  res.send("🎬 Welcome to Film Solutions API! Use /api/movies/trending to get trending movies.");
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  console.log("\n🔍 Registered Routes:");
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(`➡️ ${middleware.route.path}`);
    }
  });
  app.get("/test", (req, res) => {
    res.send("🚀 Server is working!");
  });
  
  
});
