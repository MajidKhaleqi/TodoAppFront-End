<template>
  <div class="container">
    <div class="register-bgc p-4" v-if="registerPage">
      <h4 class="w-100">ثبت نام</h4>
      <div class="row px-4 py-2">
        <input
          type="text"
          class="form-control"
          placeholder="نام کاربری"
          aria-label="Username"
          aria-describedby="basic-addon1"
          v-model="username"
        />
        <input
          type="password"
          class="form-control my-2"
          placeholder="رمز عبور"
          aria-label="password"
          aria-describedby="basic-addon1"
          v-model="password"
        />
        <button
          :disabled="disabled"
          @click="register()"
          class="btn btn-md bg-success text-white btn-register"
        >
          ثبت نام
        </button>
        <div>
          <p class="text-primary my-2" @click="registerPage = false">
            قبلا ثبت نام کرده اید؟
          </p>
        </div>
      </div>
    </div>
    <div class="login-bgc p-4" v-else>
      <p class="text-success" v-if="loggedIn">با موفقیت وارد شدید</p>
      <h4 class="w-100">ورود</h4>
      <div class="row px-4 py-2">
        <input
          type="text"
          class="form-control"
          placeholder="نام کاربری"
          aria-label="Username"
          aria-describedby="basic-addon1"
          v-model="username"
        />
        <input
          type="password"
          class="form-control my-2"
          placeholder="رمز عبور"
          aria-label="password"
          aria-describedby="basic-addon1"
          v-model="password"
        />
        <button
          :disabled="disabled"
          @click="login()"
          class="btn btn-md bg-success text-white btn-register"
        >
          ورود
        </button>
        <div>
          <p class="text-primary my-2" @click="registerPage = true">ثبت نام</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      disabled: false,
      username: "",
      password: "",
      registerPage: true,
      loggedIn: false,
    };
  },
  created() {
    if (this.$root.isLogin()) {
      this.$router.push("/todos");
    }
  },
  methods: {
    register() {
      this.disabled = true;
      axios
        .post("http://localhost:5050/api/v1/auth/register", {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          this.disabled = false;
          this.$root.setCookie(`Authorization = Bearer ${response.data.token}`);
          this.$axios.defaults.headers.common["Authorization"] =
            this.$root.getCookie("Authorization");
          this.$router.push("/todos");
          this.$root.success_notification(response.data.message);
        })
        .catch((err) => {
          this.disabled = false;
          this.$root.error_notification(err);
        });
    },
    login() {
      this.disabled = true;
      axios
        .post("http://localhost:5050/api/v1/auth/login", {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          this.disabled = false;
          this.loggedIn = true;
          setTimeout(() => {
            this.loggedIn = false;
          }, 3000);
          this.$root.setCookie(`Authorization = Bearer ${response.data.token}`);
          this.$axios.defaults.headers.common["Authorization"] =
            this.$root.getCookie("Authorization");
          this.$root.success_notification(response);
        })
        .catch((err) => {
          this.disabled = false;
          this.$root.error_notification(err);
        });
    },
  },
};
</script>
<style scoped>
.register-bgc {
  box-shadow: 1px 3px 14px 0px rgb(0 0 0 / 35%);
}
.register-bgc p {
  cursor: pointer;
}
.login-bgc {
  box-shadow: 1px 3px 14px 0px rgb(0 0 0 / 35%);
}
.login-bgc p {
  cursor: pointer;
}
* {
  font-family: "iran-sans";
}
</style>
