import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { faArrowLeft, faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { BsDatabaseFillDown } from "react-icons/bs";



function VaccinationOtp() {
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

                                            <div className="row justify-content-center">
                                                <div className="col-lg-5 col-md-12 col-sm-12">
                                                    <div className="nw-form-container">
                                                        <form action="">
                                                            <div className="custom-frm-bx mb-0">
                                                                <label htmlFor="">Enter OTP</label>
                                                            </div>
                                                            <div className="custom-frm-bx vaccine-otp-filed">

                                                                <input
                                                                    type="number"
                                                                    className="form-control  new-control-frm verify-account-frm  text-center"
                                                                    placeholder="0"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    className="form-control new-control-frm verify-account-frm text-center"
                                                                    placeholder="0"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    className="form-control new-control-frm verify-account-frm text-center"
                                                                    placeholder="0"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    className="form-control new-control-frm verify-account-frm text-center"
                                                                    placeholder="0"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    className="form-control new-control-frm verify-account-frm text-center"
                                                                    placeholder="0"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    className="form-control new-control-frm verify-account-frm text-center"
                                                                    placeholder="0"
                                                                />
                                                            </div>

                                                            <div className="mt-4 text-center">
                                                                <button type="button" className="vaccine-btn w-100" data-bs-toggle="modal" data-bs-target="#fetch-Modal">Verify & Fetch</button>
                                                            </div>

                                                            <div className='text-center mt-4'>
                                                                <p className='do-account-title text-black fw-700'>Didn't receive any code? </p>
                                                                <p className='do-account-title py-3 fw-700'>Request new code in <span className="otp-timing fw-600" style={{ color: "#FFAA78" }}>30s </span></p>
                                                                <a href="javascript:void(0)" className='nw-register-btn fw-700' style={{ color: "#00B4B5" }}>Resend</a>

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
                </div>

            </section>

            {/*Fetch Modal Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#fetch-Modal" */}
            <div className="modal step-modal" id="fetch-Modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-0 ">
                        <div className="d-flex align-items-center justify-content-end py-3 px-4">

                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "rgba(239, 0, 0, 1)" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body pb-5 px-4">
                            <div className="row">
                                <div className="fetching-content-bx">
                                    <span><BsDatabaseFillDown className="database-fetch-icon" /></span>
                                    <div className="py-3 d-flex flex-column justify-content-center align-items-center">
                                        <h5>Fetching Vaccination Details</h5>
                                        <p>Please wait while we securely retrieve your records.</p>

                                        <div class="circle-loader"></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Fetch Modal Popup End */}

        </>
    )
}

export default VaccinationOtp