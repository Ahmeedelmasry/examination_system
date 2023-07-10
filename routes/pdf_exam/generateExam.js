const express = require("express");
const fileUpload = require("express-fileupload");

const router = express.Router();

const { uploadPdf } = require("../../controls/pdf_exam/generateExam");

//Update new todo
router.post("/", fileUpload({ createParentPath: true }), uploadPdf);

module.exports = router;
