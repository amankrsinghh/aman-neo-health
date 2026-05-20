import { faAmbulance, faChevronRight, faLocationArrow, faLocationDot,  } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function AmbulancePickup() {
  return (
      <>
    <section className="ambulance-booking-section">
        <div className="container">
            <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                    <div className="book-ambulance-bx pb-5">
                    <div className="ambulance-heading">
                        <h6 className="py-3">Book Ambulance</h6>
                       <form action="">

                         <div className="custom-frm-bx">
                            <input type="text" className="form-control nw-text-filed px-5" placeholder="Pick Up Address" />

                            <div className="location-pickup-bx">
                                <span className="location-pickup-icon"><FontAwesomeIcon icon={faLocationDot}/></span>
                            </div>
                        </div>


                         <div className="custom-frm-bx">
                            <input type="text" className="form-control nw-text-filed px-5" placeholder="Enter Drop address" />

                            <div className="location-pickup-bx">
                                <span className="location-pickup-icon"><FontAwesomeIcon icon={faLocationArrow}/></span>
                            </div>
                        </div>

                        <div className="mt-5">
                            <button className="nw-thm-btn w-100 py-3">Search & Next</button>
                        </div>
                       </form>
                    </div>

                     <div className="ambulance-pickup-bx mt-4">
                      <div className="pickup-parent-bx">
                          <div className="pickup-cotnent-mega">
                            <span className="ambulance-pickup-icon"><FontAwesomeIcon icon={faAmbulance}/></span>
                            <div className="ambulance-booked-content">
                                <h6>Ambulance booked</h6>
                                <h4>Pick-up in 1 min</h4>
                            </div>
                        </div>

                        <div>
                            <button className="tracking-btn">Tracking <span className="trace-right-icon"><FontAwesomeIcon icon={faChevronRight}/></span> </button>
                        </div>
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

export default AmbulancePickup