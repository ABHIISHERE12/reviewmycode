const express = require("express");
const { getOverview } = require("../controllers/analytics");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/overview", getOverview);

module.exports = router;
