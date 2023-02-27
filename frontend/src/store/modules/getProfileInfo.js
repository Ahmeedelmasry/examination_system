import Store from "@/store/index";

export default {
  state: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    photo: "",
    userId: "",
    infoUpdated: false,
    profileImage: "",
    sectionNo: "",
    gradeNo: "",
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.photo = userInfo.profileImg;
      state.email = userInfo.email;
      state.userId = userInfo._id;
      state.password = userInfo.password;
      state.firstName = userInfo.firstName;
      state.lastName = userInfo.lastName;
      state.sectionNo = userInfo.sectionNo;
      state.gradeNo = userInfo.gradeNo;
    },
    updateUserInfo(state, payload) {
      state.photo = payload.profileImg;
      state.email = payload.email;
      state.password = payload.password;
      state.firstName = payload.firstName;
      state.lastName = payload.lastName;
      state.infoUpdated = true;
    },
    getProfileImg(state, payload) {
      state.profileImage = `${Store.state.apiLink}/${payload}`;
    },
  },
  actions: {
    async getUserInfo(context, payload) {
      await fetch(`${Store.state.apiLink}/users/profile/${payload}`)
        .then((res) => res.json())
        .then((data) => context.commit("setUserInfo", data));
    },
    async uploadImg(context, payload) {
      const headersInfo = {
        method: "POST",
        body: payload.formData,
      };
      await fetch(`${Store.state.apiLink}/profile/${payload.uId}`, headersInfo)
        .then((res) => res.json())
        .then((data) => context.commit("getProfileImg", data.message))
        .catch((err) => console.log(err));
    },
    async updateInfo(context, payload) {
      let thedata = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        password: payload.password,
      };
      if (payload.profileImg) {
        thedata.profileImg = payload.profileImg;
      }
      const headersInfo = {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(thedata),
        method: "PUT",
      };
      await fetch(
        `${Store.state.apiLink}/users/profile-update/${payload.uId}`,
        headersInfo
      )
        .then((res) => res.json())
        .catch((err) => console.log(err));
    },
  },
};
