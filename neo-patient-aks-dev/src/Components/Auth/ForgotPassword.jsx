import {
    faChevronLeft,

    faPhone,

} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { postApiData, securePostData } from "../../Services/api";
import { useState } from "react";
import { toast } from "react-toastify";

function ForgotPassword() {
    const navigate = useNavigate();
    const [contactNumber, setContactNumber] = useState("")
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!contactNumber?.trim())
            return toast.error("Mobile number is required");
        else if (contactNumber.length !== 10)
            return toast.error("Mobile number must be 10 digits")
        try {
            const res = await postApiData(`patient/forgot-password`, { contactNumber })
            if (res.success) {
                toast.success("Otp sent")
                navigate(`/otp?contact=${contactNumber}&type=forgot-password`)
            }else{
                toast.error(res?.message)
            }
        } catch (error) {
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
                                    <Link to={'/login'} className="login-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                                </div>

                                <img src="new-login-bnnr.png" alt="" />
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12 col-sm-12 ">
                             <div className="nw-form-container">
                                    <div className="login-logo">
                                        <img src="/logo.png" alt="" />
                                    </div>

                                    <div className="admin-vndr-login my-2">
                                        <h3 className="heading-grad">Forgot Password</h3>
                                        <p className="py-2">Please enter mobile number below</p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Mobile Number</label>
                                            <input type="number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="form-control new-control-frm px-5" placeholder="Enter Mobile Number" />
                                            <div className="contact-add-icon">
                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faPhone} /> </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 text-center">
                                            <button type="submit" className="nw-thm-btn w-100">Get Otp</button>
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

export default ForgotPassword