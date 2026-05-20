import {
    faCalendar,
    faChevronLeft,
    faEnvelope,
    faEye,
    faEyeSlash,
    faLock,
    faMarsAndVenus,
    faPhone,
    faUser,

} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postApiData } from "../../Services/api";

function DoctorCreateAccount() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId')
    const [isPass, setIsPass] = useState(false)
    const [isConf, setIsConf] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        dob: null,
        password: "",
        gender: "",
    });
    const handleChange = (e) => {
        const { type, name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };
    const [errors, setErrors] = useState({});
    const validate = () => {
        let temp = {};

        if (!formData?.name?.trim())
            temp.name = "Doctor name is required";

        if (!formData?.gender?.trim())
            temp.gender = "Gender is required";
        if (!formData?.dob?.trim())
            temp.dob = "Dob is required";

        if (!formData?.contactNumber?.trim())
            temp.contactNumber = "Mobile number is required";
        else if (formData.contactNumber.length !== 10)
            temp.contactNumber = "Mobile number must be 10 digits";

        if (!formData?.email?.trim())
            temp.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            temp.email = "Invalid email format";

        if (!formData?.password?.trim())
            temp.password = "Password is required";
        else if (formData.password.length < 6)
            temp.password = "Password must be at least 6 characters";

        if (!formData?.confirmPassword?.trim())
            temp.confirmPassword = "Confirm password is required";
        else if (formData.confirmPassword !== formData.password)
            temp.confirmPassword = "Passwords do not match";

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            // sessionStorage.setItem('accountData', JSON.stringify(formData))
            const response = await postApiData('doctor', formData)
            if (response.success) {
                toast.success(`Your one time otp is ${response.code}`)
                toast.success('Signup successfully')
                navigate(`/otp?contact=${formData.contactNumber}`)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message)
            console.error("Error creating lab:", err);
        }
    };
    useEffect(() => {

        if (sessionStorage.getItem('accountData')) {
            const data = JSON.parse(sessionStorage.getItem('accountData'))
            setFormData(data)
        }
    }, [])
    return (
        <>
            <section className="admin-login-section nw-hero-section ">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="admin-pisture-bx">
                                <div className="position-relative">
                                    <Link to='/login' className="login-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                                </div>
                                <img src="/doctor-pic.png" alt="" />
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12 col-sm-12 py-lg-3 py-sm-0">
                            <div className="nw-form-container">
                                <div className="login-logo">
                                    <img src="/logo.png" alt="" />
                                </div>

                                <div className="admin-vndr-login">
                                    <h3 className="heading-grad">Create Account</h3>
                                    <p className="">Giv credential to sign up your account</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="custom-frm-bx">
                                        <div className="custom-frm-bx mb-0">
                                            <label htmlFor="">Name</label>
                                            <input type="text" name="name" value={formData?.name} onChange={handleChange} className="form-control new-control-frm px-5" placeholder="Enter Name" />
                                            <div className="contact-add-icon">
                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faUser} /> </span>
                                            </div>
                                        </div>
                                        {errors.name && <small className="text-danger">{errors.name}</small>}
                                    </div>

                                    <div className="custom-frm-bx">
                                        <div className="custom-frm-bx mb-0">

                                            <label htmlFor="">Mobile Number</label>
                                            <input type="number" name="contactNumber" value={formData?.contactNumber} onChange={handleChange} className="form-control new-control-frm px-5" placeholder="Enter Mobile Number" />
                                            <div className="contact-add-icon">
                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faPhone} /> </span>
                                            </div>
                                        </div>
                                        {errors.contactNumber && <small className="text-danger">{errors.contactNumber}</small>}
                                    </div>

                                    <div className="custom-frm-bx">
                                        <div className="custom-frm-bx mb-0">
                                            <label htmlFor="">Email</label>
                                            <input type="email" name="email" value={formData?.email} onChange={handleChange} className="form-control new-control-frm px-5" placeholder="Enter Email Address" />
                                            <div className="contact-add-icon">
                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faEnvelope} /> </span>
                                            </div>
                                        </div>
                                        {errors.email && <small className="text-danger">{errors.email}</small>}
                                    </div>

                                    <div className="custom-frm-bx">
                                        <div className="custom-frm-bx mb-0">
                                            <label htmlFor="">Date of Birth</label>
                                            <input type="date" name="dob" value={formData?.dob} onChange={handleChange}
                                            max={new Date().toISOString().split("T")[0]} className="form-control new-control-frm ps-5" placeholder="Enter Email Address" />
                                            <div className="contact-add-icon">
                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faCalendar} /> </span>
                                            </div>
                                        </div>
                                        {errors.dob && <small className="text-danger">{errors.dob}</small>}
                                    </div>

                                    <div className="custom-frm-bx">
                                        <label>Gender</label>
                                        <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faMarsAndVenus} /> </span>
                                            <select className="nw-select" name="gender" value={formData?.gender} onChange={handleChange} >
                                                <option>--Select--</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        {errors.gender && <small className="text-danger">{errors.gender}</small>}
                                    </div>



                                    <div className="custom-frm-bx">
                                        <div className="custom-frm-bx mb-0">

                                            <label htmlFor="">Password</label>
                                            <input type={isPass ? "password" : "text"} name="password" value={formData?.password} onChange={handleChange} className="form-control new-control-frm px-5" placeholder="Enter Email Address" />
                                            <div className="contact-add-icon">
                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLock} /> </span>
                                            </div>
                                            <div className="login-eye-bx">
                                                <button type="button" onClick={() => setIsPass(!isPass)} className="nw-contact-icon">
                                                    <FontAwesomeIcon icon={isPass ? faEyeSlash:faEye} />
                                                </button>
                                            </div>
                                        </div>
                                        {errors.password && <small className="text-danger">{errors.password}</small>}
                                    </div>

                                    <div className="custom-frm-bx">
                                        <div className="custom-frm-bx mb-0">

                                            <label htmlFor="">Confirm Password</label>
                                            <input type={isConf ? "password" : "text"} name="confirmPassword" value={formData?.confirmPassword} onChange={handleChange} className="form-control new-control-frm px-5" placeholder="Enter Confirm Password" />
                                            <div className="contact-add-icon">
                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLock} /> </span>
                                            </div>
                                            <div className="login-eye-bx">
                                                <button type="button" onClick={() => setIsConf(!isConf)} className="nw-contact-icon">
                                                    <FontAwesomeIcon icon={isConf ? faEyeSlash:faEye} />
                                                </button>
                                            </div>
                                        </div>
                                        {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                                    </div>


                                    <div className="mt-3 text-center">
                                        <button type="submit" className="nw-thm-btn w-100">Continue</button>
                                    </div>

                                    <div className='text-center mt-4'>
                                        <span className='do-account-title'>don't have an account?  <NavLink to="/login" className='nw-register-btn'>Login here</NavLink></span>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default DoctorCreateAccount