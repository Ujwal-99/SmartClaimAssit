const express = require("express");
const mongoose = require("mongoose");
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
// MongoDB Connection
// ==========================

mongoose.connect("mongodb://127.0.0.1:27017/insuranceDB")
.then(() => {
  console.log("✅ MongoDB Connected");
})
.catch((error) => {
  console.log("❌ MongoDB Connection Error:", error);
});

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