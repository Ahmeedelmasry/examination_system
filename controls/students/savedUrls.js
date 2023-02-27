const SavedUrlSchema = require("../../models/students/savedUrls");

//One
const checkBeforeSave = async (req, res) => {
  const check = await SavedUrlSchema.findOne({
    instructorId: req.params.instructorId,
    studentId: req.params.stId,
  });
  res.json(check);
};

//two
const pushUrl = async (req, res) => {
  const newUrl = await SavedUrlSchema.updateOne(
    {
      instructorId: req.params.instId,
      studentId: req.params.stId,
    },
    { $set: { urls: req.body } }
  );
  res.json(newUrl);
};

//Three
const createNewShare = async (req, res) => {
  const url = new SavedUrlSchema(req.body);
  const savedUrl = await url.save();
  res.json(savedUrl);
};

////////////////////////
const GetStSavedUrls = async (req, res) => {
  const myUrls = await SavedUrlSchema.find({ studentId: req.params.id });
  res.json(myUrls);
};

const updateSavedUrls = async (req, res) => {
  const url = await SavedUrlSchema.updateOne(
    {
      _id: req.params.stId,
    },
    { $set: { urls: req.body } }
  );
  res.json(url);
};

//Delete Url Share

const doDeleteUrlShare = async (req, res) => {
  const delUrl = await SavedUrlSchema.deleteOne({
    instructorId: req.params.instId,
    studentId: req.params.stId,
  });
  res.json(delUrl);
};

module.exports = {
  createNewShare,
  checkBeforeSave,
  GetStSavedUrls,
  updateSavedUrls,
  pushUrl,
  doDeleteUrlShare,
};
