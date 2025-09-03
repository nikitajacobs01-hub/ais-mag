import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // now uses env variable
    withCredentials: false, // no cookies for now
});

export default api;
