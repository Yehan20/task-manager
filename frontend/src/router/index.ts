import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth';
import { log } from '@/utils';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        authRequired: true,
      }

    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        guestOnly: true,
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),

    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),

    },
  ],
})

// Before each
router.beforeEach( async function (to, from) {

  // update title based on the route name 
  document.title = `Task manager ${to.name?.toString()}`;

  log('run');

  const auth = useAuthStore();

  await auth.getUser();
  log(auth.currentUser);

  // Auth required gaurd should check for user in the store if not there fetch if fails redirect back to login\
  if (to.meta.authRequired && !auth.currentUser) {
    return {
       name:'login'
    }
  }

  if (to.meta.guestOnly && auth.currentUser) {
    return {
      name: 'home'
    }
  }

  return true;
});

export default router
