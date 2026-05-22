const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  repository: {
    type: mongoose.Schema.ObjectId,
    ref: "Repository",
    required: true,
  },
  pullRequest: {
    type: mongoose.Schema.ObjectId,
    ref: "PullRequest",
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  findings: [
    {
      file: String,
      line: Number,
      issue: String,
      severity: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
      },
      suggestion: String,
      category: {
        type: String,
        enum: ["security", "performance", "architecture", "maintainability", "bug"],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
