const NotifSchema = require("../../models/students/notifications");

const pushNotif = async (req, res) => {
  const newFollow = new NotifSchema(req.body);
  const savedFollow = await newFollow.save();
  res.json(savedFollow);
};

const updateReadNotif = async (req, res) => {
  const updateNow = await NotifSchema.updateMany(
    { studentId: req.params.id },
    req.body
  );
  res.json(updateNow);
};

const getAllNotif = async (req, res) => {
  const allStudents = await NotifSchema.find({
    studentId: req.params.id,
  });
  res.json(allStudents);
};

module.exports = {
  pushNotif,
  getAllNotif,
  updateReadNotif,
};
