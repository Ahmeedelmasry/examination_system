import Store from "@/store/index";

export default {
  state: {
    urlAdd: null,
    urls: "",
    allExams: "",
    followers: "",
    examsUpdated: null,
  },
  mutations: {
    //Add Url
    addUrl(state, payload) {
      state.urlAdd = payload;
    },
    //Get Urls
    getUrls(state, payload) {
      state.urls = "";
      if (payload.length > 0) {
        state.urls = payload;
      }
    },
    //Get Exams
    getExams(state, payload) {
      state.allExams = payload;
    },
    updateExams(state, payload) {
      state.examsUpdated = payload;
    },
  },
  actions: {
    //Insert Url
    async doAddUrl(context, urlData) {
      const postHeaderInfo = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(urlData),
      };
      await fetch(`${Store.state.apiLink}/urls/add`, postHeaderInfo)
        .then((res) => res.json())
        .then(() => {
          context.commit("addUrl", true);
          setTimeout(() => {
            context.commit("addUrl", null);
          }, 500);
        });
    },
    //Get Urls
    async doGetUrls(context, userId) {
      await fetch(`${Store.state.apiLink}/urls/${userId}`)
        .then((res) => res.json())
        .then((data) => context.commit("getUrls", data));
    },
    //Delete Url
    async doDeleteUrl(context, payload) {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      };
      await fetch(
        `${Store.state.apiLink}/urls/delete/${payload}`,
        requestOptions
      )
        .then((res) => res.json())
        .catch((err) => console.log(err));
    },
    ////////////////////
    //Add Exam
    async doAddExam(contxt, payload) {
      const theHeaderInfo = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      };
      await fetch(`${Store.state.apiLink}/exams/new/add`, theHeaderInfo).catch(
        (err) => console.log(err)
      );
    },
    //Get Exams
    async doGetExams(context, userId) {
      await fetch(`${Store.state.apiLink}/exams/all/${userId}`)
        .then((res) => res.json())
        .then((firstData) => {
          const sortedArr = [];
          firstData.forEach((exam) => {
            sortedArr.unshift(exam);
          });
          context.commit("getExams", sortedArr);
        })
        .catch((err) => console.log(err));
    },
    async doDelSharedExam(context, payload) {
      context.commit("resetData", []);
      await fetch(`${Store.state.apiLink}/shares/exam-result/${payload.instId}`)
        .then((res) => res.json())
        .then(async (data) => {
          await data.forEach((share) => {
            let sharedExams = share.exams;
            sharedExams.forEach(async (exam, index) => {
              if (exam.examId == payload.examId) {
                sharedExams.splice(index, 1);
                if (sharedExams.length <= 0) {
                  const headerInfo = {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ _id: share._id }),
                  };
                  await fetch(
                    `${Store.state.apiLink}/shares/delete-share`,
                    headerInfo
                  ).then((res) => res.json());
                } else {
                  const headerInfo = {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(sharedExams),
                  };
                  await fetch(
                    `${Store.state.apiLink}/shares/delete-shared-exam/${share._id}`,
                    headerInfo
                  ).then((res) => res.json());
                }
              }
            });
          });
        });
    },
    //Delete Exams
    async doDelExamsAction(context, examId) {
      const theHeaderInfo = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      await fetch(
        `${Store.state.apiLink}/exams/delete/${examId}`,
        theHeaderInfo
      )
        .then((res) => res.json())
        .catch((err) => console.log(err));
    },
    async doCheckExam(context, payload) {
      let sharResp = "";
      await fetch(
        `${Store.state.apiLink}/shares/find/${payload.instructorId}/${payload.studentId}`
      )
        .then((res) => res.json())
        .then(async (data) => {
          if (data) {
            sharResp = { message: "Exam Shared Successfully" };
            let examExists = "";
            for (let i = 0; i < data.exams.length; i++) {
              if (data.exams[i].examId == payload.exams[0].examId) {
                examExists = true;
                break;
              } else {
                examExists = false;
              }
            }
            if (examExists == false) {
              const examsArr = data.exams;
              examsArr.push(payload.exams[0]);
              const headerInfo = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(examsArr),
              };
              await fetch(
                `${Store.state.apiLink}/shares/push-exam/${payload.instructorId}/${payload.studentId}`,
                headerInfo
              )
                .then((res) => res.json())
                .then(async () => {
                  const pushNotifHeader = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      instructorId: payload.instructorId,
                      studentId: payload.studentId,
                      isRead: false,
                      firstName: payload.firstName,
                      lastName: payload.lastName,
                      profileImg: payload.profileImg,
                      message: "has shared a new exam with you",
                    }),
                  };
                  await fetch(
                    `${Store.state.apiLink}/st-notifs/push-notif`,
                    pushNotifHeader
                  )
                    .then((res) => res.json())
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            }
            //////
          } else {
            const headerInfo = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            };
            await fetch(`${Store.state.apiLink}/shares/add`, headerInfo)
              .then((res) => res.json())
              .then(async (data) => {
                sharResp = data;
                const pushNotifHeader = {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    instructorId: payload.instructorId,
                    studentId: payload.studentId,
                    isRead: false,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    profileImg: payload.profileImg,
                    message: "has shared a new exam with you",
                  }),
                };
                await fetch(
                  `${Store.state.apiLink}/st-notifs/push-notif`,
                  pushNotifHeader
                )
                  .then((res) => res.json())
                  .catch((err) => console.log(err));
              })
              .then(() => {})
              .catch((err) => console.log(err));
          }
        });
      return sharResp;
    },
  },
};
