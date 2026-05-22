// Fallback queue that doesn't use Redis or BullMQ to avoid crashes
// when the user doesn't have Redis installed locally.

const addAnalysisJob = async (jobData) => {
  console.log("[Queue] Bypassing Redis and running AI analysis locally...");
  const AiWorker = require("../workers/aiWorker");
  if (AiWorker && typeof AiWorker.processJob === "function") {
    // Run asynchronously without blocking the request
    AiWorker.processJob({ data: jobData }).catch(err => {
      console.error("[Queue] Local processing error:", err);
    });
  }
};

module.exports = {
  analysisQueue: null,
  addAnalysisJob,
  connection: null,
};
