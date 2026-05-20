
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { BiSolidShieldPlus } from "react-icons/bi";


function VaccinationCertificate() {
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
                                    <a href="javascript:void(0)" className="text-black fz-20 me-2"><FontAwesomeIcon icon={faArrowLeft}/></a>
                                    <h5 className="heading-grad fz-24 mb-0">Vaccination</h5>
                                </div>
                                <div className="all-profile-data-bx">
                                    <div className="row ">
                                        <div className="col-lg-12">
                                           <div className="imported-certificated">
                                             <h5>Imported Certificate</h5>
                                           </div>
                                           <div className="import-certificate-bx">
                                                <div className="text-center">
                                                  <span className="shield-plus-icon"><BiSolidShieldPlus /></span>
                                                    <div className="shield-content">
                                                        <h6>No Vaccination Record Found</h6>
                                                        <p>We couldn’t find any vaccination records <br /> linked to this profile.</p>
                                                    </div>
                                                </div>
                                           </div>

                                           <div className="text-center mt-3">
                                                <button className="vaccine-btn">Import Vaccination Certificate</button>
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

export default VaccinationCertificate