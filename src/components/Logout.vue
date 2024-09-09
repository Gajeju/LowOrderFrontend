<template>
  <button @click="logout" class="logout-button">로그아웃</button>
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

<style scoped>
.logout-button {
  padding: 10px 20px;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
</style>
