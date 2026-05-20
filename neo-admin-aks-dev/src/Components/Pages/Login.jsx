import { useState } from "react";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios"; // 🔥 interceptor wala axios
import { toast } from "react-toastify";
import { initFCM } from "../../utils/initFCM";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/adminauth/login", {
        email,
        password,
      });

      // 🔐 SAVE TOKEN
      localStorage.setItem("admin_token", res.data.token);
      localStorage.setItem("admin_user", JSON.stringify(res.data.admin));
      initFCM();
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="nw-hero-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="nw-form-container">

              <div className="login-logo">
                <img src="/logo.png" alt="logo" />
              </div>

              <div className="my-3">
                <h2 className="gradient-text fw-700">Login Admin</h2>
                <p>Welcome back! Please enter your details.</p>
              </div>

              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                {/* EMAIL */}
                <div className="custom-frm-bx">
                  <label>Email Id</label>
                  <input
                    type="email"
                    className="form-control px-5 admin-table-search-frm"
                    placeholder="Enter Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <div className="login-icon-bx">
                    <span className="auth-icon">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="custom-frm-bx">
                  <label>Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control px-5 admin-table-search-frm"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <div className="login-icon-bx">
                    <span className="auth-icon">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                  </div>

                  <div className="login-eye-bx">
                    <span
                      className="text-black"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                      />
                    </span>
                  </div>
                </div>

                {/* SUBMIT */}
                <div className="mt-5">
                  <button
                    type="submit"
                    className="nw-thm-btn w-100 rounded-3 py-3"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
