import apiClient from "../../services/apiClient";

// BKAV HaiHS: Goi API Lấy danh sách nhóm - start
export const getGroupsListApi = async (page = 1, limit = 10) => {
  const response = await apiClient.get(`/groups?page=${page}&limit=${limit}`);
  return response.data;
};
// BKAV HaiHS: Goi API Lấy danh sách nhóm - end
