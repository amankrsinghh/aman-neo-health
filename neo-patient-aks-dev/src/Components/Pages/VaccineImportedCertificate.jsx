import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { faArrowLeft, faCheckCircle, faCircleXmark, faDownload, faShareNodes } from "@fortawesome/free-solid-svg-icons"


function VaccineImportedCertificate() {
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
                                         <div className="imported-certificated">
                                                <h5>Imported Certificate</h5>
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <div className="vaccine-report-download">
                                                        <img src="/vaccine-report.png" alt="" />
                                                        <div className="vaccine-report-details">
                                                            <div>
                                                                <h5>Ram Prasad</h5>
                                                                <p>Covid Shield</p>
                                                            </div>

                                                            <div>
                                                                <h6><FontAwesomeIcon icon={faCheckCircle}/> Dose Completed </h6>
                                                            </div>
                                                        </div>

                                                        <button className="nw-thm-btn w-100 fw-600" style={{color : "#00B4B5"}} data-bs-toggle="modal" data-bs-target="#certificate-Modal">View Certificate</button>

                                                    </div>
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <div className="vaccine-report-download">
                                                        <img src="/vaccine-report.png" alt="" />
                                                        <div className="vaccine-report-details">
                                                            <div>
                                                                <h5>Ram Prasad</h5>
                                                                <p>Covid Shield</p>
                                                            </div>

                                                            <div>
                                                                <h6><FontAwesomeIcon icon={faCheckCircle}/> Dose Completed </h6>
                                                            </div>
                                                        </div>

                                                        <button className="nw-thm-btn w-100 fw-600" style={{color : "#00B4B5"}} data-bs-toggle="modal" data-bs-target="#certificate-Modal">View Certificate</button>

                                                    </div>
                                            </div>

                                             <div className="text-end mt-3">
                                                <button className="vaccine-btn ">Import Vaccination Certificate</button>
                                            </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </section>

             {/*Certificate Modal Popup Start  */}
                        {/* data-bs-toggle="modal" data-bs-target="#certificate-Modal" */}
                        <div className="modal step-modal" id="certificate-Modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                            aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-md">
                                <div className="modal-content rounded-0 ">
                                    <div className="d-flex align-items-center justify-content-between py-3 px-4 border-bottom">

                                        <div>
                                            <h5 className="heading-grad mb-0">Certificate Detail</h5>
                                        </div>
            
                                        <div>
                                            <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "rgba(239, 0, 0, 1)" }}>
                                                <FontAwesomeIcon icon={faCircleXmark} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="modal-body pb-5 px-4">
                                        <div className="row justify-content-center">
                                           <div className="col-lg-10">
                                            <div className="certificate-view-bx">
                                                    <div className="vaccine-bar-code">
                                                            <img src="/black-bar-code.png" alt="" />
                                                    </div>

                                                    <div className="vaccine-certificate-details">
                                                        <div className="vaccine-certificate-content">
                                                            <h6>Name</h6>
                                                            <h4>Ram Prasad</h4>
                                                        </div>
                                                        <div className="vaccine-certificate-content text-end">
                                                            <h6>Age</h6>
                                                            <h4>34</h4>
                                                        </div>
                                                        <div className="vaccine-certificate-content ">
                                                            <h6>Date</h6>
                                                            <h4>21/05/2019</h4>
                                                        </div>
                                                        <div className="vaccine-certificate-content text-end">
                                                            <h6>Vaccine Name</h6>
                                                            <h4>Chovidshield</h4>
                                                        </div>
                                                        <div className="vaccine-certificate-content ">
                                                            <h6>Dose</h6>
                                                            <h4>1</h4>
                                                        </div>
                                                        <div className="vaccine-certificate-content text-end">
                                                            <h6>Center</h6>
                                                            <h4>Appolo City Hospital</h4>
                                                        </div>
                                                        <div className="vaccine-certificate-content ">
                                                            <h6>Certificate ID</h6>
                                                            <h4>RAM19CSH001</h4>
                                                        </div>
                                                    </div>

                                                  


                                            </div>

                                              <div className="mt-3 d-flex align-items-center justify-content-center gap-2">
                                                <button className="nw-warning-outline-btn w-100" style={{borderWidth : "1px"}}> <FontAwesomeIcon icon={faShareNodes}/> Share</button>
                                                         <button className="vaccine-btn w-100"><FontAwesomeIcon icon={faDownload}/> Download</button>
                                                    </div>


                                           </div>
            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*  Certificate Modal Popup End */}


        </>
  )
}

export default VaccineImportedCertificate