const mongoose = require("mongoose");

const ShareSchema = new mongoose.Schema({
  studentId: String,
  instructorId: String,
  exams: Array,
  examId: String,
  firstName: String,
  lastName: String,
  profileImg: String,
  isExamed: Boolean,
  isNotified: Boolean,
});

module.exports = mongoose.model("shares", ShareSchema);
