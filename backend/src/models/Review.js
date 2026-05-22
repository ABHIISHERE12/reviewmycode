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
  architectureScore: {
    type: Number,
    default: 0,
  },
  securityScore: {
    type: Number,
    default: 0,
  },
  performanceScore: {
    type: Number,
    default: 0,
  },
  maintainabilityScore: {
    type: Number,
    default: 0,
  },
  strengths: [String],
  improvements: [String],
  findings: [
    {
      issue: String,
      severity: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
      },
      impact: String,
      fix: String,
    },
  ],
  fileReviews: [
    {
      file: String,
      issues: [
        {
          issue: String,
          severity: String,
          suggestion: String,
        }
      ],
      suggestions: [String]
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
