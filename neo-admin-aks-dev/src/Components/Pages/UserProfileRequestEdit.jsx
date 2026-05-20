import { TbGridDots } from "react-icons/tb";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { faClose, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function UserProfileRequestEdit() {
  return (
  <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Profile Edit  Request</h3>
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
                                            Profile Edit  Request
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='new-mega-card'>
                    <div className="row">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="custom-frm-bx mb-0">
                                        <input
                                            type="email"
                                            className="form-control admin-table-search-frm search-table-frm"
                                            id="email"
                                            placeholder="Search"
                                            required
                                        />
                                        <div className="adm-search-bx">
                                            <button className="tp-search-btn">
                                                <FontAwesomeIcon icon={faSearch} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="dropdown">
                                <a href="#" className="thm-btn lt-thm-btn" id="acticonMenus" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    <FontAwesomeIcon icon={faFilter} /> Filter
                                </a>

                                <div className="dropdown-menu dropdown-menu-end user-dropdown tble-action-menu"
                                    aria-labelledby="acticonMenus">

                                    <div
                                        className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-bottom">
                                        <h6 className="mb-0 fz-18">Filter</h6>
                                        <a href="#" className="fz-16 clear-btn">Reset</a>
                                    </div>

                                    <div className="p-3">
                                        <ul className="filtring-list mb-3">
                                            <h6>Status</h6>
                                            <li>
                                                <div className="form-check new-custom-check">
                                                    <input className="form-check-input" type="checkbox" id="reject" />
                                                    <label className="form-check-label" for="reject">Accepted</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="form-check new-custom-check">
                                                    <input className="form-check-input" type="checkbox" id="pending" />
                                                    <label className="form-check-label" for="pending">Rejected</label>
                                                </div>
                                            </li>
                                        </ul>
    
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-top">
                                        <a href="javascript:void(0)" className="thm-btn thm-outline-btn rounded-4 px-5 py-2 outline"> Cancel</a>
                                        <a href="javascript:void(0)" className="thm-btn rounded-4 px-5 py-2"> Apply</a>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-lg-12">
                            <div className="table-section admin-mega-section">
                                <div className="table table-responsive mb-0">
                                    <table className="table mb-0">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Contact</th>
                                                <th>Age</th>
                                                <th>Specialty</th>
                                                <th>Organization /  Hospital Name</th>
                                                <th>Request Date</th>
                                                <th>Reason</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            <tr>
                                                <td>01.</td>

                                                <td>
                                                    <div className="admin-table-bx">
                                                        <div className="admin-table-sub-bx">
                                                            <img src="/doctor-avatr.png" alt="" />
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="admin-table-bx">
                                                        <div className="admin-table-sub-bx">
                                                            <div className="admin-table-sub-details">
                                                                <h6>Dr. David Patel </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <ul className="ad-info-list">
                                                        <li className="ad-info-item"><span className="ad-info-title">Mobile No :</span> +91-9876543210</li>
                                                        <li className="ad-info-item"><span className="ad-info-title">Email : </span> davidpateleff@gmail.com</li>
                                                    </ul>
                                                </td>
                                                <td>30</td>
                                                <td>Psychologists</td>
                                                <td>Mercy Hospital</td>
                                                <td>20 jun 2025</td>
                                                <td><span className="chnge">Photo Change</span></td>
                                                <td ><span className="approved approved-active">Accepted</span></td>
                                                <td>
                                                    <a
                                                        href="javascript:void(0)"
                                                        className="grid-dots-btn"
                                                        data-bs-toggle="modal" data-bs-target="#edit-Request"
                                                    >
                                                        <TbGridDots />
                                                    </a>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>02.</td>

                                                <td>
                                                    <div className="admin-table-bx">
                                                        <div className="admin-table-sub-bx">
                                                            <img src="/doctor-avatr.png" alt="" />
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="admin-table-bx">
                                                        <div className="admin-table-sub-bx">
                                                            <div className="admin-table-sub-details">
                                                                <h6>Dr. David Patel </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <ul className="ad-info-list">
                                                        <li className="ad-info-item"><span className="ad-info-title">Mobile No :</span> +91-9876543210</li>
                                                        <li className="ad-info-item"><span className="ad-info-title">Email : </span> davidpateleff@gmail.com</li>
                                                    </ul>
                                                </td>
                                                <td>30</td>
                                                <td>Psychologists</td>
                                                <td>Mercy Hospital</td>
                                                <td>20 jun 2025</td>
                                                <td><span className="chnge">Wrong Profile Name ...</span></td>
                                                <td ><span className="approved reject approved-reject">Rejected</span></td>
                                                <td>
                                                    <a
                                                        href="javascript:void(0)"
                                                        className="grid-dots-btn"
                                                    >
                                                        <TbGridDots />
                                                    </a>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>03.</td>

                                                <td>
                                                    <div className="admin-table-bx">
                                                        <div className="admin-table-sub-bx">
                                                            <img src="/doctor-avatr.png" alt="" />
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="admin-table-bx">
                                                        <div className="admin-table-sub-bx">
                                                            <div className="admin-table-sub-details">
                                                                <h6>Dr. David Patel </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <ul className="ad-info-list">
                                                        <li className="ad-info-item"><span className="ad-info-title">Mobile No :</span> +91-9876543210</li>
                                                        <li className="ad-info-item"><span className="ad-info-title">Email : </span> davidpateleff@gmail.com</li>
                                                    </ul>
                                                </td>
                                                <td>30</td>
                                                <td>Psychologists</td>
                                                <td>Mercy Hospital</td>
                                                <td>20 jun 2025</td>
                                                <td><span className="chnge">Wrong Profile Name ...</span></td>
                                                <td ><span className="approved approved-active">Accepted</span></td>
                                                <td>
                                                    <a
                                                        href="javascript:void(0)"
                                                        className="grid-dots-btn"
                                                    >
                                                        <TbGridDots />
                                                    </a>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>04.</td>

                                                <td>
                                                    <div className="admin-table-bx">
                                                        <div className="admin-table-sub-bx">
                                                            <img src="/doctor-avatr.png" alt="" />
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="admin-table-bx">
                                                        <div className="admin-table-sub-bx">
                                                            <div className="admin-table-sub-details">
                                                                <h6>Dr. David Patel </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <ul className="ad-info-list">
                                                        <li className="ad-info-item"><span className="ad-info-title">Mobile No :</span> +91-9876543210</li>
                                                        <li className="ad-info-item"><span className="ad-info-title">Email : </span> davidpateleff@gmail.com</li>
                                                    </ul>
                                                </td>
                                                <td>30</td>
                                                <td>Psychologists</td>
                                                <td>Mercy Hospital</td>
                                                <td>20 jun 2025</td>
                                                <td><span className="chnge">Wrong Profile Name ...</span></td>
                                                <td ><span className="approved approved-active">Accepted</span></td>
                                                <td>
                                                    <a
                                                        href="javascript:void(0)"
                                                        className="grid-dots-btn"
                                                    >
                                                        <TbGridDots />
                                                    </a>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>05.</td>

                                                <td>
                                                    <div className="admin-table-bx">
                                                        <div className="admin-table-sub-bx">
                                                            <img src="/doctor-avatr.png" alt="" />
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="admin-table-bx">
                                                        <div className="admin-table-sub-bx">
                                                            <div className="admin-table-sub-details">
                                                                <h6>Dr. David Patel </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <ul className="ad-info-list">
                                                        <li className="ad-info-item"><span className="ad-info-title">Mobile No :</span> +91-9876543210</li>
                                                        <li className="ad-info-item"><span className="ad-info-title">Email : </span> davidpateleff@gmail.com</li>
                                                    </ul>
                                                </td>
                                                <td>30</td>
                                                <td>Psychologists</td>
                                                <td>Mercy Hospital</td>
                                                <td>20 jun 2025</td>
                                               <td><span className="chnge">Wrong Profile Name ...</span></td>
                                                <td ><span className="approved approved-active">Accepted</span></td>
                                                <td>
                                                    <a
                                                        href="javascript:void(0)"
                                                        className="grid-dots-btn"
                                                    >
                                                        <TbGridDots />
                                                    </a>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>06.</td>

                                                <td>
                                                    <div className="admin-table-bx">
                                                        <div className="admin-table-sub-bx">
                                                            <img src="/doctor-avatr.png" alt="" />
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="admin-table-bx">
                                                        <div className="admin-table-sub-bx">
                                                            <div className="admin-table-sub-details">
                                                                <h6>Dr. David Patel </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <ul className="ad-info-list">
                                                        <li className="ad-info-item"><span className="ad-info-title">Mobile No :</span> +91-9876543210</li>
                                                        <li className="ad-info-item"><span className="ad-info-title">Email : </span> davidpateleff@gmail.com</li>
                                                    </ul>
                                                </td>
                                                <td>30</td>
                                                <td>Psychologists</td>
                                                <td>Mercy Hospital</td>
                                                <td>20 jun 2025</td>
                                               <td><span className="chnge">Wrong Profile Name ...</span></td>
                                                <td ><span className="approved approved-active">Accepted</span></td>
                                                <td>
                                                    <a
                                                        href="javascript:void(0)"
                                                        className="grid-dots-btn"
                                                    >
                                                        <TbGridDots />
                                                    </a>
                                                </td>
                                            </tr>



                                        </tbody>
                                    </table>
                                </div>

                                <div className="custom-pagination-wrapper d-flex justify-content-between align-items-center flex-wrap mt-3">

                                    <div className="page-selector d-flex align-items-center mb-2 mb-md-0">
                                        <p className="me-2 ">Page</p>
                                        <select className="form-select custom-page-dropdown">
                                            <option value="1" selected>1</option>
                                            <option value="2">2</option>
                                        </select>
                                        <p className="ms-2">of 10</p>
                                    </div>

                                    <nav aria-label="Page navigation">
                                        <ul className="pagination custom-pagination mb-0">
                                            <li className="page-item"><a className="page-link" href="#"><HiChevronDoubleLeft /></a></li>
                                            <li className="page-item"><a className="page-link" href="#"><HiChevronLeft /></a></li>
                                            <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                                            <li className="page-item disabled"><a className="page-link" href="#">...</a></li>
                                            <li className="page-item"><a className="page-link" href="#">10</a></li>
                                            <li className="page-item"><a className="page-link" href="#"><HiChevronRight /></a></li>
                                            <li className="page-item"><a className="page-link" href="#"><HiChevronDoubleRight /></a></li>
                                        </ul>
                                    </nav>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>



             {/*Payment Status Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#edit-Request" */}
            <div className="modal step-modal" id="edit-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
              aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content rounded-5 p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="lg_title mb-0">Edit Request from David Patel</h6>
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
                              <p>The user has requested to update their profile details.This includes modifying personal information such as name, photo, contact details, and other relevant fields.</p>
                          </div>
                        </div>

                        <div className="custom-frm-bx mt-3">
                          <label htmlFor="">Note</label>
                          <textarea name="" id="" className="form-control" placeholder="The user has requested to update their profile details."></textarea>
                          
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

export default UserProfileRequestEdit