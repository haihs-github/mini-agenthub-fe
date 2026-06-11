import React, { useState, useEffect } from "react";
import { loginApi } from "../authApi";
import { useAuth } from "../AuthContext";
import { useToast } from "../../../components/Toast"; //
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { FiShield, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

// BKAV HaiHS : Component Form Đăng nhập - start
const LoginForm = () => {
  const { loginSuccess } = useAuth();
  const { showToast } = useToast(); //

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // kiểm tra email mỗi khi email thay đổi
  useEffect(() => {
    if (email === "") {
      setEmailError("");
    } else if (!emailRegex.test(email)) {
      setEmailError("Email không đúng định dạng");
    } else {
      setEmailError("");
    }
  }, [email]);

  //   Xử lý submit form đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || !email || !password) return;

    setIsLoading(true);
    setApiError("");

    try {
      const data = await loginApi(email, password);
      // Đổi từ data.user thành data.data.user
      loginSuccess(data.data.user, data.data.token, data.data.user.permissions);

      // Bắn Toast thành công cực kỳ đơn giản!
      showToast("Đăng nhập hệ thống thành công!", "success");

      window.location.href = "/chat";
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Thông tin đăng nhập không chính xác hoặc lỗi mạng!";

      setApiError("Thông tin đăng nhập không chính xác");

      // BẰNG CHỨNG SỨC MẠNH: Chỉ cần gọi đúng 1 dòng này, UI tự xử lý trượt mở
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* BKAV HaiHS: Đổi màu nền tổng và màu chữ cơ bản - Sáng: bg-gray-50 text-gray-900 / Tối: bg-[#0b0f19] text-white */
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] bg-radial from-gray-100 to-gray-50 dark:from-[#151d30] dark:to-[#0b0f19] flex flex-col justify-between items-center p-6 text-gray-900 dark:text-white font-sans relative overflow-hidden transition-colors duration-300">
      {/* THANH ĐẦU TRANG */}
      <div className="w-full max-w-7xl flex justify-between items-center">
        {/* BKAV HaiHS: Chữ thương hiệu Agent Hub đầu trang */}
        <span className="text-lg font-bold tracking-wider text-gray-900 dark:text-white transition-colors duration-300">
          Agent Hub
        </span>
        {/* BKAV HaiHS: Nút chuyển hướng quay lại trang chủ */}
        <a
          href="/"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ← Quay lại trang chủ
        </a>
      </div>

      {/*KHUNG FORM ĐĂNG NHẬP CHÍNH */}
      {/* BKAV HaiHS: Sửa màu Card đăng nhập chính - Sáng: bg-white viền xám / Tối: bg-[#161b26]/80 viền cũ */}
      <div className="w-full max-w-md bg-white dark:bg-[#161b26]/80 border border-gray-200 dark:border-[#232d42] rounded-2xl p-10 shadow-xl dark:shadow-2xl backdrop-blur-md my-auto transition-colors duration-300">
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-widest text-blue-500 uppercase">
            Truy Cập Bảo Mật
          </span>
          <h2 className="text-3xl font-bold mt-2 tracking-tight">Đăng Nhập</h2>
          {/* BKAV HaiHS: Sửa text phụ mô tả */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">
            Chào mừng bạn trở lại Agent Hub. Vui lòng nhập thông tin để truy cập
            bảng điều khiển.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* HIỂN THỊ CHỮ ĐỎ BÁO LỖI TRÊN Ô EMAIL KHI LOGIN THẤT BẠI */}
          {apiError && (
            <div className="text-red-500 text-sm font-medium flex items-center gap-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-fade-in">
              <FiAlertCircle />
              {apiError}
            </div>
          )}

          {/* Ô NHẬP EMAIL */}
          <div className="relative">
            {/* BKAV HaiHS: Sửa nhãn tên trường nhập */}
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors duration-300">
              Địa chỉ Email
            </label>
            {/* BKAV HaiHS: Sửa màu nền ô input, text, placeholder và viền của trường email */}
            <input
              type="text"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={`w-full bg-gray-50 dark:bg-[#0f131f] border rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none transition-all duration-300 ${emailError ? "border-red-500/60 focus:border-red-500" : "border-gray-200 dark:border-[#232d42] focus:border-blue-500"}`}
            />
            {/* THÔNG BÁO ĐỊNH DẠNG EMAIL CHƯA ĐÚNG */}
            {emailError && (
              <span className="text-xs text-red-500 dark:text-red-400 mt-1.5 block animate-slide-up">
                {emailError}
              </span>
            )}
          </div>

          {/* Ô NHẬP MẬT KHẨU */}
          <div>
            {/* BKAV HaiHS: Sửa nhãn mật khẩu */}
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors duration-300">
              Mật khẩu
            </label>
            <div className="relative">
              {/* BKAV HaiHS: Sửa màu nền, text, placeholder và viền trường mật khẩu */}
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-gray-50 dark:bg-[#0f131f] border border-gray-200 dark:border-[#232d42] focus:border-blue-500 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none transition-all pr-12 duration-300"
              />
              {/* BKAV HaiHS: Điều chỉnh màu nút ẩn hiện con mắt */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* NÚT SUBMIT XỬ LÝ TRẠNG THÁI LOADING & CHẶN CLICK NHIỀU LẦN */}
          <button
            type="submit"
            disabled={isLoading || !!emailError || !email || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/40 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-xl transition-all flex justify-center items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
          >
            {isLoading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin text-lg" />
                <span>Đang xác thực thông tin...</span>
              </>
            ) : (
              <span>Tiếp tục vào Hệ thống</span>
            )}
          </button>
        </form>
      </div>

      {/* THANH CHÂN TRANG */}
      {/* BKAV HaiHS: Điều chỉnh màu chữ và dấu phân cách tròn dưới chân trang */}
      <div className="w-full max-w-7xl flex justify-center items-center gap-6 text-xs text-gray-400 dark:text-gray-500 tracking-wider transition-colors duration-300">
        <div className="flex items-center gap-1.5">
          <FiShield />
          <span>MÃ HÓA ĐẦU CUỐI (E2EE)</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300"></div>
        <div className="flex items-center gap-1.5">
          <FiCheckCircle />
          <span>CHỨNG NHẬN ISO 27001</span>
        </div>
      </div>
    </div>
  );
};
// BKAV HaiHS : Component Form Đăng nhập - start
export default LoginForm;
