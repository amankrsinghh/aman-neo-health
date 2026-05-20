import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { faArrowLeft, faCalendar, faCircleXmark, faDownload, faEye, faFilePdf, faLocationDot, faMessage, faPhone, faShareNodes, faVideo, } from "@fortawesome/free-solid-svg-icons"
import { BsCapsule } from "react-icons/bs";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

function AppointmentDetailsCompletedTwo() {
    return (
        <>
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
                                                            <span className="nw-result-bx completed-title">Upcoming</span>
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

                                            <div className="col-lg-6 mb-3">
                                                <div className="appointment-booking-detail-bx">
                                                    <div className="booking-details-tp-title">
                                                        <h5>Prescriptions</h5>
                                                    </div>
                                                    <div className="appointment-listing-bx">
                                                        <div className="prescriptin-bx">
                                                            <div className="prescriptin-content">

                                                                <div className="prescriptin-picture">
                                                                    <img src="/prescriptin-pic.png" alt="" />
                                                                    <div>
                                                                        <p>Prescription Date</p>
                                                                        <h6>8/21/2025</h6>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <button className="thm-outline-btn thm-btn" data-bs-toggle="modal" data-bs-target="#prescription-Modal"> <FontAwesomeIcon icon={faEye} /> View </button>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="col-lg-6 mb-3">
                                                <div className="appointment-booking-detail-bx">
                                                    <div className="booking-details-tp-title">
                                                        <h5>Lab tests prescribed by the doctor</h5>
                                                    </div>
                                                    <div className="appointment-listing-bx">
                                                        <div className="lab-parent-bx">
                                                            <div className="nw-presc-lab-bx">
                                                                <img src="/lab-pic.png" alt="" />
                                                                <div className="appointment-info-details">
                                                                    <h4 className="">Advance Lab Tech</h4>
                                                                    <p className=""><FontAwesomeIcon icon={faLocationDot} /> Malviya Nagar, Jaipur</p>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <a href="javascript:void(0)"><img src="/map.svg" alt="" /></a>
                                                            </div>

                                                        </div>



                                                        <div className="prescriptin-bx my-3">
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

                                                        <div className="text-center">
                                                            <button className="thm-btn">Book Appointment</button>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className=" mt-3 text-end d-flex align-items-center justify-content-end gap-2">
                                                <button className="nw-warning-outline-btn" data-bs-toggle="modal" data-bs-target="#rating-Modal" >Add Rating</button>
                                                <button className="nw-thm-btn">Re -Appointment </button>
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
                                    <h6 className="heading-grad mb-0 fz-24">Prescription</h6>
                                </div>
                                <div>
                                    <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "rgba(239, 0, 0, 1)" }}>
                                        <FontAwesomeIcon icon={faCircleXmark} />
                                    </button>
                                </div>
                            </div>
                            <div className="modal-body pb-5 px-4">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="pres-date-bx">
                                                <img src="/schedule.svg" alt="" />
                                                <div>
                                                    <p>Date</p>
                                                    <h6>8/21/2025</h6>
                                                </div>
                                            </div>
                                            <div>
                                                <a href="javascript:void(0)" className="text-black fz-18"> <FontAwesomeIcon icon={faShareNodes} /> </a>
                                                <a href="javascript:void(0)" className="text-black fz-18"> <FontAwesomeIcon icon={faDownload} /> </a>
                                            </div>
                                        </div>

                                        <div className="view-report-card">
                                            <div className="view-report-header">
                                                <h5>RX-10014</h5>
                                                <h6>Date: 8/21/2025</h6>
                                            </div>

                                            <div className="view-report-content">
                                                <div className="sub-content-title">
                                                    <h4>RX.</h4>
                                                    <h3><BsCapsule style={{ color: "#00B4B5" }} /> Medications</h3>
                                                </div>

                                                <div className="view-medications-bx mb-3">
                                                    <h5>1. Aserpin</h5>
                                                    <ul className="viwe-medication-list">
                                                        <li className="viwe-medication-item">Dosage: 10mg </li>
                                                        <li className="viwe-medication-item">Frequency: Once daily </li>
                                                        <li className="viwe-medication-item">Duration: 30 days</li>
                                                        <li className="viwe-medication-item">Instructions: Bbbjjj</li>

                                                    </ul>
                                                </div>

                                                <div className="view-medications-bx mb-3">
                                                    <h5>1. Aserpin</h5>
                                                    <ul className="viwe-medication-list">
                                                        <li className="viwe-medication-item">Dosage: 10mg </li>
                                                        <li className="viwe-medication-item">Frequency: Once daily </li>
                                                        <li className="viwe-medication-item">Duration: 30 days</li>
                                                        <li className="viwe-medication-item">Instructions: Bbbjjj</li>

                                                    </ul>
                                                </div>

                                                <div className="diagnosis-bx mb-3">
                                                    <h5>Diagnosis</h5>
                                                    <p>Hypertension</p>
                                                </div>

                                                <div className="diagnosis-bx mb-3">
                                                    <h5>Diagnosis</h5>
                                                    <p>-</p>
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
                                      <div className="rating-modal-bx">
                                            <img src="/date-time-img.png" alt="" />
                                      </div>

                                       <div className="rating-modal-content text-center">
                                                <h5>How was your experience <br /> with <span className="dcotr-name">Dr. David Patel </span> </h5>
                                                <ul className="doctr-rating-list my-2">
                                                    <li className="doctr-rating-item"><a href="javascript:void(0)" className="nw-rating-nav"> <FontAwesomeIcon icon={solidStar} />  </a></li>
                                                    <li  className="doctr-rating-item"><a href="javascript:void(0)" className="nw-rating-nav"> <FontAwesomeIcon icon={solidStar} />  </a></li>
                                                    <li  className="doctr-rating-item"><a href="javascript:void(0)" className="nw-rating-nav"> <FontAwesomeIcon icon={solidStar} /> </a></li>
                                                    <li  className="doctr-rating-item"><a href="javascript:void(0)" className="nw-rating-nav nw-regular-star"> <FontAwesomeIcon icon={regularStar} /> </a></li>
                                                    <li  className="doctr-rating-item"><a href="javascript:void(0)" className="nw-rating-nav nw-regular-star"> <FontAwesomeIcon icon={regularStar} /> </a></li>
                                                </ul>
                                                <div className="custom-frm-bx">
                                                        <label htmlFor="">Write your Review</label>
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
                {/*  Rating Popup End */}


            </>
        </>
    )
}

export default AppointmentDetailsCompletedTwo