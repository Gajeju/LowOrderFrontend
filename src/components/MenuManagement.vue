<template>
  <div class="menu-management">
    <Logout />
    <div class="header">
      <button @click="openModal" class="add-menu-button">메뉴 추가</button>
    </div>

    <!-- 메뉴 리스트 -->
    <div v-if="menuList.length > 0" class="menu-grid">
      <div v-for="menu in menuList" :key="menu.menuId" class="menu-card">
        <img
          class="menu-image"
          src="https://via.placeholder.com/150"
          alt="Menu Image"
        />
        <div class="menu-info">
          <h4 class="menu-name">{{ menu.menuName }}</h4>
          <p class="menu-type">{{ menu.menuType }}</p>
          <p class="menu-price">{{ menu.price }}원</p>
        </div>
        <div class="menu-actions">
          <button @click="editMenu(menu)" class="edit-button">수정</button>
          <button @click="deleteMenu(menu.menuId)" class="delete-button">
            삭제
          </button>
        </div>
      </div>
    </div>
    <div v-else class="no-menu">등록된 메뉴가 없습니다.</div>

    <!-- 모달 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ isEditMode ? "메뉴 수정" : "메뉴 추가" }}</h3>
        <form @submit.prevent="isEditMode ? updateMenu() : createMenu()">
          <div>
            <label for="menuName">메뉴 이름:</label>
            <input
              v-model="newMenu.menuName"
              id="menuName"
              type="text"
              required
            />
          </div>
          <div>
            <label for="menuType">메뉴 종류:</label>
            <input
              v-model="newMenu.menuType"
              id="menuType"
              type="text"
              required
            />
          </div>
          <div>
            <label for="price">가격:</label>
            <input v-model="newMenu.price" id="price" type="number" required />
          </div>
          <button type="submit" class="submit-button">
            {{ isEditMode ? "수정 완료" : "메뉴 추가" }}
          </button>
        </form>
        <button @click="closeModal" class="close-button">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Logout from "./Logout.vue";

export default {
  components: {
    Logout,
  },
  data() {
    return {
      showModal: false,
      isEditMode: false, // 수정 모드 여부
      newMenu: {
        menuId: null, // 수정 시 메뉴 ID를 저장
        menuName: "",
        menuType: "",
        price: 0,
        storeId: null,
      },
      menuList: [],
    };
  },
  methods: {
    openModal() {
      const storeId = localStorage.getItem("store_id");
      if (storeId && storeId !== "undefined") {
        this.newMenu.storeId = parseInt(storeId);
      } else {
        console.error("Store ID가 로컬 스토리지에 없습니다.");
        this.newMenu.storeId = null;
      }
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.isEditMode = false;
      this.resetNewMenu();
    },
    async createMenu() {
      try {
        const response = await axios.post("/api/menus", this.newMenu);
        this.menuList.push(response.data);
        this.closeModal();
        this.resetNewMenu();
      } catch (error) {
        console.error(
          "메뉴 추가 중 오류 발생:",
          error.response ? error.response.data : error
        );
      }
    },

    async updateMenu() {
      try {
        console.log("Updating menu with ID:", this.newMenu.menuId); // menuId가 제대로 들어가는지 확인
        if (!this.newMenu.menuId) {
          throw new Error("menuId가 설정되지 않았습니다.");
        }
        await axios.put(`/api/menus/${this.newMenu.menuId}`, this.newMenu); // 이때 menuId가 null 또는 undefined가 아니어야 합니다.
        const index = this.menuList.findIndex(
          (menu) => menu.menuId === this.newMenu.menuId
        );
        if (index !== -1) {
          this.menuList.splice(index, 1, { ...this.newMenu });
        }
        this.closeModal();
      } catch (error) {
        console.error(
          "메뉴 수정 중 오류 발생:",
          error.response ? error.response.data : error
        );
      }
    },
    async deleteMenu(menuId) {
      try {
        console.log("Deleting menu with ID:", menuId); // menuId가 undefined가 아닌지 확인
        await axios.delete(`/api/menus/${menuId}`);
        this.menuList = this.menuList.filter((menu) => menu.menuId !== menuId);
      } catch (error) {
        console.error(
          "메뉴 삭제 중 오류 발생:",
          error.response ? error.response.data : error
        );
      }
    },
    editMenu(menu) {
      this.isEditMode = true;
      // 수정할 메뉴 데이터를 제대로 설정합니다.
      this.newMenu = { ...menu }; // 이때 newMenu에 menuId가 정확히 들어가야 합니다.
      console.log("Editing menu with ID:", this.newMenu.menuId); // 메뉴 ID를 확인합니다.
      this.showModal = true;
    },
    resetNewMenu() {
      this.newMenu = {
        menuId: null,
        menuName: "",
        menuType: "",
        price: 0,
        storeId: localStorage.getItem("store_id") || 0,
      };
    },
    async fetchMenus() {
      try {
        const storeId = localStorage.getItem("store_id");
        if (!storeId || storeId === "undefined") {
          console.error("Store ID가 로컬 스토리지에 없습니다.");
          return;
        }
        const response = await axios.get(`/api/menus/store/${storeId}`);
        this.menuList = response.data;
      } catch (error) {
        console.error(
          "메뉴를 가져오는 중 오류 발생:",
          error.response ? error.response.data : error
        );
      }
    },
  },
  mounted() {
    this.fetchMenus();
  },
};
</script>

<style scoped>
.menu-management {
  padding: 20px;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.add-menu-button {
  padding: 10px 20px;
  background-color: #00b894;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.add-menu-button:hover {
  background-color: #00a17e;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.menu-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  text-align: center;
  transition: transform 0.2s ease;
}

.menu-card:hover {
  transform: scale(1.05);
}

.menu-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 15px;
}

.menu-info {
  margin-bottom: 15px;
}

.menu-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #2d3436;
}

.menu-type {
  color: #636e72;
  margin-bottom: 5px;
}

.menu-price {
  font-size: 16px;
  color: #00b894;
  font-weight: bold;
}

.menu-actions {
  display: flex;
  justify-content: space-between;
}

.edit-button,
.delete-button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.edit-button {
  background-color: #fdcb6e;
  color: white;
}

.edit-button:hover {
  background-color: #e1b954;
}

.delete-button {
  background-color: #d63031;
  color: white;
}

.delete-button:hover {
  background-color: #c0392b;
}

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
  background-color: #ffffff;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
  width: 500px;
  max-width: 100%;
  text-align: center;
  position: relative;
}

.modal-content h3 {
  margin-bottom: 30px;
  font-size: 24px;
  color: #2d3436;
  font-weight: bold;
}

.modal-content label {
  display: block;
  font-size: 14px;
  color: #636e72;
  margin-bottom: 5px;
  text-align: left;
}

.modal-content input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dfe6e9;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 16px;
}

.modal-content input:focus {
  border-color: #00b894;
  outline: none;
}

.submit-button {
  background-color: #0984e3;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  width: 100%;
}

.submit-button:hover {
  background-color: #74b9ff;
}

.close-button {
  background-color: #000000;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 20px;
}

.close-button:hover {
  background-color: #333333;
}
.no-menu {
  text-align: center;
  color: #636e72;
  font-size: 18px;
  margin-top: 30px;
}
</style>
