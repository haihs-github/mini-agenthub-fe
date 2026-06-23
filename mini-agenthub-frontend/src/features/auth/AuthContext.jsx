import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null); // khởi tạo context

// BKAV HaiHS : Tạo AuthProvider để quản lý trạng thái đăng nhập và quyền truy cập của người dùng - start
export const AuthProvider = ({ children }) => {
  // Khởi tạo state để lưu thông tin người dùng, token và quyền truy cập
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [permissions, setPermissions] = useState([]);

  //   Khi component AuthProvider được mount, tự động kiểm tra nếu có thông tin người dùng và quyền truy cập đã lưu trong LocalStorage, nếu có thì khôi phục lại vào state
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedPermissions = localStorage.getItem("permissions");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedPermissions) setPermissions(JSON.parse(savedPermissions));
  }, []);

  // Hàm loginSuccess sẽ được gọi khi người dùng đăng nhập thành công, nó sẽ cập nhật state và lưu thông tin vào LocalStorage để duy trì trạng thái đăng nhập ngay cả khi người dùng làm mới trang
  const loginSuccess = (userData, tokenData, permissionData) => {
    setUser(userData);
    setToken(tokenData);
    setPermissions(permissionData);
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("permissions", JSON.stringify(permissionData));
  };
  // BKAV HaiHS : Cap nhat thong tin nguoi dung va token trong context - start
  const login = (userData, tokenData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
    if (tokenData) {
      setToken(tokenData);
      localStorage.setItem("token", tokenData);
    }
  };
  // BKAV HaiHS : Cap nhat thong tin nguoi dung va token trong context - end

  // Hàm logout sẽ xóa thông tin người dùng, token và quyền truy cập khỏi state và LocalStorage, trả về trạng thái chưa đăng nhập
  const logout = () => {
    setUser(null);
    setToken(null);
    setPermissions([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
  };

  // Cung cấp giá trị của context bao gồm thông tin người dùng, token, quyền truy cập và các hàm để đăng nhập và đăng xuất cho các component con có thể sử dụng thông qua useContext(AuthContext)
  return (
    <AuthContext.Provider
      value={{ user, token, permissions, loginSuccess, logout, login }}
    >
      {children}
    </AuthContext.Provider>
  );
};
// BKAV HaiHS : Tạo AuthProvider để quản lý trạng thái đăng nhập và quyền truy cập của người dùng - end

export const useAuth = () => useContext(AuthContext); // xuất context
