const express = require("express");
const router = express.Router();
const { updateExamWar } = require("../../middlewares/updateExam");

const {
  addExam,
  getAllExams,
  deleteExam,
  getOneExam,
  updateExam,
} = require("../../controls/instructor/theExams");

router.post("/new/add", addExam);
router.delete("/delete/:id", deleteExam);
router.get("/all/:id", updateExamWar, getAllExams);
router.get("/signle-exam/:id", getOneExam);
router.put("/update/:id", updateExam);

module.exports = router;
