import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,  
  headers: {
    "x-api-key": process.env.REACT_APP_API_SECRET_KEY,
  }
});

export default api;
