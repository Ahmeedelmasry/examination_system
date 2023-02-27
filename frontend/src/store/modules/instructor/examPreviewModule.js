import Store from "@/store/index";

export default {
  state: {
    examDetails: "",
  },
  mutations: {
    getQuestions(state, payload) {
      state.examDetails = payload;
    },
  },
  actions: {
    async getExamQuestions(context, payload) {
      await fetch(`${Store.state.apiLink}/exams/signle-exam/${payload}`)
        .then((res) => res.json())
        .then((data) => context.commit("getQuestions", data));
    },
  },
};
