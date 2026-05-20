import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

import { MdSimCard } from "react-icons/md";

function VaccinationSelectSim() {
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
                                                <h5>Select Via</h5>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <label className="vaccine-certificate-type-bx">
                                                        <input
                                                            type="radio"
                                                            name="vaccineType"
                                                            className="vaccine-radio"
                                                        />

                                                        <div className="vaccine-mega-bx">
                                                            <span><MdSimCard  className="vaccine-icon" style={{color : "#00B4B5"}} /></span>
                                                            <div className="vaccine-content">
                                                                <h5>Import Using Mobile OTP</h5>
                                                                <p>
                                                                    Quickly fetch your health data with a simple <br /> mobile OTP verification
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <label className="vaccine-certificate-type-bx">
                                                        <input
                                                            type="radio"
                                                            name="vaccineType"
                                                            className="vaccine-radio"
                                                        />

                                                        <div className="vaccine-mega-bx">
                                                            <span><MdSimCard  className="vaccine-icon" style={{color : "#00B4B5"}} /></span>
                                                            <div className="vaccine-content">
                                                                <h5>Import via ABDM/CoWIN</h5>
                                                                <p>
                                                                    Quickly fetch your health data with a simple <br /> ABDM
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

export default VaccinationSelectSim