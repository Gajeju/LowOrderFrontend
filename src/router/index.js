import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Dashboard from "../components/Dashboard.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true }, // 로그인한 사용자는 접근 불가
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true }, // 로그인한 사용자만 접근 가능
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation Guard 설정
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("auth"); // 로그인 여부 확인

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 인증된 사용자만 접근 가능
    if (!isAuthenticated) {
      next("/login"); // 인증되지 않은 경우 로그인 페이지로 이동
    } else {
      next(); // 인증된 경우 요청한 페이지로 이동
    }
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    // 인증되지 않은 사용자만 접근 가능
    if (isAuthenticated) {
      next("/dashboard"); // 로그인된 경우 대시보드로 리다이렉트
    } else {
      next(); // 로그인되지 않은 사용자는 로그인 페이지 접근 허용
    }
  } else {
    next(); // 특별한 조건이 없는 경우 그대로 진행
  }
});

export default router;
