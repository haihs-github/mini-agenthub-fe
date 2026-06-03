import apiClient from "../../services/apiClient";

// BKAV HaiHS : Lấy danh sách user phân trang - start
export const getUsersApi = async (page = 1, limit = 10) => {
  const response = await apiClient.get(`/users?page=${page}&limit=${limit}`);
  return response.data;
};
// BKAV HaiHS : Lấy danh sách user phân trang - end
