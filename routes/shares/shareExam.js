const express = require("express");
const { updateStExamWar } = require("../../middlewares/updateExam");
const router = express.Router();
const {
  createNewShare,
  checkBeforeShare,
  GetStSharedExams,
  updateSharedExam,
  pushExam,
  getSearchedExams,
  getExamResult,
  deleteShare,
  deleteSharedExam,
} = require("../../controls/shares/shareExam");

//Find Share
router.get("/find/:instructorId/:stId", checkBeforeShare);

//Push New Exam to Share
router.put("/push-exam/:instructorId/:stId", pushExam);

//Create New Share
router.post("/add", createNewShare);

//Get Studen Exams
router.get("/getst-exams/:id", updateStExamWar, GetStSharedExams);

//Get Searched Page Shared Exams
router.get("/get-search-exams/:stId/:insId", getSearchedExams);

//Update Exam Status
router.put("/updatest-exams/:stId", updateSharedExam);

//Update Exam Status
router.put("/delete-shared-exam/:shareId", deleteSharedExam);

//Delete A Share
router.delete("/delete-share", deleteShare);

//Find Exam For Result
router.get("/exam-result/:instId", getExamResult);

module.exports = router;
