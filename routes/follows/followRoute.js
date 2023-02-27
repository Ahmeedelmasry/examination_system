const express = require("express");
const router = express.Router();
const {
  addNewFollow,
  removeFollow,
  getFollowedInstructor,
  getAllStudents,
  updateReadFollow,
} = require("../../controls/follows/followCtrl");

router.get("/:stId/:inId", getFollowedInstructor);
router.post("/do-follow", addNewFollow);
router.put("/update-follow/:id", updateReadFollow);
router.delete("/do-unfollow", removeFollow);
router.get("/all-students/get/:id", getAllStudents);

module.exports = router;
