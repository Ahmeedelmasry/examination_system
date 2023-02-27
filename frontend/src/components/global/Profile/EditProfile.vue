<template>
  <TheNav />
  <div class="edit-profile">
    <TheLoading />
    <div class="profile-info mt-5">
      <div class="container">
        <div class="row">
          <div class="col-11 col-lg-10 m-auto main-col">
            <div class="info mt-1 pt-4">
              <form
                action=""
                @submit.prevent="submitEdit"
                enctype="multipart/form-data"
              >
                <div class="profile-img position-relative">
                  <img
                    v-if="userInf.photos == null"
                    :src="allUserInfo.photo"
                    alt=""
                  />
                  <img v-else :src="userInf.photos" alt="" />
                  <input
                    type="file"
                    name="image-upload"
                    id="image-upload"
                    accept="image/jpg, image/png, image/jpeg"
                    class="image-upload position-absolute"
                    @change="changePhoto"
                  />
                </div>
                <div class="first-name-block info-block">
                  <div class="row">
                    <div class="col-6">
                      <label for="firstname" class="block-tit"
                        >First Name:&nbsp;</label
                      >
                    </div>
                    <div class="col-6">
                      <input
                        name="firstname"
                        class="block-info first-name"
                        type="text"
                        v-model="userInf.firstName"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div class="last-name-block info-block">
                  <div class="row">
                    <div class="col-6">
                      <label for="lastname" class="block-tit"
                        >Last Name:&nbsp;</label
                      >
                    </div>
                    <div class="col-6">
                      <input
                        name="lastname"
                        class="block-info last-name"
                        type="text"
                        v-model="userInf.lastName"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div class="password-block info-block">
                  <div class="row">
                    <div class="col-6">
                      <label for="password" class="block-tit"
                        >Password:&nbsp;</label
                      >
                    </div>
                    <div class="col-6 position-relative">
                      <input
                        name="password"
                        class="block-info the-password"
                        type="password"
                        v-model="userInf.password"
                        required
                        minlength="8"
                      />
                      <i
                        @click="showPassword"
                        class="fa fa-eye position-absolute show-password"
                      ></i>
                      <i
                        @click="hidePassword"
                        class="fa fa-eye-slash position-absolute hide-password"
                      ></i>
                    </div>
                  </div>
                </div>
                <div class="edit-profile info-block">
                  <div class="row mt-5">
                    <div class="col-6 text-center">
                      <router-link to="profile">
                        <button class="back" type="button">Back</button>
                      </router-link>
                    </div>
                    <div class="col-6 text-center">
                      <button class="edit" type="submit">Save Edits</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="loading">
      <svg
        class="spinner"
        width="65px"
        height="65px"
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          class="path"
          fill="none"
          stroke-width="6"
          stroke-linecap="round"
          cx="33"
          cy="33"
          r="30"
        ></circle>
      </svg>
    </div>
    <div class="success" @click="closePopup">
      <div class="container" @click="stopProp">
        <p class="text-center">Your have updated your profile successfully!</p>
      </div>
    </div>
  </div>
</template>

<script>
import TheNav from "@/components/global/thenav/TheNav.vue";
import TheLoading from "@/components/global/loading/TheLoading.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "EditProfile",
  data() {
    return {
      userInf: {
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        photos: null,
        imageUrl: "",
      },
    };
  },
  components: {
    TheNav,
    TheLoading,
  },
  computed: {
    ...mapState(["allUserInfo"]),
  },
  methods: {
    ...mapActions(["updateInfo", "getUserInfo", "uploadImg", "doCheckAuth"]),
    showAlert(icn, msg, btnTxt) {
      this.$swal({
        title: msg,
        icon: icn,
        confirmButtonText: btnTxt,
        confirmButtonColor: "#197278",
        showCloseButton: true,
      });
    },
    async submitEdit() {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
      if (!checkAuth) {
        this.$router.push("/signin");
      } else {
        //Upload Image First
        const myFile = document.querySelector(".edit-profile input[type=file]")
          .files[0];
        document.querySelector(".edit-profile .loading").style.opacity = "0.7";
        document.querySelector(".edit-profile .loading").style.visibility =
          "visible";
        if (!myFile) {
          //Then Update User Info
          const theForm = document.querySelector(".edit-profile .info form");
          const payload = {
            firstName: theForm.firstname.value,
            lastName: theForm.lastname.value,
            password: theForm.password.value,
            uId: checkAuth._id,
          };
          await this.updateInfo(payload);
          await this.getUserInfo(checkAuth._id);
          setTimeout(() => {
            this.showAlert("success", "Profile Updated successfuly!", "OK");
            document.querySelector(".edit-profile .loading").style.opacity =
              "0";
            document.querySelector(".edit-profile .loading").style.visibility =
              "hidden";
            setTimeout(() => {
              location.reload();
            }, 1000);
          }, 1000);
        } else {
          const formData = new FormData();
          formData.append("image", myFile);
          const payloadd = {
            formData: formData,
            uId: checkAuth._id,
          };
          await this.uploadImg(payloadd);

          //Then Update User Info
          const theForm = document.querySelector(".edit-profile .info form");
          const payload = {
            firstName: theForm.firstname.value,
            lastName: theForm.lastname.value,
            password: theForm.password.value,
            profileImg: this.allUserInfo.profileImage,
            uId: checkAuth._id,
          };
          await this.updateInfo(payload);
          await this.getUserInfo(checkAuth._id);
          setTimeout(() => {
            this.showAlert("success", "Profile Updated successfuly!", "OK");
            document.querySelector(".edit-profile .loading").style.opacity =
              "0";
            document.querySelector(".edit-profile .loading").style.visibility =
              "hidden";
            setTimeout(() => {
              location.reload();
            }, 1000);
          }, 1000);
        }
      }
    },
    closePopup(e) {
      e.currentTarget.style.display = "none";
      setTimeout(() => {
        this.$router.push("/profile");
      }, 1000);
    },
    showPassword(e) {
      document.querySelector(".edit-profile input.the-password").type = "text";
      e.currentTarget.style.display = "none";
      document.querySelector(".edit-profile i.hide-password").style.display =
        "block";
    },
    hidePassword(e) {
      document.querySelector(".edit-profile input.the-password").type =
        "password";
      e.currentTarget.style.display = "none";
      document.querySelector(".edit-profile i.show-password").style.display =
        "block";
    },
    changePhoto(e) {
      if (!e.target.files[0]) {
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.imageUrl = reader.result;
        this.userInf.photos = this.imageUrl;
      });
      reader.readAsDataURL(e.currentTarget.files[0]);
    },
  },
  async mounted() {
    const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
    if (!checkAuth) {
      this.$router.push("/signin");
    } else {
      await this.getUserInfo(checkAuth._id);
      this.userInf.firstName = this.allUserInfo.firstName;
      this.userInf.lastName = this.allUserInfo.lastName;
      this.userInf.email = this.allUserInfo.email;
      this.userInf.photos = this.allUserInfo.photo;
      this.userInf.password = this.allUserInfo.password;
      document.querySelector(".edit-profile .loading").style.opacity = "0";
      document.querySelector(".edit-profile .loading").style.visibility =
        "hidden";
      //End
    }
  },
};
</script>

<style lang="scss">
@import "../../../assets/sass/main";

.edit-profile {
  .main-col {
    padding-bottom: 10px;
    box-shadow: 0px 0px 10px -7px black;
    background: $bgColor;
    border-radius: 30px;
    margin-top: 30px !important;
    border: 2px solid rgba(255, 255, 255, 0.148);
  }

  input {
    border: none;
    outline: none;
    background-color: transparent;
    color: $titleColor;
    padding-left: 10px;
    text-transform: capitalize;
    width: 130%;
    padding: 5px 10px;
    font-size: 17px;
    font-weight: 700;
    border-bottom: 1px solid $titleColor;
    opacity: 0.9;
  }

  input[type="email"] {
    text-transform: unset;
    background-color: rgb(4 69 175 / 7%);
    border-bottom: unset;
    cursor: not-allowed;
  }

  input[type="file"] {
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 143%;
    z-index: 3;
    transition: 0.2s;
    background-color: rgba(0, 0, 0, 0.411);
    cursor: pointer;
    opacity: 0;

    &:hover {
      opacity: 1;
    }
  }

  .profile-img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    margin: auto;
    box-shadow: 0px 0px 8px -6px black;
    background-image: url(../../../assets/home/download.png);
    background-position: center center;
    background-size: cover;
    margin-bottom: 30px;
    border: 2px solid rgba(255, 255, 255, 0.252);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  i.show-password,
  i.hide-password {
    right: -49px;
    top: 6px;
    font-size: 14px;
    opacity: 0.4;
    transition: 0.2s;
    cursor: pointer;
    color: $titleColor;
    &:hover {
      opacity: 1;
    }
  }

  i.hide-password {
    display: none;
  }

  .info {
    margin-right: auto;
    margin-left: auto;
    width: 67%;

    .info-block {
      margin-bottom: 15px;

      .edit {
        background-color: #0daa2f96;
        color: $titleColor;
        transition: 0.3s;
        margin-top: 10px;
        padding: 8px 30px;
        border-radius: 25px;
        border-color: $mainColor;
        font-size: 20px;
        font-weight: 900;
        width: 100%;
        opacity: 0.6;
      }
      .edit:hover {
        opacity: 1;
        background-color: #138f03ee;
      }

      .back {
        background-color: #e913139c;
        color: $titleColor;
        transition: 0.3s;
        margin-top: 10px;
        padding: 8px 30px;
        border-radius: 25px;
        border-color: $mainColor;
        font-size: 20px;
        font-weight: 900;
        width: 100%;
        opacity: 0.6;
      }
      .back:hover {
        opacity: 1;
        background-color: #e91313ee;
      }
    }

    label {
      font-size: 25px;
      font-weight: 900;
      color: whitesmoke;
      opacity: 0.9;
    }

    label.block-tit {
      display: inline-block;
    }
  }
}

.edit-profile .success {
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
      color: #3bbc3b;
      font-weight: 500;
    }
  }
}

//Media Queries
@media (max-width: 1199px) {
  .edit-profile {
    i.show-password,
    i.hide-password {
      right: -40px;
    }
  }
}

@media (max-width: 990px) {
  .edit-profile .success .container p {
    font-size: 12px;
  }
}
@media (max-width: 766px) {
  .edit-profile .main-col {
    border-radius: 20px;
  }
  .edit-profile .info .info-block .back {
    font-size: 18px;
  }
  .edit-profile .info .info-block .edit {
    font-size: 18px;
  }
  .edit-profile .info {
    width: 81%;
    .success .container {
      width: 60%;
    }
  }

  .edit-profile .info label {
    font-size: 20px;
  }

  .edit-profile .info input {
    width: 110%;
    font-size: 12px;
  }

  .edit-profile .profile-img {
    width: 120px;
    height: 120px;
  }
  .edit-profile {
    i.show-password,
    i.hide-password {
      right: -2px;
      top: 10px;
      font-size: 10px;
    }
  }
  .edit-profile .info .info-block {
    margin-bottom: 25px;
  }
}

@media (max-width: 576px) {
  .edit-profile .success .container {
    width: 60%;
    p {
      font-size: 10px;
    }
  }
  .edit-profile {
    i.show-password,
    i.hide-password {
      right: 14px;
    }
  }
}

@media (max-width: 479px) {
  .edit-profile .profile-info {
    margin-top: 67px !important;
  }
  .edit-profile .info {
    width: 100%;
  }

  .edit-profile .info label {
    font-size: 11px;
  }

  .edit-profile .profile-img {
    width: 100px;
    height: 100px;
  }

  .edit-profile .info input {
    width: 100%;
    font-size: 9px;
  }
  .edit-profile .info .info-block .back {
    width: 70%;
    font-size: 12px;
    margin-left: 40px;
    padding-right: unset;
    padding-left: unset;
  }
  .edit-profile .info .info-block .edit {
    width: 70%;
    font-size: 12px;
    margin-right: 40px;
    padding-right: unset;
    padding-left: unset;
  }
}
</style>
