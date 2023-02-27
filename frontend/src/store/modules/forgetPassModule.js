import Store from "@/store/index";
import axios from "axios";

export default {
  state: {},
  mutations: {},
  actions: {
    async doValidForget(context, payload) {
      let resp = "";
      await axios
        .get(`${Store.state.apiLink}/users/forget-password/${payload}`)
        .then((res) => {
          resp = res.data;
        })
        .catch((err) => {
          resp = err.response.data;
        });
      return resp;
    },
  },
};
