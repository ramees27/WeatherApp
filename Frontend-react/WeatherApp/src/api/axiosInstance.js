// src/api/axiosInstance.js
import axios from 'axios';

const axiosapi = axios.create({
  baseURL: 'https://localhost:7093/api/', // Replace with your actual backend base URL
});

export default axiosapi;
