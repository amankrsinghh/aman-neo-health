
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { BiInjection } from "react-icons/bi";

function VaccineCertificateType() {
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
                                                <h5>Vaccine Certificate Type</h5>
                                            </div>

                                            {/* <div className="row">
                                            <div className="col-lg-6">
                                                <div className="vaccine-certificate-type-bx">
                                                      <div className="vaccine-mega-bx">
                                                          <span ><BiInjection className="vaccine-icon"/></span>
                                                        <div className="vaccine-content">
                                                            <h5>UIP Vaccines</h5>
                                                            <p>Choose the vaccine type you received to fetch <br /> the correct certificate.</p>
                                                        </div>
                                                      </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="vaccine-certificate-type-bx">
                                                      <div className="vaccine-mega-bx">
                                                          <span ><BiInjection className="vaccine-icon"/></span>
                                                        <div className="vaccine-content">
                                                            <h5>UIP Vaccines</h5>
                                                            <p>Choose the vaccine type you received to fetch <br /> the correct certificate.</p>
                                                        </div>
                                                      </div>
                                                </div>
                                            </div>
                                           </div> */}

                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <label className="vaccine-certificate-type-bx">
                                                        <input
                                                            type="radio"
                                                            name="vaccineType"
                                                            className="vaccine-radio"
                                                        />

                                                        <div className="vaccine-mega-bx">
                                                            <span><BiInjection className="vaccine-icon" /></span>
                                                            <div className="vaccine-content">
                                                                <h5>COVID-19 Vaccines</h5>
                                                                <p>
                                                                    Choose the vaccine type you received to fetch <br />
                                                                    the correct certificate.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>

                                                <div className="col-lg-6">
                                                    <label className="vaccine-certificate-type-bx">
                                                        <input
                                                            type="radio"
                                                            name="vaccineType"
                                                            className="vaccine-radio"
                                                        />

                                                        <div className="vaccine-mega-bx">
                                                            <span><BiInjection className="vaccine-icon" /></span>
                                                            <div className="vaccine-content">
                                                                <h5>Private Vaccines</h5>
                                                                <p>
                                                                    Choose the vaccine type you received to fetch <br />
                                                                    the correct certificate.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="text-end mt-3">
                                                <button className="vaccine-btn">Continue To Import</button>
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

export default VaccineCertificateType