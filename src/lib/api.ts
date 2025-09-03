import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // set on Vercel
    withCredentials: false, // you’re not using cookies
    headers: { 'Content-Type': 'application/json' },
});


export default api;
