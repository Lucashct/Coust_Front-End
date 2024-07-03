import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store'
import money from 'v-money3';

import GoogleSignInPlugin from "vue3-google-signin";

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.use(store);
app.use(money);
app.use(GoogleSignInPlugin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
});
app.mount('#app');
