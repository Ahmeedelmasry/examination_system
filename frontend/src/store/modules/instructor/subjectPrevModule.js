import Store from "@/store/index";

export default {
  state: {
    subjData: "",
  },
  mutations: {
    subQuestions(state, payload) {
      state.subjData = payload;
    },
  },
  actions: {
    async getSubQuestions(context, payload) {
      await fetch(`${Store.state.apiLink}/subjects/signle-subject/${payload}`)
        .then((res) => res.json())
        .then((data) => context.commit("subQuestions", data))
        .catch((err) => console.log(err));
    },
  },
};
