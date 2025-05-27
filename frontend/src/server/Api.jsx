import axios from "axios";

const api = axios.create({
    baseURL: "https://admin-js-tau.vercel.app",
    withCredentials: true,
});

export default api;