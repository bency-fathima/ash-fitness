import axios from "axios";
import { ENV } from "../utils/env";

const axiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

export const axiosFile = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});


// Request Interceptor
const requestInterceptor = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
};

const requestErrorInterceptor = (error) => Promise.reject(error);

axiosInstance.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
axiosFile.interceptors.request.use(requestInterceptor, requestErrorInterceptor);

// Response Interceptor
const responseInterceptor = (response) => {
  const newAccessToken = response.headers["x-access-token"];
  if (newAccessToken) {
    localStorage.setItem("token", newAccessToken);
  }
  return response.data;
};

const responseErrorInterceptor = (error) => {
  if (error.response?.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
axiosFile.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export default axiosInstance;
