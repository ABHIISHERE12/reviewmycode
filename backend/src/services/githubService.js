const axios = require("axios");
const ErrorResponse = require("../utils/ErrorResponse");

class GithubService {
  constructor(accessToken) {
    if (!accessToken) {
      throw new ErrorResponse("GitHub access token is required", 401);
    }
    this.api = axios.create({
      baseURL: "https://api.github.com",
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
  }

  async getUserRepositories() {
    try {
      // Fetch user's repos (including private ones if scope allows)
      const response = await this.api.get("/user/repos?sort=updated&per_page=100");
      return response.data;
    } catch (error) {
      throw new ErrorResponse("Failed to fetch repositories from GitHub", 500);
    }
  }

  async getRepositoryPullRequests(owner, repo) {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/pulls?state=all&per_page=50`);
      return response.data;
    } catch (error) {
      throw new ErrorResponse(`Failed to fetch PRs for ${owner}/${repo}`, 500);
    }
  }

  async getPullRequestDiff(owner, repo, pullNumber) {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/pulls/${pullNumber}`, {
        headers: {
          Accept: "application/vnd.github.v3.diff",
        },
      });
      return response.data; // Raw diff string
    } catch (error) {
      throw new ErrorResponse("Failed to fetch PR diff", 500);
    }
  }
}

module.exports = GithubService;
