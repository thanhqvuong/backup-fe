import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function StaffLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[\w.+-]+@gmail\.com$/;

    if (!emailRegex.test(form.email)) newErrors.email = "Email phải có đuôi @gmail.com.";
    if (!form.password) newErrors.password = "Vui lòng nhập mật khẩu.";
    if (!form.role) newErrors.role = "Vui lòng chọn vai trò.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setProgress(0);

    try {
      const res = await axios.post("https://backend-njgx.onrender.com/admin-login", form, {
        withCredentials: true,
      });

      toast.success(res.data.message || "Đăng nhập thành công!");

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      setTimeout(() => {
        setIsLoading(false);
        navigate("/admin/dashboard");
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      toast.error(message);
      setIsLoading(false);
    }
  };

  // Auto-refresh access token mỗi 3h
  useEffect(() => {
    const interval = setInterval(async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;
      try {
        const res = await axios.post(
          "https://backend-njgx.onrender.com/admin-login/refresh-token",
          { refreshToken },
          { withCredentials: true }
        );
        localStorage.setItem("accessToken", res.data.accessToken);
      } catch (err) {
        console.error("Refresh token thất bại");
      }
    }, 1000 * 60 * 60 * 3); // mỗi 3 giờ

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8">
      <ToastContainer position="top-right" />

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          <p className="text-white text-2xl font-bold mb-4">ĐANG XỬ LÝ</p>
          <div className="w-96 border-4 border-black p-1">
            <div
              className="bg-green-500 text-white text-sm text-center transition-all duration-100"
              style={{ width: "100%" }}
            >
              Loading...
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-8 mt-10"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập Admin</h2>

        <div className="mb-4">
          <input
            name="email"
            type="email"
            placeholder="Email *"
            onChange={handleChange}
            value={form.email}
            className={`bg-gray-100 text-black placeholder-gray-700 px-3 py-2 rounded border w-full ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="mb-4 relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu *"
            onChange={handleChange}
            value={form.password}
            className={`bg-gray-100 text-black placeholder-gray-700 px-3 py-2 rounded border w-full ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          <span
            className="absolute right-3 top-2 cursor-pointer text-sm text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ẩn" : "Hiện"}
          </span>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium mb-1">Vai trò</label>
          <div className="flex gap-4 mt-1">
            {[
              { value: "manager", label: "Quản lý" },
              { value: "agent", label: "Nhân viên" },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="role"
                  value={value}
                  onChange={handleChange}
                  checked={form.role === value}
                />
                {label}
              </label>
            ))}
          </div>
          {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
          disabled={isLoading}
        >
          ĐĂNG NHẬP
        </button>
      </form>
    </div>
  );
}
