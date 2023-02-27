<template>
  <div class="profile">
    <TheNav />
    <div class="profile-info mt-5 pt-4">
      <TheLoading />
      <div class="container">
        <div class="row">
          <div class="col-11 col-lg-7 m-auto main-col pt-4">
            <div class="profile-img">
              <img
                :src="allUserInfo.photo != null && allUserInfo.photo"
                alt=""
                @click="showImg"
              />
            </div>
            <div class="info mt-4 pt-2">
              <div class="first-name-block info-block">
                <div class="row">
                  <div class="col-12 text-center">
                    <span class="block-info mr-2">{{
                      allUserInfo.firstName
                    }}</span>
                    <span class="block-info">{{ allUserInfo.lastName }}</span>
                  </div>
                </div>
              </div>
              <div class="email-block info-block">
                <div class="row">
                  <div class="col-12 text-center">
                    <span class="block-info the-email">{{
                      allUserInfo.email
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="id-block info-block">
                <div class="row">
                  <div class="col-12 text-center">
                    <router-link to="edit-profile">
                      <button class="edit">Edit profile</button>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="show-prof-img">
      <span
        style="
          color: white;
          position: absolute;
          font-size: 25px;
          top: 40px;
          left: 40px;
          cursor: pointer;
          z-index: 10;
        "
        @click="closePhoto"
        >X</span
      >
      <div class="img-feild"></div>
    </div>
  </div>
</template>

<script>
import TheNav from "@/components/global/thenav/TheNav.vue";
import TheLoading from "@/components/global/loading/TheLoading.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "TheProfile",
  components: {
    TheNav,
    TheLoading,
  },
  computed: {
    ...mapState(["allUserInfo", "setUserInfo"]),
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      photos: "",
      userID: "",
    };
  },
  methods: {
    ...mapActions(["doCheckAuth"]),
    closePhoto(e) {
      e.target.parentElement.style.display = "none";
    },
    showImg(e) {
      const styles = window.getComputedStyle(e.target.parentElement);
      if (e.target.getAttribute("src")) {
        document.querySelector(
          ".profile .show-prof-img .img-feild"
        ).style.backgroundImage = `url(
          ${e.target.getAttribute("src")}
        )`;
      } else {
        document.querySelector(
          ".profile .show-prof-img .img-feild"
        ).style.backgroundImage = styles.backgroundImage;
      }

      document.querySelector(".profile .show-prof-img").style.display = "block";
    },
  },
  async mounted() {
    const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
    if (!checkAuth) {
      this.$router.push("/signin");
    } else {
      setTimeout(() => {
        document.querySelector(
          ".profile .profile-info .loading"
        ).style.opacity = "0";
        document.querySelector(
          ".profile .profile-info .loading"
        ).style.visibility = "hidden";
      }, 300);
    }
  },
};
</script>

<style lang="scss">
@import "../../../assets/sass/main";

.profile {
  .profile-img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    margin: auto;
    background-image: url(../../../assets/home/download.png);
    background-position: center center;
    border: 2px solid rgba(255, 255, 255, 0.252);
    background-size: cover;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
    }
  }
}
.profile .info {
  margin-right: auto;
  margin-left: auto;
  color: rgb(255, 255, 250);
  opacity: 0.7;
  .info-block {
    margin-bottom: 40px;
    button {
      background-color: #4eba447d;
      color: $titleColor;
      transition: 0.3s;
      margin-top: 10px;
      padding: 8px 30px;
      border-radius: 25px;
      border-color: $mainColor;
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 1px;
    }
    button:hover {
      background-color: #1dea12;
    }
  }
  span {
    font-size: 28px;
    font-weight: 900;
    text-transform: capitalize;
  }
  span.the-email {
    text-transform: unset;
  }
  span.block-tit {
    display: inline-block;
  }
}
.profile .main-col {
  padding-top: 10px;
  border: 2px solid rgba(255, 255, 255, 0.148);
  background: $bgColor;
  border-radius: 30px;
}
.profile .show-prof-img {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 20000;
  display: none;
  background: rgba(0, 0, 0, 0.812);
  .img-feild {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 50%;
    top: 0%;
    transform: translateX(-50%);
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
    max-width: 85%;
  }
}
//Media Queries
@media (max-width: 990px) {
  .profile .info span {
    font-size: 21px;
  }
  .profile .info .info-block button {
    font-size: 20px;
  }
}
@media (max-width: 766px) {
  .profile .main-col {
    border-radius: 20px;
  }
  .profile .info span {
    font-size: 15px;
  }
  .profile .profile-img {
    width: 120px;
    height: 120px;
  }
  .profile .info .info-block button {
    font-size: 15px;
  }
}
@media (max-width: 479px) {
  .profile .info {
    span {
      font-size: 9px;
    }
    .info-block {
      margin-bottom: 32px;
      button {
        font-size: 12px;
      }
    }
  }
  .profile .profile-img {
    width: 100px;
    height: 100px;
  }
}
</style>
