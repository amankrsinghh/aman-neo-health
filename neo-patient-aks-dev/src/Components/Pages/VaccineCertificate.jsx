import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"


function VaccineCertificate() {
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
                                    <a href="javascript:void(0)" className="text-black fz-20 me-2"><FontAwesomeIcon icon={faArrowLeft} /></a>
                                    <h5 className="heading-grad fz-24 mb-0">Vaccination</h5>
                                </div>
                                <div className="all-profile-data-bx">
                                    <div className="row ">
                                        <div className="col-lg-12">
                                            <div className="imported-certificated">
                                                <h5>Covid-19 Vaccine Certificate</h5>
                                            </div>

                                            {/* <div className="row">
                                           <div className="col-lg-2">
                                                         <div className="vaccine-certificate-bx">
                                                <img src="/vaccine-certificate.png" alt="" />
                                            </div>
                                           </div>
                                           <div className="col-lg-2">
                                                         <div className="vaccine-certificate-bx">
                                                <img src="/vaccine-certificate.png" alt="" />
                                            </div>
                                           </div>
                                           <div className="col-lg-2">
                                                         <div className="vaccine-certificate-bx">
                                                <img src="/vaccine-certificate.png" alt="" />
                                            </div>
                                           </div>
                                           
                                            </div> */}

                                            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
                                                <div className="col">
                                                    {/* <div className="vaccine-certificate-bx vax-cert-select-bx">
                                                        <label className="vax-radio-wrapper">
                                                            <input
                                                                type="radio"
                                                                name="vaccine_certificate"
                                                                className="vax-hidden-radio"
                                                            />
                                                            <span className="vax-custom-radio"></span>
                                                        </label>

                                                        <img src="/vaccine-certificate.png" alt="" />

                                                        <span className="vax-image-check">

                                                        </span>
                                                    </div> */}

                                                    <div class="vaccine-certificate-bx vax-cert-select-bx">
                                                        <label class="vax-radio-wrapper">
                                                            <input type="checkbox" class="vax-hidden-checkbox" />
                                                            <span class="vax-custom-checkbox"></span>
                                                            <span class="vax-image-check"></span>
                                                        </label>

                                                        <img src="/vaccine-certificate.png" alt="Certificate" />
                                                    </div>

                                                </div>

                                                <div className="col">

                                                    <div class="vaccine-certificate-bx vax-cert-select-bx">
                                                        <label class="vax-radio-wrapper">
                                                            <input type="checkbox" class="vax-hidden-checkbox" />
                                                            <span class="vax-custom-checkbox"></span>
                                                            <span class="vax-image-check"></span>
                                                        </label>

                                                        <img src="/vaccine-certificate.png" alt="Certificate" />
                                                    </div>
                                                </div>

                                                <div className="col">
                                                    <div class="vaccine-certificate-bx vax-cert-select-bx">
                                                        <label class="vax-radio-wrapper">
                                                            <input type="checkbox" class="vax-hidden-checkbox" />
                                                            <span class="vax-custom-checkbox"></span>
                                                            <span class="vax-image-check"></span>
                                                        </label>

                                                        <img src="/vaccine-certificate.png" alt="Certificate" />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div class="vaccine-certificate-bx vax-cert-select-bx">
                                                        <label class="vax-radio-wrapper">
                                                            <input type="checkbox" class="vax-hidden-checkbox" />
                                                            <span class="vax-custom-checkbox"></span>
                                                            <span class="vax-image-check"></span>
                                                        </label>

                                                        <img src="/vaccine-certificate.png" alt="Certificate" />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div class="vaccine-certificate-bx vax-cert-select-bx">
                                                        <label class="vax-radio-wrapper">
                                                            <input type="checkbox" class="vax-hidden-checkbox" />
                                                            <span class="vax-custom-checkbox"></span>
                                                            <span class="vax-image-check"></span>
                                                        </label>

                                                        <img src="/vaccine-certificate.png" alt="Certificate" />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div class="vaccine-certificate-bx vax-cert-select-bx">
                                                        <label class="vax-radio-wrapper">
                                                            <input type="checkbox" class="vax-hidden-checkbox" />
                                                            <span class="vax-custom-checkbox"></span>
                                                            <span class="vax-image-check"></span>
                                                        </label>

                                                        <img src="/vaccine-certificate.png" alt="Certificate" />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div class="vaccine-certificate-bx vax-cert-select-bx">
                                                        <label class="vax-radio-wrapper">
                                                            <input type="checkbox" class="vax-hidden-checkbox" />
                                                            <span class="vax-custom-checkbox"></span>
                                                            <span class="vax-image-check"></span>
                                                        </label>

                                                        <img src="/vaccine-certificate.png" alt="Certificate" />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div class="vaccine-certificate-bx vax-cert-select-bx">
                                                        <label class="vax-radio-wrapper">
                                                            <input type="checkbox" class="vax-hidden-checkbox" />
                                                            <span class="vax-custom-checkbox"></span>
                                                            <span class="vax-image-check"></span>
                                                        </label>

                                                        <img src="/vaccine-certificate.png" alt="Certificate" />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div class="vaccine-certificate-bx vax-cert-select-bx">
                                                        <label class="vax-radio-wrapper">
                                                            <input type="checkbox" class="vax-hidden-checkbox" />
                                                            <span class="vax-custom-checkbox"></span>
                                                            <span class="vax-image-check"></span>
                                                        </label>

                                                        <img src="/vaccine-certificate.png" alt="Certificate" />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div class="vaccine-certificate-bx vax-cert-select-bx">
                                                        <label class="vax-radio-wrapper">
                                                            <input type="checkbox" class="vax-hidden-checkbox" />
                                                            <span class="vax-custom-checkbox"></span>
                                                            <span class="vax-image-check"></span>
                                                        </label>

                                                        <img src="/vaccine-certificate.png" alt="Certificate" />
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="text-end mt-3">
                                                <button className="vaccine-btn ">Continue</button>
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

export default VaccineCertificate