import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,  
  headers: {
    "x-api-key": import.meta.env.VITE_API_SECRET_KEY,
  }
});

export default api;
