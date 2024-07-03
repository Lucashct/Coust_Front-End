<template>
  <el-header class="header" v-loading.fullscreen.lock="isLoading">
    <el-row style="">
      <el-col :span="8" style="display: flex; place-content: start; align-items: center;">
        <img class="title-icon" src="/title_icon.png" alt="Ícone do título">
        <span class="title-font">COUST</span>
      </el-col>
      <el-col :span="8" style="display: flex; justify-content: center; align-items: center;">
        <el-row :gutter="50">
          <el-col :span="12" v-show="isShowMenuRoutes">
            <router-link class="menu-link" to="/home">Home</router-link>
          </el-col>
          <el-col :span="12" v-show="isShowMenuRoutes">
            <router-link class="menu-link" to="/cards">Cartões</router-link>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" style="display: flex; place-content: end; align-items: center;">
        <el-button @click="logOut" class="log-out-in-button" link v-show="isShowMenuRoutes">
          Log out
          <img src="../../assets/logout.svg" alt="Log out Icon" class="icon-button">
        </el-button>

        <el-button @click="showLoginDialog" class="log-out-in-button" link v-show="isShowLogInButton">
          Login
          <img src="../../assets/login.svg" alt="Log in Icon" class="icon-button">
        </el-button>
      </el-col>
    </el-row>
  </el-header>
  <el-container class="padding-view">
    <router-view />
  </el-container>
  <login v-model:visibility="loginDialogVisibility"/>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { globalFetch } from '../../fetchGlobal';
import { useRoute, useRouter } from 'vue-router';
import Login from './dialogs/Login.vue';
import urls from '../../utils/urls';

const store = useStore();
const router = useRouter();
const route = useRoute();

const loginDialogVisibility = ref(false);

const updateUserHandler = (user: object) => store.dispatch('loginStore/updateUserLogged', user);

onMounted(async () => {
  const result = await globalFetch(urls.RECOVER_SESSION, {
    method: "POST",
    credentials: 'include',
  });

  const resultJson = await result.json();

  updateUserHandler(resultJson.item);

  if(resultJson.status === 'Success') {
    router.push({ path: '/home' })
  }
})

const isShowMenuRoutes = computed(():boolean => {
  return route.name === 'Home' || route.name === 'Cards'
})

const isShowLogInButton = computed(():boolean => {
  return route.name === 'Wellcome'
})

const isLoading = computed(() => store.state.globalState.loadingState)

const logOut = async () => {
  const result = await globalFetch(urls.LOG_OUT, {
    method: "GET",
    credentials: 'include'
  })

  const resultJson = await result.json();

  updateUserHandler({});

  if(resultJson.status === 'Success') {
    router.push({ path: '/' })
  }
}

const showLoginDialog = () => {
  loginDialogVisibility.value = true;
}
</script>

<style scoped>
  .header {
    background-color: #3b744c;
  }
  .title-font {
    font-size: 40px; 
    font-weight: 700;
    color: #e6e6e6;
  }
  .title-icon {
    width: 50px;
    height: 50px;
  }
  .menu-link {
    text-decoration: none;
    color: #e6e6e6;
  }
  .menu-link:hover {
    color: #bebebe;
    text-decoration: underline;
  }

  .padding-view {
    padding: 10px 20px;
  }
  
  .icon-button {
    width: 18px;
    height: 18px;
    margin-left: 5px;
  }

  .log-out-in-button {
    background-color: transparent;
    color: #f5f5f5;
    border: none;
  }

  .log-out-in-button:hover {
    color: #d3d2d2;
  }
</style>