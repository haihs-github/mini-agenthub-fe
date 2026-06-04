import apiClient from "../../services/apiClient";

// BKAV HaiHS : Lấy danh sách user phân trang - start
export const getUsersApi = async (page = 1, limit = 10) => {
  const response = await apiClient.get(`/users?page=${page}&limit=${limit}`);
  return response.data;
};
// BKAV HaiHS : Lấy danh sách user phân trang - end

// BKAV HaiHS : Thêm mới người dùng - start
export const createUserApi = async (userData) => {
  const response = await apiClient.post("/users/create", userData);
  return response.data;
};
// BKAV HaiHS : Thêm mới người dùng - end

// BKAV HaiHS : Cập nhật người dùng theo ID - start
export const updateUserApi = async (id, userData) => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};
// BKAV HaiHS : Cập nhật người dùng theo ID - end

// BKAV HaiHS : Lấy danh sách nhóm - start
export const getGroupsApi = async (page = 1, limit = 10) => {
  const response = await apiClient.get(`/groups?page=${page}&limit=${limit}`);
  return response.data;
};
// BKAV HaiHS : Lấy danh sách nhóm - end
