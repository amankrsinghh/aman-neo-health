import axios from "axios";

// const API = axios.create({
//     baseURL: "http://localhost:9100/api",
// });

const API = axios.create({
    baseURL: "https://api.neohealthcard.com:9100/api",
});

// Add token automatically:
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default API;
