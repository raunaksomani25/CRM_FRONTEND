import axios from "axios";

const api = axios.create({
  baseURL: process.env.VITE_API_URL,
  withCredentials: true,  
  headers: {
    "x-api-key": process.env.VITE_API_SECRET_KEY,
  }
});

export default api;
