import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { BsCapsule } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { IoMdQrScanner } from "react-icons/io";
import { faDownload, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";


function AddPrescriptionDetails() {
    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between mega-content-bx">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Prescription Details</h3>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <NavLink to="/" className="breadcrumb-link">
                                                Dashboard
                                            </NavLink>
                                        </li>


                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Prescription Details
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>


                    </div>
                </div>


                <div className='new-mega-card'>
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                            <div className="view-report-card">
                                <div className="">
                                    <div className="view-report-header d-flex align-items-center justify-content-between">
                                        <div>
                                            <h5>RX-10014</h5>
                                            <h6>Date: 8/21/2025</h6>
                                        </div>

                                        <div className="admin-table-bx">
                                            <div className="">
                                                <div className="admin-table-sub-details d-flex align-items-center gap-2">
                                                    <img src="/doctor-avatr.png" alt="" style={{ border: "5px solid #fff" }} />
                                                    <div className="">
                                                        <h6 className="fw-700 fz-14" style={{ color: "#00B4B5" }}>Dr. David Patel </h6>
                                                        <p>DO-4001</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>



                                </div>

                                <div className="view-report-content">
                                    <div className="sub-content-title">
                                        <h4>RX.</h4>
                                        <h3><BsCapsule style={{ color: "#00B4B5" }} /> Medications</h3>
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

                        <div className="col-lg-6 col-md-12 col-sm-12">
                            {/* <div className="new-invoice-card">
                                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                                            <div>
                                                                <h5 className="first_para fw-700 fz-20 mb-0">Details</h5>
                                                            </div>
                                                            <div className="d-flex align-item-center gap-2">
                                                                <button className="print-btn"> <FontAwesomeIcon icon={faDownload} /> Download Bill</button>
                                                                <button className="print-btn"> <FontAwesomeIcon icon={faPrint} /> Print</button>
                                                            </div>
                                                        </div>
                        
                        
                        
                        
                                                        <div className="laboratory-report-bx">
                                                            <ul className="laboratory-report-list">
                                                                <li className="laboratory-item border-0">Aserpin <span className="laboratory-title">$20</span></li>
                                                                <li className="laboratory-item">Ibuprofen <span className="laboratory-title"></span></li>
                                                            </ul>
                        
                                                            <div className="lab-amount-bx">
                                                                <ul className="lab-amount-list">
                                                                    <li className="lab-amount-item">Total Amount :<span className="price-title">$40</span></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div> */}

                            <div className="">
                                <div className="generate-bill  mb-3">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div>
                                            <h5 className="first_para fw-700 fz-20 mb-0">Scan Medications</h5>
                                        </div>
                                        <div className="d-flex align-item-center gap-2">
                                            <button className="thm-btn rounded-2" data-bs-toggle="modal" data-bs-target="#scanner-Request"> <IoMdQrScanner className="fz-18 me-2" /> Scan</button>

                                        </div>
                                    </div>

                                    <div className="medicine-card">
                                        <div className="left-icon">
                                            <BsCapsule style={{ color: "#00B4B5" }} />
                                        </div>

                                        <span className="med-name">Aserpin</span>

                                        <label className="check-container">
                                            <input type="checkbox" defaultChecked />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>

                                    <div className="medicine-card">
                                        <div className="left-icon">
                                            <BsCapsule style={{ color: "#00B4B5" }} />
                                        </div>

                                        <span className="med-name">Ibuprofen</span>

                                        <label className="check-container">
                                            <input type="checkbox" />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="">
                                    <div className="new-invoice-card mobile-prescription">
                                        <div className="d-flex align-items-center justify-content-between mb-3 pharmacy-bill">
                                            <div className="mobile-title">
                                                <h5 className="first_para fw-700 fz-20 mb-0">Generate Bill</h5>
                                            </div>
                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                                <button className="print-btn"> <FontAwesomeIcon icon={faTrash} /> Delete</button>
                                                <button className="print-btn"> <FontAwesomeIcon icon={faDownload} /> Download PDF</button>
                                                <button className="print-btn"> <FontAwesomeIcon icon={faPrint} /> Print</button>
                                            </div>
                                        </div>

                                        <div className="laboratory-header mb-4">
                                            <div className="laboratory-name">
                                                <h5>World Pharmacy</h5>
                                                <p><span className="laboratory-title">GSTIN : </span> 09897886454</p>
                                            </div>
                                            <div className="invoice-details">
                                                <p><span className="laboratory-invoice">Invoice :</span> IN89767</p>
                                                <p><span className="laboratory-invoice">Date :</span> 03/11/2025</p>
                                            </div>
                                        </div>

                                        <div className="nw-laboratory-bill-crd">
                                            <div className="nw-laboratory-bill-bx">
                                                <h6>Bill To</h6>
                                                <h4>Aarav Mehta</h4>
                                                <p className="mb-0"><span className="laboratory-phne">Phone :</span> +91-9876543210</p>
                                            </div>
                                            <div className="nw-laboratory-bill-bx">
                                                <h6>Order</h6>
                                                <h4>Aarav Mehta</h4>
                                                <p className="mb-0"><span className="laboratory-phne">Phone :</span> +91-9876543210</p>
                                            </div>
                                        </div>

                                        <div className="laboratory-report-bx">
                                            <ul className="laboratory-report-list">
                                                <li className="laboratory-item"><span className="price-title">Medicine</span> <span className="price-title">Price</span></li>
                                                <li className="laboratory-item border-0"><span>Aserpin</span> <span className="price-title">200.00</span></li>
                                                <li className="laboratory-item"><span>Ibuprofen</span> <span className="price-title">200.00</span></li>
                                            </ul>

                                            <div className="lab-amount-bx">
                                                <ul className="lab-amount-list">
                                                    <li className="lab-amount-item">Subtotal : <span className="price-title">400.00</span></li>
                                                    <li className="lab-amount-item lab-divider">GST (5%) :  <span className="price-title">68.00</span></li>
                                                    <li className="lab-amount-item">Total :  <span className="price-title">468.00</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                <div className="custom-frm-bx mt-3">
                                    <label htmlFor="">Note</label>
                                    <textarea name="" id="" className="form-control nw-frm-select"></textarea>
                                </div>
                            </div>
                        </div>


                        <div className="mt-3 text-end border-top pt-3">
                            <div className="permission-check-main-bx">

                                <div className="form-check custom-check d-inline-block">
                                    <input className="form-check-input" type="checkbox" value="" id="chats" />
                                    <label className="form-check-label" for="chats">
                                        Payment Done
                                    </label>
                                </div>

                            </div>

                            <div>
                                <NavLink to="/add-prescriptions-detail" className="nw-thm-btn">Save & Continue</NavLink>
                            </div>
                        </div>





                    </div>

                </div>
            </div>




        </>
    )
}

export default AddPrescriptionDetails