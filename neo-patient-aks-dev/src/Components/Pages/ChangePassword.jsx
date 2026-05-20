import { faArrowRightFromBracket, faCalendarPlus, faCreditCard, faEye, faEyeSlash, faFile, faFlask, faHeart, faKey, faLock, faMessage, faShareAlt, faUserEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import { securePostData } from "../../Services/api"
import { useState } from "react"
import ProfileSidebar from "./ProfileSidebar"
import { Link } from "react-router-dom"

function ChangePassword() {
    const [password, setPassword] = useState('')
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
        const data = { userId, oldPassword, newPassword: password }
        try {
            const response = await securePostData(`patient/change-password`, data);
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
        }
    }
    return (
        <>
            <div className="profile-right-card">
                <div className="profile-tp-header">
                    <h5 className="heading-grad fz-24 mb-0">Change Password</h5>
                </div>
                <div className="all-profile-data-bx">
                    <form onSubmit={handleSubmit}>
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Current Password</label>
                                    <input type={isOld ? "password" : "text"} required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="form-control new-control-frm px-5" placeholder="Enter Current Password" />

                                    <div className="contact-add-icon">
                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLock} /> </span>
                                    </div>

                                    <div className="nw-password-eye-bx" onClick={() => setIsOld(!isOld)}>
                                        <button><FontAwesomeIcon icon={isOld ? faEye : faEyeSlash} /></button>

                                    </div>
                                </div>

                                <div className="custom-frm-bx">
                                    <label htmlFor="">New Password</label>
                                    <input type={isPass ? "password" : "text"} required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-control new-control-frm px-5" placeholder="Enter New Password" />

                                    <div className="contact-add-icon">
                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLock} /> </span>
                                    </div>

                                    <div className="nw-password-eye-bx" onClick={() => setIsPass(!isPass)}>
                                        <button><FontAwesomeIcon icon={isPass ? faEye : faEyeSlash} /></button>

                                    </div>
                                </div>

                                <div className="custom-frm-bx">
                                    <label htmlFor="">Confirm New Password</label>
                                    <input type={isConf ? "password" : "text"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required className="form-control new-control-frm px-5" placeholder="Confirm New Password" />

                                    <div className="contact-add-icon">
                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLock} /> </span>
                                    </div>

                                    <div className="nw-password-eye-bx" onClick={() => setIsConf(!isConf)}>
                                        <button><FontAwesomeIcon icon={isConf ? faEye : faEyeSlash} /></button>

                                    </div>
                                </div>

                                <div className="text-center mt-lg-5">
                                    <button className="nw-thm-btn" type="submit">Change Password</button>
                                </div>

                            </div>
                        </div>
                    </form>


                </div>
            </div>


            <div className="text-end mt-4">
                 <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
              </div>

        </>
    )
}

export default ChangePassword