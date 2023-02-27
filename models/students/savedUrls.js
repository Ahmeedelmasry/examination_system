const mongoose = require("mongoose");

const ShareSchema = new mongoose.Schema({
  studentId: String,
  instructorId: String,
  firstName: String,
  lastName: String,
  profileImg: String,
  urls: Array,
});

module.exports = mongoose.model("savedUrls", ShareSchema);
