const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  instructorUserId: String,
  questions: Array,
  title: String,
});

module.exports = mongoose.model("subjects", subjectSchema);
