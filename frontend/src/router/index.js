import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage";
import DrHomepage from "@/components/instructor/HomePage/DrHomeComponent";
import StudentHome from "@/components/student/HomePage/StudentHome";
import SearchPreview from "@/components/student/search/SearchPreview";
import StartExam from "@/components/student/StartTest/StartExam";
import SignIn from "@/components/global/logging/SignIn.vue";
import SignUp from "@/components/global/logging/SignUp.vue";
import ForgetPassword from "@/components/global/logging/ForgetPassword.vue";
import TheProfile from "@/components/global/Profile/TheProfile.vue";
import EditProfile from "@/components/global/Profile/EditProfile.vue";
import ExamDetails from "@/components/instructor/test-creating/ExamDetails.vue";
import CreateExam from "@/components/instructor/test-creating/CreateExam.vue";
import TestPreview from "@/components/instructor/test-preview/TestPreview.vue";
import SeeResult from "@/components/instructor/SeeResults/SeeResults.vue";
import BankPage from "@/components/instructor/TestBank/BankPage.vue";
import SubjectsHome from "@/components/instructor/TestBank/SubjectsHome.vue";
import SubjectsPreview from "@/components/instructor/TestBank/SubjectsPreview.vue";
import ErrPage from "@/components/error404/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/instructor-home",
    name: "DrHomepage",
    component: DrHomepage,
  },
  {
    path: "/student-result/:instId/:examId",
    name: "SeeResult",
    component: SeeResult,
  },
  {
    path: "/student-home",
    name: "StudentHome",
    component: StudentHome,
  },
  {
    path: "/search-preview/:id",
    name: "SearchPreview",
    component: SearchPreview,
  },

  {
    path: "/start-exam/:instId/:stId/:exId",
    name: "StartExam",
    component: StartExam,
  },
  {
    path: "/exam-details",
    name: "ExamDetails",
    component: ExamDetails,
  },
  {
    path: "/create-exam",
    name: "CreateExam",
    component: CreateExam,
  },
  {
    path: "/test-bank",
    name: "BankPage",
    component: BankPage,
  },
  {
    path: "/subjects-home",
    name: "SubjectsHome",
    component: SubjectsHome,
  },
  {
    path: "/subjects-preview/:id",
    name: "SubjectsPreview",
    component: SubjectsPreview,
  },

  {
    path: "/test-preview/:id",
    name: "TestPreview",
    component: TestPreview,
  },
  {
    path: "/profile",
    name: "TheProfile",
    component: TheProfile,
  },
  {
    path: "/edit-profile",
    name: "EditProfile",
    component: EditProfile,
  },
  {
    path: "/signin",
    name: "signin",
    component: SignIn,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUp,
  },
  {
    path: "/forget-password",
    name: "ForgetPassword",
    component: ForgetPassword,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "ErrPage",
    component: ErrPage,
    meta: {
      title: "Page 404 Not Found",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return { savedPosition };
    } else {
      return { top: 0 };
    }
  },
});
export default router;
