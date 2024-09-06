import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

// Spring Boot 백엔드 주소
axios.defaults.baseURL = "http://localhost:8081"; // 백엔드 포트 확인
axios.defaults.withCredentials = true;

const app = createApp(App);
app.config.globalProperties.$http = axios;
app.use(router);
app.mount("#app");
