const SubjectSchema = require("../../models/instructor/theSubject");

const addSubject = async (req, res) => {
  const subject = new SubjectSchema(req.body);
  const savedSubj = await subject.save();
  res.json(savedSubj);
};

const deleteSubject = async (req, res) => {
  const subject = await SubjectSchema.findByIdAndDelete(req.params.id);
  res.json(subject);
};

const getAllSubjects = async (req, res) => {
  const subject = await SubjectSchema.find({ instructorUserId: req.params.id });
  res.json(subject);
};

const getOneSubject = async (req, res) => {
  const subjects = await SubjectSchema.findOne({ _id: req.params.id });
  res.json(subjects);
};

module.exports = { addSubject, getAllSubjects, deleteSubject, getOneSubject };
