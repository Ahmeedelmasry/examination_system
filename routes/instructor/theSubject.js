const express = require("express");
const router = express.Router();
const {
  addSubject,
  getAllSubjects,
  deleteSubject,
  getOneSubject,
} = require("../../controls/instructor/theSubject");

router.post("/new/add-subj", addSubject);
router.delete("/delete/:id", deleteSubject);
router.get("/all/:id", getAllSubjects);
router.get("/signle-subject/:id", getOneSubject);

module.exports = router;
