import axios, { type AxiosResponse } from 'axios';

const END_POINT = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/';

//Axios instance to overide default configuration
const instance = axios.create({
    baseURL: END_POINT,
})

//Configure Request Interceptors to pass the token to the requests
instance.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    return config;
}, (err) => {
   return  Promise.reject(err);
})

// Configure Respone Interceptor to modify the response payload
instance.interceptors.response.use(function (response) {

    // let data = response.data;
    // let code = response.status;

    return response;

}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.log('runs');
    
    return Promise.reject(error);
});



export default instance;