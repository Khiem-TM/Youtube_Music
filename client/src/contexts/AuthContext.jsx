import { createContext, useContext, useReducer, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

// Trạng thái đầu
const initialState = {
  user: null,
  token: localStorage.getItem("token"), // Nếu vẫn đang trong session (token vẫn bị lưu trong storage --> dùng luôn token hiện có )
  loading: false,
  error: null,
};

// Nhận state và action để chuyển sang state mới --> handle các action như dưới (update state)
const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.access_token,
        loading: false,
        error: null,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // lấy userdata từ server
  const fetchUserProfile = async () => {
    // double check
    if (!state.token) return;

    try {
      // gửi về reducer --> cf trạng thái loading
      dispatch({ type: "SET_LOADING", payload: true });
      const userData = await authService.getProfile(state.token); //call api
      // gửi về reducer --> cf trạng thái set user
      dispatch({ type: "SET_USER", payload: userData });
    } catch (error) {
      console.error("Không thể fetch user profile", error);
      logout();
    }
  };

  // useEffect đồng bộ token từ ReactState --> localStorage (fetch or remove)
  useEffect(() => {
    if (state.token) {
      localStorage.setItem("token", state.token);
      fetchUserProfile();
    } else {
      localStorage.removeItem("token");
    }
  }, [state.token]);

  // Hàm login
  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await authService.login({ email, password });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Đăng nhập thất bại",
      });
      throw error;
    }
  };

  // Hàm đăng ký

  const register = async (userdata) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await authService.register(userdata);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Đéo được ok",
      });
      throw error;
    }
  };

  // Hàm đăng xuất
  const logout = async () => {
    if (state.token) {
      try {
        await authService.logout(state.token);
      } catch (error) {
        console.error("Logout API error:", error);
      }
    }
    dispatch({ type: "LOGOUT" });
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const response = await authService.refreshToken({ refreshToken });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data,
      });
      return response.data.access_token;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await authService.updateProfile(profileData, state.token);
      // Call lại để đảm bảo fe lấy lại thông tin user Profile đầy đủ sau cập nhật từ BE
      await fetchUserProfile();
      dispatch({ type: "SET_LOADING", payload: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Cập nhật thất bại";
      dispatch({ type: "SET_ERROR", payload: error });
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await authService.changePassword(passwordData, state.token);
      dispatch({ type: "SET_LOADING", payload: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đổi mật khẩu thất bại";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  };

  // Mọi component con có thể gọi hàm --> mini redux =))
  const value = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    fetchUserProfile,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthProvider");
  }
  return context;
};
