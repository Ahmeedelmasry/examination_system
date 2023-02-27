const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  instructorId: String,
  studentId: String,
  isRead: Boolean,
  firstName: String,
  lastName: String,
  profileImg: String,
  message: String,
});

module.exports = mongoose.model("stNotifications", notificationSchema);
