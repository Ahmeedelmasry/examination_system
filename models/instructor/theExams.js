const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  time: String,
  startDate: String,
  startTimeAt: String,
  endTimeAt: String,
  instructorUserId: String,
  questions: Array,
  status: String,
  title: String,
  totalDegree: String,
  grade: String,
});

module.exports = mongoose.model("exams", examSchema);
