import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
  faClose,
  faDownload,
  faFilePdf,
  faPen,
  faShareNodes
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";

function ApproveProfile() {
    const navigate = useNavigate()

  return (
     <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        <div className="row mb-3">
            <div className="d-flex align-items-center justify-content-between sub-header-bx">
              <div>
                <h3 className="innr-title mb-2">Profile</h3>
                <div className="admin-breadcrumb">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb custom-breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="#" className="breadcrumb-link">
                          Dashboard
                        </a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Profile
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
              <div className="add-nw-bx">
                <a href="javascript:void(0)" className="add-nw-btn nw-thm-btn " data-bs-toggle="modal" data-bs-target="#edit-Request" >
                  Send Profile Edit Request
                </a>
              </div>
            </div>
          </div>

        <div className="lab-chart-crd">
          <div className="row">
            <div className="col-lg-12">
              <div className="lab-tp-title patient-bio-tab  d-flex align-items-center justify-content-between py-2">
                <div>
                  <h6 className="mb-0 text-black fz-22 fw-600">Profile</h6>
                </div>

                <div className="d-flex align-items-center gap-2">

                    <div className="approve-title">
                        <h5><span className="approve-right-check"><FontAwesomeIcon icon={faCheck}/></span> Approved Edit Request</h5>
                    </div>

                    <NavLink to="/edit-profile"  type="submit" className="nw-filtr-thm-btn">Edit</NavLink>
                </div>
              </div>

              <div className="patient-bio-tab">
                <ul className="nav nav-tabs gap-3" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link active"
                      id="home-tab"
                      data-bs-toggle="tab"
                      href="#home"
                      role="tab"
                    >
                      Pharmacy Profile
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
                      Pharmacy Images
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
                      Pharmacy Address
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
                      Upload License
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      id="person-tab"
                      data-bs-toggle="tab"
                      href="#person"
                      role="tab"
                    >
                      Contact Person
                    </a>
                  </li>
                </ul>

                <div className="tab-content mt-4" id="myTabContent">
                  <div
                    className="tab-pane fade show active"
                    id="home"
                    role="tabpanel"
                  >
                    <div className="sub-tab-brd">
                      <form action="">
                        <div className="row">
                          <div className="col-lg-12">
                           <div className="d-flex align-items-center justify-content-between laboratory-card">
                             <div className="lab-profile-mega-bx">
                              <div className="lab-profile-avatr-bx position-relative">
                                <img src="/pharmacy-logo.png" alt="" className="border" />
                                <div className="lab-profile-edit-avatr">
                                  <a href="javascript:void(0)" className="edit-btn cursor-pointer">
                                    <FontAwesomeIcon icon={faPen} />
                                  </a>
                                </div>
                                <input
                                  type="file"
                                  accept=""
                                  className="lab-profile-file-input"
                                />
                              </div>

                              <div>
                                <h4 className="lg_title ">World Pharmacy</h4>
                                <p className="first_para">ID : #94969548</p>
                              </div>



                            </div>


                                <div className="d-flex align-items-center justify-content-center gap-2 carding-bx">
                                                    <div className="add-patients-clients">

                                                        <div className="chip-card"></div>
                                                        <img src="/pharmacy-card.png" alt="" />
                                                        <div className="patient-card-details">
                                                            <h4>World Pharmacy</h4>
                                                            <p>Pharmacy ID</p>
                                                            <h6>Lab202425</h6>
                                                        </div>
                                                        <div className="qr-code-generate"></div>

                                                    </div>

                                                    {/* <div className="d-flex flex-column gap-2 card-down-bx">
                                                        <button className="patient-crd-down-btn"><FontAwesomeIcon icon={faDownload} /></button>

                                                        <button className="patient-crd-down-btn crd-share-btn"><FontAwesomeIcon icon={faShareNodes} /></button>
                                                    </div> */}
                                                       <div className="d-flex flex-column gap-2 card-down-bx">
                                                        <button className="pharmacy-card-tbn"><FontAwesomeIcon icon={faDownload} /></button>

                                                        <button className="pharmacy-card-tbn crd-share-btn"><FontAwesomeIcon icon={faShareNodes} /></button>
                                                    </div>
                                                </div>
                           </div>


                          </div>

                          <div className="col-lg-6">
                            <div className="custom-frm-bx">
                              <label htmlFor="">Pharmacy Name</label>
                              <input
                                type="text"
                                className="form-control patient-frm-control"
                                placeholder=""
                                value="World Pharmacy"
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="custom-frm-bx">
                              <label htmlFor="">Mobile Number</label>
                              <input
                                type="number"
                                className="form-control patient-frm-control"
                                placeholder=""
                                value="9665190183"
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="custom-frm-bx">
                              <label htmlFor="">Email Number</label>
                              <input
                                type="email"
                                className="form-control patient-frm-control"
                                placeholder=""
                                value="advancelab68gmail.com "
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="custom-frm-bx">
                              <label htmlFor="">Gst Number</label>
                              <input
                                type="number"
                                className="form-control patient-frm-control"
                                placeholder=""
                                value="9704789479247"
                              />
                            </div>
                          </div>

                          <div className="col-lg-12">
                            <div className="custom-frm-bx">
                              <label htmlFor="">About</label>
                              <textarea name="" id="" className="form-control patient-frm-control" placeholder="Advance Lab Tech, a dedicated cardiologist, brings a wealth of experience to Golden Gate Cardiology Center in Golden Gate, "></textarea>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="tab-pane fade" id="profile" role="tabpanel">
                    <div className="sub-tab-brd lab-thumb-bx">
                     <div className="row mb-3">
                      <h5 className="text-black fw-700">Thumbnail image</h5>
                      <div className="col-lg-4">
                       <div className="lab-images-bx">
                          <img src="/thumb.png" alt="" />
                        </div>
                      </div>
                     </div>

                     <div className="row">
                            <h5 className="text-black fw-700">Image</h5>
                      <div className="col-lg-4 mb-3">
                         <div className="lab-multi-image-bx">
                          <img src="/pic-first.png" alt="" />
                        </div>
                      </div>
                      <div className="col-lg-4 mb-3">
                         <div className="lab-multi-image-bx">
                          <img src="/pic-two.png" alt="" />
                        </div>
                      </div>
                      <div className="col-lg-4 mb-3">
                         <div className="lab-multi-image-bx">
                          <img src="/pic-three.png" alt="" />
                        </div>
                      </div>
                     </div>
                    </div>
                  </div>

                  <div className="tab-pane fade" id="contact" role="tabpanel">
                    <div className="sub-tab-brd ">
                      <form action="">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="custom-frm-bx">
                              <label htmlFor="">Full Address</label>
                              <input
                                type="text"
                                className="form-control nw-frm-select"
                                placeholder=""
                                value="123 Oak Street, Jaipur"
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="custom-frm-bx">
                              <label htmlFor="">Country</label>
                              <input
                                type="text"
                                className="form-control nw-frm-select"
                                placeholder=""
                                value="India "
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="custom-frm-bx">
                              <label htmlFor="">State</label>
                              <input
                                type="text"
                                className="form-control nw-frm-select"
                                placeholder=""
                                value="Rajasthan "
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="custom-frm-bx">
                              <label htmlFor="">City</label>
                              <input
                                type="text"
                                className="form-control nw-frm-select"
                                placeholder=""
                                value="Jaipur"
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="custom-frm-bx">
                              <label htmlFor="">Pin Code</label>
                              <input
                                type="text"
                                className="form-control nw-frm-select"
                                placeholder=""
                                value="302028"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="tab-pane fade" id="upload" role="tabpanel">
                    <div className="sub-tab-brd lab-thumb-bx">
                      <form action="">
                        <div className="row">
                          <h5 className="text-black fw-700">License Details</h5>
                          <div className="col-lg-6">
                            <div className="custom-frm-bx">
                              <label htmlFor="">Lab License Number</label>
                              <input
                                type="text"
                                className="form-control nw-frm-select"
                                placeholder=""
                                value="LIC98r37894789"
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="custom-frm-bx">
                              <label htmlFor="">Lab License  Documents</label>
                            <div className="form-control lablcense-frm-control">
                             <div className="lablcense-bx">
                               <div>
                                <h6 ><FontAwesomeIcon icon={faFilePdf} style={{color : "#EF5350"}}/> Lablcense.pdf</h6>
                              </div>
                              <div className="">
                                <button type="" className="pdf-download-tbn">Download</button>
                              </div>
                             </div>
                            </div>
                            </div>
                          </div>

                          
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="tab-pane fade" id="person" role="tabpanel">
                    <div className="sub-tab-brd">
                      <form action="">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="lab-profile-mega-bx">
                              <div className="lab-profile-avatr-bx lab-contact-prson position-relative rounded-circle">
                                <img src="/user-avatar.png" alt="" className="rounded-cricle" />
                                <div className="lab-profile-edit-avatr">
                                  <a href="javascript:void(0)" className="edit-btn cursor-pointer">
                                    <FontAwesomeIcon icon={faPen} />
                                  </a>
                                </div>
                                <input
                                  type="file"
                                  accept=""
                                  className="lab-profile-file-input"
                                />
                              </div>

                              <div>
                                <h4 className="lg_title ">Jonh Smith</h4>
                              </div>



                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="custom-frm-bx">
                              <label htmlFor="">Name</label>
                              <input
                                type="text"
                                className="form-control nw-frm-select"
                                placeholder=""
                                value="Jonh Smith"
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="custom-frm-bx">
                              <label htmlFor="">Mobile Number</label>
                              <input
                                type="number"
                                className="form-control nw-frm-select"
                                placeholder=""
                                value="9665190183"
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="custom-frm-bx">
                              <label htmlFor="">Email Number</label>
                              <input
                                type="email"
                                className="form-control nw-frm-select"
                                placeholder=""
                                value="advancelab68gmail.com "
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="custom-frm-bx">
                              <label htmlFor="">Gender</label>
                              <input
                                type="text"
                                className="form-control nw-frm-select"
                                placeholder=""
                                value="Male"
                              />
                            </div>
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
      </div>

      {/*Payment Status Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#edit-Request" */}
            <div className="modal step-modal fade" id="edit-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
              aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content rounded-5 p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="lg_title mb-0">Edit Request from Admin</h6>
                    </div>
                    <div>
                      <button type="button" className="" data-bs-dismiss="modal" aria-label="Close">
                        <FontAwesomeIcon icon={faClose} />
                      </button>
                    </div>
                  </div>
                  <div className="modal-body p-0">
                    <div className="row ">
                      <div className="col-lg-12 mt-5">
                        <div className="edit-request-bx">
                          <div className="float-left">
                            <img src="/edit-reqest.png" alt="" />
                          </div>
                          <div className="float-right">
                              <p>You can edit your profile when you click on the request button. The edit option will appear after your request is approved. After making changes, click on save and you will have to wait for approval
</p>
                          </div>
                        </div>

                        <div className="custom-frm-bx">
                          <label htmlFor="">Note</label>
                          <textarea name="" id="" className="form-control"></textarea>
                          
                        </div>
      
                        <div>
                          <button type="button" onClick={()=> navigate("/edit-profile")} data-bs-dismiss="modal" aria-label="Close" className="nw-thm-btn w-100" > Send Edit Request </button>
                        </div>
      
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*  Payment Status Popup End */}

    </>
  )
}

export default ApproveProfile