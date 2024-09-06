<template>
  <div class="login-container">
    <div class="login-box">
      <h1>매장 로그인</h1>
      <input v-model="loginId" placeholder="아이디" class="input-field" />
      <input
        v-model="password"
        type="password"
        placeholder="비밀번호"
        class="input-field"
      />
      <button @click="login" class="login-button">로그인</button>
    </div>
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
        await this.$http.post("/auth/login", {
          loginId: this.loginId,
          password: this.password,
        });
        localStorage.setItem("auth", true); // 로그인 상태 저장
        this.$router.push("/dashboard"); // 로그인 성공 후 대시보드로 리다이렉트
      } catch (error) {
        alert("Login failed");
      }
    },
  },
};
</script>

<style scoped>
/* 전체 컨테이너 스타일 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f5; /* 부드러운 배경색 */
  padding: 20px;
}

/* 로그인 박스 스타일 */
.login-box {
  width: 400px;
  padding: 30px 20px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  box-sizing: border-box; /* 박스 크기 계산 */
}

/* 제목 스타일 */
.login-box h1 {
  font-size: 28px;
  margin-bottom: 30px;
  color: #333333;
  font-weight: bold;
}

/* 입력 필드 스타일 */
.input-field {
  width: calc(100% - 20px); /* 여유 공간을 포함해 너비 설정 */
  padding: 12px; /* 여유 있는 패딩 */
  margin-bottom: 20px;
  border: 2px solid #dddddd;
  border-radius: 10px;
  font-size: 18px;
  background-color: #fafafa;
  transition: border-color 0.3s;
  box-sizing: border-box; /* 패딩과 경계 포함 계산 */
}

.input-field:focus {
  border-color: #00aaff; /* 포커스 시 강조 */
  outline: none;
}

/* 버튼 스타일 */
.login-button {
  width: 100%;
  padding: 15px;
  background-color: #000000; /* 버튼 색상을 검정으로 변경 */
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #333333; /* 버튼 호버 시 조금 더 어두운 색 */
}

/* 반응형 디자인 */
@media screen and (max-width: 768px) {
  .login-box {
    width: 90%;
    padding: 20px;
  }
  .input-field {
    font-size: 16px;
  }
  .login-button {
    font-size: 16px;
  }
}
</style>
