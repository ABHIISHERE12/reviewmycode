const axios = require("axios");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");

// @desc    Redirect to GitHub for OAuth
// @route   GET /api/github/login
// @access  Private
exports.githubLogin = asyncHandler(async (req, res, next) => {
  const redirectUri = `${process.env.FRONTEND_URL}/github/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo,user`;

  res.status(200).json({ success: true, url: githubAuthUrl });
});

// @desc    Handle GitHub OAuth callback
// @route   POST /api/github/callback
// @access  Private
exports.githubCallback = asyncHandler(async (req, res, next) => {
  const { code } = req.body;

  if (!code) {
    return next(new ErrorResponse("No code provided", 400));
  }

  // 1. Exchange code for access token
  const tokenResponse = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const accessToken = tokenResponse.data.access_token;

  if (!accessToken) {
    return next(new ErrorResponse("Failed to get GitHub access token", 401));
  }

  // 2. Fetch user profile from GitHub
  const userResponse = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });

  const githubUser = userResponse.data;

  // 3. Update the currently logged-in user with GitHub details
  const user = await User.findById(req.user.id);
  user.githubId = githubUser.id.toString();
  user.githubUsername = githubUser.login;
  user.githubAvatar = githubUser.avatar_url;
  user.githubAccessToken = accessToken;

  await user.save();

  res.status(200).json({
    success: true,
    data: {
      githubUsername: user.githubUsername,
      githubAvatar: user.githubAvatar,
    },
  });
});
