<template>
  <div>
    <h1>Dashboard</h1>
    <p>{{ message }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "",
    };
  },
  async created() {
    try {
      const response = await this.$http.get("http://localhost:8080/auth/check");
      this.message = response.data;
    } catch (error) {
      this.message = "You are not logged in";
      this.$router.push("/login"); // 로그인 안 되어 있으면 로그인 페이지로 이동
    }
  },
  methods: {
    async logout() {
      await this.$http.get("http://localhost:8080/auth/logout");
      this.$router.push("/login");
    },
  },
};
</script>
