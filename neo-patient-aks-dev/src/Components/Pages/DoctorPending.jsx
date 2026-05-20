import { faCalendar, faChevronLeft, faLocationDot, faMessage, faPhone, faVideo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function DoctorPending() {

    return (
        <>
            <section className="near-section">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="d-flex aling-items-center gap-3">
                                <div className="">
                                    <a href="javascript:void(0)" className="back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </a>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="my-appointment-info-card">
                                <div className="my-appointment-tp-bx">
                                    <div className="appoint-left-title-bx">
                                        <h5 className="fz-16 fw-700 mb-0 text-black"> <span className="cal-icon"><FontAwesomeIcon icon={faCalendar} /></span> 30 June 2025, at 10:00pm </h5>
                                    </div>
                                    <div className="appoint-right-title-bx">
                                        <span className="nw-result-bx">Pending Approve</span>
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
                    </div>

                </div>



            </section>
        </>
    )
}

export default DoctorPending