import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import Loader from "../../Components/Common/Loader";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import base_url from "../../baseUrl";

function SetPassword() {
    const navigate = useNavigate();

    const email = localStorage.getItem("fp_email");
    const otp = localStorage.getItem("fp_otp");

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const validate = () => {
        if (!password.trim()) return "Password is required";
        if (password.length < 6)
            return "Password must be at least 6 characters";
        if (password !== confirm)
            return "Passwords do not match";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            return setError(validationError);
        }
        setError("");
        setLoading(true);
        try {
            const response = await axios.post(`${base_url}/api/auth/reset-password`, {password}, {
                headers: {
                    'Token': localStorage.getItem('ftoken')
                }
            });
            if (response.data.success) {
                setMsg("Password reset successfully!");
                setTimeout(() => {
                    sessionStorage.clear();
                    localStorage.clear();
                    navigate("/login");
                }, 1200);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            {loading && <Loader />}

            <section className="admin-login-section nw-hero-section all-tp-main-section">
                <div className="container">
                    <div className="row">

                        <div className="col-lg-6">
                         <div className="admin-pisture-bx">
                               <img src="new-login-bnnr.png" alt="" />
                         </div>
                        </div>

                        <div className="col-lg-6 align-content-center pb-3">
                            <div className="admin-frm-vendor-bx">
                                <div className="nw-form-container">
                                <div className="login-logo">
                                    <img src="/logo.png" alt="" />
                                </div>

                                <h3>Set Password</h3>
                                <p>Create a strong password.</p>

                                {error && <div className="alert alert-danger py-2">{error}</div>}
                                {msg && <div className="alert alert-success py-2">{msg}</div>}

                                <form onSubmit={handleSubmit}>

                                    {/* New Password */}
                                    <div className="custom-frm-bx admin-frm-bx position-relative">
                                        <label>New Password</label>

                                        <input
                                            type={showPass ? "text" : "password"}
                                            className="form-control pe-5"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="*******"
                                        />

                                        <div
                                            className="pass-eye-bx"
                                            onClick={() => setShowPass(!showPass)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <FontAwesomeIcon icon={showPass ? faEye : faEyeSlash} />
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="custom-frm-bx admin-frm-bx position-relative">
                                        <label>Confirm Password</label>

                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            className="form-control pe-5"
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                            placeholder="*******"
                                        />

                                        <div
                                            className="pass-eye-bx"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <FontAwesomeIcon icon={showConfirm ? faEye : faEyeSlash} />
                                        </div>
                                    </div>

                                    <button className="admin-lg-btn w-100 mt-3">
                                        Save
                                    </button>

                                </form>

                            </div>

                            </div>

                            

                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

export default SetPassword;
