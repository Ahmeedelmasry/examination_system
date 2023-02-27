const mongoose = require("mongoose");
const followSchema = new mongoose.Schema({
  instructorId: String,
  studentId: String,
  isRead: Boolean,
  firstName: String,
  lastName: String,
  profileImg: String,
  message: String,
  gradeNo: String,
  sectionNo: String,
});

module.exports = mongoose.model("follows", followSchema);
