import Store from "@/store/index";

export default {
  state: {
    allUrls: "",
    stExams: "",
    openExamData: "",
    isUpdated: null,
  },
  mutations: {
    getStUrls(state, payload) {
      state.allUrls = payload;
    },
    getStExams(state, payload) {
      state.stExams = payload;
    },
    stOpenExam(state, payload) {
      state.openExamData = payload;
    },
    updateExams(state, payload) {
      state.isUpdated = payload;
    },
  },
  actions: {
    //Get Exams
    async doGetStExams(context, userId) {
      await fetch(`${Store.state.apiLink}/shares/getst-exams/${userId}`)
        .then((res) => res.json())
        .then((firstData) => {
          context.commit("getStExams", firstData);
        })
        .catch((err) => console.log(err));
    },
    async doGetStUrls(context, userId) {
      await fetch(`${Store.state.apiLink}/saved-urls/getst-urls/${userId}`)
        .then((res) => res.json())
        .then((firstData) => {
          context.commit("getStUrls", firstData);
        })
        .catch((err) => console.log(err));
    },
    async checkIfExamed(context, payload) {
      let checkExam = null;
      await fetch(
        `${Store.state.apiLink}/shares/find/${payload.instId}/${payload.stId}`
      )
        .then((res) => res.json())
        .then((data) => {
          data.exams.forEach((exam) => {
            if (exam.examId == payload.examId) {
              checkExam = exam;
            }
          });
        })
        .catch((err) => console.log(err));
      return checkExam;
    },
    async submitResult(context, payload) {
      let checkExam = null;
      await fetch(
        `${Store.state.apiLink}/shares/find/${payload.instId}/${payload.stId}`
      )
        .then((res) => res.json())
        .then(async (data) => {
          let examsArr = data.exams;
          examsArr.forEach((exam) => {
            if (exam.examId == payload.examId) {
              exam.isExamed = true;
              exam.result = payload.result;
            }
          });
          const headerInfo = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(examsArr),
          };
          await fetch(
            `${Store.state.apiLink}/shares/updatest-exams/${data._id}`,
            headerInfo
          )
            .then((res) => res.json())
            .then(() => {
              examsArr = [];
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
      return checkExam;
    },
  },
};
