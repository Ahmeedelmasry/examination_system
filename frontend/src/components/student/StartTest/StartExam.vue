<template>
  <div class="start-exam">
    <TheLoading />
    <div class="container-fluid mb-4 pb-4 pt-5">
      <div class="exam-title">
        <h1 class="text-center">{{ examData.title }}</h1>
        <span class="text-center d-block"></span>
      </div>
      <div class="row">
        <div
          class="ml-5 mr-5 ques-container mb-4 px-3ml-5 mr-5 ques-container mb-4 px-3"
          v-for="(ques, index) in examData.questions"
          :key="index"
          :style="index == counter ? 'display: flex' : 'display: none'"
          :data-cac="ques.correctAnswerColumn"
          :data-dg="ques.degree"
        >
          <div class="ques-tit-row">
            <span class="ques-tit-num">{{ index + 1 }}</span>
            <i class="fa fa-arrow-right"></i>
            <p class="ques-tit">{{ ques.question }}</p>
          </div>
          <div class="choices">
            <span v-for="(choice, index) in ques.choices" :key="index">
              <div
                class="ques-choise-row position-relative"
                @click="chooseCorrect"
                v-if="choice"
              >
                <span class="ques-choice-num">{{ index + 1 }}</span>
                <p class="ques-choice">{{ choice }}</p>
                <i class="fa fa-check correct-answer"></i>
              </div>
            </span>
          </div>
        </div>
      </div>
      <div class="next-prev-btns d-flex justify-content-center">
        <button class="prev" @click="goPrev">Previous</button>
        <button class="next" @click="goNext">Next</button>
      </div>
      <div class="finish-exam position-fixed">
        <button class="finish" @click="checkFinishExam">Finish Exams</button>
      </div>
    </div>
    <div class="finish-exam-alert popup" @click="closeDelExamAlert">
      <div class="body" @click="stopAlertProp">
        <p class="alert text-center"></p>
      </div>
    </div>
    <div class="timeout-alert">
      <div class="body">
        <p class="alert text-center">Exam Time Out!</p>
        <div class="alert-btns">
          <button class="submit-finish" @click="timeOutPop">Result</button>
          <router-link to="/">
            <button class="cancel">Home</button></router-link
          >
        </div>
      </div>
    </div>
    <div class="result-popup">
      <div class="body">
        <p class="alert alert-success">
          You have finished the exam successfully!
        </p>
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
              <td class="total">{{ tableTotal }}</td>
              <td class="result">{{ tableDeg }}</td>
              <td class="percentage">{{ percentage }}%</td>
            </tr>
          </tbody>
        </table>
        <div class="result-btns">
          <router-link to="/">
            <button class="cancel">Home</button></router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheLoading from "@/components/global/loading/TheLoading.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "StartExam",
  components: { TheLoading },
  data() {
    return {
      examData: "",
      counter: 0,
      questionsDone: false,
      examResult: 0,
      resultDegree: 0,
      interval: "",
      timeCounter: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      tableTotal: 0,
      tableDeg: 0,
      percentage: 0,
    };
  },
  watch: {
    counter(newVal) {
      //Watch Next
      if (newVal >= this.examData.questions.length - 1) {
        document.querySelector(
          ".start-exam .next-prev-btns .next"
        ).style.opacity = "0.7";
        document.querySelector(
          ".start-exam .next-prev-btns .next"
        ).style.cursor = "not-allowed";

        document.querySelector(
          ".start-exam .next-prev-btns .prev"
        ).style.opacity = "1";
        document.querySelector(
          ".start-exam .next-prev-btns .prev"
        ).style.cursor = "pointer";
      }
      //Watch Prev
      else if (newVal <= 0) {
        document.querySelector(
          ".start-exam .next-prev-btns .prev"
        ).style.opacity = "0.7";
        document.querySelector(
          ".start-exam .next-prev-btns .prev"
        ).style.cursor = "not-allowed";

        document.querySelector(
          ".start-exam .next-prev-btns .next"
        ).style.opacity = "1";
        document.querySelector(
          ".start-exam .next-prev-btns .next"
        ).style.cursor = "pointer";
      } else {
        document.querySelector(
          ".start-exam .next-prev-btns .prev"
        ).style.opacity = "1";
        document.querySelector(
          ".start-exam .next-prev-btns .prev"
        ).style.cursor = "pointer";

        document.querySelector(
          ".start-exam .next-prev-btns .next"
        ).style.opacity = "1";
        document.querySelector(
          ".start-exam .next-prev-btns .next"
        ).style.cursor = "pointer";
      }
    },
  },
  computed: {
    ...mapState(["studentHome"]),
  },
  methods: {
    ...mapActions(["checkIfExamed", "submitResult", "doCheckAuth"]),
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
    timeOutPop(e) {
      document.querySelector(".start-exam .result-popup").style.display =
        "flex";
      e.currentTarget.parentElement.parentElement.parentElement.style.display =
        "none";
    },
    closeDelExamAlert(e) {
      e.currentTarget.style.display = "none";
      if (e.currentTarget.querySelector(".alert-btns")) {
        e.currentTarget.querySelector(".alert-btns").remove();
      }
    },
    stopAlertProp(e) {
      e.stopPropagation();
    },
    async checkFinishExam() {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
      if (!checkAuth) {
        this.$router.push("/signin");
      } else {
        let allQuestions = document.querySelectorAll(
          ".start-exam .ques-container"
        );
        for (let i = 0; i < allQuestions.length; i++) {
          if (!allQuestions[i].querySelector(".choose-this")) {
            this.questionsDone = false;
            this.showAlert("error", "Please Complete Your Exam!", "Go On");
            break;
          } else {
            this.questionsDone = true;
          }
        }
        if (this.questionsDone == true) {
          this.showAlert(
            "question",
            "Are you sure you want to finish the exam?",
            "Confirm",
            true,
            "Cancel"
          );
          setTimeout(async () => {
            document
              .querySelector(".swal2-styled.swal2-confirm")
              .addEventListener("click", async () => {
                await this.calculateDegree(true);
              });
          }, 0);
        }
      }
    },
    async calculateDegree(openPopup = false) {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
      if (!checkAuth) {
        this.$router.push("/signin");
      } else {
        document.querySelector(".start-exam .loading").style.cssText = `
        opacity: 0.7;visibility: visible
     `;
        this.examResult = 0;
        let allQuestions = document.querySelectorAll(
          ".start-exam .ques-container"
        );
        clearInterval(this.interval);
        allQuestions.forEach((dad) => {
          dad.querySelectorAll(".ques-choise-row").forEach((choice, index) => {
            if (choice.classList.contains("choose-this")) {
              const chosenCol = index + 1;
              if (chosenCol == dad.dataset.cac) {
                this.examResult += parseInt(dad.dataset.dg);
              }
            }
          });
        });
        this.tableTotal = this.examData.totalDegree;
        this.tableDeg = this.examResult;
        this.percentage = (
          (this.tableDeg * 100) /
          parseInt(this.tableTotal)
        ).toFixed(2);
        const payload = {
          instId: this.examData.instructorUserId,
          stId: this.$route.params.stId,
          examId: this.examData.examId,
          result: this.examResult,
        };
        await this.submitResult(payload);
        document.exitFullscreen();
        if (openPopup) {
          setTimeout(() => {
            document.querySelector(".start-exam .loading").style.cssText = `
          opacity: 0;visibility: hidden
         `;
            document.querySelector(".start-exam .result-popup").style.display =
              "flex";
          }, 1000);
        }
        document.querySelector(
          ".start-exam .container-fluid"
        ).style.pointerEvents = "none";
      }
    },
    goNext() {
      if (this.counter < this.examData.questions.length - 1) {
        this.counter++;
      }
    },
    goPrev() {
      if (this.counter > 0) {
        this.counter--;
      }
    },
    chooseCorrect(e) {
      e.currentTarget.parentElement.parentElement
        .querySelectorAll(".ques-choise-row")
        .forEach((row) => {
          row.classList.remove("choose-this");
          row.querySelector("i.correct-answer").style.opacity = 0;
          row.style.backgroundColor = "unset";
        });
      e.currentTarget.classList.add("choose-this");
      e.currentTarget.querySelector("i.correct-answer").style.opacity = 1;
      e.currentTarget.style.backgroundColor = "#6fe16f59";
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
        if (!localStorage.getItem("exam-available")) {
          this.$router.push("/");
        } else {
          const el = document.documentElement,
            rfs =
              el.requestFullScreen ||
              el.webkitRequestFullScreen ||
              el.mozRequestFullScreen ||
              el.msRequestFullscreen;
          navigator.keyboard.lock();
          rfs.call(el);
          window.addEventListener("contextmenu", (e) => {
            e.preventDefault();
          });
          document.querySelector(
            ".start-exam .exam-title span"
          ).innerText = `Time Left: 00:00:00`;
          const payload = {
            instId: this.$route.params.instId,
            stId: this.$route.params.stId,
            examId: this.$route.params.exId,
          };
          let getExam = await this.checkIfExamed(payload);
          let questions = getExam.questions;

          //Randomize Questions
          let current = questions.length;
          let temp;
          let random;
          while (current > 0) {
            random = Math.floor(Math.random() * current);
            current--;
            temp = questions[current];
            questions[current] = questions[random];
            questions[random] = temp;
          }
          this.examData = getExam;
          document.querySelector(
            ".start-exam .next-prev-btns .prev"
          ).style.opacity = "0.7";
          document.querySelector(
            ".start-exam .next-prev-btns .prev"
          ).style.cursor = "not-allowed";
          if (this.counter >= this.examData.questions.length - 1) {
            document.querySelector(
              ".start-exam .next-prev-btns .next"
            ).style.opacity = "0.7";
            document.querySelector(
              ".start-exam .next-prev-btns .next"
            ).style.cursor = "not-allowed";
          }
          //Test
          this.timeCounter.hours = Math.floor(
            ((parseInt(this.examData.time) * 60 * 1000) %
              (1000 * 60 * 60 * 24)) /
              (1000 * 60 * 60)
          );
          this.timeCounter.minutes = Math.floor(
            ((parseInt(this.examData.time) * 60 * 1000) % (1000 * 60 * 60)) /
              (1000 * 60)
          );
          this.timeCounter.seconds = Math.floor(
            ((parseInt(this.examData.time) * 60 * 1000) % (1000 * 60)) / 1000
          );
          document.querySelector(".start-exam .loading").style.cssText = `
          opacity: 0;visibility: hidden
        `;
          this.interval = setInterval(async () => {
            this.timeCounter.seconds--;
            if (JSON.stringify(this.timeCounter.seconds).length == 1) {
              this.timeCounter.seconds = `0${this.timeCounter.seconds}`;
            }
            if (JSON.stringify(this.timeCounter.minutes).length == 1) {
              this.timeCounter.minutes = `0${this.timeCounter.minutes}`;
            }
            if (JSON.stringify(this.timeCounter.hours).length == 1) {
              this.timeCounter.hours = `0${this.timeCounter.hours}`;
            }
            if (this.timeCounter.seconds < 0) {
              this.timeCounter.seconds = 59;
              this.timeCounter.minutes--;
            }
            if (this.timeCounter.minutes < 0) {
              this.timeCounter.minutes = 59;
              this.timeCounter.hours--;
            }
            document.querySelector(
              ".start-exam .exam-title span"
            ).innerText = `Time Left: ${this.timeCounter.hours}:${this.timeCounter.minutes}:${this.timeCounter.seconds}`;
            //Time Out
            if (
              this.timeCounter.hours == 0 &&
              this.timeCounter.seconds <= 0 &&
              this.timeCounter.minutes == 0
            ) {
              document.querySelector(".start-exam .loading").style.cssText = `
            opacity: 0.7;visibility: visible
          `;
              await this.calculateDegree();
              setTimeout(() => {
                document.querySelector(".start-exam .loading").style.cssText = `
              opacity: 0;visibility: hidden
            `;
                document.querySelector(
                  ".start-exam .timeout-alert"
                ).style.display = "block";
              }, 1000);
            }
          }, 1000);
          localStorage.removeItem("exam-available");
        }
      }
    }
  },
  beforeRouteLeave() {
    clearInterval(this.interval);
  },
};
</script>

<style lang="scss">
@import "../../../assets/sass/main";

.start-exam {
  .container-fluid {
    position: fixed;
    width: 50% !important;
    min-height: 67%;
    left: 50%;
    top: 17%;
    transform: translate(-50%, 0);
    border-radius: $bRadius;
    color: $titleColor;
    font-weight: 900 !important;
    background-color: $mainColor;
    border: 1px solid $titleColor;
  }
  .exam-title {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translate(-50%, -125%);
    width: 100%;
    h1 {
      border-bottom: 1px solid $titleColor;
      width: fit-content;
      margin: auto;
      margin-bottom: 10px;
    }
    span {
      font-family: monospace;
      width: fit-content;
      margin: auto;
      padding: 6px 20px;
      color: $titleColor;
      font-size: 20px;
      text-shadow: 1px 1px black;
    }
  }
  .ques-container {
    display: none;
    flex-direction: column;
    width: 100%;
    .ques-tit-row {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid $titleColor;
      padding-bottom: 5px;
      .ques-tit-num {
        font-size: 15px;
      }
      i {
        font-size: 10px;
        padding-left: 3px;
        padding-right: 10px;
      }
      p {
        border: none;
        outline: none;
        background-color: transparent;
        font-size: 20px;
        text-transform: capitalize;
        display: inline-block;
        margin: 0;
      }
    }
    .ques-choise-row {
      padding: 4px;
      min-height: 40px;
      width: 100%;
      margin-top: 15px;
      display: flex;
      align-items: center;
      margin-left: 40px;
      cursor: pointer;
      padding-right: 12px;
      border-radius: 10px;
      p {
        border: none;
        outline: none;
        background-color: transparent;
        padding-left: 10px;
        text-transform: capitalize;
        width: 100%;
        display: inline-block;
        margin: 0;
      }
      .ques-choice-num {
        font-size: 13px;
        border: none;
        outline: none;
        background-color: $titleColor;
        border-radius: 4px;
        margin-left: 5px;
        text-align: center;
        padding: 5px 7px;
        color: $mainColor;
      }
      i.correct-answer {
        border-radius: 50%;
        padding: 5px;
        background-color: #6fe16f;
        opacity: 0;
        cursor: pointer;
      }
      input::placeholder {
        color: rgba(4, 70, 175, 0.549);
        font-family: cursive;
        font-style: italic;
      }
    }
    .ques-choise-row.correct-answer {
      box-shadow: #6fe16f 0px 0px 0px 2px inset;
      background-color: #a5f4a594;
    }
    .btns {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      .add-choice {
        border: none;
        outline: none;
        width: fit-content;
        font-size: 16px;
        font-weight: 500;
        color: rgb(73 130 225);
        margin-left: 40px;
        margin-top: 15px;
        background-color: transparent;
        letter-spacing: 1px;
        transition: 0.3s;
        margin-bottom: 50px;
      }
    }
  }
  .next-prev-btns {
    position: absolute;
    bottom: 41px;
    left: 50%;
    transform: translateX(-50%);
    .next {
      outline: none;
      background-color: $mainColor;
      color: $titleColor;
      margin-left: 5px;
      font-size: 20px;
      font-weight: 900;
      border: 1px solid $titleColor;
      padding: 14px 33px;
      border-radius: $bRadius;
    }
    .prev {
      border: 1px solid $titleColor;
      outline: none;
      background-color: $mainColor;
      color: $titleColor;
      margin-right: 5px;
      font-weight: 900;
      font-size: 20px;
      padding: 14px 33px;
      border-radius: $bRadius;
    }
  }
}
.start-exam .finish-exam {
  left: 0;
  bottom: -80px;
  width: 100%;
  text-align: center;
  button {
    outline: none;
    background-color: $mainColor;
    color: $titleColor;
    font-size: 20px;
    font-weight: 900;
    border: 1px solid $titleColor;
    padding: 14px 33px;
    border-radius: $bRadius;
  }
}
.start-exam {
  .finish-exam-alert,
  .timeout-alert {
    color: red;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.621);
    z-index: 1000;
    display: none;
    .body {
      background-color: white;
      width: 30%;
      border-radius: 10px;
      box-shadow: 0px 0px 10px -6px black;
      padding: 20px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .alert-btns {
        display: flex;
        justify-content: center;
        align-items: center;
        .submit-finish {
          background-color: #4175ee;
          color: white;
          font-weight: 500;
          padding: 4px 9px;
          border: 1px solid #4175ee;
          outline: none;
          border-radius: 7px;
          margin-right: 5px;
          font-size: 14px;
        }
        .cancel {
          background-color: indianred;
          color: white;
          font-weight: 500;
          padding: 4px 9px;
          border: 1px solid indianred;
          outline: none;
          border-radius: 7px;
          margin-left: 5px;
          font-size: 14px;
        }
      }
    }
  }
}
.start-exam .result-popup {
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
@media (max-width: 1100px) {
  .start-exam .container-fluid {
    width: 60% !important;
  }
}
@media (max-width: 990px) {
  .start-exam .container-fluid {
    width: 70% !important;
  }
  .start-exam {
    .finish-exam-alert .body,
    .timeout-alert .body {
      width: 38%;
    }
  }
  .start-exam .result-popup .body {
    width: 62%;
  }
}
@media (max-width: 767px) {
  .start-exam .container-fluid {
    width: 85% !important;
    min-height: 60%;
    padding-top: 30px !important;
    .exam-title h1 {
      font-size: 23px;
    }
    .ques-container {
      .ques-tit-row {
        margin-bottom: 0;
        p {
          font-size: 17px;
        }
      }
      .ques-choise-row {
        margin-top: 9px;
        .ques-choice-num {
          font-size: 9px;
          padding: 2px 5px;
        }
        i.correct-answer {
          padding: 2px !important;
        }
        p {
          font-size: 14px;
        }
      }
    }
  }
  .start-exam {
    button {
      font-size: 12px;
    }
  }
  .start-exam {
    .finish-exam-alert .body,
    .timeout-alert .body {
      width: 40%;
      p {
        font-size: 13px;
      }
    }
  }
  .start-exam .result-popup .body {
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
@media (max-width: 530px) {
  .start-exam .ques-container {
    margin-left: 20px !important;
    margin-right: 20px !important;
    padding: 0 !important;
  }
  .start-exam .ques-container .ques-tit-row .ques-tit {
    font-size: 14px;
  }
  .start-exam .ques-container .ques-choise-row .ques-choice-num {
    font-size: 9px;
  }
  .start-exam .ques-container .ques-choise-row p {
    font-size: 12px;
  }
  .start-exam {
    .finish-exam-alert .body,
    .timeout-alert .body {
      width: 70%;
      padding: 10px;
      p {
        font-size: 12px;
      }
    }
  }
  .start-exam .result-popup .body {
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
@media (max-width: 470px) {
  .start-exam .container-fluid {
    width: 95% !important;
  }
  .start-exam .exam-title h1 {
    font-size: 16px;
  }
  .start-exam .ques-container {
    padding-left: 5px;
    padding-right: 5px;
    .ques-tit-row .ques-tit {
      font-size: 13px;
    }
    .ques-choise-row {
      margin-left: 10px;
    }
  }
  .start-exam {
    button {
      font-size: 10px !important;
    }
  }
}
@media (max-width: 390px) {
  .start-exam .ques-container {
    .correct-answer {
      font-size: 9px;
    }
    .ques-choise-row {
      width: 85%;
    }
  }
}
</style>
