import apiClient from "../../services/apiClient";

// BKAV HaiHS: Gọi API cập nhật thông tin số điện thoại và địa chỉ của tài khoản hiện tại - start
export const updateProfileApi = async (profileData) => {
  const token = localStorage.getItem("token");
  const response = await apiClient.put("/users/profile", profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
// BKAV HaiHS: Gọi API cập nhật thông tin số điện thoại và địa chỉ của tài khoản hiện tại - end
