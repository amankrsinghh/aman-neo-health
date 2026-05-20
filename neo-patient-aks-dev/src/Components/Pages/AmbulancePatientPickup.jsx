import { faLocationArrow, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RiMessage2Fill } from "react-icons/ri";

function AmbulancePatientPickup() {
    return (
        <>
            <section className="ambulance-booking-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <div className="book-ambulance-bx pb-4">
                                <div className="ambulance-booked-bx pt-3 mb-3">
                                    <h5>Pick-up in 1 min</h5>
                                </div>

                                <div className="ambulance-driver-live-details">
                                    <div className="ambulance-driver-mega-bx">
                                        <div className="driver-picture-bx">
                                            <img src="/chat-logo.jpg" alt="" />
                                            <div>
                                                <h6>MOHAMMED</h6>
                                            </div>
                                        </div>
                                        <div className="ambulance-number">
                                            <h4>TG10A9856</h4>
                                            <p>Ambulance number</p>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mt-3">
                                        <button className="chating-ambulance-btn"><RiMessage2Fill /> Send a message</button>
                                        <button className="chating-ambulance-btn"><FontAwesomeIcon icon={faPhone} /> </button>
                                    </div>

                                </div>

                                <div className="finding-location-bx">
                                    <span className="location-icon"><FontAwesomeIcon icon={faLocationDot} /></span>
                                    <div>
                                        <p>Pick Up Address</p>
                                        <h5>123, 4th Main Road, Indiranagar, Bangalore</h5>
                                    </div>
                                </div>
                                <div className="finding-location-bx">
                                    <span className="location-icon rounded-2"><FontAwesomeIcon icon={faLocationArrow} /></span>
                                    <div>
                                        <p>Drop Address</p>
                                        <h5>154/11, Bannerghatta Main Road, Opposi...</h5>
                                    </div>
                                </div>

                                <div className="text-center mt-5">
                                    <button className="nw-thm-btn outline">View Details</button>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-8 col-md-6 col-sm-12 ">
                            <div>
                                <iframe
                                    src="https://www.google.com/maps?q=SMS+Hospital+Jaipur&output=embed"
                                    className="ambulance-location"
                                    loading="lazy"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AmbulancePatientPickup