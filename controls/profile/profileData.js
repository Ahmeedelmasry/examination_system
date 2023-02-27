const path = require("path");

const updateProfileImg = async (req, res) => {
  const files = req.files;
  const ext = files.image.mimetype.split("").splice(6).join("");

  const filePath = path.join(
    __dirname,
    "../../profileImgs",
    `${req.params.id}.${ext}`
  );

  files.image.mv(filePath, (err) => {
    if (err) return res.status(500).json({ status: "error", message: "error" });
  });
  return res.json({
    status: "success",
    message: `${req.params.id}.${ext}`,
  });
};

module.exports = { updateProfileImg };
