const ShareSchema = require("../../models/shares/shareExam");
const UserSchema = require("../../models/signup/signUp");
const nodemailer = require("nodemailer");

//Send Email Func
const sendEmailFunc = (req, res, payload) => {
  //Send Email
  const from = "Questionizer MTS";
  const to = payload.student.email;
  const subject = "New Exam";
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
    text: `Hello ${payload.student.firstName} ${payload.student.lastName},
            ${payload.instructor.firstName} ${
      payload.instructor.lastName
    } Has shared a new exam with you.
        Exam title: ${
          req.body.exams ? req.body.exams[0].title : payload.examTitle
        }`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Something went wrong, Please try again" });
    } else {
      res.json({ message: "Exam Shared Successfully" });
    }
  });
};

//One
const checkBeforeShare = async (req, res) => {
  const check = await ShareSchema.findOne({
    instructorId: req.params.instructorId,
    studentId: req.params.stId,
  });
  res.json(check);
};

//two
const pushExam = async (req, res) => {
  const newExam = await ShareSchema.updateOne(
    {
      instructorId: req.params.instructorId,
      studentId: req.params.stId,
    },
    { $set: { exams: req.body } }
  );
  const student = await UserSchema.findOne({
    _id: req.params.stId,
  });
  const instructor = await UserSchema.findOne({
    _id: req.params.instructorId,
  });
  const payload = {
    instructor,
    student,
    examTitle: req.body[req.body.length - 1].title,
  };
  sendEmailFunc(req, res, payload);
  res.json(newExam);
};

//Three
const createNewShare = async (req, res) => {
  const exam = new ShareSchema(req.body);
  const savedExam = await exam.save();
  const student = await UserSchema.findOne({ _id: req.body.studentId });
  const instructor = await UserSchema.findOne({ _id: req.body.instructorId });

  const payload = {
    instructor,
    student,
  };

  sendEmailFunc(req, res, payload);
};

const GetStSharedExams = async (req, res) => {
  const myExams = await ShareSchema.find({ studentId: req.params.id });
  const dateNow = new Date();
  for (let i = 0; i < myExams.length; i++) {
    const examDate = new Date(
      `${myExams[i].startDate} ${myExams[i].endTimeAt}`
    );
    if (examDate - dateNow < 0) {
      myExams[i].status = "Closed";
    } else {
      const startTime = new Date(
        `${myExams[i].startDate} ${myExams[i].startTimeAt}`
      );
      const timeNow = new Date();
      if (startTime - timeNow < 0) {
        myExams[i].status = "Open";
      }
    }
  }
  res.json(myExams);
};

const getSearchedExams = async (req, res) => {
  const sharedExams = await ShareSchema.find({
    studentId: req.params.stId,
    instructorId: req.params.insId,
  });
  res.json(sharedExams);
};

const updateSharedExam = async (req, res) => {
  const exam = await ShareSchema.updateOne(
    {
      _id: req.params.stId,
    },
    { $set: { exams: req.body } }
  );
  res.json(exam);
};

const deleteShare = async (req, res) => {
  const deleteShare = await ShareSchema.deleteOne(req.body);
  res.json(deleteShare);
};

const deleteSharedExam = async (req, res) => {
  const deleteShare = await ShareSchema.updateOne(
    { _id: req.params.shareId },
    {
      $set: { exams: req.body },
    }
  );
  res.json(deleteShare);
};

const getExamResult = async (req, res) => {
  const examRes = await ShareSchema.find({ instructorId: req.params.instId });
  res.json(examRes);
};

module.exports = {
  createNewShare,
  checkBeforeShare,
  GetStSharedExams,
  updateSharedExam,
  pushExam,
  getSearchedExams,
  getExamResult,
  deleteShare,
  deleteSharedExam,
};
