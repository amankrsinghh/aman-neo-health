// import { faCheck } from "@fortawesome/free-solid-svg-icons"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { BiTransferAlt } from "react-icons/bi";

function EditPatient() {
  return (
     <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row ">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2">Edit Patient</h3>
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
                                                Patients
                                            </a>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Edit Patient
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="new-panel-card">
                    <form action="">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="">
                                    <h5 className="add-contact-title">Patient Details</h5>
                                </div>
                            </div>

                               <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Patient ID</label>
                                    <input
                                        type="text"
                                        className="form-control nw-frm-select"
                                        placeholder="Enter Patient ID"
                                        value="PA-987654320"
                                    />
                                </div>
                            </div>
                            
                               <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Patient Name</label>
                                    <input
                                        type="text"
                                        className="form-control nw-frm-select"
                                        placeholder="Enter Patient Name"
                                        value="Ravi Kumar"
                                    />
                                </div>
                            </div>

                            
                               <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="form-control nw-frm-select"
                                        placeholder=""
                                        value=""
                                    />
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div class="custom-frm-bx">
                                    <label>Gender</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select ">
                                            <option>---Select Gender---</option>
                                            <option value="" selected>Male</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Mobile Number</label>
                                    <input
                                        type="number"
                                        className="form-control nw-frm-select"
                                        placeholder="Enter  mobile number"
                                        value="9876543210"
                                    />
                                </div>
                            </div>
                            
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Email</label>
                                    <input
                                        type="email"
                                        className="form-control nw-frm-select"
                                        placeholder="Enter Email"
                                        value="ravi.kumar987867@gmail.com"
                                    />
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Emergency Contact Name</label>
                                    <input
                                        type="text"
                                        className="form-control nw-frm-select"
                                        placeholder="Enter Emergency Contact Name"
                                        value="Ajay Kumar"
                                    />
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Emergency Contact Phone</label>
                                    <input
                                        type="number"
                                        className="form-control nw-frm-select"
                                        placeholder="Enter  Emergency Contact Phone"
                                        value="9876543210"
                                    />
                                </div>
                            </div>

                             <div className="col-lg-4 col-md-6 col-sm-12">
                                <div class="custom-frm-bx">
                                    <label>Department</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select ">
                                            <option>---Select Department---</option>
                                            <option selected>Cardiology</option>
                                            
                                        </select>
                                    </div>
                                </div>
                            </div>

                             {/* <div className="col-lg-4 col-md-6 col-sm-12">
                                <div class="custom-frm-bx">
                                    <label>Lab Test</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select ">
                                            <option>---Select---</option>
                                       
                                            
                                        </select>
                                    </div>
                                </div>
                            </div> */}



                             <div className="col-lg-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Address</label>
                                    <textarea name="" id="" className="form-control nw-frm-select" placeholder="Enter Address" value="23 Medical Center Blvd, Suite 45,  jaipur,  india"></textarea>
                                </div>
                            </div>

                             <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">State</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select">
                                            <option>---Select State---</option>
                                            <option value="" selected>Rajasthan</option>
                                        </select>
                                    </div>

                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">City</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select">
                                            <option>---Select City---</option>
                                            <option value="" selected>Jaipur</option>
                                        </select>
                                    </div>

                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Pin code</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select">
                                            <option>Enter Pin code</option>
                                            <option value="" selected>302028</option>
                                        </select>
                                    </div>

                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Status</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select">
                                            <option>Active</option>
                                            <option value="" selected>Active</option>
                                        </select>
                                    </div>

                                </div>
                            </div>


                        </div>


                        <div className="mt-5 d-flex align-items-center justify-content-end gap-3">
                            <button type="button" className="nw-thm-btn rounded-3" data-bs-toggle="modal" data-bs-target="#added-Doctor" >Save</button>
                        </div>

                    </form>

                </div>






            </div>

              {/* <!-- add-Department Alert Popup Start --> */}
                                    {/* <!--  data-bs-toggle="modal" data-bs-target="#added-Doctor" --> */}
                                    <div className="modal step-modal" id="added-Doctor" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                                        aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered modal-md">
                                            <div className="modal-content rounded-0">
                                              
                                                <div className="modal-body  py-5 px-4">
                                                    <div className="row ">
                                                        <div className="col-lg-12">
                                                            <div className="text-center add-success-bx">
                                                                <span className="success-doctor-icon"><BiTransferAlt /></span>
                                                                    
                                                                    <h5 className="py-4 fz-24 fw-400">Are You Sure You Want To Transfer <br /> Patient To IPD</h5>
            
                                                                    <div className="d-flex align-items-center justify-content-center gap-3">
                                                                        <button className="nw-thm-btn outline"  data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                                                                    <button className="nw-thm-btn px-5"  data-bs-dismiss="modal" aria-label="Close">Confirm</button>
                                                                    </div>
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- add-Department Popup End --> */}
        </>
  )
}

export default EditPatient