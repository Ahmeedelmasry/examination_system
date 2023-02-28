//Settings
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//Routes
const signupRoute = require("./routes/signup/signUp");
const theUrls = require("./routes/instructor/theUrls");
const theExams = require("./routes/instructor/theExams");
const theSubject = require("./routes/instructor/theSubject");
const theProfile = require("./routes/profile/profileData");
const doFollow = require("./routes/follows/followRoute");
const shareExam = require("./routes/shares/shareExam");
const savedUrls = require("./routes/students/savedUrls");
const stNotifs = require("./routes/students/notifications");

//Create our express app
const app = express();

//Handle Cors and Middleware
app.use((req, res, next) => {
  res
    .header("Access-Control-Allow-Origin", "*")
    .header("Access-Control-Allow-Methods", "GET, POST, HEAD, PUT, DELETE")
    .header(
      ("Access-Control-Allow-Headers", false),
      "auth-token, Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    .header("Access-Control-Allow-Credentials", true);
  next();
});

//Cookie Parser
app.use(cookieParser());

app.use(
  cors({
    credential: true,
    // origin: true,
    origin: "https://online-exam-system-9b41e.web.app/",
  })
);

//Database Stuff
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo Db Connected .."))
  .then(() => {
    //Starting server
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Listining at port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => console.log(err));

//Config
app.use(bodyParser.json());

//Make Static Photos Available
app.use(express.static("profileImgs"));

//Routes
app.get("/", (req, res) => {
  res.send({ message: "Hello" });
});

//User Routes
app.use("/users", signupRoute);
app.use("/subjects", theSubject);
app.use("/urls", theUrls);
app.use("/exams", theExams);
app.use("/profile", theProfile);
app.use("/follows", doFollow);
app.use("/shares", shareExam);
app.use("/saved-urls", savedUrls);
app.use("/st-notifs", stNotifs);
