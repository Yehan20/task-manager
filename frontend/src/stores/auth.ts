import type { NewUser, UserInfo } from '@/types/type';
import axios from '../axios/axios';
import { defineStore } from "pinia"
import router from '@/router';
import { log } from '@/utils';

export const useAuthStore = defineStore('user', {
    state: () => ({
        currentUser: null as UserInfo | null,
    }),

    actions: {
        async loginUser(email: string, password: string) {
            try {
                log(email, password);

                const response = await axios.post('login', {
                    email,
                    password,
                })

                log(response.data);

                if (response.data) {
                    localStorage.setItem('token', response.data.authorization.token);
                }

                this.currentUser = response.data['data'];

            } catch (error) {
                throw error

            }
        },
        async registerUser(user: NewUser) {
            try {

                const response = await axios.post('register', user)

                if (response.data) {
                    localStorage.setItem('token', response.data.authorization.token);
                }
                this.currentUser = response.data;

            } catch (error) {
                log(error);
                throw error
            }
        },

        async getUser() {
            try {
                const response = await axios.get('me')
                this.currentUser = response.data['data'];

            } catch (error) {

                return error
            }
        },

        async logout() {
            try {
                await axios.post('logout')
                this.currentUser = null;
                localStorage.removeItem('token') // even token remaians it would be blacklisted
                router.push({name:'login'})

            } catch (error) {

                return error
            }
        },

        async refresh() {
            try {
                const response = await axios.post('refresh');
        
                localStorage.setItem('token',response.data.authorization.token);
                
            } catch (error) {

                return error
            }
        },
    },
})