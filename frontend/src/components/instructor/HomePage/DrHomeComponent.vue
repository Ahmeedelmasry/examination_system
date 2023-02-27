<template>
  <div class="dr-home">
    <TheNave />
    <div class="container-fluid mt-3">
      <TheLoading />

      <div class="row">
        <div class="col-12 col-sm-8 pr-sm-2">
          <div class="add-exam-div">
            <div class="title">
              <h3 class="text-center py-3">Recent Exams</h3>
            </div>
            <div class="exams px-3">
              <div
                class="empty-exams"
                v-if="getAllExams == '' || getAllExams == {}"
              >
                <p>There is no Exams added yet !</p>
              </div>
              <div class="row">
                <div
                  v-for="exam in getAllExams"
                  :key="exam.id"
                  class="col-6 col-sm-4 col-lg-3 mb-2 exam-dad"
                  :id="exam.id"
                  :data-time="exam.time"
                  :data-degree="exam.totalDegree"
                >
                  <div
                    class="exam card pb-4 position-relative"
                    style="width: 18rem"
                  >
                    <img
                      src="@/assets/exam.jpg"
                      class="exam-img-top"
                      alt="..."
                      @click="previewExam(exam._id)"
                    />
                    <div class="exam-body card-body">
                      <div class="d-flex align-items-center">
                        <h5 class="exam-title card-title">
                          {{ exam.title }}
                        </h5>
                      </div>
                      <p class="exam-date d-flex align-items-center">
                        <span class="month">{{ exam.startDate }}</span>
                      </p>
                      <p class="exam-start-time d-flex align-items-center">
                        <span class="exam-start-time"
                          >start: {{ exam.startTimeAt.slice(0, 5) }}</span
                        >
                      </p>
                      <p class="exam-end-time mb-1">
                        <span>End: {{ exam.endTimeAt.slice(0, 5) }}</span>
                      </p>
                      <p
                        v-if="exam.status == 'Closed'"
                        class="exam-status"
                        style="color: indianred"
                      >
                        {{ exam.status }}
                      </p>
                      <p
                        v-else-if="exam.status == 'Pending'"
                        class="exam-status"
                        style="color: orange"
                      >
                        {{ exam.status }}
                      </p>
                      <p v-else class="exam-status">
                        {{ exam.status }}
                      </p>
                    </div>
                    <div
                      v-if="exam.status == 'Closed'"
                      class="show-result d-flex justify-content-center"
                    >
                      <button @click="getResults(exam._id)" class="mr-1">
                        Results
                      </button>
                      <button
                        @click="openExamAlert(exam._id)"
                        class="ml-1"
                        style="background-color: indianred"
                      >
                        Delete
                      </button>
                    </div>
                    <div
                      v-if="exam.status != 'Closed'"
                      class="share-delete-div position-absolute"
                    >
                      <i
                        class="fa fa-trash-can delete-exam-btn"
                        style="cursor: pointer"
                        @click="openExamAlert(exam._id)"
                        v-if="exam.status != 'Open'"
                        title="Delete Exam"
                      ></i>
                      <i
                        class="fa fa-share-nodes share-exam-btn"
                        style="cursor: pointer"
                        @click="openSharePop(exam)"
                        title="Share Exam"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
              <form @submit.prevent="submitShareExam">
                <div class="share-popup">
                  <div class="overlay" @click="closeSharePop"></div>
                  <div class="students-div">
                    <div
                      style="
                        display: flex;
                        flex-direction: row-reverse;
                        align-items: center;
                      "
                    >
                      <div v-if="this.followers.length > 0" class="select-all">
                        <p class="text-right" @click="selectAllStudents">
                          Select All
                        </p>
                      </div>
                      <div class="d-flex pl-4 mr-auto pt-3" style="gap: 10px">
                        <div class="d-flex flex-column">
                          <label
                            style="font-size: 13px; margin-bottom: 3px"
                            for="grade_no"
                            >Grade</label
                          >
                          <select
                            name="grade_no"
                            id="grade_no"
                            style="padding: 5px 10px; border-radius: 3px"
                            v-model="gradeNo"
                            @change="filterStudents"
                          >
                            <option value="all">All Grades</option>
                            <option value="first">First Grade</option>
                            <option value="second">Second Grade</option>
                            <option value="third">Third Grade</option>
                            <option value="fourth">Fourth Grade</option>
                          </select>
                        </div>
                        <div class="d-flex flex-column">
                          <label
                            for="section_no"
                            style="font-size: 13px; margin-bottom: 3px"
                            >Section</label
                          >
                          <select
                            style="padding: 5px 10px; border-radius: 3px"
                            name="section_no"
                            id="section_no"
                            v-model="sectionNo"
                            :disabled="gradeNo == 'all'"
                            @change="filterStudents"
                          >
                            <option value="all">All Sections</option>
                            <option value="no1">section 1</option>
                            <option value="no2">section 2</option>
                            <option value="no3">section 3</option>
                            <option value="no4">section 4</option>
                            <option value="no5">section 5</option>
                            <option value="no6">section 6</option>
                            <option value="no7">section 7</option>
                            <option value="no8">section 8</option>
                            <option value="no9">section 9</option>
                            <option value="no10">section 10</option>
                            <option value="no1">section 11</option>
                            <option value="no2">section 12</option>
                            <option value="no3">section 13</option>
                            <option value="no4">section 14</option>
                            <option value="no5">section 15</option>
                            <option value="no6">section 16</option>
                            <option value="no7">section 17</option>
                            <option value="no8">section 18</option>
                            <option value="no9">section 19</option>
                            <option value="no10">section 20</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <ul class="list-unstyled">
                      <li
                        v-for="follower in this.followers"
                        :key="follower._id"
                      >
                        <div class="student-data">
                          <img
                            v-if="!follower.profileImg"
                            src="https://d.top4top.io/p_2373dflq31.png"
                            alt=""
                          />
                          <img v-else :src="follower.profileImg" alt="" />
                          <span class="student"
                            >{{ follower.firstName }}
                            {{ follower.lastName }}</span
                          >
                        </div>
                        <input
                          type="checkbox"
                          :value="follower.studentId"
                          @change="selectStudent"
                        />
                      </li>
                      <div v-if="this.followers.length > 0" class="submit">
                        <button>Send</button>
                      </div>
                    </ul>
                    <div
                      v-if="!this.followers.length > 0"
                      class="empty-students"
                    >
                      <p>No Student Available!</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <router-link to="exam-details">
              <i
                style="pointer-events: painted"
                class="fa fa-plus create-exam"
              ></i>
            </router-link>
          </div>
        </div>
        <div class="col-12 col-sm-4 pl-sm-2 mt-3 mt-sm-0">
          <div class="add-url-div">
            <div class="title py-3">
              <h3 class="text-center">Recent URLs</h3>
            </div>
            <div class="urls pt-3">
              <div class="empty-urls">
                <p v-if="this.allUrls == '' || this.allUrls == {}">
                  There is no Urls added yet !
                </p>
              </div>
              <ul
                class="list-unstyled"
                v-if="this.allUrls != '' || this.allUrls != {}"
              >
                <li v-for="(url, index) in this.allUrls" :key="index">
                  <a :href="url.link" target="_blank">{{ url.desc }}</a>
                  <i class="fa fa-close" @click="deleteUrl(url._id)"></i>
                </li>
              </ul>
            </div>
            <i
              style="pointer-events: painted"
              class="fa fa-plus add-url"
              @click="openAddUrl"
            ></i>
            <form @submit.prevent="addNewUrl" class="pl-3">
              <div class="write-url-div p-3 pt-1 position-relative">
                <span class="url-repeat-err position-absolute"
                  ><span class="yellow position-absolute"></span> Url already
                  exists!</span
                >
                <label for="url">
                  Enter URL
                  <input type="url" name="url" required v-model="url" />
                </label>
                <label for="title">
                  Enter Title
                  <input type="text" name="title" required v-model="urlTitle" />
                </label>
                <div
                  class="d-flex justify-content-center align-items-center"
                  style="gap: 10px"
                >
                  <button>
                    <i class="fa fa-check confirm-url"></i>
                  </button>
                  <button @click="closeUrl">
                    <i class="fa fa-close close-url" @click="closeUrl"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheNave from "@/components/global/thenav/TheNav.vue";
import TheLoading from "@/components/global/loading/TheLoading.vue";

import { mapActions, mapState } from "vuex";
export default {
  name: "DrHome",
  data() {
    return {
      url: "",
      urlTitle: "",
      urlExists: false,
      getAllExams: [],
      examId: "",
      allUrls: "",
      followers: "",
      sectionNo: "all",
      gradeNo: "all",
    };
  },
  components: {
    TheNave,
    TheLoading,
  },
  computed: {
    ...mapState(["instrucHome", "navbarModule", "allUserInfo"]),
  },
  watch: {
    gradeNo(val) {
      if (val == "all") {
        this.sectionNo = "all";
      }
    },
  },
  methods: {
    ...mapActions([
      "doAddUrl",
      "doGetUrls",
      "doDeleteUrl",
      "updateExams",
      "doGetExams",
      "doDelExamsAction",
      "doShareExam",
      "doCheckExam",
      "doDelSharedExam",
      "doCheckAuth",
    ]),
    showAlert(icn, msg, btnTxt, showCancel = false, cancelTxt = "") {
      this.$swal({
        title: msg,
        icon: icn,
        confirmButtonText: btnTxt,
        cancelButtonText: cancelTxt,
        confirmButtonColor: "#197278",
        cancelButtonColor: "#dc3545",
        showCancelButton: showCancel,
        showCloseButton: true,
      });
    },
    stopAlertProp(e) {
      e.stopPropagation();
    },
    closeDelExamAlert(e) {
      e.currentTarget.style.display = "none";
      localStorage.removeItem("del-exam");
    },
    openExamAlert(examId) {
      this.showAlert("question", "Are you sure?", "Delete", true, "Cancel");
      setTimeout(() => {
        document
          .querySelector(".swal2-styled.swal2-confirm")
          .addEventListener("click", () => {
            this.doDelExam(examId);
          });
      }, 0);
      localStorage.setItem("del-exam", examId);
    },
    //Delete Exam
    async doDelExam(examId) {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
      if (!checkAuth) {
        this.$router.push("/signin");
      } else {
        const payload = {
          examId: examId,
          instId: checkAuth._id,
        };
        await this.doDelSharedExam(payload);
        await this.doDelExamsAction(localStorage.getItem("del-exam"));
        let theId = checkAuth._id;
        this.doDelSharedExam(payload);
        await this.doGetExams(theId);
        this.getAllExams = this.instrucHome.allExams;
        localStorage.removeItem("del-exam");
      }
    },
    openAddUrl() {
      document.querySelector(".dr-home .add-url-div .add-url").style.display =
        "none";
      document.querySelector(
        ".dr-home .add-url-div .write-url-div"
      ).style.display = "block";
      document
        .querySelectorAll(".dr-home .add-url-div .write-url-div input")
        .forEach((inp) => {
          inp.value = "";
        });
    },
    closeUrl() {
      document.querySelector(".dr-home .add-url-div .add-url").style.display =
        "block";
      document.querySelector(
        ".dr-home .add-url-div .write-url-div"
      ).style.display = "none";
    },
    async addNewUrl() {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);

      if (!checkAuth) {
        this.$router.push("/signin");
      } else {
        let urlInp = document.querySelector(
          ".dr-home .add-url-div .write-url-div input[type=url]"
        );
        let allUrls = [];
        /////////////
        if (
          document.querySelector(".dr-home .add-url-div .urls ul").innerHTML !=
          ""
        ) {
          allUrls = document.querySelectorAll(
            ".dr-home .add-url-div .urls ul li"
          );
          for (let i = 0; i < allUrls.length; i++) {
            if (
              allUrls[i].querySelector("a").getAttribute("href") != urlInp.value
            ) {
              this.urlExists = false;
            } else {
              this.urlExists = true;
              break;
            }
          }
        }
        //Check if url exists or new
        if (this.urlExists == true) {
          document.querySelector(
            ".dr-home .add-url-div .write-url-div .url-repeat-err"
          ).style.display = "block";
          setTimeout(() => {
            document.querySelector(
              ".dr-home .add-url-div .write-url-div .url-repeat-err"
            ).style.display = "none";
          }, 3000);
        } else {
          let insertData = {
            uId: checkAuth._id,
            link: this.url,
            desc: this.urlTitle,
          };
          await this.doAddUrl(insertData);
          const userID = checkAuth._id;
          await this.doGetUrls(userID);
          this.allUrls = this.instrucHome.urls;
          // this.instrucHome.urlAdd
          document.querySelector(
            ".dr-home .add-url-div .add-url"
          ).style.display = "block";
          document.querySelector(
            ".dr-home .add-url-div .write-url-div"
          ).style.display = "none";
        }
      }
    },
    //Deleting Url
    async deleteUrl(id) {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);

      if (!checkAuth) {
        this.$router.push("/signin");
      } else {
        await this.doDeleteUrl(id);
        const userID = checkAuth._id;
        await this.doGetUrls(userID);
        this.allUrls = this.instrucHome.urls;
      }
    },
    closeSharePop() {
      document.querySelector(
        ".dr-home .add-exam-div .exams .share-popup"
      ).style.display = "none";
      localStorage.removeItem("share-exam");
    },
    async openSharePop(exam) {
      this.followers = this.navbarModule.followers;
      this.sectionNo = "all";
      this.gradeNo = "all";
      document.querySelector(
        ".dr-home .add-exam-div .exams .share-popup"
      ).style.display = "block";
      localStorage.setItem("share-exam", JSON.stringify(exam));
      document
        .querySelectorAll(
          ".dr-home .add-exam-div .exams .share-popup .students-div ul input"
        )
        .forEach((inp) => {
          if (inp.checked) {
            inp.checked = false;
            inp.classList.remove("selected");
            document.querySelector(
              ".dr-home .add-exam-div .exams .share-popup .students-div .select-all p"
            ).innerText = "Select All";
          }
        });
    },
    // work here
    filterStudents() {
      let filteredArr = [];
      if (this.gradeNo == "all") {
        this.followers = this.navbarModule.followers;
      } else {
        if (this.sectionNo == "all") {
          filteredArr = this.navbarModule.followers.filter((el) => {
            return el.gradeNo == this.gradeNo;
          });
        } else {
          filteredArr = this.navbarModule.followers.filter((el) => {
            return el.gradeNo == this.gradeNo && el.sectionNo == this.sectionNo;
          });
        }
        this.followers = filteredArr;
      }
    },
    selectStudent(e) {
      let allInps = document.querySelectorAll(
        ".dr-home .add-exam-div .exams .share-popup .students-div ul input"
      );
      if (!e.target.checked == false) {
        e.target.checked = true;
        e.target.classList.add("selected");
      } else {
        e.target.checked = false;
        e.target.classList.remove("selected");
      }
      for (let i = 0; i < allInps.length; i++) {
        if (allInps[i].checked == false) {
          document.querySelector(
            ".dr-home .add-exam-div .exams .share-popup .students-div .select-all p"
          ).innerText = "Select All";
          break;
        } else {
          document.querySelector(
            ".dr-home .add-exam-div .exams .share-popup .students-div .select-all p"
          ).innerText = "Unselect All";
        }
      }
    },
    selectAllStudents(e) {
      if (e.currentTarget.innerText === "Select All") {
        document
          .querySelectorAll(
            ".dr-home .add-exam-div .exams .share-popup .students-div ul input"
          )
          .forEach((inp) => {
            inp.checked = true;
            inp.classList.add("selected");
          });
        e.currentTarget.innerText = "Unselect All";
      } else {
        document
          .querySelectorAll(
            ".dr-home .add-exam-div .exams .share-popup .students-div ul input"
          )
          .forEach((inp) => {
            inp.checked = false;
            inp.classList.remove("selected");
          });
        e.currentTarget.innerText = "Select All";
      }
    },
    async submitShareExam() {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);

      if (!checkAuth) {
        this.$router.push("/signin");
      } else {
        let allCheckBoxes = document.querySelectorAll(
          ".dr-home .add-exam-div .exams .share-popup .students-div ul input"
        );
        let isChecked = false;
        for (let i = 0; i < allCheckBoxes.length; i++) {
          if (allCheckBoxes[i].classList.contains("selected")) {
            isChecked = true;
            break;
          } else {
            isChecked = false;
          }
        }
        if (isChecked == true) {
          document.querySelector(".dr-home .loading").style.opacity = "0.7";
          document.querySelector(".dr-home .loading").style.visibility =
            "visible";
          for (let j = 0; j < allCheckBoxes.length; j++) {
            if (allCheckBoxes[j].classList.contains("selected")) {
              const exam = JSON.parse(localStorage.getItem("share-exam"));
              exam.examId = JSON.parse(localStorage.getItem("share-exam"))._id;
              exam.isExamed = false;
              exam.result = null;
              const toShareExam = {
                studentId: allCheckBoxes[j].value,
                instructorId: checkAuth._id,
                firstName: this.allUserInfo.firstName,
                lastName: this.allUserInfo.lastName,
                profileImg: this.allUserInfo.photo,
                exams: [exam],
              };
              await this.doCheckExam(toShareExam);
            }
          }
          setTimeout(() => {
            document.querySelector(".dr-home .loading").style.opacity = "0";
            document.querySelector(".dr-home .loading").style.visibility =
              "hidden";
            this.showAlert(
              "success",
              "Exam has been shared successfulley",
              "Close"
            );
            document.querySelector(
              ".dr-home .add-exam-div .exams .share-popup"
            ).style.display = "none";
          }, 500);
        } else {
          this.showAlert(
            "error",
            "Please select one student at least to share exam with",
            "OK"
          );
        }
      }
    },
    previewExam(examId) {
      this.$router.push(`/test-preview/${examId}`);
    },
    async getResults(examId) {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);

      let instId = checkAuth._id;
      this.$router.push(`/student-result/${instId}/${examId}`);
    },
  },
  async mounted() {
    //Check if user is signed up or not
    const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);

    if (!checkAuth) {
      this.$router.push("/signin");
    } else {
      if (checkAuth.userRole != "INSTRUCTOR") {
        this.$router.push("/");
      } else {
        //Update Exam Status
        const userID = checkAuth._id;
        await this.doGetUrls(userID);
        this.allUrls = this.instrucHome.urls;
        // Get Exams
        let theId = checkAuth._id;
        await this.doGetExams(theId);
        this.getAllExams = this.instrucHome.allExams;
        setTimeout(async () => {
          await this.doGetExams(theId);
          this.getAllExams = this.instrucHome.allExams;
        }, 1000 * 60);
        document.querySelector(
          ".dr-home .container-fluid .loading"
        ).style.opacity = "0";
        document.querySelector(
          ".dr-home .container-fluid .loading"
        ).style.visibility = "hidden";
      }
    }
  },
};
</script>

<style lang="scss">
@import "../../../assets/sass/main.scss";

.dr-home {
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
      margin-bottom: 0;
    }

    .exams {
      padding-top: 5px;
      margin-top: 3px;
      max-height: 47vh;
      min-height: 47vh;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      border-bottom: 13px solid $mainColor;

      .row {
        .exam-dad {
          .share-delete-div {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            bottom: 10px;
            opacity: 0.5;

            i {
              font-size: 13px;
              color: #00000073;
            }

            .delete-exam-btn {
              color: indianred;
            }

            .share-exam-btn {
              color: #4175ee;
            }
          }

          button {
            outline: none;
            font-size: 11px;
            padding: 5px;
            border-radius: 6px;
            border: 1px solid #406df6;
            background-color: #406df6;
            color: white;
            display: block;
            margin-bottom: 10px;
          }
        }
      }

      .empty-exams {
        position: absolute;
        top: 50%;
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

      .share-popup {
        display: none;

        .overlay {
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: #000000a3;
          z-index: 1000;
        }

        .students-div {
          width: 50%;
          height: 50%;
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          border-radius: 10px;
          z-index: 1000;
          overflow-y: auto;

          .select-all p {
            padding-right: 22px;
            transform: translateY(19px);
            cursor: pointer;
            color: blue;
          }

          ul {
            padding: 30px;

            li {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;

              img {
                width: 40px;
                height: 40px;
                margin-right: 20px;
                border-radius: 50%;
              }
            }

            input {
              width: 18px;
              cursor: pointer;
              height: 18px;
            }
          }

          .submit {
            width: 100%;
            text-align: center;
            position: absolute;
            bottom: 33px;
            left: 0;

            button {
              background-color: #4175ee;
              padding: 6px 20px;
              color: white;
              border-radius: 7px;
              outline: none;
              border: 1px solid #2c51a8;
            }
          }

          .empty-students {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100%;

            p {
              font-style: italic;
              text-align: center;
              font-size: 25px;
              color: rgba(134, 132, 132, 0.6196078431);
              font-weight: 500;
            }
          }
        }
      }

      .exam {
        border-radius: 7px !important;
        width: 100% !important;
        overflow: hidden;
        margin-bottom: 10px;
        height: 290px;

        img {
          height: 120px;
          width: 100%;
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
            color: indianred;
            font-size: 10px !important;
            font-weight: 500 !important;
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

    .create-exam {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 34px;
      transition: 0.2s;
      font-size: 27px;
      background-color: $mainColor;
      opacity: 0.7;
      color: white;
      padding: 10px;
      border-radius: 11px;
      &:hover {
        opacity: 1;
        color: #6c4380;
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
      max-height: 46vh;
      min-height: 46vh;
      overflow-y: auto;
      overflow-x: hidden;
      border-bottom: 13px solid $mainColor;
      position: relative;

      .empty-urls {
        position: absolute;
        top: 50%;
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
          font-size: 15px;
          text-transform: capitalize;
          transition: 0.2s;
          font-weight: 700;

          &:hover {
            color: rgb(57, 57, 254) !important;
          }
        }

        i {
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

          &:hover {
            background-color: indianred;
          }
        }
      }
    }

    .add-url {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 34px;
      transition: 0.2s;
      font-size: 27px;
      background-color: $mainColor;
      opacity: 0.7;
      color: white;
      padding: 10px;
      border-radius: 11px;
      cursor: pointer;
      &:hover {
        opacity: 1;
        color: #6c4380;
      }
    }

    .write-url-div {
      width: 100%;
      display: none;

      label {
        font-size: 11px;
        font-weight: 500;
        margin-bottom: 10px;
        width: 90%;
        margin-left: auto !important;
        margin-right: auto !important;
        display: block;
      }

      input {
        margin-left: 5px;
        width: 70%;
        border: none;
        outline: none;
        padding-left: 15px;
        color: rgb(45, 104, 198);
        box-shadow: #197278 0px 0px 0px 1px inset;
        background-color: transparent;
        border-radius: 3px;
        padding-top: 4px;
        padding-bottom: 6px;
        font-weight: 500;
        font-size: 14px;
      }

      button {
        border: none;
        display: block;

        .confirm-url {
          background-color: #197278;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          border-radius: 5px;
          font-size: 11px;
          transition: 0.2s;

          &:hover {
            background-color: rgba(0, 128, 0, 0.653);
          }
        }
        .close-url {
          background-color: rgba(205, 92, 92, 0.73);
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          border-radius: 5px;
          font-size: 11px;
          transition: 0.2s;

          &:hover {
            background-color: indianred;
          }
        }
      }

      .url-repeat-err {
        background-color: #fcfcfc;
        font-size: 14px;
        left: 23%;
        top: 52px;
        padding: 7px 7px 12px 37px;
        border-radius: 5px;
        border: 1px solid black;
        box-shadow: 3px 3px 7px -3px rgb(0 0 0 / 68%);
        display: none;
        width: 158px;

        .yellow {
          width: 22px;
          height: 25px;
          background-color: #ffa01e;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);

          &::before {
            content: "!";
            position: absolute;
            color: white;
            height: 16px;
            top: -2px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 18px;
            font-weight: bolder;
          }
        }

        &::before {
          position: absolute;
          content: "";
          width: 20px;
          height: 20px;
          left: 4%;
          top: -25px;
          border: 12px solid;
          border-color: transparent transparent
            rgba(118, 118, 118, 0.4392156863) transparent;
        }
      }
    }
  }
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: rgb(215, 213, 213);
  border-left: 1px solid rgba(0, 0, 0, 0.237);
}

::-webkit-scrollbar-thumb {
  background: #197278;
  transition: 0.2s;

  &:hover {
    background: #156065;
  }
}

//Media Queries
@media (max-width: 990px) {
  .dr-home .add-exam-div,
  .dr-home .add-url-div {
    width: 100%;

    h3 {
      font-size: 20px !important;
    }
  }

  .dr-home .add-url-div .urls .empty-urls p {
    font-size: 19px;
  }

  .dr-home .add-exam-div .exams .empty-exams p {
    font-size: 19px;
  }

  .dr-home .add-exam-div .exams .share-popup .students-div .empty-students p {
    font-size: 19px;
  }

  .dr-home .delete-exam-alert .body {
    width: 38%;
  }
}

@media (max-width: 767px) {
  .dr-home {
    .add-exam-div {
      border-radius: 20px;

      .title h3 {
        font-size: 17px;
      }

      .exams .exam .exam-body {
        .exam-title {
          font-size: 11px !important;
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

      .create-exam {
        font-size: 20px;
      }
    }

    .add-url-div {
      border-radius: 20px;

      .title h3 {
        font-size: 17px;
      }

      .urls {
        li a {
          font-size: 12px;
        }

        li i {
          width: 15px;
          height: 15px;
        }
      }

      .add-url {
        width: 25px;
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

  .add-exam-div .exams .share-popup .students-div {
    width: 60% !important;

    li {
      span {
        font-size: 12px;
      }

      input {
        width: 13px !important;
      }

      img {
        width: 35px !important;
        height: 35px !important;
      }
    }

    button {
      font-size: 13px !important;
    }
  }

  .dr-home .delete-exam-alert .body {
    width: 40%;

    p {
      font-size: 13px;
    }

    button {
      font-size: 13px !important;
    }
  }
}

@media (max-width: 575px) {
  .dr-home {
    margin-bottom: 20px;

    .add-exam-div .exams .empty-exams p {
      font-size: 15px;
    }

    .add-exam-div .exams .share-popup .students-div .empty-students p {
      font-size: 15px;
    }

    .add-url-div {
      height: 62vh;

      .urls {
        max-height: 30vh;
        min-height: 30vh;

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
          width: 70%;
        }
      }
    }

    .add-exam-div .exams .share-popup .students-div {
      width: 80% !important;
      height: 40%;

      li {
        span {
          font-size: 11px;
        }

        input {
          width: 12px !important;
        }

        img {
          width: 33px !important;
          height: 33px !important;
        }
      }

      button {
        font-size: 11px !important;
      }
    }
  }

  .dr-home .delete-exam-alert .body {
    width: 70%;

    p {
      font-size: 12px;
    }

    button {
      font-size: 11px !important;
    }
  }
}
</style>
