<template>
  <el-container style="height: 87vh;">
    <el-row :gutter="24" class="general-container">
      <el-col class="tittle-container" :span="10">
        <h1>Bem vindo</h1>
        <span>{{ userLogged.name }}</span>
        <div class="action-buttons-container">
          <el-tooltip
            content="Adicionar conta"
          >
            <el-button @click="showAddBillDialog" size="large" circle :icon="Plus" type="success"/>
          </el-tooltip>
        </div>
      </el-col>
      
      <el-col class="resume-container" :span="14">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Resumo Geral</span>
            </div>
          </template>
          <el-row :gutter="24">
            <el-col :span="14">
              <el-table :data="billsOfTheMonth">
                <el-table-column label="Conta">
                  <template #default="scope">
                    {{ `${getBillFromEntrie(scope.row.idBill)}` }}
                  </template>
                </el-table-column>
                
                <el-table-column label="Valor">
                  <template #default="scope">
                    {{ `R$ ${(scope.row.value).toFixed(2)}` }}
                  </template>
                </el-table-column>

                <el-table-column label="Vencimento">
                  <template #default="scope">
                    {{ dateToString(scope.row.dueDate) }}
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
              
            <el-col :span="10">
              <h4>Total no mês</h4>
              {{ ammountBillInTheMonth }}
            </el-col>
          </el-row>
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
import { UserLogged } from '../../store/loginStore';
import { dateToString, firstDayMonth, lastDayMonth } from '../../utils/functions';
  const store = useStore();

  //DATA
  const addBillVisibility = ref(false)

  //COMPUTED
  const userLogged = computed<UserLogged>(() => store.state.loginStore.userLogged);
  const billsOfTheMonth = computed(() => {
    return userLogged.value.entries.filter(entrie => {
      if((new Date(entrie.dueDate)) >= firstDayMonth() && (new Date(entrie.dueDate) <= lastDayMonth())) {
        return entrie;
      }
    })
  });

  const ammountBillInTheMonth = computed(() => {
    let ammount = 0;
    billsOfTheMonth.value.forEach(bill => {
      ammount += bill.value;
    });

    return ammount;
  })

  //METHOD
  const showAddBillDialog = () => {
    addBillVisibility.value = true;
  }

  const getBillFromEntrie = (idBill: any) => {
    const bill = userLogged.value.bills.find(bill => {
      return bill.id == idBill
    });

    return bill.title
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