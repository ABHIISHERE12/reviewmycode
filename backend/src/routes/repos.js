const express = require("express");
const {
  getRepositories,
  syncRepositories,
  deleteRepository,
} = require("../controllers/repos");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect); // All repo routes are protected

router.route("/").get(getRepositories);
router.post("/sync", syncRepositories);
router.delete("/:id", deleteRepository);

module.exports = router;
