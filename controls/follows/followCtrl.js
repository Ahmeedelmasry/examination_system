const FollowSchema = require("../../models/follows/followModel");

const getFollowedInstructor = async (req, res) => {
  const followedInstructor = await FollowSchema.findOne({
    studentId: req.params.stId,
    instructorId: req.params.inId,
  });
  res.json(followedInstructor);
};

const addNewFollow = async (req, res) => {
  const newFollow = new FollowSchema(req.body);
  const savedFollow = await newFollow.save();
  res.json(savedFollow);
};

const updateReadFollow = async (req, res) => {
  const updateNow = await FollowSchema.updateMany(
    { instructorId: req.params.id },
    req.body
  );
  res.json(updateNow);
};

const removeFollow = async (req, res) => {
  const removedFollow = await FollowSchema.deleteOne({
    studentId: req.body.studentId,
    instructorId: req.body.instructorId,
  });
  res.json(removedFollow);
};

const getAllStudents = async (req, res) => {
  const allStudents = await FollowSchema.find({
    instructorId: req.params.id,
  });
  res.json(allStudents);
};

module.exports = {
  addNewFollow,
  removeFollow,
  getFollowedInstructor,
  getAllStudents,
  updateReadFollow,
};
