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
        const response = await this.$http.post("/auth/login", {
          loginId: this.loginId,
          password: this.password,
        });

        // 로그인 성공 시 store_id와 auth를 로컬 스토리지에 저장
        localStorage.setItem("auth", true); // 로그인 상태 저장
        localStorage.setItem("store_id", response.data.storeId); // store_id 저장

        this.$router.push("/menu"); // 로그인 성공 후 대시보드로 리다이렉트
      } catch (error) {
        alert("Login failed");
        console.error("로그인 중 오류:", error);
      }
    },
  },
};
</script>

<style scoped>
/* 스타일 동일 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f5;
  padding: 20px;
}
.login-box {
  width: 400px;
  padding: 30px 20px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  box-sizing: border-box;
}
.login-box h1 {
  font-size: 28px;
  margin-bottom: 30px;
  color: #333333;
  font-weight: bold;
}
.input-field {
  width: calc(100% - 20px);
  padding: 12px;
  margin-bottom: 20px;
  border: 2px solid #dddddd;
  border-radius: 10px;
  font-size: 18px;
  background-color: #fafafa;
  transition: border-color 0.3s;
  box-sizing: border-box;
}
.input-field:focus {
  border-color: #00aaff;
  outline: none;
}
.login-button {
  width: 100%;
  padding: 15px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}
.login-button:hover {
  background-color: #333333;
}
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
