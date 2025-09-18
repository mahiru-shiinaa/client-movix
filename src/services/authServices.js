import { API_ENDPOINTS } from "../constants";
import { get, post } from "../utils";

// -- Đăng ký
export const register = (userData) =>
  post(API_ENDPOINTS.AUTH.REGISTER, userData);

// -- Đăng nhập
export const login = (userData) => post(API_ENDPOINTS.AUTH.LOGIN, userData);

// -- Đăng Xuất
export const logout = () => post(API_ENDPOINTS.AUTH.LOGOUT);

// -- Kiểm tra Login
export const checkLogin = () => get(API_ENDPOINTS.AUTH.ME);
