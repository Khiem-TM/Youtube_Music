import { createContext, useContext, useReducer, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();
// Nhận state và action để chuyển sang state mới
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

// Trạng thái đầu
const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem("token", state.token);
      fetchUserProfile();
    } else {
      localStorage.removeItem("token");
    }
  }, [state.token]);

  const fetchUserProfile = async () => {
    if (!state.token) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const userData = await authService.getProfile(state.token);
      dispatch({ type: "SET_USER", payload: userData });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      logout();
    }
  };

  // Hàm login
  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await authService.login({ email, password });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data,
      });
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đăng nhập thất bại";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  };

  // Hàm đăng ký
  const register = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await authService.register(userData);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data,
      });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đăng ký thất bại";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
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
      console.error("Token refresh failed:", error);
      logout();
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
