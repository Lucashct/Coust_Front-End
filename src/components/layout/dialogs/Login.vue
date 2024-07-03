<template>
  <el-dialog
    :model-value="props.visibility"
    title="Login"
    width="400"
    @update:modelValue="emit('update:visibility', $event)"
    :before-close="closeDialog"
  >
    <el-form
      :model="form"
      :hide-required-asterisk="true"
      :size="formSize"
      :rules="rules"
      ref="ruleFormRef"
      label-width="auto"
      style="max-width: 600px; padding: 20px"
      label-position="top"
    >
      <el-form-item label="E-mail" prop="email">
        <el-input v-model="form.email" type="email"/>
      </el-form-item>

      <el-form-item label="Senha" prop="password">
        <el-input v-model="form.password" :type="isShowPassword ? 'text' : 'password'">
          <template #append>
            <el-icon class="append-click" @click="showPassword">
              <Hide v-if="isShowPassword"/>
              <View v-else/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="login(ruleFormRef)" type="success" size="small">Fazer login</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {Hide, View} from '@element-plus/icons-vue'
import { ComponentSize, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { globalFetch } from '../../../fetchGlobal';
import { useRouter } from 'vue-router';

import urls from '../../../utils/urls';
  const store = useStore();
  const router = useRouter();

  const emit = defineEmits(['update:visibility'])
  const props = defineProps({
    visibility: {
      type: Boolean,
      required: true,
      default: false
    }
  });

  const isShowPassword = ref(false);

  interface Form {
    email: string
    password: string
  }

  const formSize = ref<ComponentSize>('default');
  const ruleFormRef = ref<FormInstance>();
  const form = reactive<Form>({
    email: '',
    password: ''
  })

  const rules = reactive<FormRules<Form>>({
    email: [
      { required: true, type: 'email', message: 'Insira um email válido', trigger: 'blur' }
    ],
    password: [
      { required: true, message: 'Insira sua senha de login', trigger: 'blur' }
    ]
  });

  const showLoading = () => store.dispatch('globalState/showLoading');
  const hideLoading = () => store.dispatch('globalState/hideLoading');
  const updateUserHandler = (user: object) => store.dispatch('loginStore/updateUserLogged', user);

  const showPassword = () => {
    isShowPassword.value = !isShowPassword.value
  }

  const login = async(formEl: FormInstance | undefined) => {
    showLoading();
    if(!formEl) return;
    await formEl.validate(async (valid) => {
      if(valid) {
        const payload = {
          email: form.email,
          password: form.password
        }

        const result = await globalFetch(urls.LOGIN, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(payload)
        });

        const resultJson = await result.json();

        if(resultJson.status === 'Success') {
          updateUserHandler(resultJson.item);
          closeDialog();

          router.push({ path: '/home' });
        }

        hideLoading();
      }
    })
  }

  const closeDialog = () => {
    emit('update:visibility', false);
  }
</script>

<style scoped>
.append-click:hover {
  cursor: pointer;
}
</style>