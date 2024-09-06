<template>
  <div>
    <h1>Dashboard</h1>
    <p>Welcome to the dashboard!</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem("auth"); // 로컬 스토리지에서 인증 정보 제거
      this.$router.push("/login"); // 로그인 페이지로 이동
    },
  },
};
</script>
