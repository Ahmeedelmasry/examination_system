const Url = require("../../models/instructor/theUrls");

const addNewUrl = async (req, res) => {
  const newUrl = new Url(req.body);
  const savedUrl = await newUrl.save();
  res.json(savedUrl);
};

const deleteUrl = async (req, res) => {
  const newUrl = await Url.findByIdAndDelete({ _id: req.params.id });
  res.json(newUrl);
};

const getUrls = async (req, res) => {
  const allUrls = await Url.find({ uId: req.params.id });
  res.json(allUrls);
};

module.exports = { addNewUrl, getUrls, deleteUrl };
