<template>
  <div class="layout">
    <Sidebar />
    <div class="order-container">
      <table class="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Total Price</th>
            <th>Order Time</th>
            <th>Details</th>
            <th>Actions</th>
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
</style>
