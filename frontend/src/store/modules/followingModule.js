import Store from "@/store/index";

export default {
  state: {
    isFollowed: null,
    stExams: "",
  },
  mutations: {
    checkFollowed(state, payload) {
      state.isFollowed = payload;
    },
    getStExams(state, payload) {
      state.stExams = payload;
    },
  },
  actions: {
    async doCheckFollowed(context, payload) {
      await fetch(
        `${Store.state.apiLink}/follows/${payload.studentId}/${payload.instructorId}`
      )
        .then((res) => res.json())
        .then((data) => context.commit("checkFollowed", data));
    },
    async doFollow(context, payload) {
      const headerInfo = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      };
      await fetch(`${Store.state.apiLink}/follows/do-follow`, headerInfo)
        .then((res) => res.json())
        .then((data) => context.commit("checkFollowed", data));
    },
    async doUnfollow(context, payload) {
      const headerInfo = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      };
      await fetch(`${Store.state.apiLink}/follows/do-unfollow`, headerInfo)
        .then((res) => res.json())
        .catch((err) => console.log(err));
    },
    async doGetSearchedExams(context, payload) {
      await fetch(
        `${Store.state.apiLink}/shares/get-search-exams/${payload.studentId}/${payload.instructorId}`
      )
        .then((res) => res.json())
        .then((firstData) => {
          context.commit("getStExams", firstData);
        })
        .catch((err) => console.log(err));
    },
    async doCheckUrls(context, payload) {
      await fetch(
        `${Store.state.apiLink}/saved-urls/find/${payload.instructorId}/${payload.studentId}`
      )
        .then((res) => res.json())
        .then(async (data) => {
          if (data) {
            let urlExists = "";
            for (let i = 0; i < data.urls.length; i++) {
              if (data.urls[i]._id == payload.urls[0]._id) {
                urlExists = true;
                break;
              } else {
                urlExists = false;
              }
            }
            if (urlExists == false) {
              const urlsArr = data.urls;
              urlsArr.push(payload.urls[0]);
              const headerInfo = {
                method: "Put",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(urlsArr),
              };
              await fetch(
                `${Store.state.apiLink}/saved-urls/push-url/${payload.instructorId}/${payload.studentId}`,
                headerInfo
              )
                .then((res) => res.json())
                .catch((err) => console.log(err));
            }
            //////
          } else {
            const headerInfo = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            };
            await fetch(`${Store.state.apiLink}/saved-urls/add`, headerInfo)
              .then((res) => res.json())
              .catch((err) => console.log(err));
          }
        });
    },
    async doDeleteStURL(context, payload) {
      await fetch(
        `${Store.state.apiLink}/saved-urls/find/${payload.instructorId}/${payload.studentId}`
      )
        .then((res) => res.json())
        .then(async (data) => {
          let urlsArr = data.urls;
          urlsArr.forEach((url, index) => {
            if (url._id == payload.urlId) {
              urlsArr.splice(index, 1);
            }
          });
          if (urlsArr.length <= 0) {
            const headerInfo = {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            };
            await fetch(
              `${Store.state.apiLink}/saved-urls/delete-url-share/${payload.instructorId}/${payload.studentId}`,
              headerInfo
            )
              .then((res) => res.json())
              .catch((err) => console.log(err));
          } else {
            const headerInfo = {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(urlsArr),
            };
            await fetch(
              `${Store.state.apiLink}/saved-urls/push-url/${payload.instructorId}/${payload.studentId}`,
              headerInfo
            )
              .then((res) => res.json())
              .catch((err) => console.log(err));
          }
        });
    },
  },
};
