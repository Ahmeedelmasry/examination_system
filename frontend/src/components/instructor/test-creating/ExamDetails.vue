<template>
  <TheNav />
  <div class="exam-details mb-4">
    <div class="container mt-4">
      <form action="" @submit.prevent="submitDetails">
        <div class="form-dad">
          <div class="title-div">
            <input
              type="text"
              name="exam-title"
              placeholder="Write Your Exam Title Here"
              class="mb-4"
              required
            />
          </div>
          <div class="time-div">
            <p class="text-center">Exam Time Out</p>
            <div class="time-container">
              <label for="exam-timeout">Minutes</label>
              <input
                type="number"
                name="exam-timeout"
                class="exam-timeout"
                required
                min="1"
                value="1"
              />
            </div>
          </div>
          <hr />
          <div class="degree-div">
            <p class="text-center">Question Degree</p>
            <div class="degree-container">
              <div class="default-degree">
                <label>
                  Default Degree
                  <input
                    type="radio"
                    name="default-degree-select"
                    checked
                    @click="defaultDegreeSelect"
                  />
                </label>
              </div>
              <div class="custom-degree">
                <label>
                  Custom Degree
                  <input
                    type="radio"
                    name="default-degree-select"
                    @click="customDegreeSelect"
                  />
                </label>
              </div>
            </div>
            <div class="default-feild text-center">
              <label for="default-choice">
                <input
                  type="number"
                  name="default-choice"
                  class="mb-2"
                  value="0"
                  min="0"
                />
                Degree / Question
              </label>
            </div>
          </div>
          <hr />

          <!--Test-->
          <div class="start-end-time">
            <p class="text-center">Start And End</p>
            <div class="start-end-time-container">
              <div class="start-exam-div text-center">
                <div class="the-inps">
                  <div class="start-date time-dad">
                    <label for="start-date">Start Date:</label>
                    <input
                      type="date"
                      id="start-date"
                      name="start-date"
                      required
                    />
                  </div>
                  <div class="start-time-at time-dad">
                    <label for="start-time">Start Time:</label>
                    <input
                      type="time"
                      id="start-time"
                      name="start-time"
                      required
                      pattern="24"
                    />
                  </div>
                  <div class="end-time-at time-dad">
                    <label for="end-time">End Time:</label>
                    <input type="time" id="end-time" name="end-time" required />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--End Test-->
          <div class="submit mt-3">
            <button>Submit</button>
          </div>
        </div>
      </form>
    </div>
    <div class="exam-type-pop" @click="closeTypePop">
      <div class="btns" @click="stopPropa">
        <router-link to="create-exam"><button>Quick Exam</button></router-link>
        <button class="test-bank-btn" @click="testBankData">Test Bank</button>
      </div>
    </div>
    <div class="select-questions-pop" @click="closeTypePop">
      <form action="" @submit.prevent="doCreateExam">
        <div class="the-container" @click="stopPropa">
          <div class="empty-subjects">
            <p>There is no subjects available!</p>
          </div>
          <div class="row"></div>
          <div class="default-deg justify-content-center align-items-center">
            <span class="deg-title">Question Degree</span>
            <input type="number" min="1" value="1" required />
          </div>
          <input type="submit" name="submit" value="Create Exam" />
          <div class="questions-err">
            <p>Please select at least one question</p>
          </div>
        </div>
      </form>
    </div>
    <TheLoading />
    <div class="success" @click="closePopup">
      <div class="container" @click="stopProp">
        <p class="text-center">Exam is created successfully!</p>
      </div>
    </div>
  </div>
</template>

<script>
import TheNav from "@/components/global/thenav/TheNav.vue";
import TheLoading from "@/components/global/loading/TheLoading.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "ExamDetails",
  components: {
    TheNav,
    TheLoading,
  },
  data() {
    return {
      questionSelected: false,
      examDetails: "",
      examToSave: {
        instructorUserId: "",
        startDate: "",
        startTimeAt: "",
        endTimeAt: "",
        status: "",
        totalDegree: "",
        time: "",
        title: "",
        questions: [],
      },
    };
  },
  computed: {
    ...mapState(["getSubjects"]),
  },
  methods: {
    ...mapActions(["doGetSubjects", "doAddExam", "doCheckAuth"]),
    defaultDegreeSelect() {
      document.querySelector(
        ".exam-details .degree-div .default-feild label"
      ).style.display = "inline-block";
    },
    showAlert(icn, msg, btnTxt) {
      this.$swal({
        title: msg,
        icon: icn,
        confirmButtonText: btnTxt,
        confirmButtonColor: "#197278",
        showCloseButton: true,
      });
    },
    customDegreeSelect() {
      document.querySelector(
        ".exam-details .degree-div .default-feild label"
      ).style.display = "none";
      document.querySelector(
        ".exam-details .degree-div .default-feild input"
      ).value = 0;
    },
    submitDetails() {
      let examTitle = document.querySelector(
        ".exam-details .form-dad .title-div input"
      ).value;
      let timeValue = document.querySelector(
        ".exam-details .form-dad .time-div .time-container input"
      ).value;
      let degreeValue = document.querySelector(
        ".exam-details .form-dad .degree-div .default-feild input"
      ).value;
      let startDate = document.querySelector(
        ".exam-details .start-end-time input[type=date]"
      ).value;
      let startTime = document.querySelector(
        ".exam-details .start-end-time input[name=start-time]"
      ).value;
      let endTime = document.querySelector(
        ".exam-details .start-end-time input[name=end-time]"
      ).value;

      degreeValue = document.querySelector(
        ".exam-details .form-dad .degree-div .default-feild input"
      ).value;
      if (localStorage.getItem("exam-details")) {
        localStorage.removeItem("exam-details");
      }
      this.examDetails = "";
      this.examDetails = {
        title: examTitle,
        totalTime: timeValue,
        degree: degreeValue,
        startDate: startDate,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
      };
      localStorage.setItem("exam-details", JSON.stringify(this.examDetails));
      document.querySelector(".exam-details .exam-type-pop").style.display =
        "block";
    },
    loopDataTest(num, arr) {
      let current = arr.length;
      let temp;
      let random;
      while (current > 0) {
        random = Math.floor(Math.random() * current);
        current--;
        temp = arr[current];
        arr[current] = arr[random];
        arr[random] = temp;
      }
      let arrToLoop = [...arr];
      for (let i = 0; i < num; i++) {
        this.examToSave.questions.push(arrToLoop[i]);
      }
      this.examToSave.questions.forEach((ques) => {
        ques.degree = document.querySelector(
          ".exam-details .select-questions-pop .the-container .default-deg input"
        ).value;
      });
    },
    async testBankData(e) {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
      if (!checkAuth) {
        this.$router.push("/signin");
      } else {
        e.target.parentElement.parentElement.style.display = "none";
        setTimeout(() => {
          document.querySelector(
            ".exam-details .select-questions-pop"
          ).style.display = "flex";
        }, 1000);
        const userId = checkAuth._id;
        await this.doGetSubjects(userId);
        this.examDetails = this.getSubjects.allSubjects;
        document.querySelector(
          ".exam-details .select-questions-pop .the-container .row"
        ).innerHTML = "";
        if (this.examDetails.length > 0) {
          for (let i = 0; i < this.examDetails.length; i++) {
            let subDad = document.createElement("div");
            subDad.className = "col-6";
            subDad.innerHTML = `
            <div class="subject-container mb-4">
              <span class="title">${this.examDetails[i].title}</span>
              <input type="number" class="ques-num" max="${this.examDetails[i].questions.length}" value="0" min="0" />
            </div>
          `;
            subDad.setAttribute("data-id", this.examDetails[i]._id);
            subDad.setAttribute(
              "data-max",
              this.examDetails[i].questions.length
            );
            document
              .querySelector(".exam-details .select-questions-pop form")
              .addEventListener("submit", () => {
                if (subDad.querySelector("input").value > 0) {
                  this.loopDataTest(
                    subDad.querySelector("input").value,
                    this.examDetails[i].questions
                  );
                }
              });

            document
              .querySelector(
                ".exam-details .select-questions-pop .the-container .row"
              )
              .appendChild(subDad);
          }
          document.querySelector(
            ".exam-details .select-questions-pop .the-container .empty-subjects"
          ).style.display = "none";
          document.querySelector(
            ".exam-details .select-questions-pop .the-container .default-deg"
          ).style.display = "flex";
          document.querySelector(
            ".exam-details .select-questions-pop .the-container input[type=submit]"
          ).style.display = "block";
        }
      }
    },
    async doCreateExam() {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
      if (!checkAuth) {
        this.$router.push("/signin");
      } else {
        let allInpts = document.querySelectorAll(
          ".exam-details .select-questions-pop .the-container .ques-num"
        );
        let degreeCounter = 0;
        for (let i = 0; i < allInpts.length; i++) {
          degreeCounter += parseInt(allInpts[i].value);
          if (allInpts[i].value >= 1) {
            this.questionSelected = true;
          } else {
            if (this.questionSelected == true) {
              document.querySelector(
                ".exam-details .select-questions-pop .questions-err"
              ).style.display = "none";
            } else {
              document.querySelector(
                ".exam-details .select-questions-pop .questions-err"
              ).style.display = "block";
              setTimeout(() => {
                document.querySelector(
                  ".exam-details .select-questions-pop .questions-err"
                ).style.display = "none";
              }, 2000);
            }
          }
        }
        if (this.questionSelected == true) {
          const degInp = document.querySelector(
            ".exam-details .select-questions-pop .the-container .default-deg input"
          ).value;

          const storageExamData = JSON.parse(
            localStorage.getItem("exam-details")
          );
          this.examToSave.instructorUserId = checkAuth._id;
          this.examToSave.startDate = storageExamData.startDate;
          this.examToSave.startTimeAt = storageExamData.startTime;
          this.examToSave.endTimeAt = storageExamData.endTime;
          this.examToSave.status = "Pending";
          this.examToSave.totalDegree = parseInt(degInp) * degreeCounter;
          this.examToSave.time = storageExamData.totalTime;
          this.examToSave.title = storageExamData.title;
          document.querySelector(".exam-details .loading").style.opacity =
            "0.7";
          document.querySelector(".exam-details .loading").style.visibility =
            "visible";
          setTimeout(async () => {
            await this.doAddExam(this.examToSave);
            document.querySelector(".exam-details .loading").style.opacity =
              "0";
            document.querySelector(".exam-details .loading").style.visibility =
              "none";
            this.showAlert("success", "Exam created successfulley", "close");
            degreeCounter = 0;
            this.examToSave.questions = [];
            setTimeout(() => {
              this.$router.push("/");
            }, 1000);
          }, 1000);
        }
      }
    },
    closeTypePop(e) {
      e.currentTarget.style.display = "none";
    },
    stopPropa(e) {
      e.stopPropagation();
    },
  },
  async mounted() {
    document.forms[1].querySelector(".title-div input").value = "";
    const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
    if (!checkAuth) {
      this.$router.push("/signin");
    } else {
      if (checkAuth.userRole != "INSTRUCTOR") {
        this.$router.push("/");
      } else {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
          dd = "0" + dd;
        }

        if (mm < 10) {
          mm = "0" + mm;
        }

        today = yyyy + "-" + mm + "-" + dd;
        document
          .querySelector(".exam-details .start-end-time input[type=date]")
          .setAttribute("min", today);
        document
          .querySelector(".exam-details .start-end-time input[type=date]")
          .setAttribute("value", today);

        if (!checkAuth._id) {
          this.$router.push("signin");
        }
        if (localStorage.getItem("exam-details")) {
          localStorage.removeItem("exam-details");
        }
      }
    }
  },
};
</script>

<style lang="scss">
@import "../../../assets/sass/main";

.exam-details {
  .loading {
    visibility: hidden;
    opacity: 0;
  }

  $offset: 187;
  $duration: 1.4s;

  .spinner {
    animation: rotator $duration linear infinite;
  }

  @keyframes rotator {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(270deg);
    }
  }

  .path {
    stroke-dasharray: $offset;
    stroke-dashoffset: 0;
    transform-origin: center;
    animation: dash $duration ease-in-out infinite,
      colors ($duration * 4) ease-in-out infinite;
  }

  @keyframes colors {
    0% {
      stroke: #4285f4;
    }

    25% {
      stroke: #de3e35;
    }

    50% {
      stroke: #f7c223;
    }

    75% {
      stroke: #1b9a59;
    }

    100% {
      stroke: #4285f4;
    }
  }

  @keyframes dash {
    0% {
      stroke-dashoffset: $offset;
    }

    50% {
      stroke-dashoffset: $offset/4;
      transform: rotate(135deg);
    }

    100% {
      stroke-dashoffset: $offset;
      transform: rotate(450deg);
    }
  }
  .success {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.537);
    z-index: 1000;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    display: none;

    .container {
      background-color: white;
      width: 30%;
      border-radius: 10px;
      box-shadow: 0px 0px 10px -6px black;
      padding: 20px;

      p {
        margin-bottom: 0;
        color: #10aa10;
      }
    }
  }
  .container hr {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    background-color: $titleColor;
    height: 1px;
  }
  .form-dad {
    width: 70%;
    margin: auto;
    background-color: $mainColor;
    border: 1px solid $titleColor;
    color: $titleColor;
    border-radius: 30px;
    padding: 20px;
    .title-div {
      input {
        width: 70%;
        margin: auto;
        display: block;
        border: none;
        outline: none;
        padding-left: 15px;
        padding-right: 15px;
        background-color: transparent;
        border-radius: 3px;
        padding-top: 6px;
        padding-bottom: 10px;
        font-weight: 700;
        font-size: 20px;
        border-bottom: 4px solid $titleColor;
        text-align: center;
        color: $titleColor;
        &::placeholder {
          width: 50%;
          font-size: 18px;
          color: $titleColor;
          font-weight: 900;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0.7;
        }
      }
    }
    .time-div {
      p {
        display: block;
        text-align: center;
        font-size: 19px;
        font-weight: 900;
        margin-top: 18px;
      }
      .time-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        label {
          display: block;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          display: flex;
          margin-right: 20px;
          order: 2;
          margin-left: 15px;
          margin-top: 10px;
        }
        input {
          border: 2px solid $titleColor;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 900;
          width: 80px;
          margin: auto;
          text-align: center;
          height: 40px;
          outline: none;
          display: block;
          background-color: transparent;
          color: $titleColor;
        }
      }
    }
    .degree-div {
      p {
        display: block;
        text-align: center;
        font-size: 19px;
        font-weight: 900;
        margin-top: 18px;
      }
      input {
        width: 80px;
        margin: auto;
        text-align: center;
        height: 40px;
        outline: none;
        display: block;
        font-weight: 900;
        background-color: transparent;
        color: $titleColor;
        border: 2px solid $titleColor;
      }
      .degree-container {
        display: flex;
        justify-content: space-evenly;
        padding: 10px 30px;
        label {
          display: block;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          display: flex;
        }
        input {
          margin-left: 8px;
          width: 15px;
          height: 15px;
          display: inline-block;
          outline: none;
          border: 2px solid $titleColor;
        }
      }
      .default-feild label {
        font-size: 14px;
        font-weight: 900;
      }
      .default-feild input {
        border: 2px solid $titleColor;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 900;
        background-color: transparent;
      }
    }
  }
  .start-end-time {
    p {
      display: block;
      text-align: center;
      font-size: 19px;
      font-weight: 900;
      margin-top: 18px;
      margin-bottom: 27px;
    }
    label {
      width: 100px;
      font-size: 14px;
      font-weight: 900;
      margin-right: 10px;
    }
    input[type="date"] {
      margin-right: 40px;
      width: 60%;
      text-align: center;
      border: 2px solid $titleColor;
      border-radius: 10px;
      font-size: 14px;
      outline: none;
      padding: 5px 0;
      margin-bottom: 20px;
      padding-right: 10px;
      font-weight: 900;
      background-color: transparent;
      color: $titleColor;
    }
    input[type="time"] {
      margin-right: 40px;
      width: 60%;
      text-align: center;
      border: 2px solid $titleColor;
      border-radius: 10px;
      font-size: 14px;
      outline: none;
      padding: 5px 0;
      margin-bottom: 20px;
      padding-right: 10px;
      font-weight: 900;
      background-color: transparent;
      color: $titleColor;
    }
    .time-dad {
      display: flex;
      justify-content: center;
    }
  }

  .submit {
    button {
      width: 170px;
      padding-top: 8px;
      padding-bottom: 8px;
      border: 1px solid $titleColor;
      background-color: $mainColor;
      color: $titleColor;
      border-radius: 12px;
      font-size: 25px;
      font-weight: 900;
      transition: 0.3s;
      margin-top: 10px;
      display: block;
      margin: auto;
      margin-top: 50px;
      transition: 0.2s;
      &:hover {
        background-color: #192c4c;
      }
    }
  }
  .exam-type-pop {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.676);
    z-index: 1;
    display: none;
    .btns {
      padding: 10px;
      background-color: $mainColor;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      position: absolute;
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 450px;
      height: 200px;
      border-radius: 50px;
      button {
        background-color: $titleColor;
        color: $mainColor;
        border: 1px solid $titleColor;
        outline: none;
        padding: 10px;
        font-size: 25px;
        border-radius: 10px;
        font-weight: 900;
      }
    }
  }
  .select-questions-pop {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.676);
    z-index: 1;
    align-items: center;
    justify-content: center;
    display: none;
    .the-container {
      padding: 10px;
      background-color: $mainColor;
      padding: 30px;
      border-radius: 20px;
      width: 500px;
      .empty-subjects {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 19px;
        font-weight: 700;
        color: $titleColor;
        font-style: italic;
        margin-top: 7px;
      }
      .subject-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .title,
      span {
        color: white;
        font-size: 17px;
        font-weight: 900;
        text-transform: capitalize;
      }
      input[type="number"] {
        width: 50px;
        height: 30px;
        border-radius: 10px;
        outline: none;
        border: 1px solid black;
        text-align: center;
        font-size: 17px;
        font-weight: 900;
        margin-left: 10px;
      }
      .default-deg {
        flex-direction: column;
        border-top: 1px solid $titleColor;
        margin-bottom: 15px;
        padding-top: 10px;
        display: none;
        // display: flex;
        input {
          width: 50px;
          height: 30px;
          margin-top: 10px;
          margin-left: 0;
        }
      }
      input[type="submit"] {
        margin: auto;
        font-size: 17px;
        font-weight: 900;
        color: $mainColor;
        background-color: $titleColor;
        border: 1px solid $titleColor;
        outline: none;
        padding: 10px;
        border-radius: 10px;
        display: none;
      }
    }
    .questions-err {
      p {
        font-size: 14px;
        color: indianred;
        text-align: center;
        width: fit-content;
        margin: auto;
        margin-top: 13px;
        font-weight: 500;
        border-top-right-radius: 14px;
      }
      display: none;
    }
  }
}
//Media Queries
@media (max-width: 990px) {
  .exam-details .form-dad {
    width: 100%;
  }
}
@media (max-width: 767px) {
  .exam-details {
    .form-dad {
      margin-top: 40px;
      .title-div {
        input {
          font-size: 17px;
          &::placeholder {
            font-size: 13px;
          }
        }
      }
      .time-div {
        p {
          font-size: 15px;
        }
        .time-container {
          justify-content: space-around;
          label {
            font-size: 9px !important;
          }
          input {
            width: 53px;
            height: 31px;
            font-size: 11px !important;
          }
        }
      }
      .degree-div {
        p {
          font-size: 15px;
        }
        .degree-container {
          justify-content: space-around;
          label {
            font-size: 10px;
          }
          input {
            width: 11px;
            height: 11px;
          }
        }
        .default-feild label {
          font-size: 9px;
        }
        input {
          width: 53px;
          height: 31px;
          font-size: 11px !important;
        }
      }
      .start-end-time label {
        font-size: 10px;
      }
      .start-end-time input[type="date"] {
        font-size: 10px;
      }
      .start-end-time input[type="time"] {
        font-size: 10px;
      }
      .submit button {
        font-size: 12px;
        width: 150px;
      }
    }
    .exam-type-pop {
      .btns {
        width: 355px;
        height: 163px;
        button {
          font-size: 17px;
        }
      }
    }
    .select-questions-pop .the-container {
      width: 450px;
      span {
        font-size: 14px !important;
      }
      input[type="number"] {
        width: 45px;
        font-size: 14px;
      }
      input[type="submit"] {
        font-size: 13px;
      }
    }
  }
}
@media (max-width: 570px) {
  .exam-details {
    .exam-type-pop {
      .btns {
        width: 279px;
        height: 136px;
        button {
          font-size: 15px;
        }
      }
    }
    .select-questions-pop .the-container {
      width: 350px;
      span {
        font-size: 14px !important;
      }
      input[type="number"] {
        font-size: 12px;
      }
      input[type="submit"] {
        font-size: 11px;
      }
      .empty-subjects {
        font-size: 13px;
      }
    }
  }
}
@media (max-width: 394px) {
  .exam-details .form-dad {
    padding-left: 0;
    padding-right: 0;
    .time-div .time-container label {
      font-size: 9px;
    }
    .degree-div .degree-container label {
      font-size: 9px;
    }
    .start-end-time label {
      font-size: 9px;
    }
    .start-end-time input {
      font-size: 10px;
    }
  }
}
</style>
