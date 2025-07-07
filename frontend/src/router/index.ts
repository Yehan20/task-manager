import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import formatLabel, { log } from '@/utils';
import items from './items';

const router = createRouter({
  history: createWebHistory(),
  routes: items,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  },
});

// Before each
router.beforeEach(async function (to, from) {
  // update title based on the route name
  document.title = `Task Manager 1.1 | ` + formatLabel(to.name?.toString());

  log('run before each hook');

  const auth = useAuthStore();

  log(auth.currentUser);

  // Auth required gaurd should check for user in the store if not there fetch if fails redirect back to login\
  if (to.meta.authRequired && !auth.currentUser) {
    await auth.getUser();

    if (!auth.currentUser) {
      return {
        name: 'login',
      };
    }
  }

  // if (to.meta.guestOnly && auth.currentUser) {
  //   return {
  //     name: 'home'
  //   }
  // }

  return true;
});


// after navigation is successfull remove the loader
router.afterEach((to, from) => {
  // 
  const mainloader = document.querySelector('#main-loader');
  if (mainloader) {
    mainloader.remove();
  }

})


export default router;
