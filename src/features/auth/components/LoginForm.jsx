import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "@/features/auth/authApi";
import { useAuth } from "@/features/auth/AuthContext";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/context/LanguageContext"; // BKAV HaiHS: Import hook ngôn ngữ
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { FiShield, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

// BKAV HaiHS : Component Form Đăng nhập - start
const LoginForm = () => {
  const { loginSuccess } = useAuth();
  const { showToast } = useToast();
  const { t, tError } = useLanguage(); // BKAV HaiHS: Khai báo hàm dịch thuật t()
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (email === "") {
      setEmailError("");
    } else if (!emailRegex.test(email)) {
      setEmailError(t("email_error") || "Email không đúng định dạng");
    } else {
      setEmailError("");
    }
  }, [email, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || !email || !password) return;

    setIsLoading(true);
    setApiError("");

    try {
      const data = await loginApi(email, password);
      loginSuccess(data.data.user, data.data.token, data.data.user.permissions);

      showToast(
        t("login_success") || "Đăng nhập hệ thống thành công!",
        "success",
      );

      navigate("/chat");
    } catch (error) {
      const errorMsg = tError(error, "login_failed_msg");
      setApiError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] bg-radial from-gray-100 to-gray-50 dark:from-[#151d30] dark:to-[#0b0f19] flex flex-col justify-between items-center p-6 text-gray-900 dark:text-white font-sans relative overflow-hidden transition-colors duration-300">
      {/* THANH ĐẦU TRANG */}
      <div className="w-full max-w-7xl flex justify-between items-center">
        <span className="text-lg font-bold tracking-wider text-gray-900 dark:text-white transition-colors duration-300">
          Agent Hub
        </span>
      </div>

      {/* KHUNG FORM ĐĂNG NHẬP CHÍNH */}
      <div className="w-full max-w-md bg-white dark:bg-[#161b26]/80 border border-gray-200 dark:border-[#232d42] rounded-2xl p-10 shadow-xl dark:shadow-2xl backdrop-blur-md my-auto transition-colors duration-300">
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-widest text-blue-500 uppercase">
            {t("secure_access") || "Truy Cập Bảo Mật"}
          </span>
          <h2 className="text-3xl font-bold mt-2 tracking-tight">
            {t("login_title") || "Đăng Nhập"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">
            {t("login_desc") ||
              "Chào mừng bạn trở lại Agent Hub. Vui lòng nhập thông tin để truy cập bảng điều khiển."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {apiError && (
            <div className="text-red-500 text-sm font-medium flex items-center gap-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-fade-in">
              <FiAlertCircle />
              {apiError}
            </div>
          )}

          {/* Ô NHẬP EMAIL */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors duration-300">
              {t("email_label") || "Địa chỉ Email"}
            </label>
            <input
              type="text"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={`w-full bg-gray-50 dark:bg-[#0f131f] border rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none transition-all duration-300 ${emailError ? "border-red-500/60 focus:border-red-500" : "border-gray-200 dark:border-[#232d42] focus:border-blue-500"}`}
            />
            {emailError && (
              <span className="text-xs text-red-500 dark:text-red-400 mt-1.5 block animate-slide-up">
                {emailError}
              </span>
            )}
          </div>

          {/* Ô NHẬP MẬT KHẨU */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors duration-300">
              {t("password_label") || "Mật khẩu"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("pwd_placeholder") || "Nhập mật khẩu của bạn"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-gray-50 dark:bg-[#0f131f] border border-gray-200 dark:border-[#232d42] focus:border-blue-500 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none transition-all pr-12 duration-300"
              />
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

          <button
            type="submit"
            disabled={isLoading || !!emailError || !email || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/40 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-xl transition-all flex justify-center items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
          >
            {isLoading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin text-lg" />
                <span>{t("verifying") || "Đang xác thực thông tin..."}</span>
              </>
            ) : (
              <span>{t("login_submit_btn") || "Tiếp tục vào Hệ thống"}</span>
            )}
          </button>
        </form>
      </div>

      {/* THANH CHÂN TRANG */}
      <div className="w-full max-w-7xl flex justify-center items-center gap-6 text-xs text-gray-400 dark:text-gray-500 tracking-wider transition-colors duration-300">
        <div className="flex items-center gap-1.5">
          <FiShield />
          <span>{t("footer_e2ee") || "MÃ HÓA ĐẦU CUỐI (E2EE)"}</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300"></div>
        <div className="flex items-center gap-1.5">
          <FiCheckCircle />
          <span>{t("footer_iso") || "CHỨNG NHẬN ISO 27001"}</span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
