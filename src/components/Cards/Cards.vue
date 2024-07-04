<template>
  <el-container class="main-container">
    <el-card>
      <el-row :gutter="24">
        <el-col :span="12" class="form-card">
          <div class="card">
            <div class="card-name">
              {{ form.name === '' ? '________________________' : form.name }}
            </div>

            <div class="card-number">
              1234 5678 9123 4567
            </div>

            <div class="due-date">
              05/2035
            </div>

            <div class="user-name">
              {{ userLogged.name }}
            </div>
          </div>

          <el-form
            :model="form"
            :rules="rules"
            :hide-required-asterisk="true"
            :size="formSize"
            ref="ruleFormRef"
            label-width="auto"
            label-position="top"
            style="padding: 15px;"
          >
            <el-form-item label="Nome do cartão" prop="name">
              <el-input v-model="form.name" placeholder="Ex: Cartão Inter"/>
            </el-form-item>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="Limite do cartão" prop="limit">
                  <div class="el-input__wrapper el-input el-input--default">
                    <money3 v-model="form.limit" class="el-input__inner" v-bind="moneyConfig">
                    </money3>
                  </div>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="Data de Vencimento" prop="dueDate">
                  <el-select v-model="form.dueDate">
                    <el-option v-for="day in 31" :label="`Dia ${day}`" :value="day">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-button @click="createCard(ruleFormRef)" circle type="success" :icon="Check"/>
              <el-button circle type="warning" :icon="Brush"/>
            </el-row>
          </el-form>
        </el-col>

        <el-col :span="12" class="table-of-cards">
          
        </el-col>
      </el-row>
    </el-card>
  </el-container>
</template>

<script setup lang="ts">
import {
  Check,
  Brush
} from '@element-plus/icons-vue'
import { ComponentSize, FormInstance, FormRules } from 'element-plus';
import { computed, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { globalFetch } from '../../fetchGlobal';
import urls from '../../utils/urls';
import { UserLogged } from '../../store/loginStore';

  const store = useStore();

  interface Form {
    name: string
    dueDate: number
    limit: number
  }

  //DATA
  const formSize = ref<ComponentSize>('default');
  const ruleFormRef = ref<FormInstance>();
  const form = reactive<Form>({
    name: '',
    dueDate: 1,
    limit: 0
  });

  const moneyConfig = reactive({
    prefix: 'R$ '
  });

  const rules = reactive<FormRules<Form>>({
    name: [
      { required: true,  message: 'Insira um nome para o cartão.', trigger: 'change'}
    ],
    dueDate: [
      { required: true }
    ],
    limit: [
      { required: true }
    ]
  })

  //COMPUTED
  const showLoading = () => store.dispatch('globalState/showLoading');
  const hideLoading = () => store.dispatch('globalState/hideLoading');
  const userLogged = computed<UserLogged>(() => store.state.loginStore.userLogged);

  //METHODS
  const updateCardsHandler = (cardsList: Array<any>) => store.dispatch('loginStore/updateUserCards', cardsList);

  const createCard = async (formEl: FormInstance | undefined) => {
    if(!formEl) return;
    await formEl.validate(async(valid) => {
      if(valid) {
        showLoading();
        const payload = {
          name: form.name,
          limit: form.limit,
          dueDate: form.dueDate,
          user: { ...userLogged.value }
        }

        const result = await globalFetch(urls.CREATE_CARD, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(payload)
        });

        const resultJson = await result.json();

        if(resultJson.status === 'Success') {
          updateCardsHandler(resultJson.lista);
        }

        hideLoading();
      }
    })
  }
</script>

<style scoped>
.main-container {
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 87vh;
  padding: 0px 21%;
}

.form-card {
  padding: 10px;
}

.card {
  border-radius: 8px;
  height: 172px;
  width: 300px;
  margin: auto;
  color: #f7f8fa;
  padding: 5px;
  background-color: #80a9e4;
}

.card-name {
  text-align: start;
  padding: 2px 7px;
}

.card-number {
  text-align: start;
  padding: 60px 3px 0px 7px;
  font-size: 18px;
}

.due-date {
  display: flex;
  flex-direction: row-reverse;
  padding: 0px 7px 0px 0px;
  font-size: 13px;
}

.user-name {
  text-align: start;
  padding: 2px 7px;
}

.table-of-cards {
  padding: 10px;
}

.table-of-cards {
  padding: 10px;
}
</style>