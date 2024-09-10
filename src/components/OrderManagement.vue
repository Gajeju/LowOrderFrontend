<template>
  <div class="layout">
    <Sidebar />
    <div class="order-container">
      <button @click="getAiSuggestions" class="ai-button">AI 제안</button>
      <table class="order-table">
        <thead>
          <tr>
            <th>주문번호</th>
            <th>결제 금액</th>
            <th>경과 시간</th>
            <th>세부 주문사항</th>
            <th>완료 여부</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.orderId">
            <td>{{ order.orderId }}</td>
            <td>{{ order.totalPrice }}</td>
            <td>{{ formatElapsedTime(order.orderTime) }}</td>
            <td>
              <ul>
                <li v-for="detail in order.orderDetails" :key="detail.detailId">
                  메뉴 이름: {{ detail.menuName }}, 가격: {{ detail.price }},
                  수량: {{ detail.quantity }}
                </li>
              </ul>
            </td>
            <td>
              <button @click="deleteOrder(order.orderId)" class="delete-button">
                완료
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 모달 창 -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h3>AI 제안</h3>
          <p>{{ aiResponse }}</p>
          <button @click="closeModal">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Sidebar from "./Sidebar.vue";

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      orders: [],
      showModal: false,
    };
  },
  mounted() {
    this.fetchOrders();
    this.startTimer();
  },
  methods: {
    fetchOrders() {
      const storeId = localStorage.getItem("store_id");
      if (storeId) {
        axios
          .get(`http://localhost:8081/api/orders/${storeId}`)
          .then((response) => {
            this.orders = response.data.filter((order) => order.complete !== 1);
          })
          .catch((error) => {
            console.error("Error fetching orders:", error);
          });
      } else {
        console.error("No store_id found in localStorage");
      }
    },
    deleteOrder(orderId) {
      axios
        .put(`http://localhost:8081/api/orders/${orderId}/complete`, {
          complete: 1,
        })
        .then(() => {
          this.fetchOrders();
        })
        .catch((error) => {
          console.error("Error deleting order:", error);
        });
    },
    formatElapsedTime(orderTime) {
      const orderDate = new Date(orderTime);
      const now = new Date();
      const diffInSeconds = Math.floor((now - orderDate) / 1000);

      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;

      return `${diffInSeconds}초`;
    },
    padTime(time) {
      return time < 10 ? `0${time}` : time;
    },
    startTimer() {
      setInterval(() => {
        this.orders = this.orders.map((order) => {
          order.elapsedTime = this.formatElapsedTime(order.orderTime);
          return order;
        });
      }, 1000);
    },
    async getAiSuggestions() {
      const storeId = localStorage.getItem("store_id");

      try {
        const response = await axios.post(
          "http://localhost:8081/api/ai/suggestions",
          {
            storeId: storeId,
          }
        );

        this.aiResponse = response.data;
        this.showModal = true; // 모달 창 열기
      } catch (error) {
        console.error("Error fetching AI suggestions:", error);
      }
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
.layout {
  display: flex;
}

.sidebar {
  flex: 0 0 200px; /* 사이드바 너비 */
  background-color: #333;
  height: 100vh;
}

.order-container {
  flex-grow: 1;
  padding: 20px;
  background-color: #f9f9f9;
  margin-left: 230px; /* 사이드바 너비만큼 왼쪽 여백 추가 */
}

h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.order-table th,
.order-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.order-table th {
  background-color: #333;
  color: #fff;
  font-weight: bold;
}

.order-table tr:hover {
  background-color: #f1f1f1;
}

.delete-button {
  padding: 10px 15px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #e60000;
}

/* AI 제안 버튼 */
.ai-button {
  background-color: #00b894;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.ai-button:hover {
  background-color: #008f68;
}

/* 모달 스타일 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 50%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-bottom: 20px;
}

.modal-content button {
  padding: 10px 20px;
  background-color: #00b894;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

ul {
  list-style-type: none; /* li의 기본 점을 제거 */
  padding-left: 0; /* 기본적으로 들어가는 padding 제거 (선택 사항) */
}

li {
  margin-bottom: 10px; /* 각 항목 간의 간격 (선택 사항) */
}
</style>
