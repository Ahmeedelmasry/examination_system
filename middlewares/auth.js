const jwt = require("jsonwebtoken");
const signupSchema = require("../models/signup/signUp");

const isLogged = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(
      token,
      "my old love is married now",
      async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.json({ serverError: "Internal server error" });
        } else {
          let user = await signupSchema.findById(decodedToken.id);
          user.password = "";
          res.json(user);
        }
      }
    );
  } else {
    res.json({ authError: true });
  }
};

module.exports = { isLogged };
