<template>
  <div>
    <h1>Login</h1>
    <input v-model="loginId" placeholder="Login ID" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginId: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await this.$http.post("/auth/login", {
          loginId: this.loginId,
          password: this.password,
        });
        alert(response.data);
        this.$router.push("/dashboard");
      } catch (error) {
        alert("Login failed: " + error.response.data);
      }
    },
  },
};
</script>
