import {
    faChevronLeft,
    faEye,
    faEyeSlash,
    faLock,

} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import base_url from "../../baseUrl";
import { toast } from "react-toastify";
import { useState } from "react";

function SetPassword() {
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
            const response = await axios.post(`${base_url}/patient/reset-password`, data,{
                headers:{
                    'Token':localStorage.getItem('ftoken')
                }
            });
            if (response.data.success) {
                navigate('/select-account-type')
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
                                <img src="new-login-bnnr.png" alt="" />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div>
                                <div className="nw-form-container">
                                    <div className="login-logo">
                                        <img src="/logo.png" alt="" />
                                    </div>

                                    <div className="admin-vndr-login my-2">
                                        <h3 className="heading-grad">Set Password</h3>
                                        <p className="py-2">Create a strong password to keep your account secure.</p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">New Password</label>
                                            <input type={isPass ? "password" : "text"}
                                                className="form-control new-control-frm px-5"
                                                placeholder="Enter New Password"
                                                value={password}
                                                required
                                                onChange={(e) => setPassword(e.target.value)} />
                                            <div className="contact-add-icon">
                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLock} /> </span>
                                            </div>
                                            <div className="login-eye-bx">
                                                {/* <a href="javascript:void(0)" className="nw-contact-icon">
                                                    <FontAwesomeIcon icon={faEyeSlash} />
                                                </a> */}
                                                <button type="button" onClick={(e) => setIsPass(!isPass)} className="pass-eye-slash-btn">
                                                    <FontAwesomeIcon icon={isPass ? faEye : faEyeSlash} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Confirm Password</label>
                                            <input type={isConf ? "password" : "text"}
                                                className="form-control new-control-frm px-5"
                                                placeholder="Enter  Confirm Password"
                                                value={confirmPassword}
                                                required
                                                onChange={(e) => setConfirmPassword(e.target.value)} />
                                            <div className="contact-add-icon">
                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLock} /> </span>
                                            </div>
                                            <div className="login-eye-bx">
                                                {/* <a href="javascript:void(0)" className="nw-contact-icon">
                                                    <FontAwesomeIcon icon={faEyeSlash} />
                                                </a> */}
                                                <button type="button" onClick={(e) => setIsConf(!isConf)} className="pass-eye-slash-btn">
                                                    <FontAwesomeIcon icon={isConf ? faEye : faEyeSlash} />
                                                </button>
                                            </div>
                                        </div>


                                        <div className="mt-3 text-center">
                                            <button type="submit" className="nw-thm-btn w-100">Save</button>
                                        </div>


                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SetPassword