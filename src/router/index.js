import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Dashboard from '@/components/dashboard/Dashboard.vue'
import Namespaces from '@/components/namespaces/Namespaces.vue'
import Pods from '@/components/pods/Pods.vue'
import Login from '@/components/login/Login.vue'
import Deployments from '@/components/deployments/Deployments.vue'
import Services from '@/components/services/Services.vue'
import { useAuthStore } from '@/stores/auth'

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
    },
    {
      path: '/pods',
      name: 'pods',
      component: Pods,
    },
    {
      path: '/deployments',
      name: 'deployments',
      component: Deployments,
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/services',
      name: 'services',
      component: Services
    }
  ],
})

let handlingFirstRoute = true

router.beforeEach(async (to, from, next) => {
  const storeAuth = useAuthStore()
  if (handlingFirstRoute) {
    handlingFirstRoute = false
    await storeAuth.restoreLogin()
  }

  if(to.name != 'login' && !storeAuth.ip){
    next({ name: 'login' })
    return
  }
  next()
})

export default router
