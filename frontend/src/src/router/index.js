import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Dashboard from '@/components/Dashboard'
import Settings from '@/components/Settings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    }

  ]
})
