import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { HiCheckBadge } from "react-icons/hi2"

function VaccinationMobileNumber() {
    return (
        <>
            <section className="new-profile-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3  col-sm-12 mb-3">
                            <ProfileSidebar />
                        </div>

                        <div className="col-lg-9 col-sm-12">
                            <div className="profile-right-card">
                                <div className="profile-tp-header">
                                    <a href="javascript:void(0)" className="text-black fz-20 me-2"><FontAwesomeIcon icon={faArrowLeft} /></a>
                                    <h5 className="heading-grad fz-24 mb-0">Vaccination</h5>
                                </div>
                                <div className="all-profile-data-bx">
                                    <div className="row ">
                                        <div className="col-lg-12">
                                            <div className="imported-certificated">
                                                <h5>Select Via</h5>
                                            </div>

                                            <div className="row justify-content-center">
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <form action="">
                                                        <div className="custom-frm-bx">
                                                            <label htmlFor="">Mobile Number</label>
                                                            <input type="number" className="form-control new-control-frm verify-account-frm pe-5" placeholder="Enter your number" value="9876543210" />

                                                            {/* <div className="contact-add-icon">
                                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faPhone} /> </span>
                                                            </div> */}

                                                            <div className="verification-num-bx">
                                                                <span className="verify-title"> <HiCheckBadge /></span>
                                                            </div>
                                                        </div>

                                                        <div className="text-end mt-3">
                                                            <button className="vaccine-btn w-100">Get OTP</button>
                                                        </div>

                                                        <div className="vaccine-notice mt-4">
                                                            <p>  NeoVAX does not store your mobile number. It is used only once for certificate retrieval.</p>
                                                        </div>

                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </section>
        </>
    )
}

export default VaccinationMobileNumber