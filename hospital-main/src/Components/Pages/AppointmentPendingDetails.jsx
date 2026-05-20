import { faCheck, faCircleXmark, faEye, faFileExport, faMessage, faPhone, faPrint } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink } from "react-router-dom"

function AppointmentPendingDetails() {
    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
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
                                                Appointments
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

                        <div className="exprt-bx d-flex align-items-center gap-2 flex-wrap">
                            <NavLink to="/add-prescription" className="nw-thm-btn w-auto">Add Prescriptions</NavLink>
                            <button className="nw-thm-btn w-auto" data-bs-toggle="modal" data-bs-target="#add-Lab">Add  Lab Test </button>
                            <button className="progress-btn"> <FontAwesomeIcon icon={faCheck} /> Mark as in progress</button>
                            <button className="nw-exprt-btn"><FontAwesomeIcon icon={faPrint} /> Print </button>
                            <button className="nw-exprt-btn"><FontAwesomeIcon icon={faFileExport} /> Export </button>
                        </div>

                    </div>
                </div>


                <div className='new-panel-card'>
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
                                    <NavLink to="/patient-view" className="view-patient-btn text-center"><FontAwesomeIcon icon={faEye} /> View Patient Record</NavLink>
                                </div>
                            </div>
                            <div className="neo-health-patient-info-card mb-3">
                                <h5>Doctor Information</h5>
                                <div className="d-flex align-items-center justify-content-between my-3">
                                    <div className="admin-table-bx">
                                        <div className="admin-table-sub-bx ">
                                            <img src="/doctor-avatr.png" alt="" />
                                            <div className="admin-table-sub-details doctor-title">
                                                <h6>Dr. David Patel </h6>
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
                                            <h6>Fees</h6>
                                            <p>$25</p>
                                        </div>
                                        <div>
                                            <h6>Specialization </h6>
                                            <p>Neurology </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <NavLink to="/doctor-view" className="view-patient-btn text-center"><FontAwesomeIcon icon={faEye} /> View Doctor Profile</NavLink>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="neo-health-patient-info-card mb-3">
                                <h5>Appointment Information</h5>
                                <div className="neo-health-user-information d-flex align-items-center justify-content-between my-3">
                                    <div className="">
                                        <div className="mb-3">
                                            <h6>Created Date</h6>
                                            <p>28 June 2025 </p>
                                        </div>
                                        <div className="mb-3">
                                            <h6 className="">Appointment Date</h6>
                                            <p>30 June 2025 10:00pm</p>
                                        </div>
                                    </div>

                                    <div className="">
                                        <div className="mb-3">
                                            <h6>Appointment  Id</h6>
                                            <p> #89324879</p>
                                        </div>

                                        <div className="mb-3">
                                            <h6>Status</h6>
                                            <p><span className="approved nw-pending ">Pending </span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="neo-health-patient-info-card mb-3">
                                <h5>Payment Information</h5>

                                <div className=" my-3">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div>
                                            <h6>Fees</h6>

                                        </div>
                                        <div>
                                            <p>$25</p>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6>Payment Status</h6>
                                        </div>
                                        <div>
                                            <p><span className="approved nw-pending py-1">Pending</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* <!-- Add Lab Test Popup Start --> */}
            {/* <!--  data-bs-toggle="modal" data-bs-target="#add-Lab" --> */}
            <div className="modal step-modal fade" id="add-Lab" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-0">
                        <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                            <div>
                                <h6 className="lg_title mb-0">Add  Lab Test </h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "rgba(239, 0, 0, 1)" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body pb-5 px-4 pb-5">
                            <div className="row justify-content-center">
                                <div className="col-lg-10">
                                    <div className="add-deprtment-pic">
                                        <img src="/add-lab.png" alt="" />
                                        <p className="pt-2">Please add new lab test assign to patient</p>
                                    </div>

                                    <form action="">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Select Lab</label>
                                            <div class="select-wrapper">
                                                <select class="form-select rounded-2">
                                                    <option>--Select--</option>
                                                </select>
                                            </div>

                                        </div>

                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Test Select</label>
                                            <div class="select-wrapper">
                                                <select class="form-select rounded-2">
                                                    <option>--Select--</option>
                                                </select>
                                            </div>

                                        </div>

                                        <div className="mt-3">
                                            <button type="submit" className="nw-thm-btn w-100"> Submit</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Add Lab Test Popup End --> */}

        </>
    )
}

export default AppointmentPendingDetails