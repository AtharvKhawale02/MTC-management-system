const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const adminRoutes = require("./routes/admin.routes");
const app = express();
app.use("/api/admin", adminRoutes);
const authRoutes = require("./routes/auth.routes");



app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);

module.exports = app;