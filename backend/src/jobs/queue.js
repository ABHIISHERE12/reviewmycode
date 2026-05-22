const { Queue } = require("bullmq");
const IORedis = require("ioredis");

let connection = null;
let analysisQueue = null;

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Only connect to Redis if it's available — makes local dev work without Docker
try {
  connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
    lazyConnect: true, // Don't crash on startup if Redis isn't available
    enableOfflineQueue: false,
    retryStrategy: (times) => {
      if (times > 3) {
        console.warn("[Queue] Redis unavailable. Background AI analysis disabled.");
        return null; // Stop retrying
      }
      return Math.min(times * 200, 2000);
    },
  });

  connection.on("error", (err) => {
    console.warn("[Queue] Redis connection error:", err.message);
  });

  analysisQueue = new Queue("ai-analysis", { connection });
  console.log("[Queue] BullMQ queue initialized.");
} catch (err) {
  console.warn("[Queue] Failed to initialize Redis queue:", err.message);
}

const addAnalysisJob = async (jobData) => {
  if (!analysisQueue) {
    console.warn("[Queue] Queue not available — AI analysis job skipped.");
    return;
  }

  await analysisQueue.add("analyze-pr", jobData, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  });
};

module.exports = {
  analysisQueue,
  addAnalysisJob,
  connection,
};
