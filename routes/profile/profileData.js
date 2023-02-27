const express = require("express");
const fileUpload = require("express-fileupload");

const router = express.Router();

const { updateProfileImg } = require("../../controls/profile/profileData");

//Update new todo
router.post("/:id", fileUpload({ createParentPath: true }), updateProfileImg);

module.exports = router;
