<template>
  <TheNav />
  <div class="bank-page">
    <div class="container-fluid">
      <div class="test-title-pop">
        <div class="pop-overlay"></div>
        <div class="dad">
          <h3>Subject Title</h3>
          <form action="" @submit.prevent="closeSubjectPop">
            <input type="text" required />
            <button>Next</button>
          </form>
        </div>
      </div>
      <form action="" @submit.prevent="saveExamData">
        <div class="exam-title">
          <h1>Exam Title</h1>
        </div>
        <div class="row">
          <div
            class="col-11 col-md-2 mr-auto mr-md-2 ml-auto mt-3 side-ques-container"
          >
            <div class="side-ques-dad">
              <div class="side-block">
                <div
                  class="side-ques-row position-relative side-active"
                  data-question=".question-block-1"
                >
                  <p class="side-ques">
                    <span class="side-ques-num">1</span
                    ><i class="fa fa-arrow-right"></i> Question One
                    <span class="options-block position-absolute">
                      <i class="fa fa-close options-icon d-none"></i>
                    </span>
                  </p>
                </div>
              </div>
              <div class="submit" @click="addSideQuestions">
                <i class="fa fa-plus submit-btn"></i>
              </div>
            </div>
          </div>
          <div
            class="col-md-9 col-11 ml-auto ml-md-2 mr-auto ques-container mt-3 question-block-1"
          >
            <div class="ques-tit-row">
              <span class="ques-tit-num">1</span
              ><i class="fa fa-arrow-right"></i>
              <input
                class="ques-tit"
                placeholder="Write your question here.."
              />
            </div>
            <div class="choices">
              <div class="ques-choise-row position-relative chosen-answer">
                <span class="ques-choice-num">A</span>
                <input class="ques-choice" placeholder="Choice" />
                <i
                  class="fa fa-close del-choice"
                  style="pointer-events: none; opacity: 0.4"
                ></i>
                <div class="correct-answer-div">
                  <i class="fa fa-check correct-answer"></i>
                </div>
              </div>
              <div class="ques-choise-row position-relative">
                <span class="ques-choice-num">B</span>
                <input class="ques-choice" placeholder="Choice" />
                <i
                  class="fa fa-close del-choice"
                  style="pointer-events: none; opacity: 0.4"
                ></i>
                <div class="correct-answer-div">
                  <i class="fa fa-check correct-answer"></i>
                </div>
              </div>
            </div>
            <div class="btns">
              <button class="add-choice" type="button" @click="addChoice">
                Add Choice
              </button>
            </div>
          </div>
        </div>
        <TheLoading />
        <div class="success" @click="closePopup">
          <div class="container" @click="stopProp">
            <p class="text-center">Exam was created successfully!</p>
          </div>
        </div>
        <div class="save-exam-div">
          <button class="save-exam">Save Subject</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import TheNav from "@/components/global/thenav/TheNav.vue";
import { mapActions } from "vuex";
import TheLoading from "@/components/global/loading/TheLoading.vue";

export default {
  name: "BankPage",
  components: {
    TheNav,
    TheLoading,
  },
  data() {
    return {
      abcd: ["A", "B", "C", "D"],
      numbers: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      ],
      userId: "",
      degreeCounter: 0,
      questionsArr: [],
      subjectName: "",
      isValid: false,
      subjectId: "",
    };
  },
  methods: {
    ...mapActions(["doAddSubject", "doCheckAuth"]),
    showAlert(icn, msg, btnTxt) {
      this.$swal({
        title: msg,
        icon: icn,
        confirmButtonText: btnTxt,
        confirmButtonColor: "#197278",
        showCloseButton: true,
      });
    },
    closeSubjectPop(e) {
      document.querySelector(".bank-page .exam-title h1").innerText =
        e.currentTarget.querySelector("input").value;
      this.subjectName = e.currentTarget.querySelector("input").value;
      e.currentTarget.parentElement.parentElement.style.display = "none";
    },
    addChoice() {
      let choiceContainer = document.querySelectorAll(
        ".bank-page .ques-container .choices"
      );
      let choiceDiv = document.createElement("div");
      choiceDiv.classList = "ques-choise-row position-relative";
      let choiceNum = document.createElement("span");
      choiceNum.innerHTML = "C";
      choiceNum.className = "ques-choice-num";
      let choiceInp = document.createElement("input");
      choiceInp.className = "ques-choice";
      choiceInp.setAttribute("placeholder", "Choice");
      let delChoice = document.createElement("i");
      delChoice.classList = "fa fa-close del-choice";
      let trueFalseDiv = document.createElement("div");
      trueFalseDiv.className = "correct-answer-div";
      let correct = document.createElement("i");
      correct.classList = "fa fa-check correct-answer";
      choiceDiv.appendChild(choiceNum);
      choiceDiv.appendChild(choiceInp);
      choiceDiv.appendChild(delChoice);
      trueFalseDiv.appendChild(correct);
      choiceDiv.appendChild(trueFalseDiv);

      choiceContainer[0].appendChild(choiceDiv);
      let allChoices = choiceContainer[0].querySelectorAll(".ques-choise-row");
      if (allChoices.length == 4) {
        choiceContainer[0].parentElement.querySelector(
          ".add-choice"
        ).style.pointerEvents = "none";
        choiceContainer[0].parentElement.querySelector(
          ".add-choice"
        ).style.opacity = ".4";
      } else {
        choiceContainer[0].parentElement.querySelector(
          ".add-choice"
        ).style.pointerEvents = "unset";
        choiceContainer[0].parentElement.querySelector(
          ".add-choice"
        ).style.opacity = "1";
      }
      for (let i = 0; i < allChoices.length; i++) {
        allChoices[i].querySelector(".ques-choice-num").innerText =
          this.abcd[i];
      }

      //Delete Choice
      allChoices.forEach((choice) => {
        let btn = choice.querySelector(".del-choice");
        btn.addEventListener("click", () => {
          choice.remove();
          allChoices = choiceContainer[0].querySelectorAll(".ques-choise-row");
          if (allChoices.length == 4) {
            choiceContainer[0].parentElement.querySelector(
              ".add-choice"
            ).style.pointerEvents = "none";
            choiceContainer[0].parentElement.querySelector(
              ".add-choice"
            ).style.opacity = ".4";
          } else {
            choiceContainer[0].parentElement.querySelector(
              ".add-choice"
            ).style.pointerEvents = "unset";
            choiceContainer[0].parentElement.querySelector(
              ".add-choice"
            ).style.opacity = "1";
          }
          for (let i = 0; i < allChoices.length; i++) {
            allChoices[i].querySelector(".ques-choice-num").innerText =
              this.abcd[i];
          }
        });
        //Choose Correct Answer
        choiceContainer[0]
          .querySelectorAll(".choices .correct-answer")
          .forEach((check) => {
            check.addEventListener("click", (e) => {
              choiceContainer[0]
                .querySelectorAll(".choices .correct-answer")
                .forEach((check) => {
                  check.style.opacity = 0;
                  check.parentElement.parentElement.classList.remove(
                    "chosen-answer"
                  );
                });
              e.target.style.opacity = 1;
              e.target.parentElement.parentElement.classList.add(
                "chosen-answer"
              );
            });
          });
      });
    },
    addSideQuestions() {
      let sideContainer = document.querySelector(
        ".bank-page .side-ques-container .side-block"
      );
      let allSideRows = document.querySelectorAll(
        ".bank-page .side-ques-container .side-ques-row"
      );
      //Adding New Side Questions
      let sideRow = document.createElement("div");
      sideRow.classList = "side-ques-row position-relative";
      let sideQues = document.createElement("p");
      sideQues.className = "side-ques";
      let sideNum = document.createElement("span");
      sideNum.className = "side-ques-num";
      sideNum.innerText = "2";
      let sideArrow = document.createElement("i");
      sideArrow.classList = "fa fa-arrow-right";
      let quesText = "New Question";
      let optionsBlock = document.createElement("span");
      optionsBlock.classList = "options-block position-absolute";
      let optionsIcon = document.createElement("i");
      optionsIcon.classList = "fa fa-close options-icon";
      sideQues.appendChild(sideNum);
      sideQues.appendChild(sideArrow);
      sideQues.appendChild(document.createTextNode(quesText));
      sideQues.appendChild(optionsBlock);
      optionsBlock.appendChild(optionsIcon);
      sideRow.appendChild(sideQues);
      sideContainer.appendChild(sideRow);
      allSideRows = document.querySelectorAll(
        ".bank-page .side-ques-container .side-ques-row"
      );
      // //Creating Question Block Related To Side Question
      let questNewBlock = document.createElement("div");
      questNewBlock.classList =
        "col-md-9 col-11 ml-auto ml-md-2 mr-auto ques-container mt-3";
      questNewBlock.innerHTML = `<div class="ques-tit-row">
            <span class="ques-tit-num">1</span><i class="fa fa-arrow-right"></i>
            <input class="ques-tit" placeholder="Write your question here.." />
          </div>
          <div class="choices">
            <div class="ques-choise-row row-one position-relative chosen-answer">
              <span class="ques-choice-num">A</span>
              <input class="ques-choice" placeholder="Choice" />
              <i
                class="fa fa-close del-choice"
                style="pointer-events: none; opacity: 0.4"
              ></i>
            </div>
            <div class="ques-choise-row row-two position-relative">
              <span class="ques-choice-num">B</span>
              <input class="ques-choice" placeholder="Choice" />
              <i
                class="fa fa-close del-choice"
                style="pointer-events: none; opacity: 0.4"
              ></i>
            </div>
          </div>
          <div class="btns">
            <button class="add-choice" type="button">Add Choice</button>
          </div>`;
      let trueFalseDivOne = document.createElement("div");
      trueFalseDivOne.className = "correct-answer-div";
      let correctOne = document.createElement("i");
      correctOne.classList = "fa fa-check correct-answer";
      trueFalseDivOne.appendChild(correctOne);

      let trueFalseDivTwo = document.createElement("div");
      trueFalseDivTwo.className = "correct-answer-div";
      let correctTwo = document.createElement("i");
      correctTwo.classList = "fa fa-check correct-answer";
      trueFalseDivTwo.appendChild(correctTwo);

      questNewBlock.querySelector(".row-one").appendChild(trueFalseDivOne);
      questNewBlock.querySelector(".row-two").appendChild(trueFalseDivTwo);

      for (let i = 0; i < allSideRows.length; i++) {
        allSideRows[i].querySelector(".side-ques-num").innerHTML =
          this.numbers[i];
        sideRow.setAttribute(
          "data-question",
          `.question-block-${
            allSideRows[i].querySelector(".side-ques-num").innerHTML
          }`
        );
        questNewBlock.classList = `col-md-9 col-11 ml-auto ml-md-2 mr-auto
         ques-container mt-3 question-block-${
           allSideRows[i].querySelector(".side-ques-num").innerHTML
         }`;
        questNewBlock.querySelector(".ques-tit-num").innerHTML = `${
          allSideRows[i].querySelector(".side-ques-num").innerHTML
        }`;
      }
      if (allSideRows.length == 20) {
        document.querySelector(
          ".bank-page .side-ques-container .submit"
        ).style.pointerEvents = "none";
        document.querySelector(
          ".bank-page .side-ques-container .submit"
        ).style.opacity = ".4";
      } else if (allSideRows.length >= 12) {
        document.querySelector(
          ".bank-page .side-ques-container"
        ).style.overflowY = "scroll";
      } else {
        document.querySelector(
          ".bank-page .side-ques-container .submit-btn"
        ).style.pointerEvents = "block";
        document.querySelector(
          ".bank-page .side-ques-container .submit-btn"
        ).style.opacity = "1";
      }
      document.querySelector(".bank-page .row").appendChild(questNewBlock);

      //Check If time and Degree Default Or custom
      //Test
      questNewBlock
        .querySelector(".add-choice")
        .addEventListener("click", () => {
          let choiceContainer = questNewBlock.querySelector(".choices");
          let choiceDiv = document.createElement("div");
          choiceDiv.classList = "ques-choise-row position-relative";
          let choiceNum = document.createElement("span");
          choiceNum.innerHTML = "C";
          choiceNum.className = "ques-choice-num";
          let choiceInp = document.createElement("input");
          choiceInp.className = "ques-choice";
          choiceInp.setAttribute("placeholder", "Choice");
          let delChoice = document.createElement("i");
          delChoice.classList = "fa fa-close del-choice";
          let trueFalseDiv = document.createElement("div");
          trueFalseDiv.className = "correct-answer-div";
          let correct = document.createElement("i");
          correct.classList = "fa fa-check correct-answer";
          choiceDiv.appendChild(choiceNum);
          choiceDiv.appendChild(choiceInp);
          choiceDiv.appendChild(delChoice);
          trueFalseDiv.appendChild(correct);
          choiceDiv.appendChild(trueFalseDiv);
          choiceContainer.appendChild(choiceDiv);

          let allChoices = choiceContainer.querySelectorAll(".ques-choise-row");
          if (allChoices.length == 4) {
            choiceContainer.parentElement.querySelector(
              ".add-choice"
            ).style.pointerEvents = "none";
            choiceContainer.parentElement.querySelector(
              ".add-choice"
            ).style.opacity = ".4";
          } else {
            choiceContainer.parentElement.querySelector(
              ".add-choice"
            ).style.pointerEvents = "unset";
            choiceContainer.parentElement.querySelector(
              ".add-choice"
            ).style.opacity = "1";
          }
          for (let i = 0; i < allChoices.length; i++) {
            allChoices[i].querySelector(".ques-choice-num").innerText =
              this.abcd[i];
          }
          //Delete Choice
          allChoices.forEach((choice) => {
            let btn = choice.querySelector(".del-choice");
            btn.addEventListener("click", () => {
              choice.remove();
              allChoices = choiceContainer.querySelectorAll(".ques-choise-row");
              if (allChoices.length == 4) {
                choiceContainer.parentElement.querySelector(
                  ".add-choice"
                ).style.pointerEvents = "none";
                choiceContainer.parentElement.querySelector(
                  ".add-choice"
                ).style.opacity = ".4";
              } else {
                choiceContainer.parentElement.querySelector(
                  ".add-choice"
                ).style.pointerEvents = "unset";
                choiceContainer.parentElement.querySelector(
                  ".add-choice"
                ).style.opacity = "1";
              }
              for (let i = 0; i < allChoices.length; i++) {
                allChoices[i].querySelector(".ques-choice-num").innerText =
                  this.abcd[i];
              }
            });
          });
          ///////////
          //Choose Correct Answer
          questNewBlock.querySelectorAll(".correct-answer").forEach((check) => {
            check.addEventListener("click", () => {
              questNewBlock
                .querySelectorAll(".correct-answer")
                .forEach((check) => {
                  check.style.opacity = 0;
                  check.parentElement.parentElement.classList.remove(
                    "chosen-answer"
                  );
                });
              check.style.opacity = 1;
              check.parentElement.parentElement.classList.add("chosen-answer");
            });
          });
        });
      ///////////
      //Choose Correct Answer
      questNewBlock
        .querySelectorAll(".ques-choise-row .correct-answer")
        .forEach((check) => {
          check.addEventListener("click", () => {
            questNewBlock
              .querySelectorAll(
                ".bank-page .ques-container .ques-choise-row .correct-answer"
              )
              .forEach((check) => {
                check.style.opacity = 0;
                check.parentElement.parentElement.classList.remove(
                  "chosen-answer"
                );
              });
            check.style.opacity = 1;
            check.parentElement.parentElement.classList.add("chosen-answer");
          });
        });
      //Check If Degree Default Or Not
      if (this.userId.degree > 0) {
        document
          .querySelectorAll(".bank-page .ques-container .btns input")
          .forEach((degree) => {
            degree.value = this.userId.degree;
            degree.setAttribute("disabled", "disabled");
            degree.style.boxShadow = "unset";
          });
      }
    },
    async saveExamData() {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
      if (!checkAuth) {
        this.$router.push("/signin");
      } else {
        ////////////
        let allFeilds = document.querySelectorAll(".bank-page .ques-container");
        let allQuestions = document.querySelectorAll(
          ".bank-page .ques-container"
        );
        for (let i = 0; i < allFeilds.length; i++) {
          let feildChoices = allFeilds[i].querySelectorAll(
            ".ques-choise-row input"
          );
          for (let j = 0; j < feildChoices.length; j++) {
            if (feildChoices[j].value == "") {
              this.showAlert("error", "Please complet your questions", "OK");
              this.isValid = false;
              break;
            } else {
              this.isValid = true;
            }
          }
        }
        if (this.isValid == true) {
          document.querySelector(".bank-page .loading").style.cssText = `
            opacity: 0.7; visibility: visible
          `;
          for (let i = 0; i < allQuestions.length; i++) {
            let questionObj = {
              title: allQuestions[i].querySelector(
                ".bank-page .ques-container .ques-tit-row input"
              ).value,
              choices: [],
              correctAnswer: "",
            };
            let allChoices = allQuestions[i].querySelectorAll(
              ".bank-page .ques-container .ques-choise-row input"
            );
            for (let j = 0; j < allChoices.length; j++) {
              questionObj.choices.push(allChoices[j].value);
              if (
                allChoices[j].parentElement.classList.contains("chosen-answer")
              ) {
                questionObj.correctAnswer = [j];
              }
            }
            this.questionsArr.push(questionObj);
          }
          //
          let allSubQuestions = [];
          for (let k = 0; k < this.questionsArr.length; k++) {
            let quesTitle = this.questionsArr[k].title;
            let correctAns = this.questionsArr[k].correctAnswer;
            let choose1 = this.questionsArr[k].choices[0];
            let choose2 = this.questionsArr[k].choices[1];
            let choose3 = "";
            let choose4 = "";
            if (this.questionsArr[k].choices.length > 2) {
              choose3 = this.questionsArr[k].choices[2];
              if (this.questionsArr[k].choices.length > 3) {
                choose4 = this.questionsArr[k].choices[3];
              }
            }
            const allChoices = [];
            allChoices.push(choose1);
            allChoices.push(choose2);
            allChoices.push(choose3);
            allChoices.push(choose4);
            const examQuesData = {
              question: quesTitle,
              choices: allChoices,
              correctAnswerColumn: JSON.parse(correctAns[0]) + 1,
            };
            allSubQuestions.push(examQuesData);
          }
          const subjData = {
            title: this.subjectName,
            instructorUserId: this.userId,
            questions: allSubQuestions,
          };
          await this.doAddSubject(subjData);
          setTimeout(() => {
            document.querySelector(".bank-page .loading").style.cssText = `
            opacity: 0; visibility: hidden
          `;
            this.showAlert("success", "Subject created successfuly!", "OK");
          }, 2000);
          setTimeout(() => {
            this.$router.push("subjects-home");
          }, 4000);
        }
      }
    },
  },
  async mounted() {
    const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
    if (!checkAuth) {
      this.$router.push("/signin");
    } else {
      if (checkAuth.userRole != "INSTRUCTOR") {
        this.$router.push("/");
      } else {
        //Get Data
        this.userId = checkAuth._id;
        //Call Active Side Ques And Display Its Ques block
        let activeOnLoadRow = "";
        if (
          document.querySelector(
            ".bank-page .side-ques-container .side-ques-row.side-active"
          )
        ) {
          activeOnLoadRow = document.querySelector(
            ".bank-page .side-ques-container .side-ques-row.side-active"
          );
          document.querySelector(
            activeOnLoadRow.dataset.question
          ).style.display = "block";
        }
        let sideContainer = document.querySelector(
          ".bank-page .side-ques-container"
        );
        sideContainer.addEventListener("click", (e) => {
          let sideRows = document.querySelectorAll(".bank-page .side-ques-row");
          sideRows.forEach((ques) => {
            //Add Active Color To Selected Question And Display Its Ques Block
            ques.addEventListener("click", (e) => {
              let allQuesBlocks = document.querySelectorAll(
                ".bank-page .ques-container"
              );
              allQuesBlocks.forEach((block) => {
                block.style.display = "none";
              });
              sideRows.forEach((ques) => {
                if (!e.target.classList.contains("options-icon")) {
                  ques.classList.remove("side-active");
                  e.currentTarget.classList.add("side-active");
                  if (ques.classList.contains("side-active")) {
                    document.querySelector(
                      ques.dataset.question
                    ).style.display = "block";
                  }
                }
              });
              //End Add Active Color To Selected Question
            });
          });
          //Deleting side question and related block question
          if (e.target.classList.contains("options-icon")) {
            document
              .querySelector(
                e.target.parentElement.parentElement.parentElement.dataset
                  .question
              )
              .remove();
            e.target.parentElement.parentElement.parentElement.remove();
            sideRows = document.querySelectorAll(".bank-page .side-ques-row");
            let allQueses = document.querySelectorAll(
              ".bank-page .ques-container"
            );
            if (sideRows.length < 2) {
              document
                .querySelector(".bank-page .side-ques-container .side-ques-row")
                .classList.add("side-active");
            }
            if (sideRows.length < 20) {
              document.querySelector(
                ".bank-page .side-ques-container .submit"
              ).style.pointerEvents = "unset";
              document.querySelector(
                ".bank-page .side-ques-container .submit"
              ).style.opacity = "1";
            }
            if (sideRows.length < 12) {
              document.querySelector(
                ".bank-page .side-ques-container"
              ).style.overflowY = "unset";
            }
            for (let i = 0; i < sideRows.length; i++) {
              sideRows[i].querySelector(".side-ques-num").innerHTML =
                this.numbers[i];

              sideRows[i].setAttribute(
                "data-question",
                `.question-block-${
                  sideRows[i].querySelector(".side-ques-num").innerHTML
                }`
              );
              allQueses[i].classList = `col-md-9 col-11 ml-auto ml-md-2 mr-auto
         ques-container mt-3 question-block-${
           sideRows[i].querySelector(".side-ques-num").innerHTML
         }`;
              allQueses[i].querySelector(".ques-tit-num").innerHTML = `${
                sideRows[i].querySelector(".side-ques-num").innerHTML
              }`;
            }
            sideRows.forEach((row) => {
              row.classList.remove("side-active");
            });
            sideRows[0].classList.add("side-active");
            document.querySelector(sideRows[0].dataset.question).style.display =
              "block";
          }
          //End Deleting side question and related block question
        });
        //Choose Correct Answer
        let quesContainerOnLoad = document.querySelectorAll(
          ".bank-page .ques-container"
        )[0];
        quesContainerOnLoad
          .querySelectorAll(
            ".bank-page .ques-container .ques-choise-row .correct-answer"
          )
          .forEach((check) => {
            check.addEventListener("click", () => {
              quesContainerOnLoad
                .querySelectorAll(".correct-answer")
                .forEach((check) => {
                  check.style.opacity = 0;
                  check.parentElement.parentElement.classList.remove(
                    "chosen-answer"
                  );
                });
              check.style.opacity = 1;
              check.parentElement.parentElement.classList.add("chosen-answer");
            });
          });
        setTimeout(() => {
          document.querySelector(".bank-page .loading").style.cssText = `
            opacity: 0; visibility: hidden
          `;
        }, 200);
      }
    }
  },
};
</script>

<style lang="scss">
@import "../../../assets/sass/main";

.bank-page .test-title-pop {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: $bgColor;
  z-index: 30;
  display: flex;
  justify-content: center;
  align-items: center;
  .pop-overlay {
    width: 100%;
    z-index: -1;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: $bgColor;
  }
  .dad {
    width: 50%;
    text-align: center;
    padding: 20px;
    background-color: $mainColor;
    color: $titleColor;
    border-radius: 25px;
    h3 {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 20px;
    }
    input {
      outline: none;
      width: 94%;
      border-radius: 10px;
      height: 38px;
      border: none;
      margin-bottom: 24px;
      padding-left: 14px;
      font-size: 25px;
      font-weight: 700;
      padding-bottom: 5px;
    }
    button {
      width: 125px;
      height: 46px;
      border-radius: 15px;
      border: 1px solid $titleColor;
      background: #55b0a4;
      color: $titleColor;
      font-size: 25px;
      font-weight: 900;
      opacity: 0.7;
    }
    button:hover {
      opacity: 1;
      background: #099e09;
    }
  }
}
.bank-page .exam-title {
  position: fixed;
  z-index: 1000;
  left: 50%;
  transform: translateX(-50%);
  top: 120px;
  width: fit-content;
  z-index: 1;
  h1 {
    margin: 0 0 5px 0;
    text-align: center;
    font-size: 25px;
    font-weight: 900;
    color: $mainColor;
  }
}
.bank-page {
  ::-webkit-scrollbar-track {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: white;
    margin-block: 2px;
    border-left: 1px solid rgb(206, 205, 205);
  }
  .side-ques-container {
    background-color: white;
    padding: 0;
    height: 82vh;
    padding-bottom: 20px;
    box-shadow: 0px 0px 7px -5px black;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    .side-block {
      padding-left: 1px;
    }
    .side-ques-row {
      display: flex;
      align-items: center;
      padding: 12px 0 12px 10px;
      transition: 0.4s;
      margin-top: 1px;
      cursor: pointer;
      .side-ques {
        font-size: 10px;
        font-weight: 700;
        margin: 0;
        .side-ques-num {
          font-size: 12px;
          background-color: #797777;
          color: white;
          width: 20px;
          height: 20px;
          display: inline-block;
          text-align: center;
          border-radius: 4px;
          font-weight: 700;
        }
        i {
          font-size: 10px;
          padding-left: 5px;
          padding-right: 5px;
        }
        .options-block {
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          .options-icon {
            font-size: 12px;
            transition: 0.2s;
            color: rgba(109, 107, 107, 0.804);
          }
        }
      }
    }
    //Side Active Classes
    .side-active {
      background-color: rgb(243, 240, 240);
      border-radius: 7px;
      outline: 1px solid #a5a3a3b5;
    }
    /////////////////////////
    .submit {
      width: 40px;
      background-color: $mainColor;
      opacity: 0.7;
      margin-left: auto;
      margin-right: auto;
      margin-top: 10px;
      position: relative;
      border-radius: 7px;
      text-align: center;
      transition: 0.3s;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
    .submit .submit-btn {
      border: none;
      outline: none;
      width: fit-content;
      font-size: 17px;
      color: white;
      letter-spacing: 1px;
      padding: 8px 0;
    }
  }
}
.bank-page .save-exam-div {
  position: fixed;
  bottom: 55px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  .save-exam {
    background-color: $mainColor;
    color: white;
    width: 200px;
    border: 1px solid $mainColor;
    padding: 8px 0;
    border-radius: 15px;
    font-size: 25px;
    font-weight: 900;
    transition: 0.3s;
    box-shadow: 0px 0px 10px -3px black;
    opacity: 0.6;
    &:hover {
      opacity: 1;
    }
  }
}
.bank-page .ques-container {
  background-color: white;
  height: 82vh;
  padding-top: 110px;
  padding-left: 100px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 7px -5px black;
  display: none;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;

  .ques-tit-row {
    margin-bottom: 20px;
    .ques-tit-num {
      font-size: 15px;
      font-weight: 700;
      color: $mainColor;
    }
    i {
      color: #197278;
      font-size: 10px;
      padding-left: 3px;
      padding-right: 10px;
    }
    input {
      border: none;
      outline: none;
      background-color: transparent;
      border-bottom: 1px solid $mainColor;
      padding-bottom: 5px;
      width: 80%;
      font-size: 20px;
      text-transform: capitalize;
      font-weight: 700;
    }
    input::placeholder {
      font-size: 20px;
      font-style: italic;
      color: rgba(0, 0, 0, 0.326);
    }
  }
  .ques-choise-row {
    box-shadow: $mainColor 0px 0px 0px 1px inset;
    padding: 4px;
    min-height: 40px;
    border-radius: 4px;
    background-color: #19727824;
    width: 65%;
    margin-top: 15px;
    display: flex;
    align-items: center;
    margin-left: 40px;
    input {
      border: none;
      outline: none;
      background-color: transparent;
      padding-left: 10px;
      text-transform: capitalize;
      width: 100%;
      font-weight: 700;
    }
    .ques-choice-num {
      font-size: 11px;
      border: none;
      outline: none;
      color: $mainColor;
      font-weight: 500;
      background-color: rgb(254, 254, 254);
      border: 1px solid $mainColor;
      border-radius: 4px;
      padding: 0;
      margin-left: 5px;
      text-align: center;
      padding: 4px 6px;
      font-weight: 700;
    }
    .del-choice {
      font-size: 12px;
      right: -5px;
      border-radius: 50%;
      color: white;
      background-color: rgb(79, 78, 78);
      width: 17px;
      height: 17px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      display: none;
    }
    .correct-answer-div {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: -65px;
      i.correct-answer {
        border-radius: 50%;
        padding: 5px;
        background-color: #5fd95f;
        color: white;
        opacity: 0;
        transition: 0.2s;
        cursor: pointer;
      }
    }
    input::placeholder {
      color: $mainColor;
      opacity: 0.7;
      font-family: cursive;
      font-style: italic;
      font-weight: 700;
    }
  }
  .ques-choise-row.chosen-answer {
    box-shadow: #6fe16f 0px 0px 0px 2px inset;
    background-color: #5fd95f5f;
  }
  .ques-choise-row:hover .del-choice {
    display: flex;
  }
  .ques-choise-row:hover .correct-answer-div .correct-answer {
    opacity: 0.5 !important;
  }
  .ques-choise-row .correct-answer-div .correct-answer:hover {
    opacity: 1 !important;
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
      color: $mainColor;
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
        color: $mainColor;
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
      color: $mainColor;
      box-shadow: $mainColor 0px 0px 0px 1px inset;
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
.bank-page .success {
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

//Media Queries
@media (max-width: 990px) {
  .bank-page .test-title-pop .dad {
    width: 70%;
  }
  .bank-page .ques-container .btns .time-degree {
    padding-right: 91px !important;
  }
  .bank-page .success .container p {
    font-size: 12px;
  }
}
@media (max-width: 767px) {
  .bank-page .exam-title {
    top: 90px;
  }
  .bank-page .save-exam-div .save-exam {
    font-size: 18px;
    width: 155px;
  }
  .bank-page .success .container {
    width: 60%;
  }
  .bank-page .side-ques-container {
    height: 14vh;
    overflow-y: unset !important;
    order: 2;
    box-shadow: unset;
    border-radius: unset;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
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
  .bank-page .side-ques-container .save-exam-div {
    bottom: 23px;
  }
  .bank-page .ques-container {
    padding-top: 72px;
    padding-left: 70px;
    height: 53vh;
    border-radius: unset;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
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
  .bank-page .test-title-pop .dad {
    input {
      font-size: 20px;
    }
    h3 {
      font-size: 25px;
    }
    button {
      font-size: 20px;
    }
  }
}
@media (max-width: 660px) {
  .bank-page .ques-container .btns .save-ques {
    margin-right: 30px;
  }
}
@media (max-width: 530px) {
  .bank-page .side-ques-container .side-block .side-ques-row {
    width: 50%;
    .side-ques-num {
      font-size: 10px;
      width: 17px;
      height: 17px;
    }
    .success .container p {
      font-size: 10px;
    }
  }
  .bank-page .ques-container .btns button {
    font-size: 12px !important;
  }
  .bank-page .ques-container .ques-tit-row .ques-tit {
    font-size: 14px;
  }
  .bank-page .ques-container .ques-tit-row .ques-tit::placeholder {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.613);
  }
  .bank-page .ques-container .ques-choise-row .ques-choice-num {
    font-size: 9px;
  }
  .bank-page .ques-container .ques-choise-row input {
    font-size: 12px;
  }
  .bank-page .ques-container .ques-choise-row input::placeholder {
    color: rgba(4, 70, 175, 0.803);
    letter-spacing: 1px;
  }
  .bank-page .ques-container .btns input {
    font-size: 12px;
  }
  .bank-page .ques-container .btns .time-degree label {
    font-size: 12px;
  }
  .bank-page .ques-container .btns .time-degree input[name="time"] {
    margin-left: 24px !important;
  }
  .bank-page .ques-container .btns .time-degree {
    padding-right: 61px !important;
  }
  .bank-page .test-title-pop .dad {
    width: 90%;
    input {
      font-size: 16px;
    }
    h3 {
      font-size: 21px;
    }
    button {
      font-size: 16px;
      width: 85px;
      height: 33px;
    }
  }
}
@media (max-width: 470px) {
  .bank-page .side-ques-container {
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
  .bank-page .exam-title h1 {
    font-size: 16px;
  }
  .bank-page .ques-container {
    padding-left: 20px;
    padding-right: 5px;
    height: 50vh;
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
  .bank-page {
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
