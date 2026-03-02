const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
<<<<<<< HEAD

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/api/admin", adminRoutes);
=======
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
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
>>>>>>> b316133 (Connect backend auth and update frontend integration)
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;