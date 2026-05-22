const mongoose = require("mongoose");

const RepositorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String, // GitHub owner login
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  description: String,
  stars: {
    type: Number,
    default: 0,
  },
  forks: {
    type: Number,
    default: 0,
  },
  language: String,
  githubRepoId: {
    type: String,
    required: true,
    unique: true,
  },
  openPRs: {
    type: Number,
    default: 0,
  },
  healthScore: {
    type: Number,
    default: 100, // Starts at 100, drops if AI finds vulnerabilities
  },
  lastAnalyzed: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Repository", RepositorySchema);
