import Store from "@/store/index";

export default {
  state: {
    searchData: {
      isExist: false,
      userId: "",
      firstName: "",
      lastName: "",
      photo: "",
      userRole: "",
    },
    followers: [],
    readNotif: false,
  },
  mutations: {
    showHideSearch(state, payload) {
      state.userRole = payload;
    },
    //Search
    checkResult(state, check) {
      if (check.isExist == true) {
        state.isExist = true;
        state.userId = check.userId;
        state.firstName = check.firstName;
        state.lastName = check.lastName;
        state.photo = check.photo;
      } else {
        state.isExist = false;
        state.userId = "";
        state.firstName = "";
        state.lastName = "";
        state.photo = "";
      }
    },
    getFollowers(state, payload) {
      state.followers = payload;
    },
    //Read notifications
    redNotifMut(state, payload) {
      state.readNotif = payload;
    },
  },
  //Search Action
  actions: {
    async doGetResult(context, payload, check) {
      await fetch(`${Store.state.apiLink}/users/search/${payload}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            check = {
              isExist: true,
              userId: data._id,
              firstName: data.firstName,
              lastName: data.lastName,
              photo: data.profileImg,
            };
          } else {
            check = {
              isExist: false,
            };
          }
          context.commit("checkResult", check);
        })
        .catch((err) => console.log(err));
    },
    //Notifications Action
    async getFollowers(context, payload) {
      const arr = [];
      await fetch(`${Store.state.apiLink}/${payload.path}/${payload.userID}`)
        .then((res) => res.json())
        .then((data) => {
          data.forEach((el) => {
            arr.unshift(el);
          });
          context.commit("getFollowers", arr);
        })
        .catch((err) => console.log(err));
    },
    //Read Notifcations
    async readNotifcations(context, payload) {
      const headerInfo = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.body),
      };
      await fetch(
        `${Store.state.apiLink}/${payload.updatePath}/${payload.userID}`,
        headerInfo
      )
        .then((res) => res.json())
        .catch((err) => console.log(err));
    },
  },
};
