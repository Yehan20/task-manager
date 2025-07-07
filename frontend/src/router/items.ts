import AppLayout from '@/layouts/AppLayout.vue';
import HomeView from '@/views/HomeView.vue';

const items = [
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      guestOnly: true,
    },
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

  {
    path: '/',
    component: AppLayout,
    meta: {
      authRequired: true,
    },
    // HomeView
    children: [
      { path: '', component: HomeView, name: 'home' },
      {
        path: 'task/create',
        name: 'task.create',
        component: () => import('../views/CreateTaskView.vue'),
      },
      {
        path: 'task/:id/edit',
        name: 'task.edit',
        props: true,
        component: () => import('../views/EditTaskView.vue'),
      },
      {
        path: ':pathMatch(.*)*',
        name: 'notfound',
        component: () => import('../views/NotFoundView.vue'),
      },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('../views/NotFoundView.vue'),
  },


];

export default items;
