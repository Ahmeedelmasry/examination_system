const express = require("express");
const router = express.Router();
const {
  createNewShare,
  checkBeforeSave,
  GetStSavedUrls,
  updateSavedUrls,
  pushUrl,
  doDeleteUrlShare,
} = require("../../controls/students/savedUrls");

//Find Share
router.get("/find/:instructorId/:stId", checkBeforeSave);

//Push New Exam to Share
router.put("/push-url/:instId/:stId", pushUrl);

//Create New Share
router.post("/add", createNewShare);

//Get Studen Exams
router.get("/getst-urls/:id", GetStSavedUrls);

//Update Exam Status
router.put("/updatest-urls/:stId", updateSavedUrls);

//Delete Created Url Share
router.delete("/delete-url-share/:instId/:stId", doDeleteUrlShare);

module.exports = router;
