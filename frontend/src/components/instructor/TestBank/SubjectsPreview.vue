<template>
  <TheNav />
  <div class="subject-preview mb-4">
    <TheLoading />
    <div class="container-fluid">
      <div class="exam-title">
        <h1 class="text-center">{{ SubjectPreview.subjData.title }}</h1>
      </div>
      <div class="row">
        <div
          v-for="(ques, index) in SubjectPreview.subjData.questions"
          :key="ques.id"
          :id="ques.id"
          class="col-11 col-sm-10 col-md-9 col-lg-8 col-xl-7 ml-auto mr-auto ques-container mb-4"
        >
          <div class="ques-tit-row">
            <span class="ques-tit-num">{{ index + 1 }}</span
            ><i class="fa fa-arrow-right"></i>
            <input class="ques-tit" disabled :value="ques.question" />
          </div>
          <div class="choices">
            <div
              v-for="(choice, index) in ques.choices"
              :key="index"
              :id="index"
              :class="
                (index + 1 == ques.correctAnswerColumn &&
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheNav from "@/components/global/thenav/TheNav.vue";
import TheLoading from "@/components/global/loading/TheLoading.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "SubjectsPreview",
  components: {
    TheNav,
    TheLoading,
  },
  data() {
    return {
      subjectData: "",
      subjectQuestions: "",
      correctAnswers: [],
    };
  },
  computed: {
    ...mapState(["SubjectPreview"]),
  },
  methods: {
    ...mapActions(["getSubQuestions", "doCheckAuth"]),
  },
  async mounted() {
    const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
    if (!checkAuth) {
      this.$router.push("/signin");
    } else {
      await this.getSubQuestions(this.$route.params.id);
      document.querySelector(".subject-preview .loading").style.cssText = `
      opacity: 0; visibility: hidden
    `;
    }
  },
};
</script>

<style lang="scss">
@import "../../../assets/sass/main";

.subject-preview .exam-title h1 {
  color: white;
  border-bottom: 1px solid $titleColor;
  font-weight: 900;
  margin: 20px auto;
  width: fit-content;
}
.subject-preview .ques-container {
  padding-top: 60px;
  padding-left: 70px;
  padding-bottom: 80px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 7px -5px black;
  border-radius: 10px;
  font-weight: 900;
  background-color: $mainColor;
  border: 1px solid $titleColor;
  .ques-tit-row {
    margin-bottom: 20px;
    .ques-tit-num {
      font-size: 15px;
      color: $titleColor;
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
      color: $titleColor;
      font-weight: 900;
      text-transform: capitalize;
    }
  }
  .ques-choise-row {
    padding: 4px;
    min-height: 40px;
    border-radius: 4px;
    background-color: transparent;
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
      font-weight: 700;
      padding-left: 10px;
      text-transform: capitalize;
      width: 100%;
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
      i.correct-answer {
        border-radius: 50%;
        padding: 5px;
        background-color: #6fe16f;
        color: white;
      }
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
    input {
      color: black;
    }
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
    .time-degree {
      display: flex;
      flex-direction: column;
      padding-right: 170px;
      padding-top: 10px;
      label {
        font-size: 16px;
        font-weight: 500;
        color: rgb(73 130 225);
        letter-spacing: 1px;
        letter-spacing: 1px;
      }
    }
    input {
      margin-left: 10px;
      border: none;
      outline: none;
      padding-left: 15px;
      width: 50px;
      color: rgb(45, 104, 198);
      box-shadow: rgb(4 69 175 / 60%) 0px 0px 0px 1px inset;
      background-color: transparent;
      border-radius: 3px;
      padding-top: 6px;
      padding-bottom: 8px;
      font-weight: 500;
      font-size: 14px;
    }
    input[name="time"] {
      margin-left: 30px;
    }
    .add-choice:hover {
      color: rgb(7, 58, 139);
    }
    .save-ques {
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
      margin-right: 175px;
      transition: 0.3s;
    }
    .save-ques:hover {
      color: rgb(7, 58, 139);
    }
  }
  .trash-can:hover {
    opacity: 1;
  }
}
.subject-preview .degree-time {
  .degree,
  .time {
    box-shadow: 0px 0px 7px -5px black;
    padding: 10px;
    border-radius: 4px;
    color: white;
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
  .subject-preview .ques-container .btns .time-degree {
    padding-right: 91px !important;
  }
}
@media (max-width: 767px) {
  .subject-preview .side-ques-container {
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
  .subject-preview .side-ques-container .save-exam-div {
    bottom: 23px;
  }
  .subject-preview .ques-container {
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
  .subject-preview .degree-time {
    h3 {
      font-size: 13px;
    }
    p {
      font-size: 11px;
    }
  }
}
@media (max-width: 660px) {
  .subject-preview .ques-container .btns .save-ques {
    margin-right: 30px;
  }
}
@media (max-width: 530px) {
  .subject-preview .side-ques-container .side-block .side-ques-row {
    width: 50%;
    .side-ques-num {
      font-size: 10px;
      width: 17px;
      height: 17px;
    }
  }
  .subject-preview .ques-container .btns button {
    font-size: 12px !important;
  }
  .subject-preview .ques-container .ques-tit-row .ques-tit {
    font-size: 14px;
  }
  .subject-preview .ques-container .ques-tit-row .ques-tit::placeholder {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.613);
  }
  .subject-preview .ques-container .ques-choise-row .ques-choice-num {
    font-size: 9px;
  }
  .subject-preview .ques-container .ques-choise-row input {
    font-size: 12px;
  }
  .subject-preview .ques-container .ques-choise-row input::placeholder {
    color: rgba(4, 70, 175, 0.803);
    letter-spacing: 1px;
  }
  .subject-preview .ques-container .btns input {
    font-size: 12px;
  }
  .subject-preview .ques-container .btns .time-degree label {
    font-size: 12px;
  }
  .subject-preview .ques-container .btns .time-degree input[name="time"] {
    margin-left: 24px !important;
  }
  .subject-preview .ques-container .btns .time-degree {
    padding-right: 61px !important;
  }
}
@media (max-width: 470px) {
  .subject-preview .side-ques-container {
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
  .subject-preview .exam-title h1 {
    font-size: 16px;
  }
  .subject-preview .ques-container {
    padding-left: 20px;
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
  .subject-preview {
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
