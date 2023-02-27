import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "../fontawesome-free-6.1.0-web/css/all.css";
import "@/bootstrap/bootstrap.css";
import "@/bootstrap/bootstrap.min.css";
import "normalize.css";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const backendApi = {
  data() {
    return {
      apiLink: "http://localhost:8080",
    };
  },
};

createApp(App)
  .mixin(backendApi)
  .use(VueSweetalert2)
  .use(store)
  .use(router)
  .mount("#app");
