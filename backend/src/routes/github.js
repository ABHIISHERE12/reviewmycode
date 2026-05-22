const express = require("express");
const { githubLogin, githubCallback } = require("../controllers/github");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/login", protect, githubLogin);
router.post("/callback", protect, githubCallback);

module.exports = router;
