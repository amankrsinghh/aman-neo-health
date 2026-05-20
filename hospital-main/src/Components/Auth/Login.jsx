import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../api/api";
import Loader from "../../Components/Common/Loader";
import { messaging } from "../../firebase";
import { getToken } from "firebase/messaging";
import { useDispatch } from "react-redux";
import { fetchEmpDetail, fetchUserDetail } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
import { postApiData } from "../../Service/api";
import { saveFcmToken } from "../../Service/globalFunction";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [emailLogin, setEmailLogin] = useState(false)
    const [validation, setValidation] = useState({});
    const [loading, setLoading] = useState(false);
    const [isText, setIsText] = useState(false)
    const [staffLogin, setStaffLogin] = useState(false)
    const [withOtp, setWithOtp] = useState(true)
    const [hospitalId, setHospitalId] = useState('')
    // ---------------- VALIDATION ---------------- //
    const validate = () => {
        let temp = {};

        if (emailLogin) {
            // ✅ Email validation
            if (!email.trim()) {
                temp.email = "Email is required";
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                temp.email = "Invalid email address";
            }
        } else {
            // ✅ Mobile validation
            if (!contactNumber.trim()) {
                temp.contactNumber = "Mobile Number is required";
            } else if (!/^\d{10}$/.test(contactNumber)) {
                temp.contactNumber = "Invalid mobile number";
            }
        }
        if(staffLogin && !hospitalId?.trim()){
            temp.hospitalId="Hospital id is required"
        }

        // ✅ Password validation
        if (!password.trim()) {
            temp.password = "Password is required";
        } else if (password.length < 6) {
            temp.password = "Password must be at least 6 characters";
        }

        setValidation(temp);

        return Object.keys(temp).length === 0;
    };


    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validate()) return;
        setLoading(true);
        let data = { password, withOtp };
        if (emailLogin) {
            data.email = email
        } else {
            data.contactNumber = contactNumber
        }
        try {
            const res = await api.post("/auth/login", data);
            if (res.data.success) {
                if (withOtp) {
                    navigate(`/otp?contact=${contactNumber || email}`);
                } else {
                    localStorage.setItem("token", res.data.token);

                    dispatch(fetchUserDetail())

                    // 2️⃣ Full user details save
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                    await saveFcmToken();
                    navigate("/dashboard");
                }
            } else {
                toast.error(res.data.message)
            }
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false); // STOP LOADER
        }
    };

    const staffLoginSubmit = async (e) => {
        e.preventDefault();

        // if (!validate()) return;
        setLoading(true);
        let data = { password, panelId: hospitalId, withOtp };
        if (emailLogin) {
            data.email = email
        } else {
            data.contactNumber = contactNumber
        }
        try {
            const res = await postApiData('api/staff/login', data)
            if (res.success) {
                if (withOtp) {
                    localStorage.setItem('staffId', res.staffId)
                    localStorage.setItem("panelId", hospitalId)
                    navigate(`/otp?contact=${contactNumber || email}`);
                }
                else {
                    localStorage.setItem("token", res.token);
                    localStorage.removeItem("panelId")
                    dispatch(fetchEmpDetail(res.staffId))

                    dispatch(fetchUserDetail())

                    // 2️⃣ Full user details save
                    localStorage.setItem("user", JSON.stringify(res.user));
                    await saveFcmToken();
                    navigate("/dashboard");
                }
            } else {
                toast.error(res.data.message)
            }
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false); // STOP LOADER
        }
    };

    return (
        <>
            {loading && <Loader />}
            <section className=" all-tp-main-section admin-login-section nw-hero-section ">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="admin-pisture-bx">
                                <img src="new-login-bnnr.png" alt="" />
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12 col-sm-12 align-content-center pb-3">
                            <div className="admin-frm-vendor-bx">
                                {staffLogin ?
                                    <form onSubmit={staffLoginSubmit}>
                                        <div className="nw-form-container">

                                            <div className="login-logo">
                                                <img src="/logo.png" alt="" />
                                            </div>

                                            <div className="admin-vndr-login my-3">
                                                <h3>Hospital Login</h3>
                                                <p>Secure access to the Hospital Information System.</p>
                                            </div>

                                            {/* api ERROR */}
                                            {error && (
                                                <div className="alert alert-danger py-2">{error}</div>
                                            )}

                                            {/* EMAIL */}
                                            <div className="custom-frm-bx">
                                                <label>Hospital Id</label>
                                                <input
                                                    type="text"
                                                    className="form-control pe-5"
                                                    // placeholder="Enter Mobile Number"
                                                    value={hospitalId}
                                                    name="hospitalId"
                                                    onChange={(e) => setHospitalId(e.target.value)}
                                                />
                                                {validation.hospitalId && (
                                            <small className="text-danger">{validation.hospitalId}</small>
                                        )}
                                            </div>
                                            {emailLogin ?
                                                <div className="custom-frm-bx">
                                                    <label>Email address</label>
                                                    <input
                                                        type="email"
                                                        className="form-control pe-5"
                                                        placeholder="Enter email address"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                    {validation.email && (
                                                        <small className="text-danger">{validation.email}</small>
                                                    )}
                                                </div> : <div className="custom-frm-bx">
                                                    <label>Mobile Number</label>
                                                    <input
                                                        type="number"
                                                        className="form-control pe-5"
                                                        placeholder="Enter Mobile Number"
                                                        value={contactNumber}
                                                        onChange={(e) => setContactNumber(e.target.value)}
                                                    />
                                                    {validation.contactNumber && (
                                                        <small className="text-danger">{validation.contactNumber}</small>
                                                    )}
                                                </div>}

                                            {/* PASSWORD */}
                                            <div className="custom-frm-bx">
                                                <label>Password</label>
                                                <input
                                                    type={isText ? "text" : "password"}
                                                    className="form-control pe-5"
                                                    placeholder="*******"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />

                                                <div className="login-eye-bx">
                                                    <button type="button" onClick={() => setIsText(!isText)} className="text-black">
                                                        <FontAwesomeIcon icon={isText ? faEye : faEyeSlash} />
                                                    </button>
                                                </div>

                                                {validation.password && (
                                                    <small className="text-danger">{validation.password}</small>
                                                )}
                                            </div>

                                            <div className='d-flex justify-content-between'>
                                                <button type="button" onClick={() => {
                                                    setContactNumber('')
                                                    setEmailLogin(!emailLogin)
                                                }} className='lab-login-forgot-btn fs-6'>Login using {emailLogin ? 'mobile number' : 'email'}</button>

                                            </div>
                                            <div className="form-check custom-check">
                                                <label className="form-check-label">Continue with Otp</label>
                                                <input type="checkbox" className="form-check-input" name="" checked={withOtp} onChange={(e) => setWithOtp(e.target.checked)} id="" />
                                            </div>

                                            <div className="mt-4">
                                                <button type="submit" className="admin-lg-btn w-100">
                                                    Login
                                                </button>
                                            </div>
                                            <div className='d-flex justify-content-between mt-3'>
                                                <button type="button" onClick={(e) => {
                                                    e.preventDefault()
                                                    setStaffLogin(!staffLogin)
                                                }} className='lab-login-forgot-btn fs-6'>{staffLogin ? 'Login as Hospital' : 'Login as employee'}</button>
                                                {/* <NavLink to="/forgot-password" className="lab-login-forgot-btn fs-6">
                                            Forgot Password
                                        </NavLink> */}
                                            </div>

                                            <div className="text-center mt-lg-5 mt-sm-3">
                                                <span className='do-account-title'>
                                                    Don't have an account?
                                                    <NavLink to="/create-account" className='lab-login-forgot-btn'> Register here </NavLink>
                                                </span>
                                            </div>

                                        </div>
                                    </form>
                                    : <form onSubmit={handleLogin}>
                                        <div className="nw-form-container">

                                            <div className="login-logo">
                                                <img src="/logo.png" alt="" />
                                            </div>

                                            <div className="admin-vndr-login my-3">
                                                <h3>Hospital Login</h3>
                                                <p>Secure access to the Hospital Information System.</p>
                                            </div>

                                            {/* api ERROR */}
                                            {error && (
                                                <div className="alert alert-danger py-2">{error}</div>
                                            )}

                                            {/* EMAIL */}
                                            {emailLogin ?
                                                <div className="custom-frm-bx">
                                                    <label>Email address</label>
                                                    <input
                                                        type="email"
                                                        className="form-control pe-5"
                                                        placeholder="Enter email address"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                    {/* {validation.contactNumber && (
                                            <small className="text-danger">{validation.contactNumber}</small>
                                        )} */}
                                                </div> : <div className="custom-frm-bx">
                                                    <label>Mobile Number</label>
                                                    <input
                                                        type="number"
                                                        className="form-control pe-5"
                                                        placeholder="Enter Mobile Number"
                                                        value={contactNumber}
                                                        onChange={(e) => setContactNumber(e.target.value)}
                                                    />
                                                    {/* {validation.contactNumber && (
                                            <small className="text-danger">{validation.contactNumber}</small>
                                        )} */}
                                                </div>}

                                            {/* PASSWORD */}
                                            <div className="custom-frm-bx">
                                                <label>Password</label>
                                                <input
                                                    type={isText ? "text" : "password"}
                                                    className="form-control pe-5"
                                                    placeholder="*******"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />

                                                <div className="login-eye-bx">
                                                    <button type="button" onClick={() => setIsText(!isText)} className="text-black">
                                                        <FontAwesomeIcon icon={isText ? faEye : faEyeSlash} />
                                                    </button>
                                                </div>

                                                {validation.password && (
                                                    <small className="text-danger">{validation.password}</small>
                                                )}
                                            </div>

                                            <div className='d-flex justify-content-between'>
                                                <button type="button" onClick={() => {
                                                    setContactNumber('')
                                                    setEmailLogin(!emailLogin)
                                                }} className='lab-login-forgot-btn fs-6'>Login using {emailLogin ? 'mobile number' : 'email'}</button>
                                                <NavLink to="/forgot-password" className="lab-login-forgot-btn fs-6">
                                                    Forgot Password
                                                </NavLink>
                                            </div>
                                            <div className="form-check custom-check">
                                                <label className="form-check-label">Continue with Otp</label>
                                                <input type="checkbox" className="form-check-input" name="" checked={withOtp} onChange={(e) => setWithOtp(e.target.checked)} id="" />
                                            </div>

                                            <div className="mt-4">
                                                <button type="submit" className="admin-lg-btn w-100">
                                                    Login
                                                </button>
                                            </div>
                                            <div className='d-flex justify-content-between mt-3'>
                                                <button type="button" onClick={(e) => {
                                                    e.preventDefault()
                                                    setStaffLogin(!staffLogin)
                                                }} className='lab-login-forgot-btn fs-6'>{staffLogin ? 'Login as Hospital' : 'Login as employee'}</button>
                                                {/* <NavLink to="/forgot-password" className="lab-login-forgot-btn fs-6">
                                            Forgot Password
                                        </NavLink> */}
                                            </div>

                                            <div className="text-center mt-lg-5 mt-sm-3">
                                                <span className='do-account-title'>
                                                    Don't have an account? <NavLink to="/create-account" className='lab-login-forgot-btn'> Register here
                                                    </NavLink>
                                                </span>
                                            </div>

                                        </div>
                                    </form>}

                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

export default Login;
