const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const analysisQueue = new Queue("ai-analysis", { connection });

const addAnalysisJob = async (jobData) => {
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
