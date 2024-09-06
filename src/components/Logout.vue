<template>
  <button @click="logout">로그아웃</button>
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
/* 스타일 필요시 추가 */
</style>
