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

const searchService = {
  // Gợi ý tìm kiếm
  getSuggestions: async (query) => {
    try {
      const res = await api.get("/search/suggestions", {
        params: { q: query }
      });
      return res.data;
    } catch (error) {
      console.error("Lỗi lấy gợi ý tìm kiếm:", error);
      throw error;
    }
  },

  // Kết quả tìm kiếm đầy đủ
  search: async (query, limit = 20, page = 1) => {
    try {
      const res = await api.get("/search", {
        params: { 
          q: query,
          limit: limit,
          page: page
        }
      });
      return res.data;
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      throw error;
    }
  }
};

export default searchService;