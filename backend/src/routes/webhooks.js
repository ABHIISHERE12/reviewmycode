const express = require("express");
const { handleGithubWebhook } = require("../controllers/webhooks");

const router = express.Router();

// Webhook endpoints must be public so GitHub can reach them
router.post("/github", handleGithubWebhook);

module.exports = router;
