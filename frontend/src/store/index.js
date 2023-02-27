import { createStore } from "vuex";
import allUserInfo from "@/store/modules/getProfileInfo";
import signupModule from "@/store/modules/signupModule";
import forgetPass from "@/store/modules/forgetPassModule";
import navbarModule from "@/store/modules/navbarModule";
import instrucHome from "@/store/modules/instructor/homeModule";
import examPrev from "@/store/modules/instructor/examPreviewModule";
import showResult from "@/store/modules/instructor/showResult";
import getSubjects from "@/store/modules/instructor/subjectHomeModule";
import SubjectPreview from "@/store/modules/instructor/subjectPrevModule";
import followingModule from "@/store/modules/followingModule";
//End Instructor
import studentHome from "@/store/modules/students/stHomeModule";

export default createStore({
  modules: {
    allUserInfo,
    signupModule,
    forgetPass,
    navbarModule,
    instrucHome,
    examPrev,
    showResult,
    getSubjects,
    SubjectPreview,
    studentHome,
    followingModule,
  },
  state: {
    apiLink: "http://localhost:3000",
    // apiLink: "https://online-exam-system-oes.herokuapp.com",
    loginErr: null,
    loginData: null,
    isAuthed: null,
  },
  getters: {},
  mutations: {
    checkAuth(state, payload) {
      state.isAuthed = payload;
    },
    //Bind User Data with Inputs
    catchErr(state, payload) {
      state.loginErr = payload;
    },
    userDataMu(state, payload) {
      state.loginData = payload;
    },
    logout(state, payload) {
      state.isAuthed = payload;
      state.loginData = payload;
    },
  },
  actions: {
    doResetErrs(context) {
      context.commit("catchErr", null);
    },
    async doCheckAuth(context, apiLink) {
      let checkAuth;
      console.log("fired store");
      await fetch(`${apiLink}/users/check/is-auth`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authError) {
            checkAuth = null;
          } else {
            checkAuth = data;
          }
        });
      return checkAuth;
    },
    //Check If user exists or not
    async checkUser(context, payload) {
      await fetch(`${context.state.apiLink}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payload.email,
          password: payload.pass,
        }),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            context.commit("catchErr", data.error);
            context.commit("userDataMu", null);
          } else {
            context.commit("catchErr", null);
            context.commit("userDataMu", data);
          }
        });
    },
    async doSignOut(context, payload) {
      await fetch(`${payload}/users/logout`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(() => context.commit("logout"))
        .catch((err) => console.log(err));
    },
  },
});
