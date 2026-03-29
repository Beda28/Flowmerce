import axios from "axios";

let isRefreshing = false;

const client = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL ? `http://${import.meta.env.VITE_HOST_URL}/api` : "/api",
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("FM_Access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorDetail = error.response?.data?.detail;
    const status = error.response?.status;

    if (
      status === 401 && 
      errorDetail?.code === "TOKEN_EXPIRED" && 
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return Promise.reject(error);
      }
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("FM_Refresh");
        const baseURL = import.meta.env.VITE_HOST_URL ? `http://${import.meta.env.VITE_HOST_URL}` : "";
        
        const res = await axios.post(`${baseURL}/api/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem("FM_Access", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        isRefreshing = false;
        return client(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        localStorage.removeItem("FM_Access");
        localStorage.removeItem("FM_Refresh");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    if (status === 401 && errorDetail?.msg) {
      if (!originalRequest._retry) {
        alert(errorDetail.msg);
      }
    }
    
    return Promise.reject(error);
  }
);

export default client;
