import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { faArrowLeft, faCalendar, faCircleXmark, faFilePdf, faLocationDot, faMessage, faPhone, } from "@fortawesome/free-solid-svg-icons"
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

function LabTestDetailsCompleted() {
    return (
        <>
            <section className="new-profile-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-sm-12 mb-3">
                            <ProfileSidebar />
                        </div>

                        <div className="col-lg-9 col-sm-12">
                            <div className="profile-right-card">
                                <div className="profile-tp-header">
                                    <h5 className="heading-grad fz-24 mb-0"> <a href="javascript:void(0)" className="text-black fz-18"><FontAwesomeIcon icon={faArrowLeft} /></a> Appointment Details </h5>
                                </div>
                                <div className="all-profile-data-bx">
                                    <div className="row">
                                        <div className="col-lg-12 mb-3">
                                            <div className="my-appointment-info-card ">
                                                <div className="my-appointment-tp-bx">
                                                    <div className="appoint-left-title-bx">
                                                        <h5 className="fz-16 fw-700 mb-0 text-black"> <span className="cal-icon"><FontAwesomeIcon icon={faCalendar} /></span> 30 June 2025, at 10:00pm </h5>
                                                    </div>
                                                    <div className="appoint-right-title-bx">
                                                        <span className="nw-result-bx completed-title">Completed</span>
                                                    </div>
                                                </div>
                                                <div className="appointment-info-parent-bx">
                                                    <div className="appointment-info-sub-bx">
                                                        <img src="/lab-pic.png" alt="" />
                                                        <div className="appointment-info-details">
                                                            <h4 className="">Advance Lab Tech</h4>
                                                            <p className=""><FontAwesomeIcon icon={faLocationDot} /> Malviya Nagar, Jaipur</p>
                                                            <p>Tests Name: <span className="cbc-report-title">CBC</span></p>

                                                        </div>
                                                    </div>
                                                    <div className="appointment-info-mega-bx">
                                                        <div className="not-accpent-bx">

                                                        </div>

                                                        <div>
                                                            <ul className="doctor-social-list">
                                                                <li className="doctor-social-item"><a href="javascript:void(0)" className="doctor-social-btn" > <FontAwesomeIcon icon={faMessage} /> </a></li>
                                                                <li className="doctor-social-item"><a href="javascript:void(0)" className="doctor-social-btn" > <FontAwesomeIcon icon={faPhone} /> </a></li>

                                                            </ul>
                                                        </div>

                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-12 mb-3">
                                            <div className="lab-report-tp-bx">
                                                <div className="booking-details-tp-title">
                                                    <h5>Lab Report</h5>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-8 col-sm-12">
                                                        <div className="appointment-listing-bx py-3">
                                                            <div className="prescriptin-bx ">
                                                                <div className="prescriptin-content">
                                                                    <div className="prescriptin-picture lab-test-bx">
                                                                        <img src="/lab-tube.svg" alt="" style={{ width: "50px", height: "50px" }} />
                                                                        <div>
                                                                            <h6 className="fz-18 fw-700 mb-0">CBC Report</h6>
                                                                            <p>30 June 2025</p>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <a href="javascript:void(0)" className="thm-btn thm-outline-btn rounded-2"><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} /> Download</a>
                                                                    </div>
                                                                </div>

                                                                <div className="cbc-result-bx mt-2">
                                                                    <p>Result CBC Report</p>
                                                                    <h5>Negative</h5>
                                                                </div>



                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>



                                        <div className="col-lg-6 mb-3">
                                            <div className="appointment-booking-detail-bx">
                                                <div className="booking-details-tp-title">
                                                    <h5>Booking Details</h5>
                                                </div>
                                                <div className="appointment-listing-bx">
                                                    <ul className="appoint-booking-list">
                                                        <li className="booking-item">Appointment ID<span className="booking-title">#987676454</span></li>
                                                        <li className="booking-item">Booking Date<span className="booking-title">28 June 2025  10:00pm</span></li>
                                                        <li className="booking-item">CBC Report Amount<span className="booking-title">$ 25 </span></li>
                                                        <li className="booking-item">Total Amount<span className="booking-title">$ 25 </span></li>
                                                        <li className="booking-item">Payment<span className="booking-title accept-title">Cash</span></li>
                                                    </ul>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-lg-6 mb-3">
                                            <div className="appointment-booking-detail-bx">
                                                <div className="booking-details-tp-title">
                                                    <h5>Patient info</h5>
                                                </div>
                                                <div className="appointment-listing-bx">
                                                    <ul className="appoint-booking-list">
                                                        <li className="booking-item">Name<span className="booking-title">Sunil Kumar Sharma</span></li>
                                                        <li className="booking-item">Email<span className="booking-title">sunil@gamil.com</span></li>
                                                        <li className="booking-item">Mobile Number<span className="booking-title">+91-9876543210</span></li>

                                                    </ul>
                                                </div>

                                            </div>
                                        </div>

                                        <div className=" mt-3 text-end d-flex align-items-center justify-content-end gap-2">
                                            <button className="nw-warning-outline-btn" data-bs-toggle="modal" data-bs-target="#rating-Modal">Add Rating</button>
                                            <button className="nw-thm-btn">Re -Appointment </button>
                                        </div>



                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

            </section>

            {/*Rating Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#rating-Modal" */}
            <div className="modal step-modal" id="rating-Modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-0 ">
                        <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                            <div>
                                <h6 className="heading-grad mb-0 fz-24">Rating </h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "rgba(239, 0, 0, 1)" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body pb-5 px-4">
                            <div className="row justify-content-center">
                                <div className="col-lg-9">
                                    <div className="rating-modal-bx lab-view-bx">
                                        <img src="/lab-avtar.png" alt="" />
                                    </div>

                                    <div className="rating-modal-content text-center">
                                        <h5>How was your experience <br /> with <span className="dcotr-name">Advance Lab Tech </span> </h5>
                                        <ul className="doctr-rating-list my-2">
                                            <li className="doctr-rating-item"><a href="javascript:void(0)" className="nw-rating-nav"> <FontAwesomeIcon icon={solidStar} />  </a></li>
                                            <li className="doctr-rating-item"><a href="javascript:void(0)" className="nw-rating-nav"> <FontAwesomeIcon icon={solidStar} />  </a></li>
                                            <li className="doctr-rating-item"><a href="javascript:void(0)" className="nw-rating-nav"> <FontAwesomeIcon icon={solidStar} /> </a></li>
                                            <li className="doctr-rating-item"><a href="javascript:void(0)" className="nw-rating-nav nw-regular-star"> <FontAwesomeIcon icon={regularStar} /> </a></li>
                                            <li className="doctr-rating-item"><a href="javascript:void(0)" className="nw-rating-nav nw-regular-star"> <FontAwesomeIcon icon={regularStar} /> </a></li>
                                        </ul>
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Write your Review</label>
                                            <textarea name="" id="" className="form-control nw-text-filed"></textarea>
                                        </div>
                                    </div>

                                    <div>
                                        <button className="nw-thm-btn w-100">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Rating Popup End */}
        </>
    )
}

export default LabTestDetailsCompleted