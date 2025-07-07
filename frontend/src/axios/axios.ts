import router from '@/router';
import { log } from '@/utils';
import axios, { type AxiosResponse } from 'axios';

const END_POINT = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/';

//Axios instance to overide default configuration
const instance = axios.create({
  baseURL: END_POINT,
});

//Configure Request Interceptors to pass the token to the requests
instance.interceptors.request.use(
  (config) => {
    log('Axios Request interceptor run');

    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (err) => {
    log('Axios Request interceptor fails');

    return Promise.reject(err);
  },
);

// Configure Respone Interceptor to modify the response payload
instance.interceptors.response.use(
  function (response) {
    log('Axios Response interceptor run');

    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    console.log('axios fauils',originalRequest);

    // Check if user aunthenticated  and its not a fresh request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

        console.log('send token',originalRequest);

      try {
        // send request to end point with token. which get added in request interceptor
        const response = await instance.post('refresh');
     //   const { token } = response.data;

        localStorage.setItem('token', response.data.authorization.token);

        return axios(originalRequest);
      } catch (error) {
        // Handle refresh token error or redirect to login
        log('error from interceptor', error);
        router.replace('/login');
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
