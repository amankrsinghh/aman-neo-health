import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "../../api/api";
import Loader from "../../Components/Common/Loader";
import { postApiData } from "../../Service/api";

function PasswordForgot() {
    const navigate = useNavigate();

    const [mobileNo, setMobileNo] = useState("");
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const validate = () => {
        if (!mobileNo.trim()) return "mobile number is required";
        if (mobileNo?.length < 10) return "Invalid mobile number";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const err = validate();
        if (err) return setError(err);
        setLoading(true);
        try {
            const res = await postApiData("api/auth/forgot-password", { mobileNo });
            if (res.success) {

                setMsg("OTP sent to your mobileNumber");
                setError("");

                navigate(`/otp?contact=${mobileNo}&type=forgot-password`)
            }

        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false); // STOP LOADER
        }
    };

    return (
        <>
            {loading && <Loader />}
            <section className="admin-login-section nw-hero-section all-tp-main-section">
                <div className="container-fluid">
                    <div className="row">

                        <div className="col-lg-6">
                            <div className="admin-pisture-bx">
                                <img src="new-login-bnnr.png" alt="" />
                            </div>
                        </div>

                        <div className="col-lg-6 align-content-center pb-3">
                            <div className="admin-frm-vendor-bx">
                                <form onSubmit={handleSubmit}>
                                <div className="nw-form-container">

                                    <div className="login-logo">
                                        <img src="/logo.png" alt="" />
                                    </div>

                                    <h3>Forgot Password</h3>
                                    <p>Please enter your registered mobile number</p>

                                    {error && <div className="alert alert-danger py-2">{error}</div>}
                                    {msg && <div className="alert alert-success py-2">{msg}</div>}

                                    <div className="custom-frm-bx">
                                        <label>Mobile Number</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter Mobile Number"
                                            value={mobileNo}
                                            onChange={(e) => setMobileNo(e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-lg-5 mt-sm-3">
                                        <button type="submit" className="admin-lg-btn w-100">Submit</button>
                                    </div>

                                </div>
                            </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

export default PasswordForgot;
