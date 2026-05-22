const express = require("express");
const { githubConnect, githubCallback } = require("../controllers/github");

const router = express.Router();

router.get("/connect", githubConnect);
router.get("/callback", githubCallback);

module.exports = router;
