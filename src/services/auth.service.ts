import axios from "../utils/axios.customize.ts";
import {UserType} from "../types/user.type.ts";

const registerUserAPI = (data: UserType) => {
    const URL_BACKEND = "/api/v1/auth/register";
    return axios.post(URL_BACKEND, data);
}

const loginUserAPI = (data: UserType) => {
    const URL_BACKEND = "/api/v1/auth/login";
    return axios.post(URL_BACKEND, data);
}

const fetchAccountAPI = () => {
    const URL_BACKEND = "/api/v1/auth/account";
    return axios.get(URL_BACKEND);
}

const logoutUserAPI = () => {
    const URL_BACKEND = "/api/v1/auth/logout";
    return axios.post(URL_BACKEND);
}

const refreshTokenAPI = () => {
    const URL_BACKEND = "/api/v1/auth/refresh";
    return axios.get(URL_BACKEND);
}

export {registerUserAPI, loginUserAPI, fetchAccountAPI, logoutUserAPI, refreshTokenAPI};