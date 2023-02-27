import Store from "@/store/index";

export default {
  state: {
    allSubjects: "",
  },
  mutations: {
    getSubjects(state, payload) {
      state.allSubjects = payload;
    },
  },
  actions: {
    async doAddSubject(context, payload) {
      const theHeaderInfo = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      };
      await fetch(`${Store.state.apiLink}/subjects/new/add-subj`, theHeaderInfo)
        .then((res) => res.json())
        .catch((err) => console.log(err));
    },
    async doGetSubjects(context, payload) {
      await fetch(`${Store.state.apiLink}/subjects/all/${payload}`)
        .then((res) => res.json())
        .then((data) => context.commit("getSubjects", data));
    },
    async doDelSubj(context, payload) {
      const headerSetInfo = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      await fetch(
        `${Store.state.apiLink}/subjects/delete/${payload}`,
        headerSetInfo
      )
        .then((res) => res.json())
        .catch((err) => console.log(err));
    },
  },
};
