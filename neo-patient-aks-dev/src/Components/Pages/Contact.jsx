import { faEnvelope, faHome, faLocationDot, faPhone, faStar, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Contact() {
    return (
        <>
            <section className="tp-breadcrum-section">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="text-center mb-3">
                                <h4 className="lg_title">Contact</h4>
                            </div>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="#" className="breadcrumb-link">
                                                <FontAwesomeIcon icon={faHome} />
                                            </a>
                                        </li>


                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Contact
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="contact-us-section">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-lg-5 col-md-12 col-sm-12">
                            <div className="contact-detail-card">
                                <div className="contact-info-bx mb-3">
                                    <h6 className="mb-0">Get in touch</h6>
                                    <h5 className="heading-grad fz-40">Have Any Question?</h5>
                                </div>

                                <div className="contact-info-card  mb-3">
                                    <div>
                                        <span className="contact-awesome-icon"><FontAwesomeIcon icon={faPhone} /></span>
                                    </div>

                                    <div>
                                        <h4>Call Now</h4>
                                        <p>+91-9876543210</p>
                                    </div>
                                </div>
                                <div className="contact-info-card mb-3">
                                    <div>
                                        <span className="contact-awesome-icon"><FontAwesomeIcon icon={faEnvelope} /></span>
                                    </div>

                                    <div>
                                        <h4>Email Address</h4>
                                        <p>User@gmail.com</p>
                                    </div>
                                </div>
                                <div className="contact-info-card mb-3">
                                    <div>
                                        <span className="contact-awesome-icon"><FontAwesomeIcon icon={faLocationDot} /></span>
                                    </div>

                                    <div>
                                        <h4>Address</h4>
                                        <p>4517 Washington Ave. Manchester, india</p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="contact-frm-card px-lg-4">
                                <form action="">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Name</label>
                                        <input type="text" className="form-control new-control-frm px-5" placeholder="Enter Name" />

                                        <div className="contact-add-icon">
                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faUser} /> </span>
                                        </div>

                                    </div>

                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Mobile Number</label>
                                        <input type="text" className="form-control new-control-frm px-5" placeholder="Enter Mobile Number" />
                                        <div className="contact-add-icon">
                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faPhone} /> </span>
                                        </div>
                                    </div>

                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Email</label>
                                        <input type="text" className="form-control new-control-frm px-5" placeholder="Enter Email Address" />
                                        <div className="contact-add-icon">
                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faEnvelope} /> </span>
                                        </div>
                                    </div>

                               
                                    <div className="custom-frm-bx">
                                        <label>Schedule</label>
                                        <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faStar} /> </span>
                                            <select className="nw-select">
                                                <option>Select Subject</option>
                                                <option>Test 1</option>
                                                <option>Test 2</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="custom-frm-bx">
                                    <label htmlFor="">Message</label>
                                    <textarea name="" id="" className="form-control new-control-frm"></textarea>
                                    </div>

                                    <div className="mt-5 text-center">
                                        <button className="nw-thm-btn ">Submit</button>
                                    </div>



                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}

export default Contact