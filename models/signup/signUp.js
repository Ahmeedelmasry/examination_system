const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bycrept = require("bcrypt");

const signupSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email address"],
    unique: true,
    validate: [isEmail, " Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  userRole: String,
  gradeNo: String,
  sectionNo: String,
  profileImg: String,
});

//Hashing Password Before Save
signupSchema.pre("save", async function (next) {
  //Generate a salt
  const salt = await bycrept.genSalt();
  //Hash The Password
  this.password = await bycrept.hash(this.password, salt);
  next();
});

signupSchema.pre("updateOne", async function (next) {
  const salt = await bycrept.genSalt();
  this._update.password = await bycrept.hash(this._update.password, salt);
  next();
});

//Custom Loggin Function
signupSchema.statics.login = async function (email, password) {
  let user = await this.findOne({ email });
  if (user) {
    const comparePass = await bycrept.compare(password, user.password);
    if (comparePass) {
      return user;
    }
    return {
      error: {
        email: "",
        password: "Incorrect password",
      },
    };
  }
  return {
    error: {
      email: "Email not found",
      password: "",
    },
  };
};

module.exports = mongoose.model("users", signupSchema);
