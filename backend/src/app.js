const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const valveRoutes = require("./routes/valve.routes");
const parameterRoutes = require("./routes/parameter.routes");
const app = express();

// Middleware - runs on every request
app.use(helmet());  // Security headers
app.use(cors({
  origin: "http://localhost:3000",  // Allow frontend specifically
  credentials: true  // Allow cookies and auth headers
}));
app.use(morgan("dev"));  // Log requests
app.use(express.json());  // Parse JSON bodies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", valveRoutes);
app.use("/api", parameterRoutes);

module.exports = app;