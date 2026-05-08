const express = require("express");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/authRoutes");
const historyRoutes = require("./routes/historyRoutes");

const app = express();

// ==========================
// Middleware
// ==========================

app.use(cors());
app.use(express.json());

// ==========================
// Routes
// ==========================

app.use("/api", authRoutes);
app.use("/api", historyRoutes);

// ==========================
// Test Route
// ==========================

app.get("/", (req, res) => {
  res.send("🚀 Insurance Backend API Running");
});

// ==========================
// Start Server
// ==========================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
