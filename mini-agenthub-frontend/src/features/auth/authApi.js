import apiClient from "../../services/apiClient";

// BKAV HaiHS : gọi API Đăng nhập - start
export const loginApi = async (email, password) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};
// BKAV HaiHS : gọi API Đăng nhập - end
