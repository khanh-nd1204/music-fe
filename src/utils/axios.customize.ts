import axios from "axios";
import NProgress from 'nprogress';
import {refreshTokenAPI} from "../services/auth.service.ts";

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

instance.interceptors.request.use(config => {
    NProgress.start();
    const token = window?.localStorage?.getItem('access_token');
    if (token) config.headers.Authorization = 'Bearer ' + token;
    return config;
}, error => {
    NProgress.done();
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    NProgress.done();
    return response.data?.data || response;
}, async error => {
    NProgress.done();
    const { config, response } = error;
    if (response?.status === 401 && !config.headers['x-no-retry']) {
        const res = await refreshTokenAPI();
        if (res?.data) {
            window.localStorage.setItem('access_token', res.data.access_token);
            config.headers.Authorization = 'Bearer ' + res.data.access_token;
            config.headers['x-no-retry'] = 'true';
            return instance.request(config);
        }
    }
    if (response?.status === 403 && config.url === '/api/v1/auth/refresh') {
        if (!['/', '/login'].includes(window.location.pathname)) {
            window.location.href = '/login';
        }
    }
    return response?.data || error;
});

export default instance
