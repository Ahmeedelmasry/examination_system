<template>
  <TheNave />
  <div class="subject-home pt-3">
    <TheLoading />
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 pr-sm-2">
          <div class="add-exam-div">
            <div class="title">
              <h3 class="text-center py-3">Recent Subjects</h3>
            </div>
            <div class="exams px-3">
              <div
                v-if="!getSubjects.allSubjects.length > 0"
                class="empty-exams"
              >
                <p>There is no subjects added yet !</p>
              </div>
              <div class="row">
                <div
                  v-for="subj in getSubjects.allSubjects"
                  :key="subj._id"
                  class="col-6 col-sm-3 col-lg-2 mb-2 exam-dad"
                >
                  <div
                    class="exam card pb-4 position-relative"
                    style="width: 18rem"
                  >
                    <img
                      src="@/assets/subject.jpg"
                      class="exam-img-top"
                      alt="..."
                      style="cursor: pointer"
                      @click="goPreview(subj._id)"
                    />
                    <div class="exam-body card-body">
                      <h5
                        v-if="subj.title.length > 15"
                        class="exam-title card-title"
                      >
                        {{ subj.title.slice(0, 15) }}...
                      </h5>
                      <h5 v-else class="exam-title card-title">
                        {{ subj.title }}
                      </h5>
                    </div>
                    <i
                      @click="openSubjDel(subj._id)"
                      class="fa fa-trash-can text-center del-sub"
                    ></i>
                    <i
                      class="fa fa-share-nodes share-exam-btn"
                      style="cursor: pointer"
                      @click="openSharePop(subj._id)"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="delete-subject-alert" @click="closeDelExamAlert">
        <div class="body" @click="stopAlertProp">
          <p class="alert text-center">
            Are you sure you want to delee this subject?!
          </p>
          <div class="alert-btns">
            <button class="del-test" @click="doDelSub">Delete</button>
            <button class="cancel" @click="canselSubjectDelete">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <router-link to="test-bank">
      <i class="fa fa-plus create-exam"></i>
    </router-link>
  </div>
</template>

<script>
import TheNave from "@/components/global/thenav/TheNav.vue";
import { mapActions, mapState } from "vuex";
import TheLoading from "@/components/global/loading/TheLoading.vue";

export default {
  name: "SubjectsHome",
  components: {
    TheNave,
    TheLoading,
  },
  computed: {
    ...mapState(["getSubjects"]),
  },
  methods: {
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
    ...mapActions(["doGetSubjects", "doDelSubj", "doCheckAuth"]),
    openSubjDel(subjId) {
      localStorage.setItem("del-subject", subjId);
      this.showAlert("question", "Are you sure?", "Delete", true, "Cancel");
      setTimeout(() => {
        document
          .querySelector(".swal2-styled.swal2-confirm")
          .addEventListener("click", () => {
            this.doDelSub();
          });
      }, 0);
    },
    canselSubjectDelete() {
      document.querySelector(
        ".subject-home .delete-subject-alert"
      ).style.display = "none";
      localStorage.removeItem("del-subject");
    },
    async doDelSub() {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
      if (!checkAuth) {
        this.$router.push("/signin");
      } else {
        await this.doDelSubj(localStorage.getItem("del-subject"));
        await this.doGetSubjects(checkAuth._id);
        this.allSubj = this.getSubjects.allSubjects;
        localStorage.removeItem("del-subject");
      }
    },
    goPreview(subjId) {
      this.$router.push(`/subjects-preview/${subjId}`);
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
        await this.doGetSubjects(checkAuth._id);
        document.querySelector(".subject-home .loading").style.cssText = `
        visibility: hidden; opacity: 0
      `;
      }
    }
  },
};
</script>

<style lang="scss">
@import "../../../assets/sass/main";

.subject-home {
  .add-exam-div {
    position: relative;
    height: 75vh;
    box-shadow: 0px 0px 5px -2px black;
    background-color: white;
    border-radius: 10px;
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
      max-height: 46vh;
      min-height: 46vh;
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
            .del-sub {
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
            margin-top: 10px;
            border-radius: 6px;
            border: 1px solid #406df6;
            background-color: #406df6;
            color: white;
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
    }
    .exam {
      border-radius: 7px !important;
      width: 100% !important;
      overflow: hidden;
      margin-bottom: 10px;
      height: 220px;
      img {
        height: 140px;
        width: 100%;
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
      }
      .del-sub {
        cursor: pointer;
        background-color: indianred;
        width: fit-content;
        padding: 4px;
        border-radius: 4px;
        color: white;
        font-size: 9px;
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .create-exam {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 90px;
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
.subject-home .delete-subject-alert {
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
      .del-test {
        background-color: indianred;
        color: white;
        font-weight: 500;
        padding: 4px 9px;
        border: 1px solid indianred;
        outline: none;
        border-radius: 7px;
        margin-right: 5px;
        font-size: 14px;
      }
      .cancel {
        background-color: #4175ee;
        color: white;
        font-weight: 500;
        padding: 4px 9px;
        border: 1px solid #4175ee;
        outline: none;
        border-radius: 7px;
        margin-left: 5px;
        font-size: 14px;
      }
    }
  }
}

@media (max-width: 990px) {
  .subject-home {
    h3 {
      font-size: 20px !important;
    }
    .empty-exams {
      p {
        font-size: 19px !important;
      }
    }
  }
}

@media (max-width: 576px) {
  .subject-home {
    .empty-exams {
      p {
        font-size: 15px !important;
      }
    }
    .create-exam {
      font-size: 20px;
      bottom: 180px;
    }
  }
}
</style>
