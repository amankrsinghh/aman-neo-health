import { IoCloudUploadOutline } from "react-icons/io5";
import { FaPlusSquare } from "react-icons/fa";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function EditAllotment() {
  return (
     <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row ">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2">Edit Allotment</h3>
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
                                            Edit Allotment
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
                                    <h5 className="add-contact-title">Bed Details</h5>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div class="custom-frm-bx">
                                    <label>Floor</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select ">
                                            <option>First</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div class="custom-frm-bx">
                                    <label>Room</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select ">
                                            <option>1</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div class="custom-frm-bx">
                                    <label>Department</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select ">
                                            <option>Cardiology</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div class="custom-frm-bx">
                                    <label>Bed</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select ">
                                            <option>Bed-2</option>
                                        </select>
                                    </div>
                                </div>
                            </div>


                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Bed Par Day Fees($)</label>
                                    <input
                                        type="text"
                                        className="form-control nw-frm-select"
                                        placeholder="Enter Par Day Fees"
                                        value="25"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="my-3">
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
                                <div class="custom-frm-bx">
                                    <label>Patient </label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select">
                                            <option>---Select Patient ---</option>
                                            <option value="" selected>Ravi Kumar</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="form-control nw-frm-select"
                                        placeholder="Enter Patient ID"
                                        value=""
                                    />
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Gender</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select">
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
                                        placeholder="Enter  Email"
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
                                        placeholder="Enter  Emergency Contact Name"
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

                            <div className="col-lg-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Address</label>
                                    <textarea name="" id="" className="form-control nw-frm-select" placeholder="Enter Address"value="23 Medical Center Blvd, Suite 45,  jaipur,  india"></textarea>
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



                            <div className="col-lg-12 my-3">
                                <div className="">
                                    <h5 className="add-contact-title">Allotment Details</h5>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Attending Doctor</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select">
                                            <option>---Select Attending Doctor---</option>
                                            <option value="" selected>Dr. David Patel </option>
                                        </select>
                                    </div>

                                </div>
                            </div>


                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Allotment Date</label>
                                    <input
                                        type="date"
                                        className="form-control nw-frm-select"
                                        placeholder=""
                                        value=""
                                    />

                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Expected Discharge Date</label>
                                    <input
                                        type="date"
                                        className="form-control nw-frm-select"
                                        placeholder=""
                                        value=""
                                    />

                                </div>
                            </div>

                            <div className="col-lg-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Admission Reason</label>
                                    <textarea name="" id="" className="form-control nw-frm-select" placeholder="" value="Chest pain"></textarea>
                                </div>
                            </div>

                            <div className="col-lg-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Note</label>
                                    <textarea name="" id="" className="form-control nw-frm-select" placeholder="" value="Patient requires regular monitoring of vital signs every 4 hours."></textarea>
                                </div>
                            </div>



                        </div>


                        <div className="">
                            <h5 className="add-contact-title">Allotment Details</h5>

                            <div className="education-frm-bx mb-4">
                                <div className="row">
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Select Type</label>
                                            <div class="select-wrapper">
                                                <select class="form-select custom-select">
                                                    <option>---Select type Doctors and  Nurse ets---</option>
                                                    <option value="" selected>Doctor</option>
                                                </select>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Attending Doctor</label>
                                            <div class="select-wrapper">
                                                <select class="form-select custom-select">
                                                    <option>---Select Attending octors and  Nurse  ---</option>
                                                    <option value="" selected>Dr.Ravi kumar</option>
                                                </select>
                                            </div>

                                        </div>
                                    </div>


                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="return-box">
                                            <div className="custom-frm-bx flex-column flex-grow-1">
                                                <label htmlFor="">Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control nw-frm-select"
                                                    placeholder="Enter  Year to"
                                                    value=""
                                                />

                                            </div>

                                            <div className="">
                                                <button className="text-black"><FontAwesomeIcon icon={faTrash} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </div>

                            <div className="education-frm-bx mb-2">
                                <div className="row">
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Select Type</label>
                                            <div class="select-wrapper">
                                                <select class="form-select custom-select">
                                                    <option>---Select type Doctors and  Nurse ets---</option>
                                                    <option value="" selected>Nurse</option>
                                                </select>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Attending Doctor</label>
                                            <div class="select-wrapper">
                                                <select class="form-select custom-select">
                                                    <option>---Select Attending octors and  Nurse  ---</option>
                                                    <option value="" selected>Jenny Wilson</option>
                                                </select>
                                            </div>

                                        </div>
                                    </div>


                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="return-box">
                                            <div className="custom-frm-bx flex-column flex-grow-1">
                                                <label htmlFor="">Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control nw-frm-select"
                                                    placeholder="Enter  Year to"
                                                    value=""
                                                />

                                            </div>

                                            <div className="">
                                                <button className="text-black"><FontAwesomeIcon icon={faTrash} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </div>
                             <div className="text-end">
                            <a href="javascript:void(0)" className="add-employee-btn"><FaPlusSquare /> Add More</a>
                        </div>

                        </div>

                        <div className="mt-5 d-flex align-items-center justify-content-end gap-3">
                            <button type="submit" className="nw-thm-btn rounded-3" >Save</button>
                        </div>

                    </form>

                </div>






            </div>
        </>
  )
}

export default EditAllotment