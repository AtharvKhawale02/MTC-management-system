const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;