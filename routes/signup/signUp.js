const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

const {
  postSignup,
  getOneUser,
  getOneUserById,
  updateUserInfo,
  getSearchedIns,
  logOut,
  forgetPassword,
  uploadSecurityImages,
  methodSetCookie,
} = require("../../controls/signup/signUp");

const { isLogged } = require("../../middlewares/auth");

//Check Auth
router.get("/check/is-auth", isLogged, getOneUserById);

//Create new user
router.post("/", postSignup);

//Getter by email
router.post("/login", getOneUser);

//Getter by id
router.get("/profile/:id", getOneUserById);

//Get searched Instructor
router.get("/search/:email", getSearchedIns);

//Update User
router.put("/profile-update/:id", updateUserInfo);

//Logout
router.get("/logout", logOut);

//ForgetPassword
router.get("/forget-password/:email", forgetPassword);

//Token After Img Verify
router.post("/verify-img/:id/:userName", methodSetCookie);

router.post(
  "/upload-imgs/:email",
  fileUpload({ createParentPath: true }),
  uploadSecurityImages
);

module.exports = router;
