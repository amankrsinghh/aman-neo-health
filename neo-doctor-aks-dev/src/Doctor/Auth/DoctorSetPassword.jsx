import {
    faChevronLeft,
    faEye,
    faEyeSlash,
    faLock,

} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import base_url from "../../baseUrl";
import { toast } from "react-toastify";

function DoctorSetPassword() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isConf, setIsConf] = useState(false)
    const [isPass, setIsPass] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Password and confirm password was not match")
            return
        }
        const data = { password }
        try {
            const response = await axios.post(`${base_url}/doctor/reset-password`, data, {
                headers: {
                    'Token': localStorage.getItem('ftoken')
                }
            });
            if (response.data.success) {
                navigate('/login')
                sessionStorage.clear()
                localStorage.clear()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message)
        }
    }
    return (
        <>
            <section className="admin-login-section nw-hero-section ">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="admin-pisture-bx">
                                <div className="position-relative">
                                    <a href="javascript:void(0)" className="login-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </a>
                                </div>
                                <img src="/doctor-pic.png" alt="" />
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="col-lg-6 col-md-12 col-sm-12">
                            <div className="nw-form-container">
                                <div className="login-logo">
                                    <img src="/logo.png" alt="" />
                                </div>

                                <div className="admin-vndr-login my-3">
                                    <h3 className="heading-grad">Set Password</h3>
                                    <p className="py-2">Create a strong password to keep your account secure.</p>
                                </div>

                                <div>
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">New Password</label>
                                        <input type={isPass ? "password" : "text"}
                                            value={password}
                                            required
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="form-control new-control-frm px-5" placeholder="Enter New Password" />
                                        <div className="contact-add-icon">
                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLock} /> </span>
                                        </div>
                                        <div className="login-eye-bx">
                                            <button type="button" onClick={(e) => setIsPass(!isPass)} className="nw-contact-icon">
                                                <FontAwesomeIcon icon={isPass ? faEye : faEyeSlash} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Confirm Password</label>
                                        <input type={isConf ? "password" : "text"}
                                            value={confirmPassword}
                                            required
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="form-control new-control-frm px-5" placeholder="Enter  Confirm Password" />
                                        <div className="contact-add-icon">
                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLock} /> </span>
                                        </div>
                                        <div className="login-eye-bx">
                                            <button type="button" onClick={(e) => setIsConf(!isConf)} className="nw-contact-icon">
                                                <FontAwesomeIcon icon={isConf ? faEye : faEyeSlash} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                 <div className="mt-4 text-center">
                                <button type="" className="nw-thm-btn w-100">Save</button>
                            </div>

                            </div>


                           


                        </form>
                    </div>
                </div>

            </section >
        </>
    )
}

export default DoctorSetPassword