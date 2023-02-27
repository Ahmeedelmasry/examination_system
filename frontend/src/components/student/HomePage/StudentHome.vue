<template>
  <TheNave />
  <div class="student-home pt-3">
    <TheLoading />
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-sm-8 pr-sm-2">
          <div class="add-exam-div">
            <div class="title">
              <h3 class="text-center py-3">Recent Exams</h3>
            </div>
            <div class="exams px-3">
              <div class="empty-exams" v-if="!getAllExams.length > 0">
                <p>There is no Exams added yet !</p>
              </div>
              <div
                v-for="inst in getAllExams"
                :key="inst.instructorId"
                class="row"
              >
                <div class="instruc-div" :id="inst.instructorId">
                  <router-link
                    :to="`/search-preview/${inst.instructorId}`"
                    class="d-block"
                    style="width: fit-content; margin: auto"
                  >
                    <img
                      v-if="inst.profileImg == ''"
                      src="https://e.top4top.io/p_2363fihh21.jpg"
                      alt=""
                    />
                    <img v-else :src="inst.profileImg" alt="" />
                    <p class="instructor">
                      {{ inst.firstName }} {{ inst.lastName }}
                    </p>
                  </router-link>
                </div>
                <div
                  v-for="exam in inst.exams"
                  :key="exam.id"
                  :id="exam.id"
                  :data-time="exam.time"
                  :data-degree="exam.totalDegree"
                  class="col-6 col-sm-4 col-lg-3 mb-2 exam-dad"
                  :style="
                    exam.status == 'Pending'
                      ? 'pointer-events: none'
                      : 'pointer-events: unset'
                  "
                >
                  <div
                    class="exam card pb-4 position-relative"
                    style="width: 18rem"
                  >
                    <img
                      src="@/assets/exam.jpg"
                      class="exam-img-top"
                      alt="..."
                      @click="
                        openExam(inst.instructorId, inst.studentId, exam.examId)
                      "
                    />
                    <div class="exam-body card-body">
                      <h5
                        v-if="exam.title.length > 15"
                        class="exam-title card-title"
                      >
                        {{ exam.title.slice(0, 15) }} ...
                      </h5>
                      <h5 v-else class="exam-title card-title">
                        {{ exam.title }}
                      </h5>
                      <p class="exam-date">
                        {{ exam.startDate }}
                      </p>
                      <p class="exam-start-time">
                        Start: {{ exam.startTimeAt.slice(0, 5) }}
                      </p>
                      <p class="exam-end-time">
                        End: {{ exam.endTimeAt.slice(0, 5) }}
                      </p>
                      <p
                        class="exam-status"
                        :style="
                          (exam.status == 'Closed' && { color: 'red' }) ||
                          (exam.status == 'Pending' && { color: 'orange' })
                        "
                      >
                        {{ exam.status }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-4 pl-sm-2 mt-3 mt-sm-0">
          <div class="add-url-div">
            <div class="title py-3">
              <h3 class="text-center">Saved URLs</h3>
            </div>
            <div class="urls">
              <div class="empty-urls" v-if="!savedUrlsData.length > 0">
                <p>There is no URLs Saved yet !</p>
              </div>
              <ul
                class="list-unstyled pt-2"
                v-for="urlData in savedUrlsData"
                :key="urlData._id"
              >
                <div :id="urlData.id" class="instruc-div">
                  <router-link :to="`/search-preview/${urlData.instructorId}`">
                    <img
                      v-if="!urlData.profileImg"
                      src="https://e.top4top.io/p_2363fihh21.jpg"
                      alt=""
                    />
                    <img v-else :src="urlData.profileImg" alt="" />
                  </router-link>
                  <p class="instructor">
                    {{ urlData.firstName }} {{ urlData.lastName }}
                  </p>
                </div>
                <li
                  v-for="li in urlData.urls"
                  :key="li._id"
                  class="d-flex justify-content-between align-items-center"
                >
                  <a :href="li.link" target="_blank">
                    <span>{{ li.desc }}</span>
                  </a>
                  <button
                    href="#"
                    class="del-url"
                    @click="deleteUrl(urlData.instructorId, li._id)"
                  >
                    <i class="fa fa-close"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="result-popup">
      <div class="body">
        <p class="alert">You have already completed this exam</p>
        <table class="table-control w-100 mb-4">
          <thead>
            <tr>
              <th>Exam Degree</th>
              <th>Result Degree</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="total">{{ examTotal }}</td>
              <td class="result">{{ stResult }}</td>
              <td class="percentage">{{ resPercent }}</td>
            </tr>
          </tbody>
        </table>
        <div class="result-btns">
          <button class="cancel" @click="closeResultPop">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheNave from "@/components/global/thenav/TheNav.vue";
// import axios from "axios";
import { mapActions, mapState } from "vuex";
import TheLoading from "@/components/global/loading/TheLoading.vue";

export default {
  name: "StudentHome",
  components: {
    TheNave,
    TheLoading,
  },
  data() {
    return {
      savedUrlsData: "",
      getAllExams: "",
      isExamed: "",
      examTotal: 0,
      stResult: 0,
      resPercent: 0,
    };
  },
  computed: {
    ...mapState(["studentHome", "followingModule"]),
  },
  methods: {
    ...mapActions([
      "updateExams",
      "doGetStUrls",
      "doGetStExams",
      "doStOpenExam",
      "doUpdateStExam",
      "doDeleteStURL",
      "checkIfExamed",
      "doCheckAuth",
    ]),
    closeResultPop() {
      document.querySelector(".student-home .result-popup").style.display =
        "none";
    },
    async openExam(instId, stId, examId) {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
      if (!checkAuth) {
        this.$router.push("/signin");
      } else {
        document.querySelector(".student-home .loading").style.cssText = `
        opacity: 0.7; visibility: visible
      `;
        const payload = {
          instId: instId,
          stId: stId,
          examId: examId,
        };
        let checkExam = await this.checkIfExamed(payload);
        if (checkExam.status != "Closed") {
          if (checkExam.isExamed == false) {
            setTimeout(() => {
              document.querySelector(".student-home .loading").style.cssText = `
              opacity: 0; visibility: hidden
            `;
              localStorage.setItem("exam-available", "true");
              this.$router.push(`/start-exam/${instId}/${stId}/${examId}`);
            }, 1000);
          } else {
            document.querySelector(
              ".student-home .result-popup .body p"
            ).innerText = "You have already completed this exam";
            document.querySelector(
              ".student-home .result-popup .body p"
            ).classList = "alert alert-success";
            setTimeout(() => {
              document.querySelector(".student-home .loading").style.cssText = `
            opacity: 0; visibility: hidden
          `;

              this.examTotal = checkExam.totalDegree;
              this.stResult = checkExam.result;
              this.resPercent =
                (
                  (parseInt(checkExam.result) * 100) /
                  parseInt(checkExam.totalDegree)
                ).toFixed(2) + "%";
              setTimeout(() => {
                document.querySelector(
                  ".student-home .result-popup"
                ).style.display = "flex";
              }, 100);
            }, 500);
          }
        } else {
          if (checkExam.isExamed) {
            document.querySelector(
              ".student-home .result-popup .body p"
            ).innerText = "You have already completed this exam";
            document.querySelector(
              ".student-home .result-popup .body p"
            ).classList = "alert alert-success";
            setTimeout(() => {
              document.querySelector(".student-home .loading").style.cssText = `
            opacity: 0; visibility: hidden
          `;

              this.examTotal = checkExam.totalDegree;
              this.stResult = checkExam.result;
              this.resPercent =
                (
                  (parseInt(checkExam.result) * 100) /
                  parseInt(checkExam.totalDegree)
                ).toFixed(2) + "%";
              setTimeout(() => {
                document.querySelector(
                  ".student-home .result-popup"
                ).style.display = "flex";
              }, 100);
            }, 500);
          } else {
            document.querySelector(
              ".student-home .result-popup .body p"
            ).innerText = "You have Missed This Exam";
            document.querySelector(
              ".student-home .result-popup .body p"
            ).classList = "alert alert-danger";
            setTimeout(() => {
              document.querySelector(".student-home .loading").style.cssText = `
            opacity: 0; visibility: hidden
          `;

              this.examTotal = checkExam.totalDegree;
              this.stResult = "Missed Exam";
              this.resPercent = "Missed Exam";
              setTimeout(() => {
                document.querySelector(
                  ".student-home .result-popup"
                ).style.display = "flex";
              }, 100);
            }, 500);
          }
        }
      }
    },
    async deleteUrl(instructorId, urlId) {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
      if (!checkAuth) {
        this.$router.push("/signin");
      } else {
        document
          .querySelectorAll(".student-home .add-url-div .urls li .del-url")
          .forEach((btn) => {
            btn.style.pointerEvents = "none";
          });
        let payload = {
          instructorId: instructorId,
          studentId: checkAuth._id,
          urlId: urlId,
        };
        await this.doDeleteStURL(payload);
        await this.doGetStUrls(payload.studentId);
        this.savedUrlsData = this.studentHome.allUrls;
        document
          .querySelectorAll(".student-home .add-url-div .urls li .del-url")
          .forEach((btn) => {
            btn.style.pointerEvents = "unset";
          });
      }
    },
  },
  async mounted() {
    const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);

    if (!checkAuth) {
      this.$router.push("/signin");
    } else {
      if (checkAuth.userRole != "STUDENT") {
        this.$router.push("/");
      } else {
        // //Update Exam Status And Get
        if (document.documentElement.exitFullscreen) {
          document.documentElement.exitFullscreen();
        } else if (document.documentElement.webkitExitFullscreen) {
          /* Safari */
          document.documentElement.webkitExitFullscreen();
        } else if (document.documentElement.msExitFullscreen) {
          /* IE11 */
          document.documentElement.msExitFullscreen();
        }
        navigator.keyboard.unlock();
        window.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 27 }));
        let userId = checkAuth._id;
        await this.doGetStExams(userId);
        this.getAllExams = this.studentHome.stExams;
        setTimeout(async () => {
          await this.doGetStExams(userId);
          this.getAllExams = this.studentHome.stExams;
        }, 1000 * 60);
        await this.doGetStUrls(userId);
        this.savedUrlsData = this.studentHome.allUrls;
        document.querySelector(".student-home .loading").style.cssText = `
        opacity: 0; visibility: hidden
      `;
      }
    }
  },
  //End Get Shared Exams
};
</script>

<style lang="scss">
@import "../../../assets/sass/main.scss";

.student-home {
  a {
    text-decoration: none !important;
    color: unset !important;
  }
  .add-exam-div {
    position: relative;
    height: 75vh;
    box-shadow: 0px 0px 5px -2px black;
    background-color: white;
    border-radius: $bRadius;
    overflow: hidden;
    margin-top: 30px;
    width: 97%;
    margin-left: auto;
    margin-right: auto;
    .title h3 {
      font-size: 30px;
      font-weight: 900;
      background-color: $mainColor;
      color: $titleColor;
    }
    .exams {
      height: 89%;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      .empty-exams {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        p {
          font-style: italic;
          text-align: center;
          font-size: 25px;
          color: #8684849e;
          font-weight: 500;
        }
      }
      .instruc-div {
        text-align: center;
        width: 100%;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
        }
        .instructor {
          font-weight: 700;
          color: #838181;
          margin-left: 10px;
          text-transform: capitalize;
        }
      }
      .exam {
        border-radius: 7px !important;
        width: 100% !important;
        overflow: hidden;
        margin-bottom: 10px;
        img {
          height: 120px !important;
          width: 100%;
          object-fit: cover;
          cursor: pointer;
        }
        .exam-body {
          padding-left: 10px !important;
          padding-right: 10px !important;
          padding-top: 10px !important;
          padding-bottom: 10px !important;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .exam-title {
            font-size: 14px !important;
            font-weight: 500 !important;
            margin-bottom: 5px;
          }
          .exam-date {
            font-size: 10px !important;
            font-weight: 500 !important;
            margin-bottom: 3px;
            color: indianred;
          }
          .exam-start-time {
            font-size: 10px !important;
            font-weight: 500 !important;
            margin-bottom: 3px;
            color: #3569da;
          }
          .exam-end-time {
            font-size: 10px !important;
            font-weight: 500 !important;
            margin-bottom: 3px;
            color: indianred;
          }
          .exam-status {
            font-size: 10px;
            font-weight: 700;
            margin-bottom: 0;
            margin-top: 3px;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: -webkit-fit-content;
            width: -moz-fit-content;
            width: fit-content;
            color: #46b846;
            letter-spacing: 1px;
          }
        }
      }
    }
  }
  .add-url-div {
    height: 75vh;
    box-shadow: 0px 0px 5px -2px black;
    background-color: white;
    border-radius: $bRadius;
    overflow: hidden;
    margin-top: 30px;
    width: 97%;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    .title {
      background-color: $mainColor;
      h3 {
        font-size: 30px;
        font-weight: 900;
        color: $titleColor;
      }
    }
    .urls {
      height: 89%;
      overflow-y: auto;
      overflow-x: hidden;
      box-shadow: 0px 2px 6px -5px black;
      position: relative;
      .empty-urls {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        p {
          font-style: italic;
          text-align: center;
          font-size: 25px;
          color: #8684849e;
          font-weight: 500;
        }
      }
      li {
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #edddd4;
        padding: 10px 20px;
        border-bottom: 1px solid black;
        border-top: 1px solid black;
        a {
          transition: 0.1s all ease-in-out;
          &:hover {
            color: rgb(57, 57, 254) !important;
          }
        }
        span {
          font-size: 15px;
          font-weight: 700;
        }
        .del-url {
          background-color: rgba(205, 92, 92, 0.739);
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          border-radius: 3px;
          font-size: 11px;
          transition: 0.2s;
          cursor: pointer;
          border: none;
          outline: none;
          &:hover {
            background-color: indianred;
          }
        }
      }
      .instruc-div {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
        }
        .instructor {
          font-weight: 700;
          color: #838181;
          margin-left: 10px;
          text-transform: capitalize;
        }
      }
    }
  }
}
.student-home .result-popup {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.587);
  z-index: 3000;
  display: none;
  justify-content: center;
  align-items: center;
  .body {
    width: 50%;
    color: black;
    background-color: white;
    text-align: center;
    border-radius: 11px;
    padding-bottom: 30px;
    p {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 30px;
    }
    th {
      font-size: 17px;
      font-weight: 500;
    }
    .total,
    .result,
    .percentage {
      font-size: 19px;
      font-weight: 500;
      padding-top: 15px;
      letter-spacing: 1px;
    }
    button {
      border: 1px solid #4175ee;
      background-color: #4175ee;
      color: white;
      border-radius: 4px;
      padding: 5px 13px 7px;
      margin-top: 10px;
    }
  }
}
//Media Queries
@media (max-width: 990px) {
  .student-home .add-exam-div,
  .student-home .add-url-div {
    width: 100%;
    h3 {
      font-size: 20px !important;
    }
  }
  .student-home .add-url-div .urls .empty-urls p {
    font-size: 19px;
  }
  .student-home .add-exam-div .exams .empty-exams p {
    font-size: 19px;
  }
  .student-home .result-popup .body {
    width: 62%;
  }
}
@media (max-width: 767px) {
  .student-home .add-url-div .urls li span {
    font-size: 12px;
  }
  .student-home {
    .add-exam-div {
      .title h3 {
        font-size: 17px;
      }
      .exams {
        height: 90%;
      }
      .exams .exam .exam-body {
        .exam-title {
          font-size: 11px !important;
        }
        .exam-date {
          font-size: 7px !important;
        }
        .exam-start-time {
          font-size: 7px !important;
        }
        .exam-end-time {
          font-size: 7px !important;
        }
        .exam-status {
          font-size: 7px;
        }
      }
    }
    .add-url-div {
      .title h3 {
        font-size: 17px;
      }
      .urls {
        height: 90%;
        li a {
          font-size: 9px;
        }
      }
      .add-url {
        font-size: 15px;
        padding: 7px 12px;
      }
      .write-url-div {
        input {
          padding-top: 2px;
          padding-bottom: 2px;
          font-size: 12px;
          width: 100%;
        }
        button .confirm-url {
          width: 25px;
          height: 25px;
          font-size: 9px;
        }
      }
    }
  }
  .student-home .result-popup .body {
    p {
      font-size: 15px;
    }
    th {
      font-size: 14px;
    }
    td {
      font-size: 16px;
    }
    button {
      font-size: 12px;
    }
  }
}
@media (max-width: 575px) {
  .student-home {
    margin-bottom: 20px;
    .add-exam-div {
      border-radius: 20px;
    }
    .add-exam-div .exams .empty-exams p {
      font-size: 15px;
    }
    .add-url-div {
      height: 62vh;
      border-radius: 20px;
      .urls {
        .empty-urls p {
          font-size: 15px;
        }
      }
      .write-url-div {
        button {
          margin-top: 10px;
        }
        input {
          padding-top: 5px;
          padding-bottom: 7px;
          font-size: 12px;
          width: 79%;
        }
      }
    }
  }
  .student-home .result-popup .body {
    width: 90%;
    p {
      font-size: 12px;
    }
    th {
      font-size: 11px;
    }
    td {
      font-size: 13px !important;
    }
    button {
      font-size: 10px;
    }
  }
}
</style>
