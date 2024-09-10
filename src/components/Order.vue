<template>
  <div class="order-page" @click="hideCart">
    <!-- Click anywhere to hide cart -->
    <!-- Include Sidebar Component -->
    <Sidebar />

    <!-- Toggle Cart Button -->
    <button class="toggle-cart-button" @click.stop="toggleCart">
      장바구니 보기
    </button>

    <!-- 메뉴 목록 -->
    <div class="menu-content">
      <div v-if="menuList.length > 0" class="menu-grid">
        <div v-for="menu in menuList" :key="menu.menuId" class="menu-card">
          <div class="menu-placeholder">150 x 150</div>
          <!-- Placeholder image -->
          <h3>{{ menu.menuName }}</h3>
          <p>{{ menu.price }}원</p>
          <button @click.stop="addToCart(menu)">담기</button>
          <!-- Stop event propagation here -->
        </div>
      </div>
      <div v-else>
        <p>등록된 메뉴가 없습니다.</p>
      </div>
    </div>

    <!-- 사이드 메뉴 장바구니 (메뉴 추가 시에만 표시) -->
    <div
      class="cart-sidebar"
      :class="{ 'cart-sidebar-open': cartOpen }"
      @click.stop
    >
      <div class="cart-header">
        <h2>주문 내역</h2>
        <button class="close-cart" @click="cartOpen = false">X</button>
      </div>
      <div class="cart-items">
        <div v-if="cart.length > 0">
          <div v-for="(item, index) in cart" :key="index" class="cart-item">
            <span>{{ item.menuName }}</span>
            <span>{{ item.price }}원</span>
            <!-- Quantity adjustment with arrows -->
            <div class="quantity-controls">
              <button @click="decreaseQuantity(index)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="increaseQuantity(index)">+</button>
            </div>
            <button @click="removeFromCart(index)" class="remove-button">
              삭제
            </button>
          </div>
        </div>
        <div v-else>
          <p>장바구니가 비어 있습니다.</p>
        </div>
        <button class="submit-order" @click="submitOrder">주문하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue"; // Import the sidebar component
import axios from "axios";

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      menuList: [], // 메뉴 목록
      cart: [], // 장바구니 목록
      cartOpen: false, // 장바구니 사이드바 열림/닫힘 상태
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
      this.cartOpen = true; // 장바구니 사이드바 열림
    },

    // 장바구니에서 메뉴 제거
    removeFromCart(index) {
      this.cart.splice(index, 1);
      if (this.cart.length === 0) {
        this.cartOpen = false; // 장바구니가 비면 숨김
      }
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
          storeId: parseInt(storeId),
          orderDetails: this.cart.map((item) => ({
            menuName: item.menuName,
            price: item.price,
            quantity: item.quantity,
          })),
        };
        const response = await axios.post("/api/orders", orderRequest);
        alert("주문이 완료되었습니다!");
        this.cart = []; // 주문 완료 후 장바구니 비우기
        this.cartOpen = false; // 장바구니 닫기
      } catch (error) {
        console.error("주문 중 오류 발생:", error);
        alert("주문 중 오류가 발생했습니다.");
      }
    },

    // Toggle cart visibility
    toggleCart() {
      this.cartOpen = !this.cartOpen;
    },

    // Hide cart when clicking outside
    hideCart() {
      this.cartOpen = false;
    },

    // Increase quantity
    increaseQuantity(index) {
      this.cart[index].quantity += 1;
    },

    // Decrease quantity
    decreaseQuantity(index) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity -= 1;
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
  padding-left: 230px; /* To make room for the sidebar */
  position: relative;
}

.menu-content {
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
  background-color: white;
}

.menu-placeholder {
  width: 150px;
  height: 150px;
  background-color: #ddd;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 14px;
  color: #999;
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

/* 장바구니 사이드바 */
.cart-sidebar {
  position: fixed;
  top: 0;
  right: -320px; /* Fully hidden when off-screen */
  width: 300px;
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease-in-out;
  padding: 20px;
}

.cart-sidebar-open {
  right: 0; /* Fully visible when open */
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-items {
  margin-top: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.quantity-controls {
  display: flex;
  align-items: center; /* Vertically centers the buttons and text */
  justify-content: space-between; /* Ensures proper spacing between elements */
}

.quantity-controls button {
  width: 30px; /* Set appropriate width */
  height: 30px; /* Set appropriate height */
  display: flex;
  align-items: center; /* Vertically center the text inside the button */
  justify-content: center; /* Horizontally center the text inside the button */
  background-color: #0984e3; /* Normal background color */
  color: white; /* Text color */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px; /* Adds spacing between buttons and text */
}

.quantity-controls button:hover {
  background-color: #74b9ff; /* Lighter color on hover */
}

.quantity-controls span {
  padding: 0 10px; /* Adds space around the quantity text */
  text-align: center; /* Ensures the text is centered */
}
.submit-order {
  width: 100%;
  margin-top: 20px;
  background-color: #00b894;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
}

.close-cart {
  background-color: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.toggle-cart-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: black;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-right: 20px;
}

.toggle-cart-button:hover {
  background-color: #333;
}
</style>
