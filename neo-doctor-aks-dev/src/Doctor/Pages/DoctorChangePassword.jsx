import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { BsPlusCircleFill } from "react-icons/bs";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";


import React, { useState } from 'react'
import { toast } from "react-toastify";
import { securePostData } from "../../Services/api";
import Loader from "../../Loader/Loader";
import { Link } from "react-router-dom";

function DoctorChangePassword() {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isConf, setIsConf] = useState(true)
    const [isPass, setIsPass] = useState(true)
    const [isOld, setIsOld] = useState(true)
    const [oldPassword, setOldPassword] = useState('')
    const userId = localStorage.getItem('userId')

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Password and confirm password was not match")
            return
        }
        setLoading(true)
        const data = { userId, oldPassword, newPassword: password }
        try {
            const response = await securePostData(`doctor/change-password`, data);
            if (response.success) {
                setConfirmPassword('')
                setOldPassword('')
                setPassword('')
                toast.success("Password changed successfully")
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            {loading ? <Loader />
                :
                <div className="profile-right-card">
                    <div className="profile-tp-header">
                        <h5 className="heading-grad fz-24 mb-0">Current Password</h5>
                    </div>
                    <div className="all-profile-data-bx">
                        <form onSubmit={handleSubmit}>
                            <div className="row justify-content-center">
                                <div className="col-lg-6 col-md-12 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Current Password</label>
                                        <input type={isOld ? "password" : "text"} required
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)} className="form-control new-control-frm px-5" placeholder="Enter Current Password" />
                                        <div className="contact-add-icon">
                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLock} /> </span>
                                        </div>
                                        <div className="login-eye-bx" onClick={() => setIsOld(!isOld)}>
                                            <button type="button" className="nw-contact-icon">
                                                <FontAwesomeIcon icon={isOld ? faEye : faEyeSlash} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">New Password</label>
                                        <input type={isPass ? "password" : "text"} required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)} className="form-control new-control-frm px-5" placeholder="Enter New Password" />
                                        <div className="contact-add-icon">
                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLock} /> </span>
                                        </div>
                                        <div className="login-eye-bx" onClick={() => setIsPass(!isPass)}>
                                            <button type="button" className="nw-contact-icon">
                                                <FontAwesomeIcon icon={isPass ? faEye : faEyeSlash} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Confirm New Password</label>
                                        <input type={isConf ? "password" : "text"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)} className="form-control new-control-frm px-5" placeholder="Confirm New Password" />
                                        <div className="contact-add-icon">
                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLock} /> </span>
                                        </div>
                                        <div className="login-eye-bx" onClick={() => setIsConf(!isConf)}>
                                            <button type="button" className="nw-contact-icon">
                                                <FontAwesomeIcon icon={isConf ? faEye : faEyeSlash} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mt-4">
                                        <div className="text-end">
                                             <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                                         </div>
                                        <button type="submit" className="nw-thm-btn">Change Password</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                
            }
        </>
    )
}

export default DoctorChangePassword