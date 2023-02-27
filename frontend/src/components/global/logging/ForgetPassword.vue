<template>
  <div class="forget-password mt-5">
    <!-- .. -->
    <TheLoading
      :style="
        loading
          ? 'opacity:0.7;visibility:visible'
          : 'opacity:0;visibility:hidden'
      "
    />
    <div class="logo d-none d-md-block">
      <img src="@/assets/home/large.png" alt="" />
    </div>
    <div class="main">
      <div class="signup position-relative">
        <form @submit.prevent="getNewPassword">
          <label for="chk" aria-hidden="true">Forget Password</label>
          <input
            type="email"
            v-model="email"
            name="email"
            placeholder="Email"
            class="email"
            required
          />
          <button>Submit</button>
        </form>

        <div class="go-signup">
          <router-link to="/signin">Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import TheLoading from "../loading/TheLoading.vue";

export default {
  name: "ForgetPassword",
  data() {
    return {
      email: "",
      loading: false,
    };
  },
  components: { TheLoading },
  computed: {
    ...mapState(["forgetPass"]),
  },
  methods: {
    showAlert(icn, msg, btnTxt) {
      this.$swal({
        title: msg,
        icon: icn,
        confirmButtonText: btnTxt,
        confirmButtonColor: "#197278",
        showCloseButton: true,
      });
    },
    ...mapActions(["doResetErrs", "doCheckAuth", "doValidForget"]),
    closePopup(e) {
      e.currentTarget.style.display = "none";
    },
    async getNewPassword() {
      this.loading = true;
      const newPassResp = await this.doValidForget(this.email);
      if (newPassResp.error) {
        this.loading = false;
        this.showAlert("error", newPassResp.error, "Try again");
      } else {
        this.loading = false;
        this.showAlert("success", newPassResp.message, "Close");
        this.email = "";
      }
    },
  },
  async mounted() {
    this.loading = true;
    this.doResetErrs();
    const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
    if (checkAuth) {
      this.$router.push("/");
    } else {
      this.loading = false;
    }
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/sass/main";

.forget-password {
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
    font-size: 30px;
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
    color: #fff;
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
}
@media (max-width: 450px) {
  .sign-in .main {
    width: 95%;
  }
}
</style>
