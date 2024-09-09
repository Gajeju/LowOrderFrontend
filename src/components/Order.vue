<template>
  <div class="order-page">
    <h1>메뉴 목록</h1>

    <div v-if="menuList.length > 0" class="menu-grid">
      <div v-for="menu in menuList" :key="menu.menuId" class="menu-card">
        <h3>{{ menu.menuName }}</h3>
        <p>{{ menu.menuType }}</p>
        <p>{{ menu.price }}원</p>
        <button @click="addToCart(menu)">장바구니에 추가</button>
      </div>
    </div>
    <div v-else>
      <p>등록된 메뉴가 없습니다.</p>
    </div>

    <h2>장바구니</h2>
    <div v-if="cart.length > 0">
      <div v-for="(item, index) in cart" :key="index" class="cart-item">
        <span>{{ item.menuName }}</span>
        <span>{{ item.price }}원</span>
        <input type="number" v-model="item.quantity" min="1" />
        <button @click="removeFromCart(index)">삭제</button>
      </div>
      <button @click="submitOrder">주문하기</button>
    </div>
    <div v-else>
      <p>장바구니가 비어 있습니다.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      menuList: [], // 메뉴 목록
      cart: [], // 장바구니 목록
    };
  },
  methods: {
    // 메뉴 가져오기
    async fetchMenus() {
      const storeId = localStorage.getItem("store_id");
      if (!storeId) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      try {
        const response = await axios.get(`/api/menus/store/${storeId}`);
        this.menuList = response.data;
      } catch (error) {
        console.error("메뉴를 불러오는 중 오류 발생:", error);
      }
    },

    // 장바구니에 메뉴 추가
    addToCart(menu) {
      const existingItem = this.cart.find(
        (item) => item.menuId === menu.menuId
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cart.push({
          menuId: menu.menuId,
          menuName: menu.menuName,
          price: menu.price,
          quantity: 1,
        });
      }
    },

    // 장바구니에서 메뉴 제거
    removeFromCart(index) {
      this.cart.splice(index, 1);
    },

    // 주문 제출
    async submitOrder() {
      const storeId = localStorage.getItem("store_id");
      if (!storeId) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      try {
        const orderRequest = {
          storeId: parseInt(storeId), // storeId 추가
          orderDetails: this.cart.map((item) => ({
            menuName: item.menuName,
            price: item.price,
            quantity: item.quantity,
          })),
        };
        const response = await axios.post("/api/orders", orderRequest);
        alert("주문이 완료되었습니다!");
        this.cart = []; // 주문 완료 후 장바구니 비우기
      } catch (error) {
        console.error("주문 중 오류 발생:", error);
        alert("주문 중 오류가 발생했습니다.");
      }
    },
  },
  mounted() {
    this.fetchMenus(); // 컴포넌트가 로드될 때 메뉴를 가져옴
  },
};
</script>

<style scoped>
.order-page {
  padding: 20px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.menu-card {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

button {
  margin-top: 10px;
  padding: 10px;
  background-color: #00b894;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #008f71;
}
</style>
