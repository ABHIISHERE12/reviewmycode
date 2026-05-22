const axios = require("axios");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");

// @desc    Redirect to GitHub for OAuth
// @route   GET /api/github/connect
// @access  Public (Expects token in query)
exports.githubConnect = asyncHandler(async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return next(new ErrorResponse("Not authorized to connect GitHub", 401));
  }

  // The callback URL registered in GitHub exactly: http://localhost:5000/api/github/callback
  const redirectUri = `${req.protocol}://${req.get("host")}/api/github/callback`;
  
  // We pass the user's JWT token in the 'state' parameter so GitHub returns it to us in the callback
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo,user&state=${token}`;

  // Redirect the browser to GitHub
  res.redirect(githubAuthUrl);
});

// @desc    Handle GitHub OAuth callback
// @route   GET /api/github/callback
// @access  Public
exports.githubCallback = asyncHandler(async (req, res, next) => {
  const { code, state } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  if (!code || !state) {
    return res.redirect(`${frontendUrl}?error=github_oauth_failed`);
  }

  try {
    // 1. Verify the JWT from the 'state' parameter to identify the user
    const decoded = jwt.verify(state, process.env.JWT_SECRET);
    
    // 2. Exchange code for GitHub access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.redirect(`${frontendUrl}?error=github_token_failed`);
    }

    // 3. Fetch user profile from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });

    const githubUser = userResponse.data;

    // 4. Update the currently logged-in user with GitHub details
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.redirect(`${frontendUrl}?error=user_not_found`);
    }

    user.githubId = githubUser.id.toString();
    user.githubUsername = githubUser.login;
    user.githubAvatar = githubUser.avatar_url;
    user.githubAccessToken = accessToken;

    await user.save();

    // 5. Redirect back to frontend GithubCallback component with the code/success flag
    // (Or redirect directly to dashboard if you prefer, but frontend expects a callback page to update context)
    res.redirect(`${frontendUrl}/github/callback?success=true&username=${githubUser.login}&avatar=${encodeURIComponent(githubUser.avatar_url)}`);

  } catch (error) {
    console.error("GitHub OAuth Error:", error.message);
    res.redirect(`${frontendUrl}?error=github_oauth_failed`);
  }
});
