require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { connectDB } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Connect to Database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());

// CORS config
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Mount Routers (will be implemented in subsequent steps)
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/github", require("./routes/github"));
// app.use("/api/repos", require("./routes/repos"));
// app.use("/api/prs", require("./routes/prs"));
// app.use("/api/webhooks", require("./routes/webhooks"));
// app.use("/api/analytics", require("./routes/analytics"));

app.get("/", (req, res) => {
  res.json({ message: "ReviewAI API is running" });
});

// Centralized Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
