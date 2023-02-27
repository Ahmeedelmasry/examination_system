const express = require("express");
const router = express.Router();
const {
  addNewUrl,
  getUrls,
  deleteUrl,
} = require("../../controls/instructor/theUrls");

router.post("/add", addNewUrl);
router.delete("/delete/:id", deleteUrl);
router.get("/:id", getUrls);

module.exports = router;
