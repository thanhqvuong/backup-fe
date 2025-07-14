import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function StaffRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Lấy danh sách staff đã đăng ký (GET)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("https://backend-njgx.onrender.com/admin-registers");
        console.log("Fetched admin data:", res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^([A-ZÀ-Ỹ][a-zà-ỹ]*)(\s[A-ZÀ-Ỹ][a-zà-ỹ]*)+$/;
    const emailRegex = /^[\w.+-]+@gmail\.com$/;
    const phoneRegex = /^0\d{9}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s;])[^ \s;]{5,32}$/;

    if (!nameRegex.test(form.name)) newErrors.name = "Họ và tên phải viết hoa chữ cái đầu mỗi từ, không chứa số hoặc ký tự đặc biệt.";
    if (!emailRegex.test(form.email)) newErrors.email = "Email phải có đuôi @gmail.com.";
    if (!phoneRegex.test(form.phone)) newErrors.phone = "Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số.";
    if (!passwordRegex.test(form.password)) newErrors.password = "Mật khẩu phải dài 5–32 ký tự, có in hoa, số, ký tự đặc biệt (không chứa khoảng trắng hoặc ;).";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Xác nhận mật khẩu không trùng khớp.";
    if (!form.dob) newErrors.dob = "Vui lòng chọn ngày sinh.";

    const dob = new Date(form.dob);
    const age = new Date().getFullYear() - dob.getFullYear();
    if (form.dob && (age < 18 || age >= 60)) newErrors.dob = "Tuổi phải từ 18 đến dưới 60.";

    if (!form.gender) newErrors.gender = "Vui lòng chọn giới tính.";
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

    try {
      const res = await axios.post(
        "https://backend-njgx.onrender.com/admin-registers",
        form,
        { withCredentials: true }
      );

      toast.success(res.data.message || "Đăng ký thành công!");

      setTimeout(() => {
        navigate("/admin/login");
      }, 1500);

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        dob: "",
        gender: "",
        role: "",
      });
    } catch (error) {
      const message = error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8">
      <ToastContainer position="top-right" />

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          <p className="text-white text-2xl font-bold mb-4">ĐANG XỬ LÝ</p>
          <div className="w-96 border-4 border-black p-1">
            <div className="bg-green-500 text-white text-sm text-center" style={{ width: "100%" }}>
              Loading...
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 mt-10">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng ký tài khoản Admin</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Các input field */}
          {[
            { name: "name", label: "Họ và tên *" },
            { name: "phone", label: "Số điện thoại *" },
            { name: "email", label: "Email *", type: "email" },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <input
                name={name}
                type={type || "text"}
                placeholder={label}
                onChange={handleChange}
                value={form[name]}
                className={`bg-gray-100 text-black placeholder-gray-700 px-3 py-2 rounded border w-full ${
                  errors[name] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
            </div>
          ))}

          {/* Role */}
          <div>
            <label className="text-sm font-medium mb-1">Vai trò</label>
            <div className="flex items-center gap-4">
              {["manager", "agent"].map((role) => (
                <label key={role} className="flex items-center gap-1">
                  <input type="radio" name="role" value={role} onChange={handleChange} checked={form.role === role} />
                  {role === "manager" ? "Quản lý" : "Nhân viên"}
                </label>
              ))}
            </div>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>

          {/* Passwords */}
          {[
            { name: "password", label: "Mật khẩu *", show: showPassword, setShow: setShowPassword },
            { name: "confirmPassword", label: "Xác nhận mật khẩu *", show: showConfirmPassword, setShow: setShowConfirmPassword },
          ].map(({ name, label, show, setShow }) => (
            <div key={name} className="relative">
              <input
                name={name}
                type={show ? "text" : "password"}
                placeholder={label}
                onChange={handleChange}
                value={form[name]}
                className={`bg-gray-100 text-black placeholder-gray-700 px-3 py-2 rounded border w-full ${
                  errors[name] ? "border-red-500" : "border-gray-300"
                }`}
              />
              <span
                className="absolute right-3 top-2 cursor-pointer text-sm text-gray-600"
                onClick={() => setShow(!show)}
              >
                {show ? "Ẩn" : "Hiện"}
              </span>
              {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
            </div>
          ))}

          {/* DOB + Gender */}
          <div>
            <input
              name="dob"
              type="date"
              onChange={handleChange}
              value={form.dob}
              className="bg-gray-100 text-black px-3 py-2 rounded border border-gray-300 w-full"
              required
            />
            {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
          </div>

          <div>
            <select
              name="gender"
              onChange={handleChange}
              value={form.gender}
              className="bg-gray-100 text-black px-3 py-2 rounded border border-gray-300 w-full"
              required
            >
              <option value="">Giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm mb-2">
            Đã có tài khoản? <Link to="/admin/login" className="text-blue-500">Đăng nhập</Link>
          </p>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700" disabled={isLoading}>
            ĐĂNG KÝ
          </button>
        </div>
      </form>
    </div>
  );
}
