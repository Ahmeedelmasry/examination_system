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
  try {
    const exams = await ExamSchema.find({ instructorUserId: req.params.id });
    res.json(exams);
  } catch (error) {
    console.log(error);
  }
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
