import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../api/api";
import Loader from "../../Components/Common/Loader";
import { fetchEmpDetail, fetchUserDetail } from "../../redux/features/userSlice";
import { useDispatch } from "react-redux";
import { getToken } from "firebase/messaging";
import { postApiData } from "../../Service/api";
import { toast } from "react-toastify";
import { saveFcmToken } from "../../Service/globalFunction";

function Otp() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [timer, setTimer] = useState(30);
    const [searchParams] = useSearchParams()
    const contact = searchParams.get('contact')
    const isEmail = contact?.includes('@');
    const email = localStorage.getItem("fp_email");
    const type = searchParams.get('type') || "login"

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // input refs
    const inputRefs = useRef([]);

    const handleInput = (value, index) => {
        if (!/^\d?$/.test(value)) return; // only digit allowed

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next box automatically
        if (value !== "" && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };
    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleKeyDown = (e, index) => {
        // Backspace → Go to previous input
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1].focus();
        }

        // Enter → Submit form
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };
    // ---------------- LOGIN SUBMIT ---------------- //

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalOtp = otp.join("");
        if (finalOtp.length !== 6) {
            return setError("Enter all 6 digits");
        }

        setLoading(true);
        const data = { type, code: finalOtp }
        if (isEmail) {
            data.email = contact
        } else {
            data.contactNumber = contact
        }
        try {
            if (searchParams.get('type') === "forgot-password") {

                const response = await postApiData('api/auth/verify-otp', {
                    ...data,
                    type: "forgot-password"
                });

                if (response.success) {
                    toast.success("Verify successfully");
                    localStorage.setItem('ftoken', response.token);
                    navigate('/set-password');
                } else {
                    toast.error(response.message)
                }

            } else if (localStorage.getItem('panelId') && localStorage.getItem('staffId')) {

                data.panelId = localStorage.getItem('panelId')
                data.staffId = localStorage.getItem('staffId')
                data.empId = searchParams.get('employee')
                const res = await postApiData("api/staff/verify-otp", data);
                if (res.success) {
                    localStorage.setItem("token", res.token);
                    localStorage.removeItem("panelId")
                    dispatch(fetchEmpDetail(localStorage.getItem('staffId')))

                    dispatch(fetchUserDetail())

                    // 2️⃣ Full user details save
                    localStorage.setItem("user", JSON.stringify(res.user));
                    await saveFcmToken();
                    navigate("/dashboard");

                } else {
                    toast.error(res.data.message)
                }
            } else {
                const res = await API.post("/auth/verify-otp", data);
                if (res.data.success) {

                    if (type == "login") {
                        // 1️⃣ Token save
                        localStorage.setItem("token", res.data.token);
                        dispatch(fetchUserDetail())

                        // 2️⃣ Full user details save
                        localStorage.setItem("user", JSON.stringify(res.data.user));
                        await saveFcmToken();
                        if (res.data.nextStep) {
                            navigate(res.data.nextStep);
                        } else {
                            navigate("/dashboard");
                        }
                    }
                } else {
                    toast.error(res.data.message)
                }
            }
            // localStorage.setItem("fp_otp", finalOtp);

        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };
    const handleResendCode = async (e) => {
        e.preventDefault();
        let data = {};
        if (isEmail) {
            data.email = contact
        } else {
            data.contactNumber = contact
        }

        try {
            const response = await postApiData('api/auth/resend-otp', data)
            if (response.success) {
                toast.success('Otp sent successfully')
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            console.error("Error creating pharmacy:", err);
        }
        setTimer(30); // reset timer after resend
    }

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
                                <div className="nw-form-container">
                                    <div className="login-logo">
                                        <img src="/logo.png" alt="" />
                                    </div>

                                    <h3>Verify OTP</h3>
                                    <p>Please enter 6-digit code sent to your email.</p>

                                    {error && <div className="alert alert-danger py-2">{error}</div>}

                                    <form onSubmit={handleSubmit}>
                                        <div className="custom-frm-bx admin-frm-bx lab-login-frm-bx my-lg-5 my-sm-3">

                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    maxLength="1"
                                                    value={digit}
                                                    className="form-control admin-frm-control lab-login-frm-control"
                                                    onChange={(e) => handleInput(e.target.value, index)}
                                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                                    ref={(el) => (inputRefs.current[index] = el)}
                                                />
                                            ))}

                                        </div>

                                        <div>
                                            <button className="admin-lg-btn w-100">Verify</button>
                                        </div>

                                        <div className='text-center mt-3 mt-md-4 mt-lg-5'>
                                            <p className='do-account-title text-black'>Didn’t receive any code?</p>
                                            <p className='do-account-title py-lg-4 py-sm-2'>
                                                Request new code in <span className="otp-timing">{timer}s</span>
                                            </p>
                                            <button
                                                className='lab-login-forgot-btn'
                                                onClick={handleResendCode}
                                                type="button"
                                                disabled={timer > 0} // prevent clicking before timer ends
                                            >
                                                Resend
                                            </button>
                                        </div>
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

export default Otp;
