import axios from "axios";

const API_BASE_URL = "https://youtube-music.f8team.dev/api";

// Tạo connect instance API
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// req + interceptors
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("Lỗi lấy token");
    return Promise.reject(error);
  }
);

// res + interceptors
api.interceptors.response.use(
  // nếu 2xx --> đơn giản return response để lời gọi API tiếp tục handle data
  (response) => response,
  // Nếu 4xx --> checking
  async (error) => {
    const ogReq = error.config; // Lưu lại yêu cầu gốc đang bị lỗi - 401: Access token hết hạn
    if (error.response?.status === 401 && !ogReq._retry) {
      ogReq._retry = true; // tránh infity loop

      try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            // Gọi API refresh token trực tiếp thay vì qua authService để tránh circular dependency
            const res = await api.post('/auth/refresh-token', { refreshToken });
            const newToken = res.data.access_token;
            localStorage.setItem("token", newToken); //update accessToken
            if (res.data.refresh_token) {
              localStorage.setItem("refreshToken", res.data.refresh_token);
            }
            ogReq.headers.Authorization = `Bearer ${newToken}`; // gán với req gốc
            return api(ogReq); // gọi lại
          }
      } catch (error) {
        console.log("Maybe you need login again :V");
        console.log(error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // back
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

const authService = {
  // credential = information for login
  login: async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    if (res.data.refresh_token) {
      localStorage.setItem("refreshToken", res.data.refresh_token);
    }
    return res;
  },

  register: async (userData) => {
    const res = await api.post("/auth/register", userData);
    if (res.data.refresh_token) {
      localStorage.setItem("refreshToken", res.data.refresh_token);
    }
    return res;
  },

  getProfile: async (token) => {
    const res = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  logout: async (token) => {
    const res = await api.delete("/auth/logout", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    console.log("Dang xuat thanh cong");
    return res;
  },

  refreshToken: async (tokenData) => {
    const res = await api.post("/auth/refresh-token", tokenData);
    if (res.data.refresh_token) {
      localStorage.setItem("refreshToken", res.data.refresh_token);
    }
    return res;
  },

  updateProfile: async (userData, token) => {
    const res = await api.patch("/auth/me", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  changePassword: async (passwordData, token) => {
    const response = await api.patch("/auth/change-password", passwordData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default authService;
