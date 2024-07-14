<template>
  <el-dialog
    :model-value="props.visibility"
    title="Adicionar uma conta."
    width="500"
    @update:modelValue="emit('update:visibility', $event)"
    :before-close="closeDialog"
  >
    <el-form
      :model="form"
      :rules="rules"
      :hide-required-asterisk="true"
      :size="formSize"
      ref="ruleFormRef"
      label-width="auto"
      style="max-width: 600px; padding: 20px"
      label-position="top"
    >
      <el-form-item>
        <el-switch size="small" v-model="isCredCard" style="margin-right: 10px;"/>
        Conta feita no cartão de crédito
      </el-form-item>
      
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="Título" prop="title">
            <el-input v-model="form.title"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="Tipo">
            <el-select v-model="form.type">
              <el-option v-for="type in billTypesOptions"
                :key="type.value"
                :label="type.label"
                :value="type.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="Valor">
            <div class="el-input__wrapper el-input el-input--default">
              <money3 v-model="form.ammount" class="el-input__inner" v-bind="moneyConfig"/>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="Vencimento" prop="dueDate">
            <el-date-picker v-model="form.dueDate" type="date" format="DD/MM/YYYY"/>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="24">
        <el-col :span="12" v-if="form.type === 'INSTALLMENT'">
          <el-form-item label="Quatidade de Parcelas">
            <el-input-number v-model="entriesQt" type="number" :min="1"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="isCredCard">
          <el-form-item label="Cartões">
            <el-select v-model="cardSelected" clearable>
              <el-option v-for="card in userLogged.cards"
                :key="card.id"
                :label="card.name"
                :value="card.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="createBill(ruleFormRef)" type="success" size="small">Gravar</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ComponentSize, FormInstance, FormRules } from 'element-plus';
import { computed, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { UserLogged } from '../../../store/loginStore';
import { globalFetch } from '../../../fetchGlobal';
import urls from '../../../utils/urls';

const store = useStore();

const userLogged = computed<UserLogged>(() => store.state.loginStore.userLogged);

const emit = defineEmits(['update:visibility'])
const props = defineProps({
  visibility: {
    type: Boolean,
    required: true,
    default: false
  }
});

interface Form {
  title: string
  type: string
  ammount: number
  dueDate: string
}

const billTypesOptions = [
  {
    value: 'CASH_DOWN',
    label: 'A vista'
  },
  {
    value: 'INSTALLMENT',
    label: 'A prazo'
  }
]

//DATA
const formSize = ref<ComponentSize>('default');
const ruleFormRef = ref<FormInstance>();
const form = reactive<Form>({
  title: '',
  type: 'CASH_DOWN',
  ammount: 0,
  dueDate: ''
});
const isCredCard = ref(false);
const entriesQt = ref(1);
const cardSelected = ref(undefined);

const rules = reactive<FormRules<Form>>({
  title: [
    { required: true, message: 'Digite um título para nova conta', trigger: 'change' },
  ],
  ammount: [
    { required: true, type: 'number', min: 0.1, trigger: 'blur' }
  ],
  dueDate: [
    { required: true, message: 'Obrigatória a data de vencimento', trigger: 'change' }
  ]
})

const moneyConfig = reactive({
  prefix: 'R$ '
});

const showLoading = () => store.dispatch('globalState/showLoading');
const hideLoading = () => store.dispatch('globalState/hideLoading');

const updateEntriesHandler = (entries: any) => store.dispatch('loginStore/updateUserEntries', entries);
const updateBillsHandler = (bill: any) => store.dispatch('loginStore/updateUserBills', bill);

const createBill = async (formEl: FormInstance | undefined) => {
  if(!formEl) return;
  await formEl.validate(async (valid) => {
    if(valid) {
      showLoading();

      const payload = {
        title: form.title,
        type: form.type,
        ammount: form.ammount,
        dueDate: form.dueDate,
        card: cardSelected.value,
        entriesQt: entriesQt.value,
        user: userLogged.value
      }

      const result = await globalFetch(urls.CREATE_BILL, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const resultJson = await result.json();

      if(resultJson.status === 'Success') {
        updateBillsHandler(resultJson.item.bill)
        updateEntriesHandler(resultJson.item.entries);

        clearForm(ruleFormRef.value);

        closeDialog();
      }

      hideLoading();
    }
  })
}

const clearForm = (formEl: FormInstance | undefined) => {
  if(!formEl) return;
  formEl.resetFields();
}

const closeDialog = () => {
  emit('update:visibility', false);
}
</script>