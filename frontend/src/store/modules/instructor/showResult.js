import Store from "@/store/index";

export default {
  state: {
    examResult: [],
  },
  mutations: {
    getExamResult(state, payload) {
      state.examResult.push(payload);
    },
    resetData(state, payload) {
      state.examResult = payload;
    },
  },
  actions: {
    async doGetExamResult(context, payload) {
      context.commit("resetData", []);
      await fetch(`${Store.state.apiLink}/shares/exam-result/${payload.instId}`)
        .then((res) => res.json())
        .then(async (data) => {
          await data.forEach((share) => {
            share.exams.forEach(async (exam) => {
              if (exam.examId == payload.examId) {
                await fetch(
                  `${Store.state.apiLink}/users/profile/${share.studentId}`
                )
                  .then((res) => res.json())
                  .then(async (data) => {
                    let student = {};
                    student.firstName = data.firstName;
                    student.lastName = data.lastName;
                    student.profileImg = data.profileImg;
                    student.isExamed = exam.isExamed;
                    student.result = exam.result;
                    student.totalDegree = exam.totalDegree;
                    student.title = exam.title;
                    context.commit("getExamResult", student);
                  })
                  .catch((err) => console.log(err));
              }
            });
          });
        });
    },
  },
};
