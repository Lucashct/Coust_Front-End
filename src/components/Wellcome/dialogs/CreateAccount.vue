<template>
  <el-dialog
    :model-value="props.visibility"
    title="Cadastro"
    width="550"
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
      <el-form-item label="Nome" prop="name">
        <el-input v-model="form.name" :suffix-icon="User"/>
      </el-form-item>
      
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" :suffix-icon="House"/>
      </el-form-item>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="Senha" prop="password">
            <el-input v-model="form.password" :type="showPassword ? 'text' : 'password'">
              <template #append>
                <el-icon class="append-click" @click="() => handleShowPassword()">
                  <Hide v-if="showPassword"/>
                  <View v-else/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Repetir a senha" prop="repeatPassword">
            <el-input v-model="form.repeatPassword" :type="showRepeatPassword ? 'text' : 'password'">
              <template #append>
                <el-icon class="append-click" @click="() => handleShowRepeatPassword()">
                  <Hide v-if="showRepeatPassword"/>
                  <View v-else/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="danger" size="small" @click="() => closeDialog()">Cancelar</el-button>
        <el-button type="success" size="small" @click="createUser(ruleFormRef)">Confirmar</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { House, User, View, Hide } from '@element-plus/icons-vue'
import { ComponentSize, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { globalFetch } from '../../../fetchGlobal';
import urls from '../../../utils/urls';
import { useRouter } from 'vue-router';

  const store = useStore();
  const router = useRouter();

  const emit = defineEmits(['update:visibility'])
  const props = defineProps({
    visibility: {
      type: Boolean,
      required: true,
      default: false,
    },
  })
  //DATA
  const showPassword = ref(false);
  const showRepeatPassword = ref(false);

  interface RuleForm {
    name: string,
    email: string,
    password: string,
    repeatPassword: string
  }

  const formSize = ref<ComponentSize>('default')
  const ruleFormRef = ref<FormInstance>()
  const form = reactive<RuleForm>({
    name: '',
    email: '',
    password: '',
    repeatPassword: ''
  });

  const validateRepeatPass = (_rule: any ,value: any, callback: any) => {
    if(value === '' ) {
      callback(new Error('Por favor insira a senha.'));
    } else if(value !== form.password) {
      callback(new Error('As senhas não correspondem.'));
    } else {
      callback()
    }
  }

  const rules = reactive<FormRules<RuleForm>>({
    name: [
      { required: true, message: 'Por favor insira o seu nome', trigger: 'change' }
    ],
    email: [
      { required: true, message: 'Por favor insira um email', trigger: 'change' }
    ],
    password: [
      { required: true, message: 'Por favor insira uma senha', trigger: 'change' }
    ],
    repeatPassword: [
      { validator: validateRepeatPass, trigger: 'blur' }
    ]
  })
0
  //COMPUTED

  //METHODS
  const showLoading = () => store.dispatch('globalState/showLoading');
  const hideLoading = () => store.dispatch('globalState/hideLoading')
  const updateUserHandler = (user: object) => store.dispatch('loginStore/updateUserLogged', user);

  const clearForm = () => {
    form.name = ''
    form.email = ''
    form.password = ''
    form.repeatPassword = ''
  }
  const handleShowPassword = () => {
    showPassword.value = !showPassword.value;
  }

  const handleShowRepeatPassword = () => {
    showRepeatPassword.value = !showRepeatPassword.value
  }

  const createUser = async (formEl: FormInstance | undefined) => {
    showLoading();
    if(!formEl) return;
    await formEl.validate(async(valid) => {
      if(valid) {
       const payload = {
          name: form.name,
          email: form.email,
          password: form.password
        }

        const result = await globalFetch(urls.CREATE_USER, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(payload)
        });

        const resultJson = await result.json();
        if(resultJson.status === 'Success') {
          updateUserHandler(resultJson.item);

          router.push({ path: '/home' })
        }

        hideLoading();
      }
    })
  }

  
  const closeDialog = () => {
    clearForm();
    emit('update:visibility', false);
  }
</script>

<style scoped>
.append-click:hover {
  cursor: pointer;
}
</style>