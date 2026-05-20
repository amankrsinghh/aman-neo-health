import {
    faChevronLeft,
    faEye,
    faEyeSlash,
    faLock,
    faPhone,

} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { postApiData } from "../../Services/api";
import { toast } from "react-toastify";
import { fetchPatientDetail, fetchPatientProfile } from "../../Redux/features/patient";
import { useEffect, useState } from "react";
import Loader from "../Layouts/Loader";
import { saveFcmToken } from "../../Services/globalFunction";

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isShow, setIsShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const userId = localStorage.getItem('userId')
    const [emailLogin, setEmailLogin] = useState(false)
    const [formData, setFormData] = useState({
        contactNumber: "",
        email: "",
        password: "", withOtp: true
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const [errors, setErrors] = useState({});
    const validate = () => {
        let temp = {};

        if (emailLogin) {
            if (!formData?.email?.trim())
                temp.email = "Email is required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                temp.email = "Invalid email format";
        } else {
            if (!formData?.contactNumber?.trim())
                temp.contactNumber = "Mobile number is required";
            else if (formData.contactNumber.length !== 10)
                temp.contactNumber = "Mobile number must be 10 digits";
        }
        if (!formData?.password?.trim())
            temp.password = "Password is required";


        setErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true)
        try {
            const response = await postApiData('patient/signin', formData)
            if (response.success) {
                if (formData.withOtp) {
                    localStorage.setItem('patientId', response.patientId)
                    toast.success('Login successfully')
                    navigate(`/otp?contact=${formData?.contactNumber || formData?.email}`)
                } else {
                    sessionStorage.clear();
                    toast.success('Verify successfully');

                    localStorage.setItem('token', response.token);
                    localStorage.setItem('userId', response.userId);
                    localStorage.setItem('role', response.role || 'patient');

                    if (response.nextStep) {
                        navigate(response.nextStep);
                    } else {
                        dispatch(fetchPatientDetail());
                        navigate('/my-appointment');
                        await saveFcmToken();
                    }
                }
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message)
            console.error("Error creating lab:", err);
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        if (emailLogin) {
            setFormData({ ...formData, contactNumber: "" })
        } else {
            setFormData({ ...formData, email: "" })
        }
    }, [emailLogin])
    return (
        <>
            {loading ?
                <Loader />
                : <section className="admin-login-section nw-hero-section ">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <div className="admin-pisture-bx">
                                    <div className="position-relative">
                                        <Link to='/' className="login-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                                    </div>

                                    <img src="new-login-bnnr.png" alt="" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <div >
                                    <div className="nw-form-container">
                                        <div className="login-logo">
                                            <img src="/logo.png" alt="" />
                                        </div>

                                        <div className="admin-vndr-login my-2">
                                            <h3 className="heading-grad">Login Here</h3>
                                            <p className="py-2">Sign in to access your health records securely.</p>
                                        </div>

                                        <form onSubmit={handleSubmit}>
                                            {emailLogin ?
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Email Address</label>
                                                    <div className="custom-frm-bx mb-0">
                                                        <input type="email" name="email"
                                                            value={formData.email}
                                                            onChange={handleChange} className="form-control new-control-frm px-5" placeholder="Enter Email Address" />
                                                        <div className="contact-add-icon">
                                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faPhone} /> </span>
                                                        </div>
                                                    </div>
                                                    {errors.email && <small className="text-danger">{errors.email}</small>}
                                                </div>
                                                : <div className="custom-frm-bx">
                                                    <label htmlFor="">Mobile Number</label>
                                                    <div className="custom-frm-bx mb-0">
                                                        <input type="number" name="contactNumber"
                                                            value={formData.contactNumber}
                                                            onChange={handleChange} className="form-control new-control-frm px-5" placeholder="Enter Mobile Number" />
                                                        <div className="contact-add-icon">
                                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faPhone} /> </span>
                                                        </div>
                                                    </div>
                                                    {errors.contactNumber && <small className="text-danger">{errors.contactNumber}</small>}
                                                </div>}

                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Password</label>
                                                <div className="custom-frm-bx mb-0">

                                                    <input type={isShow ? "text" : "password"} name="password"
                                                        value={formData.password}
                                                        onChange={handleChange} className="form-control new-control-frm px-5" placeholder="*******" />
                                                    <div className="contact-add-icon">
                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLock} /> </span>
                                                    </div>
                                                    <div className="login-eye-bx">
                                                        <button onClick={() => setIsShow(!isShow)} type="button" className="nw-contact-icon">
                                                            <FontAwesomeIcon icon={isShow ? faEyeSlash : faEye} />
                                                        </button>
                                                    </div>
                                                </div>
                                                {errors.password && <small className="text-danger">{errors.password}</small>}
                                            </div>

                                            <div className='d-flex justify-content-between'>
                                                <button type="button" onClick={() => setEmailLogin(!emailLogin)} className='lab-login-forgot-btn fs-6'>Login using {emailLogin ? 'mobile number' : 'email'}</button>
                                                <NavLink to="/forgot-password" className='lab-login-forgot-btn fs-6'>Forgot Password</NavLink>
                                            </div>
                                            <div className="custom-radio-group my-3">
                                                <label className="form-label me-3">Continue with Otp</label>
                                                <input type="checkbox" className="form-check-input" name="" checked={formData?.withOtp}
                                                    onChange={(e) => setFormData({ ...formData, withOtp: e.target.checked })} id="" />
                                            </div>
                                            <div className="mt-3 text-center">
                                                <button className="nw-thm-btn w-100" type="submit">Login</button>
                                            </div>

                                            <div className='text-center mt-4'>
                                                <span className='do-account-title'>don't have an account?  <NavLink to="/create-account" className='nw-register-btn'>Register here</NavLink></span>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>}
        </>
    )
}

export default Login