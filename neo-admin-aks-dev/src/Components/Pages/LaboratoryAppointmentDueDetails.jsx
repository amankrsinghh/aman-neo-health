import { faEye, faFileExport, faMessage, faPhone, faPrint } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function LaboratoryAppointmentDueDetails() {
  return (
    <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Appointment Details</h3>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="#" className="breadcrumb-link">
                                                Dashboard
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <a href="#" className="breadcrumb-link">
                                                Laboratory  Appointments
                                            </a>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Appointment Details
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>

                        <div className="exprt-bx d-flex align-items-center gap-2">
                            <button className="nw-exprt-btn"><FontAwesomeIcon icon={faPrint}/> Print </button>
                            <button className="nw-exprt-btn"><FontAwesomeIcon icon={faFileExport}/> Export </button>
                        </div>
                    </div>
                </div>


                <div className='new-mega-card'>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="neo-health-patient-info-card mb-3">
                                <h5>Patient Information</h5>
                                <div className="d-flex align-items-center justify-content-between my-3">
                                    <div className="admin-table-bx">
                                        <div className="admin-table-sub-bx">
                                            <img src="/admin-tb-logo.png" alt="" />
                                            <div className="admin-table-sub-details doctor-title">
                                                <h6>Wade Warren</h6>
                                                <p>PA-9001</p>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="neo-health-contact-bx">
                                        <button className="neo-health-contact-btn"><FontAwesomeIcon icon={faMessage} /></button>
                                        <button className="neo-health-contact-btn"><FontAwesomeIcon icon={faPhone} /></button>
                                    </div>
                                </div>

                                <div className="neo-health-user-information my-3">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div>
                                            <h6>Age</h6>
                                            <p>20 Years</p>
                                        </div>
                                        <div>
                                            <h6>Gender</h6>
                                            <p>Male</p>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6>Address</h6>
                                            <p>23 Medical Center Blvd, Suite 45,  jaipur,  india</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button className="view-patient-btn"><FontAwesomeIcon icon={faEye} /> View Patient Record</button>
                                </div>
                            </div>

                            <div className="neo-health-patient-info-card mb-3">
                                <h5>Laboratory </h5>
                                <div className="d-flex align-items-center justify-content-between my-3">
                                    <div className="admin-table-bx">
                                        <div className="admin-table-sub-bx ">
                                            <img src="/profile-tab-avatar.png" alt="" />
                                            <div className="admin-table-sub-details doctor-title">
                                                <h6>Advance Lab Tech</h6>
                                                <p>LAB-4001</p>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="neo-health-contact-bx">
                                        <button className="neo-health-contact-btn"><FontAwesomeIcon icon={faMessage} /></button>
                                        <button className="neo-health-contact-btn"><FontAwesomeIcon icon={faPhone} /></button>
                                    </div>
                                </div>

                                <div className="neo-health-user-information my-3">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div>
                                            <h6>Address</h6>
                                            <p>23 Medical Center Blvd, Suite 45,  jaipur,  india</p>
                                        </div>

                                    </div>
                                </div>
                                <div>
                                    <button className="view-patient-btn"><FontAwesomeIcon icon={faEye} /> View Doctor Profile</button>
                                </div>
                            </div>
                        </div>


                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="neo-health-patient-info-card mb-3">
                                <h5>Lab Report</h5>
                                <div className="my-3 ad-labs-report-bx text-center">
                                    <img src="/ad-labs.png" alt="" className="mb-2" />
                                    <p>Please Wait for lab report update</p>
                                </div>
                            </div>


                             <div className="neo-health-patient-info-card mb-3">
                                <h5>Appointment Information</h5>
                                <div className="neo-health-user-information d-flex align-items-start justify-content-between my-3">
                                    <div className="">
                                        <div className="mb-3">
                                            <h6>Created Date</h6>
                                            <p>22 June 2025 </p>
                                        </div>
                                        <div className="mb-3">
                                            <h6 className="">Appointment Date</h6>
                                            <p>23 June 2025 10:00pm</p>
                                        </div>

                                         <div>
                                         <div className="mb-3">
                                            <h6>Status</h6>
                                            <p><span className="approved approved-pending ">Pending</span></p>
                                        </div>
                                    </div>
                                    </div>

                                    <div className="">
                                        <div className="mb-3">
                                            <h6>Appointment  Id</h6>
                                            <p> #89324879</p>
                                        </div>

                                        <div className="mb-3">
                                            <h6>Completed date </h6>
                                            <p> 23 June 2025 10:00pm</p>
                                        </div>

                                        
                                       
                                    </div>

                                   


                                </div>
                            </div>


                               <div className="neo-health-patient-info-card mb-3">
                                <h5>Payment Information</h5>

                                <div className=" my-3">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <div>
                                            <h6>CBC Payment</h6>

                                        </div>
                                        <div>
                                            <p>$10</p>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <div>
                                            <h6>Haemoglobin Payment</h6>
                                        </div>

                                        <div>
                                            <p>$15</p>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <div>
                                            <h6>Haemoglobin Payment</h6>
                                        </div>

                                        <div>
                                            <p>$25</p>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <div>
                                            <h6>Payment Status</h6>
                                        </div>

                                        <div>
                                            <p><span className="approved reject rounded-5 px-3 py-2">Due</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    
                          
                        </div>

                    </div>

                </div>
            </div>
        </>
  )
}

export default LaboratoryAppointmentDueDetails