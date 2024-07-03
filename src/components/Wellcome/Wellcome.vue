<template>
  <el-container style="display: flex; flex-direction: column; gap: 50px; justify-content: center; height: 85vh;">
    <el-row :gutter="24" style="width: 100%; display: flex; flex-direction: row; justify-content: center;">
      <el-col :span="24" class="app-description-1-container">
        <span>Controle sua renda de maneira inteligente.</span>
      </el-col>
      <el-col :span="24">
        <span>Continue com o google ou crie uma conta Coust.</span>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="width: 100%; display: flex; flex-direction: row; justify-content: center;">
      <el-button :disabled="!isReady" @click="() => login()" style="max-width: 200px; width: 100%;">
        <img src="/google.svg" alt="Icone google" class="icone-google">
        Login com o Google
      </el-button>
      <el-button @click="openCreateAccountDialog" style="max-width: 200px; width: 100%;">
        Criar conta no Coust
      </el-button>
    </el-row>
  </el-container>
  <create-account v-model:visibility="dialogVisibilities.createAccountVisibility"/>
</template>

<script setup lang="ts">
import { 
  useCodeClient,
  type ImplicitFlowSuccessResponse,
  type ImplicitFlowErrorResponse
} from "vue3-google-signin";

import CreateAccount from "./dialogs/CreateAccount.vue";

import { globalFetch } from "../../fetchGlobal";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import urls from "../../utils/urls";
import { reactive } from "vue";

const store = useStore();
const router = useRouter();

//DATA DECLARATIONS
const dialogVisibilities = reactive({
  createAccountVisibility: false,
})

//STORE FUNCTIONS
const updateUserHandler = (user: object) => store.dispatch('loginStore/updateUserLogged', user);


//COMPUTER FUNCTIONS
const handleOnError = (errorResponse: ImplicitFlowErrorResponse) => {
  console.log("Error: ", errorResponse);
};


//METHODS
const handleOnSuccess = async (response: ImplicitFlowSuccessResponse) => {
  
  const result = await globalFetch(urls.GOOGLE_LOGIN, {
    method: "POST",
    credentials: 'include',
    body: JSON.stringify({
      code: response.code
    })
  }); 

  const resultJson = await result.json();

  updateUserHandler(resultJson.item);

  if(resultJson.status === 'Success') {
    router.push({ path: '/home' })
  }
};

const { isReady, login } = useCodeClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
});

const openCreateAccountDialog = ():void => {
  dialogVisibilities.createAccountVisibility = true;
}
</script>

<style scoped>
  .app-description-1-container {
    text-align: center;
    font-size: 60px;
    max-width: 500px;
    font-weight: 700;
    color: #585656;
  }

  .app-description-2-container {
    text-align: center;
    font-size: 20px;
    max-width: 300px;
    font-weight: 700;
    color: #585656;
  }

  .icone-google {
    width: 18px;
    height: 18px;
    margin-right: 5px;
  }
</style>