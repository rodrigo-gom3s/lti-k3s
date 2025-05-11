import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Dashboard from '@/components/dashboard/Dashboard.vue'
import Namespaces from '@/components/namespaces/Namespaces.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/namespaces',
      name: 'namespaces',
      component: Namespaces,
    }
  ],
})

export default router
