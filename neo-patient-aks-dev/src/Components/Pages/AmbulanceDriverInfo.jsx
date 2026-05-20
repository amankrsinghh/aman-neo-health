import { faAmbulance, faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function AmbulanceDriverInfo() {
    return (
        <>
            <section className="ambulance-booking-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <div className="book-ambulance-bx pb-5">
                                <div className="ambulance-heading">
                                    
                                    <h6 className="py-3"><a href="javascript:void(0)" className="back-btn me-2"><FontAwesomeIcon icon={faArrowLeft}/></a> Patient Info</h6>

                                    <div className="ambulance-kilo-meter-bx">
                                            <div className="ambulance-km-content">
                                                <span className="ambulace-km-icon"><FontAwesomeIcon icon={faAmbulance}/></span>
                                            <div>
                                                <h5>Ambulance</h5>
                                                <p>24 KM</p>
                                            </div>
                                            </div>

                                            <div>
                                                <h4>$ 20</h4>
                                            </div>
                                    </div>


                                    <form action="">

                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Patient Name</label>
                                            <input type="text" className="form-control nw-text-filed pe-4" placeholder="Enter Name" />
                                        </div>

                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Mobile Number</label>
                                            <input type="number" className="form-control nw-text-filed pe-4" placeholder="Enter Mobile Number" />
                                        </div>

                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Emergency Contact Person Number</label>
                                            <input type="number" className="form-control nw-text-filed pe-4" placeholder="Enter Mobile Number" />
                                        </div>

                                        <div className="custom-frm-bx">
                                            <label>Severity</label>
                                            <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                <select className="nw-select">
                                                    <option>Select</option>
                                                   
                                                </select>
                                            </div>
                                        </div>

                                        <div className="custom-frm-bx">
                                            <label>Gender</label>
                                            <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                <select className="nw-select">
                                                    <option>Select</option>
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Note</label>                                
                                            <textarea name="" id="" className="form-control nw-text-filed" placeholder="Type Note"></textarea>
                                        </div>


                                        <div className="mt-5">
                                            <button className="nw-thm-btn w-100 py-3">Confirm Ambulance Book</button>
                                        </div>
                                    </form>
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

export default AmbulanceDriverInfo