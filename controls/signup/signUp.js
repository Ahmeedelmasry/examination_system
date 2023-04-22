const SignUp = require("../../models/signup/signUp");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

//Handle Errors
const handleErrs = (err) => {
  let error = { firstName: "", lastName: "", email: "", password: "" };
  if (err.errors) {
    Object.values(err.errors).forEach((err) => {
      error[err.path] = err.message;
    });
  }
  if (err.code === 11000) {
    error.email = "This email already exists, try another email";
  }
  return error;
};

const maxAge = 60 * 60 * 24 * 1;

//Generating Token
const generToken = (id) => {
  return jwt.sign({ id }, "my old love is married now", {
    expiresIn: maxAge,
  });
};

const getOneUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const logging = await SignUp.login(email, password);
  let sendUser = new Object(logging);

  if (logging.error) {
    res.status(401).json(logging);
  } else {
    sendUser.password = "";
    res.status(201).json(sendUser);
  }
};

const methodSetCookie = (req, res) => {
  const token = generToken(req.params.id);
  res.cookie("jwt", token, {
    maxAge: maxAge * 1000,
    httpOnly: false,
    sameSite: "none",
    secure: true,
  });
  res.status(201).json({ message: `Welcome back ${req.params.userName}` });
};

const getOneUserById = async (req, res) => {
  let t = await SignUp.findOne({ _id: req.params.id });
  t.password = "";
  res.json(t);
};

const postSignup = async (req, res) => {
  try {
    let emailDomain = req.body.email.split("@");
    const ext = emailDomain[emailDomain.length - 1];
    if (req.body.email && ext !== "fci.zu.edu.eg") {
      return res.status(400).json({
        errors: { email: "Email address must end with 'fci.zu.edu.eg'" },
      });
    }
    let newUser = await SignUp.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      userRole: req.body.userRole,
      profileImg: req.body.profileImg,
      sectionNo: req.body.userRole == "STUDENT" ? req.body.sectionNo : "",
      gradeNo: req.body.userRole == "STUDENT" ? req.body.gradeNo : "",
    });
    const token = generToken(newUser._id);
    res.cookie("jwt", token, {
      maxAge: maxAge * 1000,
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });
    delete newUser.password;
    res.json(newUser);
  } catch (error) {
    const errRes = handleErrs(error);
    res.status(401).json({ errors: errRes });
  }
};

const uploadSecurityImages = async (req, res) => {
  const files = req.files;
  const imgsArr = [];
  files.image.forEach(async (file, i) => {
    const filePath = path.join(
      __dirname,
      "../../profileImgs/securityImages",
      `${req.params.email}/${req.params.email}-${i}.jpg`
    );

    file.mv(filePath, (err) => {
      if (err)
        return res.status(500).json({ status: "error", message: "error" });
    });
    imgsArr.push(file.name);
  });

  return res.json({
    status: "success",
    images: "Images Uploaded Successfully",
  });
};

const getSearchedIns = async (req, res) => {
  const searchedIns = await SignUp.findOne({
    email: req.params.email,
    userRole: "INSTRUCTOR",
  });
  res.json(searchedIns);
};

const updateUserInfo = async (req, res) => {
  const newInfo = await SignUp.updateOne({ _id: req.params.id }, req.body);
  res.json(newInfo);
};

const forgetPassword = async (req, res) => {
  try {
    const getUser = await SignUp.findOne({ email: req.params.email });
    if (!getUser) {
      res.status(404).json({ error: "User Not Found" });
    } else {
      const randChars = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        0,
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
      ];
      let newArr = [];
      for (let i = 0; i < 30; i++) {
        const rand = Math.floor(Math.random() * randChars.length);
        newArr.push(randChars[rand]);
      }
      const finalToken = newArr.join("");
      const updatePassword = await SignUp.updateOne(
        { email: req.params.email },
        { password: finalToken }
      );
      //Send Email
      const from = "Questionizer MTS Website";
      const to = getUser.email;
      const subject = "New Password Set";
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "mhmdtahasherif123@gmail.com",
          pass: "fgbziviyswvlrlwj",
        },
      });
      const mailOptions = {
        from,
        to,
        subject,
        text: `Hello ${getUser.firstName} ${getUser.lastName},
         Your new password is (${finalToken}), You can use it now to login to Questionizer MTS.`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          res
            .status(400)
            .json({ error: "Something went wrong, Please try again" });
        } else {
          res.json({ message: "A new password has been sent to your email" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ error: "Something went wrong, please try again" });
  }
};

const logOut = (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 1,
    sameSite: "none",
    httpOnly: true,
    secure: true,
  });
  res.json("Signed out");
};

module.exports = {
  postSignup,
  forgetPassword,
  getSearchedIns,
  getOneUser,
  getOneUserById,
  uploadSecurityImages,
  updateUserInfo,
  logOut,
  methodSetCookie,
};
