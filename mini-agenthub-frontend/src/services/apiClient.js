import axios from "axios";

// BKAV HaiHS : Khởi tạo cấu hình cấu trúc Axios Instance dùng chung - start
const apiClient = axios.create({
  // Tự động bốc URL Server từ file môi trường .env, nếu không có sẽ lấy mặc định là localhost:3000
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
// BKAV HaiHS : Khởi tạo cấu hình cấu trúc Axios Instance dùng chung - end

// BKAV HaiHS : Tự động gài Token từ LocalStorage - start
apiClient.interceptors.request.use(
  (config) => {
    // Lấy chuỗi Token mã hóa của User được lưu từ LocalStorage dưới trình duyệt
    const token = localStorage.getItem("token");

    // Nếu User đã đăng nhập (có token), tự động nhét mã Bearer Token vào Header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  // Xử lý kịch bản nếu quá trình đóng gói request xảy ra lỗi hệ thống phần cứng/mạng nội bộ
  (error) => Promise.reject(error),
);
// BKAV HaiHS : Tự động gài Token từ LocalStorage - end

export default apiClient;
