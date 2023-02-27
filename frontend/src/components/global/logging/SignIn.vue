<template>
  <div class="sign-in pt-4">
    <TheLoading />
    <div class="logo d-none d-md-block">
      <img src="@/assets/home/large.png" alt="" />
    </div>
    <div class="main">
      <div class="signup position-relative">
        <form @submit.prevent="signInFun">
          <label for="chk" aria-hidden="true">Login</label>
          <input
            type="email"
            v-model="userData.email"
            name="email"
            placeholder="Email"
            class="email"
            required
          />
          <span class="err" v-if="$store.state.loginErr">{{
            $store.state.loginErr.email
          }}</span>
          <div class="pass-dad">
            <input
              required
              :type="showPass ? 'text' : 'password'"
              v-model="userData.pass"
              name="pswd"
              placeholder="Password"
              class="pass"
            />
            <i
              class="fa fa-eye-slash"
              @click="showPass = !showPass"
              v-if="showPass"
            ></i>
            <i class="fa fa-eye" @click="showPass = !showPass" v-else></i>
          </div>
          <span class="err" v-if="$store.state.loginErr">{{
            $store.state.loginErr.password
          }}</span>
          <button>Login</button>
        </form>
        <div class="go-signup">
          <router-link to="/signup">Sign up</router-link>
        </div>
        <div class="forget text-center">
          <span style="color: black; margin-right: 5px; font-size: 15px"
            >If you Forget Password?</span
          >
          <router-link
            to="forget-password"
            style="color: whitesmoke; font-size: 13px"
            >Click Here</router-link
          >
        </div>
      </div>
    </div>
    <div class="face-popup" v-if="showCamPopup">
      <i
        class="fa fa-close close-cam"
        style="
          color: white;
          font-size: 30px;
          position: absolute;
          left: 20px;
          top: 20px;
        "
        @click="closeVideo(vidSrcObj)"
      ></i>
      <div class="vid-container">
        <video
          id="video"
          autoplay
          muted
          width="720"
          height="560"
          :style="!webCam ? 'display: none' : 'display: block'"
        ></video>
        <img
          width="720"
          height="560"
          src="@/assets/home/download.png"
          class="display-img"
          alt=""
          :style="`${
            webCam ? 'display: none;' : 'display: block;'
          }border-radius: 7px`"
        />
      </div>
      <div
        style="
          display: flex;
          width: 720px;
          margin: auto;
          gap: 30px;
          margin-top: 10px;
        "
        class="btns_container"
      >
        <button v-if="webCam" @click="displayImg" class="capture-btn">
          Capture
        </button>
        <button
          v-if="imgFile"
          @click="start(userData.email)"
          class="verify-btn capture-btn"
        >
          Verify
        </button>
        <button
          style="background: indianred"
          v-if="imgFile"
          @click="cancelImg"
          class="capture-btn"
        >
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import TheLoading from "../loading/TheLoading.vue";
import * as faceapi from "face-api.js";

export default {
  name: "SignIn",
  data() {
    return {
      userData: {
        email: "",
        pass: "",
      },
      showPass: false,
      imgFile: "",
      webCam: false,
      showCamPopup: false,
      vidSrcObj: "",
    };
  },
  computed: {
    ...mapState(["userExists", "passCorrect", "userInfo"]),
  },
  methods: {
    ...mapActions(["checkUser", "test", "doResetErrs", "doCheckAuth"]),
    closePopup(e) {
      e.currentTarget.style.display = "none";
    },
    startVideo() {
      setTimeout(async () => {
        const video = document.getElementById("video");
        navigator.getUserMedia(
          { video: {} },
          (stream) => {
            this.vidSrcObj = stream;
            video.srcObject = this.vidSrcObj;
          },
          (err) => console.error(err)
        );
      }, 1000);
    },
    closeVideo(vidSrc) {
      vidSrc.getTracks().forEach((track) => {
        track.stop();
      });
      vidSrc = null;
      this.showCamPopup = false;
    },
    displayImg() {
      const video = document.getElementById("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      let imgUrl = canvas.toDataURL("image/jpeg");
      document.querySelector(".display-img").setAttribute("src", imgUrl);
      this.imgFile = this.urlToFile(imgUrl);
      canvas.remove();
      this.webCam = false;
    },
    urlToFile(url) {
      let arr = url.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let data = arr[1];

      let dataStr = atob(data);
      let n = dataStr.length;
      let dataArr = new Uint8Array(n);
      while (n--) {
        dataArr[n] = dataStr.charCodeAt(n);
      }
      let file = new File([dataArr], "File.jpg", { type: mime });
      return file;
    },
    cancelImg() {
      this.imgFile = "";
      this.webCam = true;
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
    async signInFun() {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
      if (checkAuth) {
        this.$router.push("/");
      } else {
        await this.checkUser(this.userData);
        if (this.$store.state.loginData) {
          document.querySelector(".sign-in .loading").style.opacity = "0.7";
          document.querySelector(".sign-in .loading").style.visibility =
            "visible";
          if (this.$store.state.loginData.userRole == "INSTRUCTOR") {
            await fetch(
              `${this.$store.state.apiLink}/users/verify-img/${this.$store.state.loginData._id}/${this.$store.state.loginData.firstName}`,
              { method: "POST", credentials: "include" }
            )
              .then((res) => res.json())
              .then(() => {
                if (this.$store.state.loginData.userRole == "STUDENT") {
                  localStorage.setItem("rule", "STUDENT");
                  this.$router.push("/student-home");
                } else {
                  localStorage.setItem("rule", "INSTRUCTOR");
                  this.$router.push("/instructor-home");
                }
              })
              .catch((err) => {
                console.log(err);
                this.showAlert("error", "Faild To Login, Try Again", "close");
              })
              .finally(() => {
                document.querySelector(".sign-in .loading").style.opacity = "0";
                document.querySelector(".sign-in .loading").style.visibility =
                  "hidden";
              });
          } else {
            setTimeout(() => {
              document.querySelector(".sign-in .loading").style.opacity = "0";
              document.querySelector(".sign-in .loading").style.visibility =
                "hidden";
              setTimeout(() => {
                this.imgFile = "";
                this.showCamPopup = true;
                this.webCam = true;
                this.startVideo();
              }, 1000);
            }, 1000);
          }
        }
      }
    },
    //Recognize Picture
    async loadModels() {
      await Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri("../../../models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("../../../models"),
        faceapi.nets.ssdMobilenetv1.loadFromUri("../../../models"),
      ]);
    },
    async start(email) {
      document.querySelector(".sign-in .loading").style.opacity = "0.7";
      document.querySelector(".sign-in .loading").style.visibility = "visible";
      const container = document.createElement("div");
      container.style.position = "relative";
      const labeledFaceDescriptors = await this.loadLabeledImages(email);
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
      let image;
      let canvas;
      console.log("loaded");
      if (image) image.remove();
      if (canvas) canvas.remove();
      image = await faceapi.bufferToImage(this.imgFile);
      container.append(image);
      canvas = faceapi.createCanvasFromMedia(image);
      container.append(canvas);
      const displaySize = { width: image.width, height: image.height };
      faceapi.matchDimensions(canvas, displaySize);
      const detections = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const results = resizedDetections.map((d) =>
        faceMatcher.findBestMatch(d.descriptor)
      );
      results.forEach(async (result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result.toString(),
        });
        drawBox.draw(canvas);
        if (result.label == "unknown") {
          document.querySelector(".sign-in .loading").style.opacity = "0";
          document.querySelector(".sign-in .loading").style.visibility =
            "hidden";
          this.showAlert(
            "error",
            "Login Faild, Can't Recognize Your Face",
            "close"
          );
          return;
        } else {
          await fetch(
            `${this.$store.state.apiLink}/users/verify-img/${this.$store.state.loginData._id}/${this.$store.state.loginData.firstName}`,
            { method: "POST", credentials: "include" }
          )
            .then((res) => res.json())
            .then(() => {
              this.closeVideo(this.vidSrcObj);
              if (this.$store.state.loginData.userRole == "STUDENT") {
                localStorage.setItem("rule", "STUDENT");
                this.$router.push("/student-home");
              } else {
                localStorage.setItem("rule", "INSTRUCTOR");
                this.$router.push("/instructor-home");
              }
            })
            .catch((err) => {
              console.log(err);
              this.showAlert("error", "Faild To Login, Try Again", "close");
            })
            .finally(() => {
              document.querySelector(".sign-in .loading").style.opacity = "0";
              document.querySelector(".sign-in .loading").style.visibility =
                "hidden";
            });
          return;
        }
      });
    },
    async loadLabeledImages(email) {
      const labels = [email];
      return Promise.all(
        labels.map(async (label) => {
          const descriptions = [];
          for (let i = 1; i <= 2; i++) {
            const img = await faceapi.fetchImage(
              `${this.$store.state.apiLink}/securityImages/${label}/${label}-${i}.jpg`
            );
            const detections = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            descriptions.push(detections.descriptor);
          }

          return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
      );
    },
    //Recognize Picture
  },
  async mounted() {
    document.querySelector(".sign-in .loading").style.cssText = `
        opacity: 1; visibility:visible
      `;
    this.doResetErrs();
    const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
    if (checkAuth) {
      this.$router.push("/");
    } else {
      document.querySelector(".sign-in .loading").style.cssText = `
        opacity: 0; visibility:hidden
      `;
      await this.loadModels();
    }
  },
  components: { TheLoading },
};
</script>

<style scoped lang="scss">
@import "../../../assets/sass/main";

.sign-in {
  body {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-family: "Jost", sans-serif;
  }
  .logo {
    position: absolute;
    left: 50px;
    width: 165px;
    top: 10px;
    img {
      width: 100%;
    }
  }
  .main {
    width: 400px;
    height: 90vh;
    background: red;
    overflow: hidden;
    background: url("https://doc-08-2c-docs.googleusercontent.com/docs/securesc/68c90smiglihng9534mvqmq1946dmis5/fo0picsp1nhiucmc0l25s29respgpr4j/1631524275000/03522360960922298374/03522360960922298374/1Sx0jhdpEpnNIydS4rnN4kHSJtU1EyWka?e=view&authuser=0&nonce=gcrocepgbb17m&user=03522360960922298374&hash=tfhgbs86ka6divo3llbvp93mg4csvb38")
      no-repeat center/ cover;
    border-radius: 10px;
    box-shadow: 5px 20px 50px #000;
    margin: 0 auto;
    margin-top: 22px;
  }
  .signup {
    position: relative;
    width: 100%;
    height: 100%;
  }
  label {
    color: #fff;
    font-size: 2.3em;
    justify-content: center;
    display: flex;
    margin: 60px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.5s ease-in-out;
  }

  input {
    width: 70%;
    height: 40px;
    background: #e0dede;
    justify-content: center;
    display: flex;
    margin: 20px auto;
    padding: 10px;
    border: none;
    outline: none;
    border-radius: 5px;
  }
  .pass-dad {
    width: 70%;
    margin: auto;
    position: relative;
    input {
      width: 100%;
    }
    i {
      position: absolute;
      top: 50%;
      right: 5px;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }
  button {
    width: 70%;
    height: 40px;
    margin: 10px auto;
    justify-content: center;
    display: block;
    color: #e0ecee;
    background: $bgColor;
    font-size: 1em;
    font-weight: bold;
    margin-top: 20px;
    outline: none;
    border: none;
    border-radius: 5px;
    transition: 0.1s ease-in;
    cursor: pointer;
    margin-top: 40px;
    opacity: 0.5;
  }
  button:hover {
    opacity: 1;
    background: rgb(52, 125, 52);
  }
  .login {
    height: 460px;
    background: #eee;
    border-radius: 60% / 10%;
    transform: translateY(-180px);
    transition: 0.8s ease-in-out;
  }
  .go-signup {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 58px;
    width: 100%;
    height: 68px;
    background: #ececec;
    z-index: 10;
    border-top-right-radius: 50%;
    border-top-left-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    a {
      color: black;
      font-size: 28px;
      font-weight: 700;
    }
  }
  span.err {
    display: block;
    color: rgb(240, 123, 123);
    letter-spacing: 1px;
    font-size: 12px;
    width: 70%;
    margin: auto;
  }
  .loading {
    opacity: 0;
    visibility: hidden;
  }
  .face-popup {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.669);
    z-index: 100;
    overflow: hidden auto;
  }
}
.vid-container {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 66px;
}
.capture-btn {
  margin: 0 auto 5px !important;
  opacity: 1 !important;
}
@media (max-width: 767px) {
  .sign-in #video {
    width: 95%;
    margin: auto;
  }
  .btns_container {
    justify-content: center;
    align-items: center;
    width: 100% !important;
  }
}
@media (max-width: 450px) {
  .sign-in .main {
    width: 95%;
  }
}
</style>
