const mongoose = require("mongoose");

const PullRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  repository: {
    type: mongoose.Schema.ObjectId,
    ref: "Repository",
    required: true,
  },
  githubPrId: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  author: {
    type: String, // GitHub username
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  commits: {
    type: Number,
    default: 0,
  },
  changedFiles: {
    type: Number,
    default: 0,
  },
  additions: {
    type: Number,
    default: 0,
  },
  deletions: {
    type: Number,
    default: 0,
  },
  riskScore: {
    type: Number,
    default: 0, // 0-100, calculated by AI
  },
  analysisStatus: {
    type: String,
    enum: ["pending", "analyzing", "completed", "failed"],
    default: "pending",
  },
  state: {
    type: String,
    enum: ["open", "closed", "merged"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PullRequest", PullRequestSchema);
