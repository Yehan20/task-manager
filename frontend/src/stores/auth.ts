import type { NewUser, UserInfo } from '@/types/type';
import axios from '../axios/axios';
import { defineStore } from 'pinia';
import router from '@/router';
import { useTasks } from './task';

export const useAuthStore = defineStore('user', {
  state: () => ({
    currentUser: null as UserInfo | null,
  }),

  actions: {
    async loginUser(email: string, password: string) {
      try {
        const response = await axios.post('login', {
          email,
          password,
        });

        if (response.data) {
          localStorage.setItem('token', response.data.authorization.token);
        }

        this.currentUser = response.data['data'];
      } catch (error) {
        throw error;
      }
    },
    async registerUser(user: NewUser) {
      try {
        const response = await axios.post('register', user);

        if (response.data) {
          localStorage.setItem('token', response.data.authorization.token);
        }
        this.currentUser = response.data.data;
      } catch (error) {
        throw error;
      }
    },

    async getUser() {
      try {
        const response = await axios.get('me');
        this.currentUser = response.data['data'];
      } catch (error) {
        return error;
      }
    },

    async logout() {
      const taskStore = useTasks();
      try {
        await axios.post('logout');
        router.push({ name: 'login' });
        this.currentUser = null;
        console.log('store is running');
        taskStore.$reset();
        localStorage.removeItem('token'); // even token remaians it would be blacklisted
        console.log('store is end');
      } catch (error) {
        return error;
      }
    },

    async refresh() {
      try {
        const response = await axios.post('refresh');

        localStorage.setItem('token', response.data.authorization.token);
      } catch (error) {
        return error;
      }
    },
  },
});
