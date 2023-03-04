const ExamSchema = require("../../models/instructor/theExams");

const addExam = async (req, res) => {
  const exam = new ExamSchema(req.body);
  const savedExam = await exam.save();
  res.json(savedExam);
};

const deleteExam = async (req, res) => {
  const exam = await ExamSchema.findByIdAndDelete(req.params.id);
  res.json(exam);
};

const getAllExams = async (req, res) => {
  const exams = await ExamSchema.find({ instructorUserId: req.params.id });
  //
  //
  for (let i = 0; i < exams.length; i++) {
    const examDate = new Date(`${exams[i].startDate} ${exams[i].endTimeAt}`);
    const dateNow = new Date();
    if (examDate - dateNow < 0) {
      await ExamSchema.updateOne(
        { _id: exams[i]._id },
        {
          status: "Closed",
        }
      );
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
      }
    }
  }
  setTimeout(async () => {
    const examsUpdated = await ExamSchema.find({
      instructorUserId: req.params.id,
    });
    res.json(examsUpdated);
  }, 1000);
};

const getOneExam = async (req, res) => {
  const exams = await ExamSchema.findOne({ _id: req.params.id });
  res.json(exams);
};

const updateExam = async (req, res) => {
  const exam = await ExamSchema.updateOne(
    { _id: req.params.id },
    {
      status: req.body.status,
    }
  );
  res.json(exam);
};

module.exports = { addExam, getAllExams, deleteExam, getOneExam, updateExam };
