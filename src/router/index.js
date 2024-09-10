import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import MenuManagement from "../components/MenuManagement.vue";
import Order from "@/components/Order.vue";
import OrderManagement from "@/components/OrderManagement.vue";

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
    path: "/menu", // URL을 /menu로 변경
    name: "MenuManagement",
    component: MenuManagement,
    meta: { requiresAuth: true }, // 로그인한 사용자만 접근 가능
  },
  {
    path: "/order", // URL을 /menu로 변경
    name: "Order",
    component: Order,
    meta: { requiresAuth: true }, // 로그인한 사용자만 접근 가능
  },
  {
    path: "/order-management", // URL을 /menu로 변경
    name: "OrderManagement",
    component: OrderManagement,
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
    if (!isAuthenticated) {
      next("/login"); // 인증되지 않은 경우 로그인 페이지로 이동
    } else {
      next(); // 인증된 경우 요청한 페이지로 이동
    }
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      next("/menu"); // 로그인된 경우 /menu로 리다이렉트
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
