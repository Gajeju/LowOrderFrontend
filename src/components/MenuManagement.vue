<template>
  <div>
    <Logout />
    <button @click="openModal">메뉴 추가</button>

    <!-- 모달 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>메뉴 추가</h3>
        <form @submit.prevent="createMenu">
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
          <button type="submit">메뉴 추가</button>
        </form>
        <button @click="closeModal">닫기</button>
      </div>
    </div>

    <!-- 메뉴 리스트 -->
    <div v-if="menuList.length > 0">
      <ul>
        <li v-for="menu in menuList" :key="menu.menuId">
          {{ menu.menuName }} - {{ menu.menuType }} - {{ menu.price }}
        </li>
      </ul>
    </div>
    <div v-else>등록된 메뉴가 없습니다.</div>
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
      newMenu: {
        menuName: "",
        menuType: "",
        price: 0,
        storeId: null, // storeId는 로컬 스토리지에서 가져옵니다.
      },
      menuList: [],
    };
  },
  methods: {
    openModal() {
      const storeId = localStorage.getItem("store_id");
      if (storeId && storeId !== "undefined") {
        this.newMenu.storeId = parseInt(storeId); // 문자열로 저장될 수 있으므로 숫자로 변환
      } else {
        console.error("Store ID가 로컬 스토리지에 없습니다.");
        this.newMenu.storeId = null; // 잘못된 값 대신 null로 설정
      }
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async createMenu() {
      try {
        console.log("보내는 데이터:", this.newMenu); // 전송할 데이터 확인
        const response = await axios.post("/api/menus", this.newMenu); // MenuController로 데이터 전송
        this.menuList.push(response.data); // 메뉴 추가 후 리스트 갱신
        this.closeModal(); // 모달 닫기
        this.resetNewMenu(); // 입력값 초기화
      } catch (error) {
        console.error(
          "메뉴 추가 중 오류 발생:",
          error.response ? error.response.data : error
        );
      }
    },
    resetNewMenu() {
      this.newMenu = {
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

        const response = await axios.get(`/api/menus/store/${storeId}`); // 해당 storeId의 메뉴 목록 가져오기
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
    this.fetchMenus(); // 페이지 로드 시 메뉴 목록 가져오기
  },
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  max-width: 100%;
}
</style>
