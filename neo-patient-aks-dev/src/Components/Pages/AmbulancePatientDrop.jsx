import { faCircleXmark, faLocationArrow, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RiMessage2Fill, RiVerifiedBadgeFill } from "react-icons/ri";


function AmbulancePatientDrop() {
  return (
     <>
            <section className="ambulance-booking-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <div className="book-ambulance-bx pb-4">
                                <div className="ambulance-booked-bx pt-3 mb-3">
                                    <h5>Drop off at in 7 min</h5>
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
                                        <button className="chating-ambulance-btn"><FontAwesomeIcon icon={faPhone}/> </button>
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
                                    <button className="nw-thm-btn outline" data-bs-toggle="modal" data-bs-target="#transport-Modal">View Details</button>
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


               {/*prescription-Modal Popup Start  */}
                            {/* data-bs-toggle="modal" data-bs-target="#transport-Modal" */}
                            <div className="modal step-modal" id="transport-Modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered modal-md">
                                    <div className="modal-content rounded-0 ">
                                        <div className="d-flex align-items-center justify-content-end py-3 px-4">
                                            
                                            <div>
                                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{color: "rgba(239, 0, 0, 1)" }}>
                                                    <FontAwesomeIcon icon={faCircleXmark} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="modal-body pb-5 px-4">
                                            <div className="row">

                                                <div className="ambulance-trasport-bx">
                                                    <div className="transport-complete-bx">
                                                        <img src="/ambulance-logo.png" alt="" />
                                                        <span className="ambulance-verify"><RiVerifiedBadgeFill /></span>
                                                    </div>

                                                    <div className="transport-content">
                                                        <h5>Transport Completed</h5>
                                                        <p>The ambulance drop-off is completed</p>
                                                    </div>

                                                </div>

                                                <div className="text-center mt-5">
                                                    <button className="thm-btn w-25">Ok</button>
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

export default AmbulancePatientDrop