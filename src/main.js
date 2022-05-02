import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import routes from "./routes";
import Notifications from "vue-notification";
import Axios from "axios";
Vue.use(Notifications);
import "bootstrap";
import { BootstrapVue } from 'bootstrap-vue'
import "./components/assets/style.css";
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.config.productionTip = false;
Vue.use(BootstrapVue)
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faTrash, faPen);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.prototype.$axios = Axios;
const router = new VueRouter({
  mode: "history",
  routes,
});
window.clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}
Vue.use(VueRouter);
new Vue({
  created() {
    if (this.getCookie("Authorization")) {
      this.$axios.defaults.headers.common["Authorization"] =
        this.getCookie("Authorization");
    } else {
      this.$router.push("/authorization");
    }

    document.title = this.$router.currentRoute.meta.title;
  },

  methods: {
    isLogin() {
      if (this.getCookie("Authorization")) {
        return true;
      } else {
        return false;
      }
    },
    success_notification(message) {
      this.$notify({
        group: "success",
        type: "success",
        title: "پیام سیستم",
        duration: 6000,
        text: message,
      });
    },
    error_notification(message) {
      this.$notify({
        group: "error",
        type: "error",
        title: "پیام سیستم",
        duration: 6000,
        text: message,
      });
    },
    setCookie(name, value) {
      var expires = "";
      var date = new Date();
      date.setTime(date.getTime() + 100000000001000);
      expires = "; expires=" + date;
      document.cookie = name + (value || "") + expires + "; path=/";
    },
    getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },
  },
  render: (h) => h(App),
  router: router,
}).$mount("#app");
