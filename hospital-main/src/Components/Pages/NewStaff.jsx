import { IoCloudUploadOutline } from "react-icons/io5";
import { FaPlusSquare } from "react-icons/fa";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function NewStaff() {
  return (
      <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row ">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2">Add New Staff</h3>
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
                                                Staff
                                            </a>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                           Add New Staff
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="employee-tabs mb-4">
                            <ul className="nav nav-tabs gap-3 ps-2" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link active"
                                        id="home-tab"
                                        data-bs-toggle="tab"
                                        href="#home"
                                        role="tab"
                                    >
                                        Personal Info
                                    </a>
                                </li>

                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link"
                                        id="profile-tab"
                                        data-bs-toggle="tab"
                                        href="#profile"
                                        role="tab"
                                    >
                                        Professional
                                    </a>
                                </li>

                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link"
                                        id="contact-tab"
                                        data-bs-toggle="tab"
                                        href="#contact"
                                        role="tab"
                                    >
                                        Employment
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link"
                                        id="upload-tab"
                                        data-bs-toggle="tab"
                                        href="#upload"
                                        role="tab"
                                    >
                                        Access
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="new-panel-card">
                            <div className="">
                                <div className="tab-content" id="myTabContent">
                                    <div className="tab-pane fade show active" id="home" role="tabpanel">
                                        <form action="">
                                            <div className="row">
                                                <div className="d-flex align-items-center gap-3">
                                                    <h4 className="lg_title text-black fw-700 mb-3">Personal Information</h4>
                                                    
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="custom-frm-bx">
                                                        <div className="upload-box  p-3">
                                                            <div className="upload-icon mb-2">
                                                                <IoCloudUploadOutline />
                                                            </div>

                                                            <div>
                                                                <p className="fw-semibold mb-1">
                                                                    <label htmlFor="fileInput1" className="file-label file-select-label">
                                                                        Choose a file or drag & drop here
                                                                    </label>
                                                                </p>

                                                                <small className="format-title">JPEG Format</small>


                                                                <div className="mt-3">
                                                                    <label htmlFor="fileInput1" className="browse-btn">
                                                                        Browse File
                                                                    </label>
                                                                </div>

                                                                <input
                                                                    type="file"
                                                                    className="d-none"
                                                                    id="fileInput1"
                                                                    accept=".png,.jpg,.jpeg"
                                                                />

                                                                <div id="filePreviewWrapper" className="d-none mt-3">
                                                                    <img src="" alt="Preview" className="img-thumbnail" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>


                                            <div className="row">
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter name"
                                                            value=""
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx ">
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
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Address</label>
                                                        <textarea name="" id="" className="form-control nw-frm-select" placeholder="Enter Address"></textarea>
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>State</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select">
                                                                <option>---Select State---</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>City</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select">
                                                                <option>---Select City---</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Pin code</label>
                                                          <div class="select-wrapper">
                                                            <select class="form-select custom-select">
                                                                <option>---Enter Pin code---</option>
                                                            </select>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="col-lg-12 my-3">
                                                    <div className="">
                                                        <h5 className="add-contact-title">Contact Information</h5>
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Mobile Number</label>
                                                        <input
                                                            type="number"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  mobile number"
                                                            value=""
                                                        />

                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Email</label>
                                                        <input
                                                            type="email"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Email"
                                                            value=""
                                                        />

                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Emergency Contact Name</label>
                                                        <input
                                                            type="email"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Emergency Contact Name"
                                                            value=""
                                                        />

                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Emergency Contact Phone</label>
                                                        <input
                                                            type="email"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Emergency Contact Phone"
                                                            value=""
                                                        />
                                                    </div>
                                                </div>

                                                <div className="text-end">
                                                    <button type="submit" className="nw-thm-btn">Save & Continue</button>
                                                </div>

                                            </div>
                                        </form>
                                    </div>

                                    <div className="tab-pane fade" id="profile" role="tabpanel">
                                        <form action="">
                                            <div className="row">
                                                <h4 className="lg_title text-black fw-700 mb-3">Professional Information</h4>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Profession</label>
                                                        <input
                                                            type="text"
                                                            className="form-control nw-frm-select"
                                                            placeholder="e.g. Pharmacist, Nurse, etc."
                                                            value=""
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Specialization</label>
                                                        <input
                                                            type="text"
                                                            className="form-control nw-frm-select"
                                                            placeholder="e.g. Cardiology, Pediatrics, etc."
                                                            value=""
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Total Experience</label>
                                                        <input
                                                            type="text"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Total Experience"
                                                            value=""
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Professional Bio</label>
                                                        <textarea name="" id="" className="form-control nw-frm-select" placeholder="Enter professional biography and experience"></textarea>
                                                    </div>
                                                </div>


                                                <div className="col-lg-12 my-3">
                                                    <div className="">
                                                        <h5 className="add-contact-title">Education</h5>
                                                    </div>
                                                </div>


                                            </div>

                                            <div className="education-frm-bx mb-4">
                                                <div className="row">
                                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                                        <div className="custom-frm-bx">
                                                            <label htmlFor="">University / Institution</label>
                                                            <input
                                                                type="number"
                                                                className="form-control nw-frm-select"
                                                                placeholder="Enter University / Institution"
                                                                value=""
                                                            />

                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                                        <div className="custom-frm-bx">
                                                            <label htmlFor="">Degree / Qualification</label>
                                                            <input
                                                                type="email"
                                                                className="form-control nw-frm-select"
                                                                placeholder="Enter Degree / Qualification"
                                                                value=""
                                                            />

                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                                        <div className="custom-frm-bx">
                                                            <label htmlFor="">Year form</label>
                                                            <input
                                                                type="email"
                                                                className="form-control nw-frm-select"
                                                                placeholder="Enter Year form"
                                                                value=""
                                                            />

                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                                        <div className="return-box">
                                                            <div className="custom-frm-bx flex-column flex-grow-1">
                                                                <label htmlFor="">Year to</label>
                                                                <input
                                                                    type="email"
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

                                            <div className="education-frm-bx">
                                                <div className="row">
                                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                                        <div className="custom-frm-bx">
                                                            <label htmlFor="">University / Institution</label>
                                                            <input
                                                                type="number"
                                                                className="form-control nw-frm-select"
                                                                placeholder="Enter University / Institution"
                                                                value=""
                                                            />

                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                                        <div className="custom-frm-bx">
                                                            <label htmlFor="">Degree / Qualification</label>
                                                            <input
                                                                type="email"
                                                                className="form-control nw-frm-select"
                                                                placeholder="Enter Degree / Qualification"
                                                                value=""
                                                            />

                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                                        <div className="custom-frm-bx">
                                                            <label htmlFor="">Year form</label>
                                                            <input
                                                                type="email"
                                                                className="form-control nw-frm-select"
                                                                placeholder="Enter Year form"
                                                                value=""
                                                            />

                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                                        <div className="return-box">
                                                            <div className="custom-frm-bx flex-column flex-grow-1">
                                                                <label htmlFor="">Year to</label>
                                                                <input
                                                                    type="email"
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

                                            <div className="text-end my-3">
                                                <a href="javascript:void(0)" className="add-employee-btn"><FaPlusSquare /> Add More</a>
                                            </div>

                                            <div className="col-lg-12 my-3">
                                                <div className="">
                                                    <h5 className="add-contact-title">Certificate</h5>
                                                </div>
                                            </div>
                                            <div className="education-frm-bx mt-4 mb-4">
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                                        <div className="custom-frm-bx">
                                                            <label htmlFor="">Certificate</label>
                                                            <input
                                                                type="number"
                                                                className="form-control nw-frm-select"
                                                                placeholder="Enter Certificate Name"
                                                                value=""
                                                            />

                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                                        <div className="return-box">
                                                            <div className="custom-frm-bx mb-3 flex-column flex-grow-1">
                                                                <label className="">Certificate Upload</label>

                                                                <div className="custom-file-wrapper nw-frm-select">
                                                                    <span className="em-browse-btn">Browse File</span>
                                                                    <span className="em-file-name">No Choose file</span>
                                                                    <input type="file" className="real-file-input" />
                                                                </div>
                                                            </div>

                                                            <div className="">
                                                                <button className="text-black"><FontAwesomeIcon icon={faTrash} /></button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>


                                            </div>

                                            <div className="education-frm-bx">
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                                        <div className="custom-frm-bx">
                                                            <label htmlFor="">Certificate</label>
                                                            <input
                                                                type="number"
                                                                className="form-control nw-frm-select"
                                                                placeholder="Enter Certificate Name"
                                                                value=""
                                                            />

                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                                        <div className="return-box">
                                                            <div className="custom-frm-bx mb-3 flex-column flex-grow-1">
                                                                <label className="">Certificate Upload</label>

                                                                <div className="custom-file-wrapper nw-frm-select">
                                                                    <span className="em-browse-btn">Browse File</span>
                                                                    <span className="em-file-name">No Choose file</span>
                                                                    <input type="file" className="real-file-input" />
                                                                </div>
                                                            </div>

                                                            <div className="">
                                                                <button className="text-black"><FontAwesomeIcon icon={faTrash} /></button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>



                                            </div>

                                            <div className="text-end my-3">
                                                <a href="javascript:void(0)" className="add-employee-btn"><FaPlusSquare /> Add More</a>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-end gap-3">
                                                <button type="submit" className="nw-thm-btn outline rounded-3">Back </button>
                                                <button type="submit" className="nw-thm-btn rounded-3" >Save & Continue</button>
                                            </div>

                                        </form>
                                    </div>

                                    <div className="tab-pane fade" id="contact" role="tabpanel">
                                        <form action="">
                                            <div className="row">

                                                <div className="d-flex align-items-center gap-3">
                                                    <h4 className="lg_title text-black fw-700 mb-3">Employment Details</h4>
                                                  
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Employee ID</label>
                                                        <input
                                                            type="text"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Employee ID"
                                                            value=""
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                   <div class="custom-frm-bx">
                                                        <label>Department</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select">
                                                                <option>---Select Department---</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                   <div class="custom-frm-bx">
                                                        <label>Position/Role</label>
                                                         <input
                                                            type="text"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Position/Role"
                                                            value=""
                                                        />
                                                    </div>
                                                </div>

                                                 <div className="col-lg-4 col-md-6 col-sm-12">
                                                   <div class="custom-frm-bx">
                                                        <label>Employment Type</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select">
                                                                <option>---Select Employment Type---</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                 <div className="col-lg-4 col-md-6 col-sm-12">
                                                   <div class="custom-frm-bx">
                                                        <label>Reporting To</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select">
                                                                <option>---Select---</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                   <div class="custom-frm-bx">
                                                        <label>Position/Role</label>
                                                         <input
                                                            type="text"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Position/Role"
                                                            value=""
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Join Date</label>
                                                        <input
                                                            type="date"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Total Experience"
                                                            value=""
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">On Leave Date</label>
                                                        <input
                                                            type="date"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Total Experience"
                                                            value=""
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>Salary($)</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select">
                                                                <option>Enter Salary</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 my-3">
                                                    <div className="">
                                                        <h5 className="add-contact-title">Contract Details</h5>
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Contract Start</label>
                                                        <input
                                                            type="date"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Total Experience"
                                                            value=""
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Contract End</label>
                                                        <input
                                                            type="date"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Total Experience"
                                                            value=""
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-12 mt-5">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Note</label>
                                                        <textarea name="" id="" className="form-control nw-frm-select" placeholder="Enter Note"></textarea>
                                                    </div>
                                                </div>

                                            </div>

                                           


                                            <div className="d-flex align-items-center justify-content-end gap-3">
                                                <button type="submit" className="nw-thm-btn outline rounded-3">Back </button>
                                                <button type="submit" className="nw-thm-btn rounded-3" >Save & Continue</button>
                                            </div>

                                        </form>
                                    </div>


                                    <div className="tab-pane fade" id="upload" role="tabpanel">
                                        <form action="">
                                            <div className="row">
                                                <h4 className="lg_title text-black fw-700 mb-3">Access</h4>
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Username</label>
                                                        <input
                                                            type="text"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Username"
                                                            value=""
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Email for Access</label>
                                                        <input
                                                            type="email"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Email  Address"
                                                            value=""
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Temporary Password</label>
                                                        <input
                                                            type="password"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Password"
                                                            value=""
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Confirm Password</label>
                                                        <input
                                                            type="password"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Confirm Password"
                                                            value=""
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 my-3">
                                                    <div className="">
                                                        <h5 className="add-contact-title">Permission</h5>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>Permission Type</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select">
                                                                <option>---Select Permission Type---</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="d-flex align-items-center justify-content-end gap-3">
                                                    <button type="submit" className="nw-thm-btn outline rounded-3">Back </button>
                                                    <button type="submit" className="nw-thm-btn rounded-3" >Submit</button>
                                                </div>


                                            </div>
                                        </form>
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

export default NewStaff