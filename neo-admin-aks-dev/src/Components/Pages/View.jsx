import {  faFileExport, faPrint } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { BsCapsule } from "react-icons/bs";

function View() {
    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between mega-content-bx">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">View</h3>
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
                                                Doctor Appointments
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <a href="#" className="breadcrumb-link">
                                                Appointment Details
                                            </a>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            View
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>

                        <div className="exprt-bx d-flex align-items-center gap-2">
                            <button className="nw-exprt-btn"><FontAwesomeIcon icon={faPrint} /> Print </button>
                            <button className="nw-exprt-btn"><FontAwesomeIcon icon={faFileExport} /> Export </button>
                        </div>


                    </div>
                </div>


                <div className='new-mega-card'>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="view-report-card">
                                <div className="view-report-header">
                                    <h5>RX-10014</h5>
                                    <h6>Date: 8/21/2025</h6>
                                </div>

                                <div className="view-report-content">
                                    <div className="sub-content-title">
                                        <h4>RX.</h4>
                                    <h3><BsCapsule style={{color : "#00B4B5"}} /> Medications</h3>
                                    </div>

                                   <div className="view-medications-bx mb-3">
                                    <h5>1. Aserpin</h5>
                                     <ul className="viwe-medication-list">
                                        <li className="viwe-medication-item">Dosage: 10mg </li>
                                        <li className="viwe-medication-item">Frequency: Once daily </li>
                                        <li className="viwe-medication-item">Duration: 30 days</li>
                                        <li className="viwe-medication-item">Instructions: Bbbjjj</li>
                                        
                                    </ul>
                                   </div>

                                   <div className="view-medications-bx mb-3">
                                    <h5>1. Aserpin</h5>
                                     <ul className="viwe-medication-list">
                                        <li className="viwe-medication-item">Dosage: 10mg </li>
                                        <li className="viwe-medication-item">Frequency: Once daily </li>
                                        <li className="viwe-medication-item">Duration: 30 days</li>
                                        <li className="viwe-medication-item">Instructions: Bbbjjj</li>
                                        
                                    </ul>
                                   </div>

                                   <div className="diagnosis-bx mb-3">
                                        <h5>Diagnosis</h5>
                                        <p>Hypertension</p>
                                   </div>

                                   <div className="diagnosis-bx mb-3">
                                        <h5>Diagnosis</h5>
                                        <p>-</p>
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

export default View