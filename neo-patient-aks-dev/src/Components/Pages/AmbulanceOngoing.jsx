import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { faAmbulance, faLocationArrow, faLocationDot } from "@fortawesome/free-solid-svg-icons"

function AmbulanceOngoing() {
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
                                    <h5 className="heading-grad fz-24 mb-0">Details</h5>
                                </div>
                                <div className="all-profile-data-bx">
                                    <div className="row ">
                                        <div className="col-lg-12">
                                            <div className="ambulance-booking-bx mb-3">
                                                <div className="ambulance-mega-bx">
                                                    <div className="ambulance-pic-content">
                                                        <span className="ambulance-icon"> <FontAwesomeIcon icon={faAmbulance}/> </span>
                                                        <div className="ambulance-timing-content">
                                                            <p>Book Ambulance Date</p>
                                                            <h5>20 July 2025 10:10 PM</h5>
                                                        </div>
                                                    </div>
                                                    <div className="ambulance-counting-bx">
                                                        <p>Ambulance number</p>
                                                        <h6>TG10A9856</h6>
                                                    </div>

                                                    <div className="ambulance-counting-bx">
                                                        <p>Amount</p>
                                                        <h6>$20</h6>
                                                    </div>
                                                   
                                                    <div>
                                                        <span className="ongoing-track">Ongoing</span>
                                                    </div>
                                                </div>

                                                <div className="ambulance-tracking-bx">
                                                    <div className="ambulance-live-location-bx">
                                                        <span className="live-tracking-icon"> <FontAwesomeIcon icon={faLocationDot}/> </span>
                                                        <div className="pick-up-content">
                                                            <p>Pick Up Address</p>
                                                            <h6>123, 4th Main Road, Indiranagar, Bangalore</h6>    
                                                        </div>
                                                    </div>

                                                    <div className="ambulance-live-location-bx">
                                                        <span className="live-tracking-icon"> <FontAwesomeIcon icon={faLocationArrow}/> </span>
                                                        <div className="pick-up-content">
                                                            <p>Drop Address</p>
                                                            <h6>154/11, Bannerghatta Main Road, Opposi...</h6>    
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {/* <button className="thm-btn thm-outline-btn">View Details</button> */}
                                                    </div>
                                                </div>

                                                <div className="ambulance-history-bx">
                                                    <h6>Booking Details</h6>
                                                    <div className="ambulance-booking-info-bx">
                                                        <ul className="ambulance-booking-list">
                                                            <li className="ambulance-item">Booking  ID<span className="ambulance-title">#987676454</span></li>
                                                            <li className="ambulance-item">Driver Name<span className="ambulance-title">MOHAMMED</span></li>
                                                            <li className="ambulance-item">Ambulance number<span className="ambulance-title">TG10A9856</span></li>
                                                            <li className="ambulance-item">Drop Time<span className="ambulance-title">-</span></li>
                                                            <li className="ambulance-item">Amount<span className="ambulance-title">$20</span></li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-end gap-3 mt-3">
                                                    <button className="nw-danger-outline-btn">Cancel</button>
                                                    <button className="nw-thm-btn fw-700" style={{color :"#00B4B5"}}>Tracking</button>
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

export default AmbulanceOngoing