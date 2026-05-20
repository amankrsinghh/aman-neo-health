import { faAmbulance, faArrowLeft, faLocationArrow, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function AmbulanceBookingCancel() {
    return (
        <>
            <section className="ambulance-booking-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <div className="book-ambulance-bx pb-5">
                                <div className="ambulance-heading">

                                    <h6 className="py-3"><a href="javascript:void(0)" className="back-btn me-2"><FontAwesomeIcon icon={faArrowLeft} /></a> Patient Info</h6>

                                    <div className="ambulance-kilo-meter-bx">
                                        <div className="ambulance-km-content">
                                            <span className="ambulace-km-icon"><FontAwesomeIcon icon={faAmbulance} /></span>
                                            <div>
                                                <h5>Ambulance</h5>
                                                <p>24 KM</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4>$ 20</h4>
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
                                        <button className="nw-danger-outline-btn w-100">Cancel</button>
                                    </div>
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

export default AmbulanceBookingCancel