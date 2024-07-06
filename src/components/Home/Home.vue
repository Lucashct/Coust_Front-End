<template>
  <el-container style="height: 87vh;">
    <el-row :gutter="24" class="general-container">
      <el-col class="tittle-container" :span="12">
        <h1>Bem vindo</h1>
        <span>{{ userLogged.name }}</span>
        <div class="action-buttons-container">
          <el-tooltip
            content="Adicionar conta"
          >
            <el-button @click="showAddBillDialog" size="large" circle :icon="Plus" type="success"/>
          </el-tooltip>
          <el-tooltip>
            <el-button size="large" circle></el-button>
          </el-tooltip>
        </div>
      </el-col>
      
      <el-col class="resume-container" :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Resumo Geral</span>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col>

      </el-col>
    </el-row>
  </el-container>
  <add-bill v-model:visibility="addBillVisibility"/>
</template>

<script lang="ts" setup>
import AddBill from './dialogs/AddBill.vue';
//ICONS IMPORT
import {
  Plus
} from '@element-plus/icons-vue'
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
  const store = useStore();

  //DATA
  const addBillVisibility = ref(false)

  //COMPUTED
  const userLogged = computed(() => store.state.loginStore.userLogged); 

  //METHOD
  const showAddBillDialog = () => {
    addBillVisibility.value = true;
}
</script>

<style scoped>
.general-container {
  width: 100%;
}

.tittle-container {
  text-align: left;
  color: #3b3b3b;
  height: 50%;
}

.tittle-container h1 {
  font-size: 4.7em;
  margin: auto;
}

.tittle-container span {
  font-size: 1.5em;
  margin-left: 10px
}

.resume-container {
  height: 50%;
}

.action-buttons-container {
  height: 39%;
  place-content: end left;
  padding: 0px 15px
}
</style>