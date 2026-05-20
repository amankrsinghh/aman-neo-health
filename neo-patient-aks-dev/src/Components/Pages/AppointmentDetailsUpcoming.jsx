import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { faArrowLeft, faCalendar, faCircleXmark, faLocationDot, faMessage, faPhone, faVideo, } from "@fortawesome/free-solid-svg-icons"

function AppointmentDetailsUpcoming() {
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
                                            <div className="my-appointment-info-card">
                                                <div className="my-appointment-tp-bx">
                                                    <div className="appoint-left-title-bx">
                                                        <h5 className="fz-16 fw-700 mb-0 text-black"> <span className="cal-icon"><FontAwesomeIcon icon={faCalendar} /></span> 30 June 2025, at 10:00pm </h5>
                                                    </div>
                                                    <div className="appoint-right-title-bx">
                                                        <span className="nw-result-bx">Upcoming</span>
                                                    </div>
                                                </div>

                                                <div className="appointment-info-parent-bx">
                                                    <div className="appointment-info-sub-bx">
                                                        <img src="/doctor-timing.png" alt="" />
                                                        <div className="appointment-info-details">
                                                            <h4 className="">Dr.James Harris</h4>
                                                            <h6 className="nw-appointment-title">Psychologists <span className="slash-title" >|</span> Mercy Hospital</h6>
                                                            <p className=""><FontAwesomeIcon icon={faLocationDot} /> Malviya Nagar, Jaipur</p>
                                                        </div>
                                                    </div>
                                                    <div className="appointment-info-mega-bx">
                                                        <div className="not-accpent-bx">
                                                            <h6 className="not-accept-title"></h6>
                                                        </div>

                                                        <div>
                                                            <ul className="doctor-social-list">
                                                                <li className="doctor-social-item"><a href="javascript:void(0)" className="doctor-social-btn" > <FontAwesomeIcon icon={faMessage} /> </a></li>
                                                                <li className="doctor-social-item"><a href="javascript:void(0)" className="doctor-social-btn" > <FontAwesomeIcon icon={faPhone} /> </a></li>
                                                                <li className="doctor-social-item"><a href="javascript:void(0)" className="doctor-social-btn" > <FontAwesomeIcon icon={faVideo} /> </a></li>

                                                            </ul>
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
                                                        <li className="booking-item">Fees<span className="booking-title">$ 25 </span></li>
                                                        <li className="booking-item">Payment<span className="booking-title paid-title">Paid</span></li>
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

                                        <div className="text-end">
                                            <button className="nw-danger-outline-btn me-3" data-bs-toggle="modal" data-bs-target="#prescription-Modal">Cancel</button>
                                            <button className="nw-thm-btn">Reschedule</button>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

            </section>

            {/*prescription-Modal Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#prescription-Modal" */}
            <div className="modal step-modal" id="prescription-Modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-0 ">
                        <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                            <div>
                                <h6 className="heading-grad mb-0 fz-24">Cancel Appointment</h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "rgba(239, 0, 0, 1)" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body pb-5 px-4">
                            <div className="row justify-content-center">
                                <div className="col-lg-10">
                                    <div className="rating-modal-bx">
                                        <div>
                                            <h5>Are you sure you want to cancel this Appointment  </h5>
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Reason of cancellation</label>
                                                <textarea name="" id="" className="form-control nw-text-filed"></textarea>
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
                </div>
            </div>
            {/*  prescription-Modal Popup End */}
        </>
    )
}

export default AppointmentDetailsUpcoming