const ExamSchema = require("../models/instructor/theExams");
const ShareSchema = require("../models/shares/shareExam");

//Instructor Exams
const updateExamWar = async (req, res, next) => {
  const exams = await ExamSchema.find({ instructorUserId: req.params.id });
  const dateNow = new Date();
  for (let i = 0; i < exams.length; i++) {
    const examDate = new Date(`${exams[i].startDate} ${exams[i].endTimeAt}`);
    if (examDate - dateNow < 0) {
      await ExamSchema.updateOne(
        { _id: exams[i]._id },
        {
          status: "Closed",
        }
      );
      exams[i].status = "Closed";
    } else {
      const startTime = new Date(
        `${exams[i].startDate} ${exams[i].startTimeAt}`
      );
      const timeNow = new Date();
      if (startTime - timeNow < 0) {
        await ExamSchema.updateOne(
          { _id: exams[i]._id },
          {
            status: "Open",
          }
        );
        exams[i].status = "Open";
      }
    }
  }
  next();
};

//Students Exams
const updateStExamWar = async (req, res, next) => {
  const myExams = await ShareSchema.find({ studentId: req.params.id });
  if (myExams) {
    myExams.forEach(async (e) => {
      let beforeUpdate = e.exams;
      beforeUpdate.forEach((exam) => {
        //Check If Exam Date Passed
        const examDate = new Date(`${exam.startDate} ${exam.endTimeAt}`);
        const dateNow = new Date();
        if (examDate - dateNow < 0) {
          exam.status = "Closed";
        } else {
          const startTime = new Date(`${exam.startDate} ${exam.startTimeAt}`);
          const timeNow = new Date();
          if (startTime - timeNow < 0) {
            exam.status = "Open";
          } else {
            exam.status = "Pending";
          }
        }
      });
      const updateExam = await ShareSchema.updateOne(
        {
          _id: e._id,
        },
        { exams: beforeUpdate }
      );
    });
  }
  setTimeout(() => {
    next();
  }, 200);
};

module.exports = { updateExamWar, updateStExamWar };
