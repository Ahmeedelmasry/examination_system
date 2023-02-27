const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
  name: String,
  profileImg: {
    contentType: String,
    data: Buffer,
  },
});

module.exports = mongoose.model("profileImgs", profileSchema);
