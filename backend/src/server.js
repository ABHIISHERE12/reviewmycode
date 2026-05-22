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

// CORS — must be before any route definitions
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle pre-flight across all routes
app.options("*", cors());

// Body parser
app.use(express.json());

// Mount Routers
app.use("/api/auth", require("./routes/auth"));
app.use("/api/github", require("./routes/github"));
app.use("/api/repos", require("./routes/repos"));
app.use("/api/prs", require("./routes/prs"));
app.use("/api/webhooks", require("./routes/webhooks"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/reviews", require("./routes/reviews"));

app.get("/", (req, res) => {
  res.json({ message: "ReviewAI API is running", status: "ok" });
});

// Centralized Error Handling
app.use(errorHandler);

// Initialize background workers after routes
require("./workers/aiWorker");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
