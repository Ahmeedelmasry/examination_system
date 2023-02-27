const mongoose = require("mongoose");
const urlSchema = new mongoose.Schema({
  desc: String,
  link: String,
  uId: String,
});

module.exports = mongoose.model("urls", urlSchema);
