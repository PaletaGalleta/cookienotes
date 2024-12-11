import axios from "axios";

const api = axios.create({
    baseURL: "/api", // Proxy this to the backend
});

export default api;
