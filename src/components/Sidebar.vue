<template>
  <div class="sidebar">
    <h1 class="title">로우오더</h1>
    <ul>
      <li :class="{ active: isActive('menu') }" @click="navigateTo('menu')">
        메뉴관리
      </li>
      <li
        :class="{ active: isActive('Order-Management') }"
        @click="navigateTo('Order-Management')"
      >
        주문관리
      </li>
      <li :class="{ active: isActive('order') }" @click="navigateTo('order')">
        주문하기
      </li>
      <li :class="{ active: isActive('logout') }" @click="navigateTo('logout')">
        로그아웃
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    navigateTo(page) {
      if (page === "logout") {
        localStorage.removeItem("auth"); // 로컬 스토리지에서 인증 정보 제거
        this.$router.push("/login");
      } else {
        this.$router.push(`/${page}`);
      }
    },
    isActive(page) {
      return this.$route.path.includes(page); // 현재 경로에 해당 페이지가 있는지 확인
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #222;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
}

ul {
  list-style: none;
  padding: 0;
  margin-top: 50px;
}

li {
  margin-bottom: 30px;
  cursor: pointer;
  font-size: 18px;
  padding-left: 10px;
  position: relative;
}

li:hover {
  color: #00b894;
}

li.active {
  color: #00b894;
  font-weight: bold;
  border-left: 4px solid #00b894; /* 선택된 항목 왼쪽에 라인 추가 */
  padding-left: 6px; /* 라인 추가로 인한 패딩 조정 */
}

.title {
  font-size: 24px;
  color: white;
  margin-bottom: 20px;
  text-align: center;
}
</style>
