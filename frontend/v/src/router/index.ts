import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import BattleView from '../views/BattleView.vue';
import WorkshopView from '../views/WorkshopView.vue';
import MarketView from '../views/MarketView.vue';
import TavernView from '../views/TavernView.vue';
import MinesView from '../views/MinesView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/battle', component: BattleView },
  { path: '/workshop', component: WorkshopView },
  { path: '/market', component: MarketView },
  { path: '/tavern', component: TavernView },
  { path: '/mines', component: MinesView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;