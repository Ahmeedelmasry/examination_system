const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const path = require("path");

const uploadPdf = async (req, res) => {
  const pdf = req.files.pdf;
  if (pdf) {
    const filePath = path.join(
      __dirname,
      "../../exam_files",
      `${Date.now()}.pdf`
    );

    pdf.mv(filePath, (err) => {
      if (err)
        return res.status(500).json({ status: "error", message: "error" });
    });

    const formData = new FormData();
    setTimeout(() => {
      formData.append("file", fs.createReadStream(filePath));

      const options = {
        headers: {
          "x-api-key": "sec_cANXyP0mShvEjx0scyB6jAOy84SVwFPJ",
          ...formData.getHeaders(),
        },
      };

      try {
        axios
          .post(
            "https://api.chatpdf.com/v1/sources/add-file",
            formData,
            options
          )
          .then(async (response) => {
            const getQuestions = await chatWithPdf(response.data.sourceId);
            if (getQuestions.status) {
              res.json(getQuestions);
            } else {
              res.json({ error: { message: "Internal Server Error" } });
            }
          });
      } catch (error) {
        console.log("Error:", error.message);
        console.log("Response:", error.response.data);
        res.json({ error: { message: "Internal Server Error" } });
      }
    }, 1000);
  } else {
    res.status(400).json({ erro: { message: "No File" } });
  }
};

// Chat After Pdf
const chatWithPdf = async (sourceId) => {
  let result;
  const config = {
    headers: {
      "x-api-key": "sec_cANXyP0mShvEjx0scyB6jAOy84SVwFPJ",
      "Content-Type": "application/json",
    },
  };

  const data = {
    sourceId: sourceId,
    messages: [
      {
        role: "user",
        content: `generate 5 questions from this content and give 4 choices to each 
          question and the correct answer in json format, need format to be like:
           questions: [{question: '', correct_answer: index, choices:[]}]
          `,
      },
    ],
  };

  try {
    await axios
      .post("https://api.chatpdf.com/v1/chats/message", data, config)
      .then((response) => {
        result = {
          status: true,
          data: response.data,
        };
      });
  } catch (error) {
    console.error("Error:", error.message);
    console.log("Response:", error.response.data);
    result = {
      status: false,
    };
  }
  return result;
};

module.exports = { uploadPdf };
