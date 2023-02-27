<template>
  <TheNav />
  <div class="test-preview mb-4">
    <TheLoading />
    <div class="container-fluid">
      <div class="exam-title">
        <h1 class="text-center">{{ examPrev.examDetails.title }}</h1>
      </div>
      <div class="row">
        <div
          class="col-11 col-sm-10 col-md-9 col-lg-8 col-xl-7 ml-auto mr-auto ques-container mb-4"
          v-for="(question, index) in examPrev.examDetails.questions"
          :key="index"
          :id="question.id"
        >
          <div class="ques-tit-row">
            <span class="ques-tit-num">{{ index + 1 }}</span
            ><i class="fa fa-arrow-right"></i>
            <input class="ques-tit" disabled :value="question.question" />
          </div>
          <div class="choices">
            <div
              v-for="(choice, index) in question.choices"
              :key="index"
              :id="index"
              :class="
                (index + 1 == question.correctAnswerColumn &&
                  'ques-choise-row position-relative correct-answer') ||
                `ques-choise-row position-relative`
              "
            >
              <span class="ques-choice-num" v-if="choice != ''">{{
                index + 1
              }}</span>
              <input
                class="ques-choice"
                disabled
                placeholder="Choice"
                :value="choice"
                v-if="choice != ''"
              />
            </div>
          </div>
          <p class="ques-deg mt-4 mr-5 text-center" style="font-size: 13px">
            {{ question.degree }} / Degree
          </p>
        </div>
      </div>
      <div class="degree-time d-flex justify-content-around align-items-center">
        <div class="degree">
          <h3>Total Degree</h3>
          <p class="degree-text">
            {{ examPrev.examDetails.totalDegree }} / Degrees
          </p>
        </div>
        <div class="time">
          <h3>Total Time</h3>
          <p class="time-text">{{ examPrev.examDetails.time }} / Minutes</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheNav from "@/components/global/thenav/TheNav.vue";
import { mapActions, mapState } from "vuex";
import TheLoading from "@/components/global/loading/TheLoading.vue";

export default {
  name: "TestPreview",
  components: {
    TheNav,
    TheLoading,
  },
  computed: {
    ...mapState(["examPrev"]),
  },
  methods: {
    ...mapActions(["getExamQuestions", "doCheckAuth"]),
  },
  async mounted() {
    const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
    if (!checkAuth) {
      this.$router.push("/signin");
    } else {
      await this.getExamQuestions(this.$route.params.id);
      document.querySelector(".test-preview .loading").style.cssText = `
      opacity: 0; visibility: hidden
    `;
    }
  },
};
</script>

<style lang="scss">
@import "../../../assets/sass/main";

.test-preview .exam-title h1 {
  color: $titleColor;
  border-bottom: 1px solid $titleColor;
  width: fit-content;
  margin: auto;
  margin-bottom: 20px;
  margin-top: 20px;
  font-weight: 900;
}
.test-preview .ques-container {
  padding-top: 60px;
  padding-left: 70px;
  padding-bottom: 80px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 7px -5px black;
  border-radius: 10px;
  color: $titleColor;
  font-weight: 900;
  background-color: $mainColor;
  border: 1px solid $titleColor;
  .ques-tit-row {
    margin-bottom: 20px;
    .ques-tit-num {
      font-size: 15px;
      font-weight: 900;
    }
    i {
      color: $titleColor;
      font-size: 10px;
      padding-left: 3px;
      padding-right: 10px;
    }
    input {
      border: none;
      outline: none;
      background-color: transparent;
      border-bottom: 1px solid $titleColor;
      padding-bottom: 5px;
      width: 80%;
      font-size: 20px;
      text-transform: capitalize;
      color: $titleColor;
      font-weight: 900;
    }
  }
  .ques-choise-row {
    padding: 4px;
    min-height: 40px;
    border-radius: 4px;
    width: 65%;
    margin-top: 15px;
    display: flex;
    align-items: center;
    margin-left: 40px;
    input {
      border: none;
      outline: none;
      background-color: transparent;
      color: $titleColor;
      padding-left: 10px;
      text-transform: capitalize;
      width: 100%;
      font-weight: 700;
    }
    .ques-choice-num {
      font-size: 11px;
      border: none;
      outline: none;
      color: rgb(39, 39, 253);
      font-weight: 500;
      background-color: $titleColor;
      border: 1px solid rgb(39, 39, 253);
      border-radius: 4px;
      padding: 0;
      margin-left: 5px;
      text-align: center;
      padding: 4px 6px;
    }
    .correct-answer-div {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: -65px;
    }
  }
  .ques-choise-row.correct-answer {
    box-shadow: #6fe16f 0px 0px 0px 2px inset;
    background-color: #a5f4a594;
    input {
      color: black;
    }
  }
}
.test-preview .degree-time {
  width: fit-content;
  margin: auto;
  border-radius: 20px;
  background-color: $mainColor;
  border: 1px solid $titleColor;
  padding: 10px 30px;
  .degree,
  .time {
    padding: 10px;
    border-radius: 4px;
    color: $titleColor;
    margin: 0 20px;
  }
  h3 {
    font-size: 15px;
    text-align: center;
    font-weight: 900;
  }
  p {
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 0;
  }
}
//Media Queries
@media (max-width: 990px) {
  .test-preview .ques-container .btns .time-degree {
    padding-right: 91px !important;
  }
}
@media (max-width: 767px) {
  .test-preview .side-ques-container {
    height: 14vh;
    overflow-y: unset !important;
    order: 2;
    box-shadow: unset;
    .side-ques-dad {
      box-shadow: 0px 0px 7px -5px black;
    }
    .side-block {
      display: flex;
      flex-wrap: wrap;
      overflow-y: scroll;
      height: 11vh;
      .side-ques-row {
        width: 33%;
        height: 45%;
      }
    }
    .submit {
      position: absolute;
      left: 50%;
      bottom: -25px;
      transform: translateX(-50%);
      z-index: 20;
    }
  }
  .test-preview .side-ques-container .save-exam-div {
    bottom: 23px;
  }
  .test-preview .ques-container {
    padding-top: 72px;
    padding-left: 70px;
    height: 53vh;
    .ques-tit-row {
      margin-bottom: 0;
      input {
        font-size: 16px;
        &::placeholder {
          font-size: 16px;
        }
      }
    }
    .ques-choise-row {
      min-height: 30px;
      margin-top: 9px;
      .ques-choice-num {
        font-size: 9px;
        padding: 2px 5px;
      }
      input {
        font-size: 12px;
      }
      .correct-answer-div {
        right: -44px;
        i.correct-answer {
          padding: 2px !important;
        }
      }
    }
    .btns {
      margin-top: 0;
      .time-degree label {
        font-size: 12px;
      }
      .time-degree input {
        width: 50px;
        padding-top: 2px;
        padding-bottom: 4px;
        font-size: 12px;
      }
      .time-degree input[name="time"] {
        margin-left: 25px;
      }
    }
    .btns .add-choice {
      font-size: 13px;
    }
  }
  .test-preview .degree-time {
    h3 {
      font-size: 13px;
    }
    p {
      font-size: 11px;
    }
  }
}
@media (max-width: 660px) {
  .test-preview .ques-container .btns .save-ques {
    margin-right: 30px;
  }
}
@media (max-width: 530px) {
  .test-preview .side-ques-container .side-block .side-ques-row {
    width: 50%;
    .side-ques-num {
      font-size: 10px;
      width: 17px;
      height: 17px;
    }
  }
  .test-preview .ques-container .btns button {
    font-size: 12px !important;
  }
  .test-preview .ques-container .ques-tit-row .ques-tit {
    font-size: 14px;
  }
  .test-preview .ques-container .ques-tit-row .ques-tit::placeholder {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.613);
  }
  .test-preview .ques-container .ques-choise-row .ques-choice-num {
    font-size: 9px;
  }
  .test-preview .ques-container .ques-choise-row input {
    font-size: 12px;
  }
  .test-preview .ques-container .ques-choise-row input::placeholder {
    color: rgba(4, 70, 175, 0.803);
    letter-spacing: 1px;
  }
  .test-preview .ques-container .btns input {
    font-size: 12px;
  }
  .test-preview .ques-container .btns .time-degree label {
    font-size: 12px;
  }
  .test-preview .ques-container .btns .time-degree input[name="time"] {
    margin-left: 24px !important;
  }
  .test-preview .ques-container .btns .time-degree {
    padding-right: 61px !important;
  }
}
@media (max-width: 470px) {
  .test-preview .side-ques-container {
    .side-ques-row {
      height: 34% !important;
    }
    .submit {
      bottom: -44px;
    }
    .side-block {
      height: 14vh;
    }
  }
  .test-preview .exam-title h1 {
    font-size: 16px;
  }
  .test-preview .ques-container {
    padding-left: 22px;
    padding-right: 5px;
    height: 50vh;
    border-radius: 10px;
    .ques-choise-row {
      width: 81%;
      margin-left: 28px;
      .del-choice {
        font-size: 9px;
        width: 17px;
        height: 15px;
      }
    }
    .btns .time-degree {
      padding-right: 49px !important;
    }
  }
  .add-choice {
    margin-left: 29px !important;
  }
}
@media (max-width: 390px) {
  .test-preview {
    .side-ques-container .side-block .side-ques-row {
      width: 100%;
      margin: 10px 10px 5px 10px;
    }
    .ques-container {
      .btns .time-degree {
        padding-right: 30px !important;
      }
      .ques-choise-row .correct-answer-div {
        right: -26px;
        .correct-answer {
          font-size: 9px;
        }
      }
    }
  }
}
</style>
