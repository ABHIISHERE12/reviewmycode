require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { connectDB } = require("./config/db");

const errorHandler = require("./middleware/errorHandler");

// ROUTES
const authRoutes = require("./routes/auth");
const githubRoutes = require("./routes/github");
const repoRoutes = require("./routes/repos");
const prRoutes = require("./routes/prs");
const webhookRoutes = require("./routes/webhooks");
const analyticsRoutes = require("./routes/analytics");
const reviewRoutes = require("./routes/reviews");

// Connect Database
connectDB();

const app = express();

// =========================
// SECURITY MIDDLEWARE
// =========================

app.use(helmet());

// =========================
// CORS CONFIG
// =========================

const allowedOrigins = [
  process.env.FRONTEND_URL ||
  "http://localhost:5173",

  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman/curl requests
      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(
          new Error("Not allowed by CORS")
        );
      }
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// Handle preflight requests
app.options("*", cors());

// =========================
// BODY PARSER
// =========================

app.use(express.json());

// =========================
// API ROUTES
// =========================

app.use("/api/auth", authRoutes);

app.use("/api/github", githubRoutes);

app.use("/api/repos", repoRoutes);

// IMPORTANT:
// THIS FIXES YOUR 404 ERROR
app.use("/api/prs", prRoutes);

app.use("/api/webhooks", webhookRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/reviews", reviewRoutes);

// =========================
// HEALTH CHECK
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "ReviewAI API is running",
    status: "ok",
  });
});

// =========================
// ERROR HANDLER
// =========================

app.use(errorHandler);

// =========================
// BACKGROUND WORKERS
// =========================

require("./workers/aiWorker");

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV ||
    "development"
    } mode on port ${PORT}`
  );
});