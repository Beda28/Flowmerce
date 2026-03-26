import axios from "axios";

const client = axios.create({
  baseURL: `http://${import.meta.env.VITE_HOST_URL}/api`,
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

    if (
      error.response?.status === 401 && 
      errorDetail?.code === "TOKEN_EXPIRED" && 
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("FM_Refresh");

        const res = await axios.post(`http://${import.meta.env.VITE_HOST_URL}/api/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem("FM_Access", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        if (axios.isAxiosError(refreshError)) {
          const msg = refreshError.response?.data?.detail?.msg || "세션이 만료되었습니다. 다시 로그인하세요.";
          alert(msg);
        } else alert("알 수 없는 오류가 발생했습니다.");
        localStorage.removeItem("FM_Access");
        localStorage.removeItem("FM_Refresh");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    } if (error) {
      const msg = error.response?.data?.detail?.msg;
      alert(msg);
    }
    return Promise.reject(error);
  }
);

export default client;
