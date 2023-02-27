import Store from "@/store/index";

export default {
  state: {
    signupFeedBack: null,
    errors: null,
  },
  mutations: {
    validSignup(state, payload) {
      state.signupFeedBack = payload;
    },
    signupErr(state, payload) {
      state.errors = payload;
    },
  },
  actions: {
    doResetUpErrs(context) {
      context.commit("signupErr", null);
    },
    async doValidateSignup(context, payload) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: payload.pass,
          userRole: payload.userRole,
          gradeNo: payload.gradeNo,
          sectionNo: payload.sectionNo,
          profileImg: "",
        }),
        credentials: "include",
      };
      await fetch(`${Store.state.apiLink}/users`, requestOptions)
        .then((res) => res.json())
        .then(async (signupRes) => {
          if (signupRes.errors) {
            context.commit("signupErr", signupRes.errors);
          } else {
            context.commit("signupErr", null);
            context.commit("validSignup", signupRes);
          }
        })
        .catch((err) => console.log(err));
    },
    async testUploadImgs(context, payload) {
      const headersInfo = {
        method: "POST",
        body: payload.images,
      };
      await fetch(
        `${Store.state.apiLink}/users/upload-imgs/${payload.email}`,
        headersInfo
      )
        .then((res) => res.json())
        .catch((err) => console.log(err));
    },
  },
};
