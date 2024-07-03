import { createRouter, createMemoryHistory } from 'vue-router';

//IMPORTS DOS COMPONENTES
import Home from '../components/Home/Home.vue';
import Cards from '../components/Cards/Cards.vue';
import Wellcome from '../components/Wellcome/Wellcome.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      name: 'Wellcome',
      component: Wellcome
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/cards',
      name: 'Cards',
      component: Cards
    }
  ]
})

export default router;