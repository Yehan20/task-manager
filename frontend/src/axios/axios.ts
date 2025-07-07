import router from '@/router';
import axios from 'axios';

const END_POINT = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/';

//Axios instance to overide default configuration
const instance = axios.create({
  baseURL: END_POINT,
});

//Configure Request Interceptors to pass the token to the requests
instance.interceptors.request.use(
  (config) => {
    console.log('Axios Request interceptor run');

    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (err) => {
    console.log('Axios Request interceptor fails');

    return Promise.reject(err);
  },
);

// Configure Respone Interceptor to modify the response payload and hanle refresh token
instance.interceptors.response.use(
  function (response) {
    console.log('Axios Response interceptor run');

    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    console.log('axios fails', originalRequest);
    const requestUrl = originalRequest?.url || '';

    const skipAuthPaths = ['login', 'register', 'refresh']; // prevent from calling token from this end points

    console.log('from axios', requestUrl);

    // Check if user aunthenticated  and its not a fresh request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !skipAuthPaths.some((path) => requestUrl.includes(path))
    ) {
      originalRequest._retry = true;

      console.log('send token', originalRequest);

      try {
        // send request to end point with token. which get added in request interceptor
        const response = await instance.post('refresh');

        // Save the token and add it to the previous request
        localStorage.setItem('token', response.data.authorization.token);
        originalRequest.headers['Authorization'] = `Bearer ${response.data.authorization.token}`;

        return axios(originalRequest);
      } catch (error) {
        // Handle refresh token error or redirect to login
        console.log('error from interceptor', error);
        router.replace('/login');
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
