<template>
  <!--Nav-->
  <div class="the-nav position-relative">
    <!--Logout Loding-->
    <TheLoading />
    <!--Logout Loding-->
    <div class="search-feild position-absolute">
      <ul class="list-unstyled">
        <div v-if="this.searchUser.isExist" class="result">
          <router-link
            :to="`/search-preview/${this.searchUser.userId}`"
            class="d-flex justify-content-evenly align-items-center"
            @click="closeSearchPop(this.searchUser.userId)"
          >
            <img src="https://e.top4top.io/p_2363fihh21.jpg" alt="" />
            <li>{{ searchUser.firstName }} {{ searchUser.lastName }}</li>
          </router-link>
        </div>
        <div class="loading-search">
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
        <div class="no-result justify-content-center align-items-center p-3">
          <p>User Not Found</p>
        </div>
      </ul>
    </div>
    <div class="container-fluid px-5">
      <div class="row py-1 px-5 align-items-center">
        <div class="col-3">
          <div class="menu">
            <i class="fa fa-bars" @click="openSideBar"></i>
          </div>
        </div>
        <div class="col-5">
          <div class="logo text-center">
            <img
              src="@/assets/home/large.png"
              alt=""
              @click="goHomePage(checkAuthen)"
            />
          </div>
        </div>
        <div class="col-4">
          <div class="logout text-right">
            <div class="the-icons position-relative pr-lg-3">
              <div class="position-relative mr-4 pr-2">
                <i
                  class="fa fa-bell"
                  style="cursor: pointer"
                  @click="openNotifications"
                ></i>
                <span
                  class="position-absolute badge badge-light"
                  style="
                    left: 15px;
                    bottom: 14px;
                    z-index: 1;
                    background: indianred;
                    color: white;
                    font-size: 15px;
                    border-radius: 6px;
                  "
                  v-if="newNotifiNum > 0"
                  >{{ newNotifiNum }}</span
                >
                <div class="show-notifs">
                  <ul>
                    <li
                      class="empty"
                      v-if="notifications == '' || notifications == []"
                      style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 90px;
                        font-size: 20px;
                        color: #797575;
                      "
                    >
                      No Notifications Yet!
                    </li>
                    <li
                      v-for="notif in notifications"
                      :key="notif._id"
                      :class="notif.isRead == false && 'is-read'"
                    >
                      <img
                        v-if="!notif.profileImg"
                        src="https://e.top4top.io/p_2363fihh21.jpg"
                        alt=""
                      />
                      <img v-else :src="notif.profileImg" alt="" />
                      {{ notif.firstName }} {{ notif.lastName }}
                      {{ notif.message }}
                    </li>
                  </ul>
                </div>
              </div>
              <router-link to="/profile">
                <img v-if="allUserInfo.photo" :src="allUserInfo.photo" alt="" />
                <img v-else src="../../../assets/home/download.png" alt="" />
              </router-link>

              <i
                class="fa fa-arrow-right-from-bracket"
                style="cursor: pointer"
                @click="logOut"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="search position-relative">
      <form action="" @submit.prevent="getSearchResult">
        <input
          type="email"
          name="email"
          placeholder="Search"
          class="w-100 pl-4"
          required
          @blur="closeSearchDiv"
          @keydown="closeSearchDiv"
          v-model="email"
        />
        <button class="position-absolute">
          <i class="fa fa-search"></i>
        </button>
      </form>
    </div>
    <div class="overlay" @click="closeSideBar"></div>
    <div class="toggle-menu">
      <ul class="list-unstyled">
        <router-link
          :to="
            checkAuthen.userRole == 'STUDENT'
              ? '/student-home'
              : '/instructor-home'
          "
        >
          <li><i class="fa fa-home"></i>Homepage</li></router-link
        >
        <hr />
        <router-link to="/profile"
          ><li><i class="fa fa-user"></i>Profile</li></router-link
        >
        <hr />
        <router-link to="/subjects-home" class="subjects-link"
          ><li><i class="fa fa-file"></i>Subjects</li></router-link
        >
        <hr />
        <a href="#" @click="logOut"
          ><li>
            <i
              style="transform: rotateZ(180deg); padding-left: 21px"
              class="fa fa-arrow-right-from-bracket"
            ></i
            >Logout
          </li></a
        >
        <hr />
      </ul>
    </div>
  </div>
</template>

<script>
import TheLoading from "@/components/global/loading/TheLoading.vue";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  name: "TheNav",
  data() {
    return {
      userID: "",
      userPhoto: null,
      pohtos: "",
      searchUser: "",
      notifications: "",
      newNotifiNum: 0,
      email: "",
      checkAuthen: "",
    };
  },
  components: {
    TheLoading,
  },
  computed: {
    ...mapState(["navbarModule", "allUserInfo"]),
  },
  methods: {
    ...mapMutations(["showHideSearch"]),
    ...mapActions([
      "doGetResult",
      "getUserInfo",
      "readNotifcations",
      "getFollowers",
      "doSignOut",
      "doCheckAuth",
    ]),
    closeSearchPop(_id) {
      document.querySelector(".the-nav .search-feild .result").style.height =
        "0px";
      this.$router.push(`/search-preview/${_id}`);
    },
    openSideBar() {
      document.querySelector(".the-nav .overlay").style.display = "block";
      document.querySelector(".the-nav .toggle-menu").style.left = 0;
    },
    closeSideBar() {
      document.querySelector(".the-nav .overlay").style.display = "none";
      document.querySelector(".the-nav .toggle-menu").style.left = "-355px";
    },
    async openNotifications() {
      const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
      if (!checkAuth) {
        this.$router.push("/signin");
      } else {
        document
          .querySelector(".the-nav .show-notifs")
          .classList.toggle("active");
        if (document.querySelector(".the-nav .show-notifs.active")) {
          if (document.querySelector(".the-nav .is-read")) {
            const payload = {
              userID: checkAuth._id,
              body: {
                isRead: true,
              },
              updatePath:
                checkAuth.userRole == "INSTRUCTOR"
                  ? "follows/update-follow"
                  : "st-notifs/update-notif",
              path:
                checkAuth.userRole == "INSTRUCTOR"
                  ? "follows/all-students/get"
                  : "st-notifs/all-notifs/get",
            };
            setTimeout(async () => {
              await this.readNotifcations(payload);
              await this.getFollowers(payload);
              this.notifications = this.navbarModule.followers;
              let counter = 0;
              this.notifications.forEach((notf) => {
                if (notf.isRead == false) {
                  counter++;
                }
              });
              this.newNotifiNum = counter;
            }, 1000);
          }
        }
      }
    },
    async getSearchResult() {
      await this.doGetResult(this.email);
      this.searchUser = this.navbarModule;
      document.querySelector(".the-nav .search-feild").style.height = "80px";
      document.querySelector(".the-nav .loading-search").style.display = "flex";
      document.querySelector(".the-nav .no-result").style.display = "none";
      if (this.searchUser.isExist == false) {
        setTimeout(() => {
          document.querySelector(".the-nav .no-result").style.display = "flex";
          document.querySelector(".the-nav .loading-search").style.display =
            "none";
        }, 1000);
      } else {
        document.querySelector(".the-nav .no-result").style.display = "none";
        setTimeout(() => {
          document.querySelector(".the-nav .loading-search").style.display =
            "none";
          document.querySelector(".the-nav .no-result").style.display = "none";
          if (this.searchUser.photo != "" && this.searchUser.isExist == true) {
            document
              .querySelector(".the-nav .search-feild .result img")
              .setAttribute("src", this.searchUser.photo);
          }
          document.querySelector(
            ".the-nav .search-feild .result"
          ).style.display = "block";
        }, 1000);
      }
    },
    closeSearchDiv() {
      document.querySelector(".the-nav .search-feild").style.height = "0px";
    },
    async logOut() {
      document.querySelector(".the-nav .loading").style.opacity = "0.7";
      document.querySelector(".the-nav .loading").style.visibility = "visible";
      await this.doSignOut(this.$store.state.apiLink);
      setTimeout(() => {
        document.querySelector(".the-nav .loading").style.opacity = "0";
        document.querySelector(".the-nav .loading").style.visibility = "hidden";
        this.$router.push("/signin");
      }, 1000);
    },
    goHomePage(check) {
      check.userRole == "INSTRUCTOR"
        ? this.$router.push("/instructor-home")
        : this.$router.push("/student-home");
    },
  },
  async mounted() {
    if (localStorage.getItem("rule") == "STUDENT") {
      document.querySelector(".the-nav .search").classList.add("show");
      document.querySelector(".the-nav .subjects-link").style.display = "none";
    } else {
      document.querySelector(".the-nav .search").classList.add("hide");
      document.querySelector(".the-nav .subjects-link").style.display = "block";
    }
    const checkAuth = await this.doCheckAuth(this.$store.state.apiLink);
    this.checkAuthen = checkAuth;
    if (checkAuth) {
      await this.getUserInfo(checkAuth._id);
    } else {
      this.$router.push("/signin");
    }
    if (checkAuth.userRole == "STUDENT") {
      const payload = {
        userID: checkAuth._id,
        path: "st-notifs/all-notifs/get",
      };

      // Get notifications
      await this.getFollowers(payload);
      this.notifications = this.navbarModule.followers;
      let counter = 0;
      this.notifications.forEach((notf) => {
        if (notf.isRead == false) {
          counter++;
        }
      });
      this.newNotifiNum = counter;
    } else {
      const payload = {
        userID: checkAuth._id,
        path: "follows/all-students/get",
      };

      // Get notifications
      await this.getFollowers(payload);
      this.notifications = this.navbarModule.followers;
      let counter = 0;
      this.notifications.forEach((notf) => {
        if (notf.isRead == false) {
          counter++;
        }
      });
      this.newNotifiNum = counter;
    }
    //End Get notifications
  },
};
</script>

<style lang="scss">
@import "../../../assets/sass/main.scss";
.the-nav a {
  text-decoration: none !important;
  color: #000 !important;
}
body {
  width: 100%;
}

/*Nav*/
.the-nav {
  background-color: $mainColor;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 1001;
  box-shadow: 0px 0px 11px -4px #0000007a;
  .loading {
    visibility: hidden;
    opacity: 0;
  }
  .loading-search {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: white;
    left: 0;
    top: 0;
    justify-content: center;
    align-items: center;
    display: none;
    svg {
      width: 35px;
    }
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
}
@media (max-width: 1210px) {
  .the-nav {
    display: block;
  }
}
@media (max-width: 767px) {
  .the-nav .row {
    padding-right: 0 !important;
    padding-left: 0 !important;
  }
}
@media (max-width: 500px) {
  .the-nav .container-fluid {
    padding-right: 15px !important;
    padding-left: 15px !important;
  }
}
.the-nav .menu i {
  font-size: 30px;
  cursor: pointer;
  color: rgb(255, 250, 250);
  opacity: 0.7;
}
.the-nav .menu i:hover {
  opacity: 1;
  color: #000;
  font-size: 35px;
}
@media (max-width: 575px) {
  .the-nav .menu i {
    font-size: 20px;
  }
}
.the-nav .logo img {
  width: 100px;
}

@media (max-width: 575px) {
  .the-nav .logo img {
    width: 75px;
  }
}
.the-nav .logout .the-icons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.the-nav .logout img {
  width: 40px;
  height: 40px;
  border-radius: 39%;
  margin-right: 30px;
  object-fit: cover;
}
@media (max-width: 575px) {
  .the-nav .logout img {
    width: 25px;
    height: 25px;
  }
}
.the-nav .logout i {
  font-size: 30px;
  color: white;
  opacity: 0.7;
}
.the-nav .logout i:hover {
  opacity: 1;
  font-size: 40px;
  color: #000;
}
@media (max-width: 575px) {
  .the-nav .logout i {
    font-size: 18px;
  }
}
.the-nav hr {
  margin: 0 !important;
  padding: 0;
  width: 100% !important;
  height: unset !important;
}
.the-nav .search {
  &.show {
    display: block;
  }
  &.hide {
    display: none;
  }
  input {
    border: none;
    outline: none;
    padding: 5px 10px;
    font-size: 18px;
  }
}
.the-nav .search input::placeholder {
  font-size: 17px;
  font-style: italic;
  letter-spacing: 1px;
  color: rgba(0, 0, 0, 0.488);
}
.the-nav .search button {
  right: 40px;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  border: unset;
  outline: unset;
  background-color: transparent;
}
.the-nav .overlay {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.479);
  position: fixed;
  left: 0;
  top: 0;
  display: none;
  position: fixed;
  z-index: 20;
}
.the-nav .toggle-menu {
  position: fixed;
  width: 350px;
  height: 100%;
  background-color: $mainColor;
  z-index: 5000;
  top: 0;
  box-shadow: 0px 0px 11px -5px black;
  overflow-x: hidden;
  padding-bottom: 30px;
  left: -360px;
  transition: 0.4s;
}
@media (max-width: 500px) {
  .the-nav .toggle-menu {
    width: 60%;
  }
}
.the-nav .toggle-menu ul {
  padding: 50px 20px 30px;
}
.the-nav .toggle-menu ul li {
  padding: 6px 18px;
  font-weight: 700;
  font-size: 20px;
  position: relative;
  margin-bottom: 20px;
  transition: 0.2s;
  color: #c4d0df;
  i {
    width: 40px;
  }
  &:hover {
    background-color: #152948;
  }
}
.the-nav .show-notifs {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: calc(100% + 26px);
  background: #e9f1fa;
  padding: 9px;
  border-radius: 10px;
  box-shadow: 0px 0px 9px -5px black;
  max-height: 300px;
  overflow-y: auto;
  visibility: hidden;
  opacity: 0;
  transition: 0.2s all ease-in-out;
  z-index: 1;
  &.active {
    visibility: visible;
    opacity: 1;
  }
  ul {
    width: 250px;
    transition: 0.5s;
    img {
      height: 35px;
      width: 35px;
      float: left;
      margin-right: 11px;
      border-radius: 50%;
    }
    li {
      padding: 7px 0;
      font-weight: 500;
      font-size: 11px;
      position: relative;
      margin-bottom: 10px;
      display: flex;
      text-align: start;
      align-items: center;
      text-transform: capitalize;
      word-break: break-all;
      &.is-read {
        background-color: #bedbe7;
      }
    }
  }
}

.open-notifications {
  max-height: 321px !important;
  overflow: auto !important;
}
@media (max-width: 500px) {
  .the-nav .toggle-menu ul li {
    font-size: 13px;
  }
}
.the-nav .toggle-menu ul.notifications {
  padding-left: 0;
  padding-right: 0;
  li {
    padding-right: 10px;
    padding-left: 10px;
  }
  p {
    text-align: center;
    padding: 28px 0px;
    font-style: italic;
    color: rgba(0, 0, 0, 0.6392156863);
    font-size: 17px;
    margin-top: 0;
    font-weight: 700;
    position: relative;
    background-color: #edddd4;
    margin-bottom: 20px;
    transition: 0.2s;
    border-bottom-left-radius: 16px;
  }
}
@media (max-width: 500px) {
  .the-nav .toggle-menu ul.notifications {
    li {
      font-size: 9px;
    }
    p {
      font-size: 12px;
    }
  }
}
.the-nav .toggle-menu {
  .notifi-link-div {
    cursor: pointer;
    span {
      background-color: #ea6767ba;
      border-radius: 50%;
      text-align: center;
      display: inline-block;
      padding: 1px 9px 1px 9px;
      color: white;
      margin-right: 10px;
      position: absolute;
      right: 0;
    }
  }
}
.the-nav .search-feild {
  width: 50%;
  height: 0;
  overflow: hidden;
  z-index: 100;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  transition: 0.4s;
  background-color: white;
  box-shadow: 0px 5px 10px -7px #7c7c7c;
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
  .no-result {
    display: none;
  }
  .result {
    display: none;
    a {
      width: fit-content;
    }
    padding: 20px;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 20px;
    }
  }
}
@media (max-width: 660px) {
  .the-nav .search-feild {
    width: 70%;
  }
}
</style>
