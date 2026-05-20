import { faCirclePlus, faCircleXmark, faEye, faFileExport, faPen, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FaPlusSquare } from "react-icons/fa";


function AllotmentDetailsSecond() {
    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Allotment Details</h3>
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
                                                Bed management
                                            </a>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Allotment Details
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        <div className="exprt-bx d-flex align-items-center gap-2 flex-wrap">
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
                                <div className="nw-allotment-details my-3">
                                    <div className="row">

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <h6>Name</h6>
                                            <p>Ravi Kumar</p>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <h6>Patient ID</h6>
                                            <p>PA-987654320</p>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <h6>Age</h6>
                                            <p>20 Years</p>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <h6>Gender</h6>
                                            <p>Male</p>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <h6>Phone</h6>
                                            <p>+91-9876543210</p>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <h6>Email</h6>
                                            <p>john.smith@example.com</p>
                                        </div>

                                        <div className="col-md-12 mb-3">
                                            <h6>Address</h6>
                                            <p>23 Medical Center Blvd, Suite 45, Jaipur, India</p>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <h6>Emergency Contact Name</h6>
                                            <p>Ajay Kumar</p>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <h6>Emergency Contact Phone</h6>
                                            <p>+91-9876543210</p>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="neo-health-patient-info-card mb-3">
                                <h5>Allotment Details</h5>
                                <div className="nw-allotment-details my-3">
                                    <div className="row">

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <h6>Allotment Date</h6>
                                            <p>20 June 2025</p>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <h6>Expected Discharge Date</h6>
                                            <p>25 June 2025</p>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <h6>Actual Discharge</h6>
                                            <p ><span className="paid-title">Discharged </span>(20 June 2025) </p>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <h6>Gender</h6>
                                            <p>Male</p>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <h6>Head  Doctor</h6>
                                            <p className="chnge fw-500">Dr. David Patel </p>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <h6>Doctor ID</h6>
                                            <p>D-2001</p>
                                        </div>

                                        <div className="col-md-12 mb-3">
                                            <h6>Admission Reason</h6>
                                            <p>Chest pain</p>
                                        </div>

                                        <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                                            <h6>Note</h6>
                                            <p>Patient requires regular monitoring of vital signs every 4 hours.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="neo-health-patient-info-card mb-3">
                                <h5 className="mb-3">Attending Doctors and  Nurse</h5>
                                <div className="table-section new-allotment-table ">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Type</th>
                                                    <th>Date</th>

                                                </tr>
                                            </thead>
                                            <tbody>

                                                <tr >
                                                    <td>Dr. Ravi  Kumar</td>
                                                    <td >Doctor</td>
                                                    <td>20 June 2025</td>
                                                </tr>

                                                <tr >
                                                    <td><span className="nw-booked-icon">Jenny Wilson</span></td>
                                                    <td >Nurse</td>
                                                    <td>20 June 2025</td>
                                                </tr>



                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        </div>


                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="neo-health-patient-info-card mb-3">
                                <h5>Bed Information</h5>
                                <div className="nw-allotment-details my-3">
                                    <div className="row">

                                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                                            <h6>Room Number</h6>
                                            <p>R-1</p>
                                        </div>

                                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                                            <h6>Floor</h6>
                                            <p>First</p>
                                        </div>

                                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                                            <h6>Bad</h6>
                                            <p className="">B-2</p>
                                        </div>

                                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                                            <h6>Department</h6>
                                            <p>Cardiology</p>
                                        </div>

                                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                                            <h6>Daily Rate</h6>
                                            <p >$25</p>
                                        </div>

                                    </div>
                                </div>

                            </div>

                            <div className="neo-health-patient-info-card mb-3">
                                <h5>Prescriptions</h5>
                                <div className="row">
                                    <div className="col-lg-6 mb-3">
                                        <div className="mt-3">
                                            <div className="barcd-scannr barcde-scnnr-card ms-0">
                                                <div className="barcd-content">
                                                    <h4>SP-9879</h4>
                                                    <img src="/barcode.png" alt="" />
                                                </div>

                                                <div className="barcode-id-details">
                                                    <div>
                                                        <h6>Patient Id </h6>
                                                        <p>PS-9001</p>
                                                    </div>


                                                    <div>
                                                        <h6>Appointment ID </h6>
                                                        <p>OID-8876</p>
                                                    </div>
                                                </div>

                                            </div>


                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="d-flex flex-column justify-content-between h-100">
                                            <div className="admin-table-bx">
                                                <div className="">
                                                    <div className="admin-table-sub-details d-flex align-items-center gap-2 doctor-title ">
                                                        <img src="/doctor-avatr.png" alt="" />
                                                        <div>
                                                            <h6>Dr. David Patel </h6>
                                                            <p className="fs-14 fw-500">DO-4001</p>
                                                        </div>
                                                    </div>
                                                    <div className="admin-table-sub-details my-3">
                                                        <p>Date :  <span className="nw-booked-icon fw-500">25-11-03</span></p>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="d-flex align-items justify-content-between">
                                                <div>
                                                    <button type="button" className="text-success"><FontAwesomeIcon icon={faPen} /></button>
                                                    <button type="button" className="text-danger"><FontAwesomeIcon icon={faTrash} /></button>
                                                </div>

                                                <div className="d-flex align-items gap-2">
                                                    <div>
                                                        <span className="approved rounded-5 active py-1">Active</span>
                                                    </div>

                                                    <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faPrint} /></button>
                                                    <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faEye} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="neo-health-patient-info-card mb-3">

                                <div className="row mt-3">
                                    <div className="d-flex aling-items-center justify-content-between mb-3">
                                        <h5 className="mb-0">Billing Information</h5>
                                        <div>
                                            <button className="nw-adding-bill-btn" ><FontAwesomeIcon icon={faCirclePlus} /></button>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="table-section new-allotment-table nw-payment-table">
                                            <div className="table table-responsive mb-0">
                                                <table className="table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Item</th>
                                                            <th>Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr >
                                                            <td>Bed Charges</td>
                                                            <td >$125</td>

                                                        </tr>

                                                        <tr >
                                                            <td>Doctor Charges</td>
                                                            <td >$25</td>

                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="laboratory-report-bx border-top ">
                                            <div className="lab-amount-bx mt-2 px-3">
                                                <ul className="lab-amount-list">
                                                    <li className="lab-amount-item">Total :  <span className="price-title fw-700">$150</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="row mt-2">
                                     <h5 className="mb-3">Payment</h5>
                                    <div className="col-lg-12">
                                        <div className="table-section new-allotment-table nw-payment-table">
                                            <div className="table table-responsive mb-0">
                                                <table className="table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Payment Type</th>
                                                            <th>Date</th>
                                                            <th>Amount</th>


                                                        </tr>
                                                    </thead>
                                                    <tbody>



                                                        <tr >
                                                            <td>Cash</td>
                                                            <td >22 June 2025</td>
                                                            <td >$125</td>

                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="appointment-crd-details my-2">
                                    <ul className="appointment-crd-list">
                                        <li className="appointment-crd-item">Total Payment <span className="appointment-crd-title">$150</span></li>
                                        <li className="appointment-crd-item">Payment Add <span className="appointment-crd-title">$150</span></li>
                                        <li className="appointment-crd-item">Pending Payment <span className="appointment-crd-title"> $0</span></li>
                                        <li className="appointment-crd-item">Payment Status <span className=" approved approved-active py-1"> Payment Complete</span></li>
                                    </ul>
                                </div>

                                <div className="report-remark mt-3">
                                    <h6 className="fw-400">Note: </h6>
                                    <p>-</p>
                                </div>


                            </div>


                        </div>

                    </div>

                </div>
            </div>

            {/* <!-- Payment Add Popup Start --> */}
            {/* <!--  data-bs-toggle="modal" data-bs-target="#add-Payment" --> */}
            <div className="modal step-modal" id="add-Payments" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content rounded-0">
                        <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                            <div>
                                <h6 className="lg_title mb-0">Payment Add</h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body pb-5 px-4 pb-5">
                            <div className="row justify-content-center">
                                <div className="col-lg-12">
                                    <div className="laboratory-report-bx">
                                        <ul className="laboratory-report-list">
                                            <li className="laboratory-item">Total Amount <span className="laboratory-title">$150</span></li>
                                            <li className="laboratory-item">Payment Add <span className="laboratory-title">$150</span></li>
                                            <li className="laboratory-item">Pending Payment  <span className="laboratory-title">$0</span></li>
                                        </ul>

                                    </div>
                                </div>

                                <div className="my-3">
                                    <h5 className="add-contact-title text-black mb-3">Services</h5>
                                    <div className="education-frm-bx mb-3 py-2 bg-transparent">
                                        <form action="">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Service</label>
                                                        <input
                                                            type="text"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Service name"
                                                        />

                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="return-box">
                                                        <div className="custom-frm-bx flex-column flex-grow-1">
                                                            <label htmlFor="">Amount($)</label>
                                                            <input
                                                                type="text"
                                                                className="form-control nw-frm-select"
                                                                placeholder="Enter amount"
                                                                value=""
                                                            />

                                                        </div>

                                                        <div className="">
                                                            <button className="text-black"><FontAwesomeIcon icon={faTrash} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>

                                    <div className="education-frm-bx mb-3 py-2 bg-transparent">
                                        <form action="">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Service</label>
                                                        <input
                                                            type="text"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Service name"
                                                        />

                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="return-box">
                                                        <div className="custom-frm-bx flex-column flex-grow-1">
                                                            <label htmlFor="">Amount($)</label>
                                                            <input
                                                                type="text"
                                                                className="form-control nw-frm-select"
                                                                placeholder="Enter amount"
                                                                value=""
                                                            />

                                                        </div>

                                                        <div className="">
                                                            <button className="text-black"><FontAwesomeIcon icon={faTrash} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="text-end">
                                        <a href="javascript:void(0)" className="add-employee-btn"><FaPlusSquare /> Add More</a>
                                    </div>
                                </div>

                                <div className="my-3">
                                    <h5 className="add-contact-title text-black mb-3">Payment</h5>
                                    <form action="">
                                        <div className="education-frm-bx mb-3 py-2 bg-transparent">
                                            <div className="row">
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Date</label>
                                                        <input
                                                            type="date"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Service name"
                                                        />

                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Amount Type</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select">
                                                                <option>Cash</option>
                                                            </select>
                                                        </div>

                                                    </div>
                                                </div>




                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="return-box">
                                                        <div className="custom-frm-bx flex-column flex-grow-1">
                                                            <label htmlFor="">Amount($)</label>
                                                            <input
                                                                type="text"
                                                                className="form-control nw-frm-select"
                                                                placeholder="Enter amount"
                                                                value="0"
                                                            />

                                                        </div>

                                                        <div className="">
                                                            <button className="text-black"><FontAwesomeIcon icon={faTrash} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>


                                    <div className="text-end">
                                        <a href="javascript:void(0)" className="add-employee-btn"><FaPlusSquare /> Add More</a>
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Payment   Status</label>
                                        <div class="select-wrapper">
                                            <select class="form-select custom-select">
                                                <option>Payment Complete</option>
                                            </select>
                                        </div>

                                    </div>
                                </div>

                                <div className="d-flex gap-3 justify-content-end">
                                    <button className="nw-cancel-btn">Cancel</button>
                                    <button className="nw-thm-btn w-auto">Save Payment</button>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Payment Add Popup End --> */}


            {/* <!-- Discharge Patient Popup Start --> */}
            {/* <!--  data-bs-toggle="modal" data-bs-target="#discharge-Patient" --> */}
            <div className="modal step-modal" id="discharge-Patient" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content rounded-0">
                        <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                            <div>
                                <h6 className="lg_title mb-0">Discharge Patient</h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body pb-5 px-4 pb-5">
                            <div className="row">
                                <div className="col-lg-12">
                                    <p >Complete the discharge process for patient <strong style={{ color: "#4D667E" }}>Ravi Kumar</strong> from Bad  <strong style={{ color: "#4D667E" }}>B-1</strong></p>

                                    <div className="laboratory-report-bx mt-3">
                                        <h5 className="add-contact-title text-black">Payment</h5>
                                        <ul className="laboratory-report-list">
                                            <li className="laboratory-item ">Bed Charges <span className="laboratory-title">$125</span></li>
                                            <li className="laboratory-item border-bottom pb-3">Doctor Charges <span className="laboratory-title">$25</span></li>
                                        </ul>

                                        <div className="lab-amount-bx mt-2">
                                            <ul className="lab-amount-list">
                                                <li className="lab-amount-item">Total<span className="price-title fw-700">$150</span></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="laboratory-report-bx">
                                        <ul className="laboratory-report-list">
                                            <li className="laboratory-item">Payment Add <span className="laboratory-title">$150</span></li>
                                            <li className="laboratory-item">Pending Payment  <span className="laboratory-title">$0</span></li>
                                            <li className="laboratory-item">Payment Status <span className="approved approved-active">Payment Complete</span></li>
                                        </ul>

                                    </div>
                                </div>

                            </div>

                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Discharge Date</label>
                                        <input
                                            type="date"
                                            className="form-control nw-frm-select"
                                            placeholder="Enter Service name"
                                        />

                                    </div>
                                </div>


                                <div className="col-lg-6 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Discharge Time</label>
                                        <input
                                            type="time"
                                            className="form-control nw-frm-select"
                                            placeholder="Enter Service name"
                                        />

                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Note</label>
                                        <textarea name="" id="" className="form-control"></textarea>
                                    </div>
                                </div>

                                <div className="d-flex gap-3 justify-content-end">
                                    <button className="nw-cancel-btn">Cancel</button>
                                    <button className="nw-thm-btn w-auto">Confirm Discharge</button>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Discharge Patient Popup End --> */}

        </>
    )
}

export default AllotmentDetailsSecond