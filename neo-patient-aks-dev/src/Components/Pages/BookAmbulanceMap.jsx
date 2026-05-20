import { faLocationArrow, faLocationDot,  } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function BookAmbulanceMap() {
  return (
    <>
    <section className="ambulance-booking-section">
        <div className="container">
            <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="book-ambulance-bx">
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
                    </div>
                </div>

                <div className="col-lg-8 col-md-6 col-sm-12">
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

export default BookAmbulanceMap