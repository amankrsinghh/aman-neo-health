import { faArrowRightFromBracket, faBuilding, faCalendar, faCertificate, faChevronRight, faCircleXmark, faCreditCard, faFile, faHistory, faKey, faMessage, faPen, faRobot, faTachometerAlt, faUserAltSlash, faUserCircle, faUserEdit, faUsers } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { BiScan } from "react-icons/bi";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchDoctorDetail, fetchEmpDetail } from "../../Redux/features/doctor";
import { securePostData } from "../../Services/api";
import { toast } from "react-toastify";
import base_url, { client_url } from "../../baseUrl";
import DoctorScanner from "../../Doctor/Pages/DoctorScanner";

function LeftSidebar() {
  const location = useLocation();
  const navigate = useNavigate()
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false)
  const handleDetected = (code) => {
    // Extract ID if it's a URL (e.g., https://neohealthcard.com/user/491466081578)
    const id = code.includes('/') ? code.split('/').filter(Boolean).pop() : code;
    navigate(`/user/${id}`);
    setScannerOpen(false); // Close scanner after detection
  };
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const userId = localStorage.getItem('userId')
  const [message, setMessage] = useState('')
  const { profiles, kyc, staffData, staffUser, user, medicalLicense, allowEdit, aboutDoctor, educationWork, customId, isRequestallowEdit, isOwner, permissions } = useSelector(state => state.doctor)
  useEffect(() => {
    const isStaff = localStorage.getItem('staffId')
    if (isStaff) {
      dispatch(fetchEmpDetail(isStaff))
    } else {
      dispatch(fetchDoctorDetail())

    }

  }, [dispatch])
  const closeScanner = () => setScannerOpen(false);
  const handleSubmit = async (e) => {
    const data = new FormData()
    data.append('userId', userId)
    data.append('profileImage', e.target.files[0])
    try {
      const result = await securePostData('doctor/update-image', data)
      if (result.success) {
        toast.success("Profile photo updated")
        dispatch(fetchDoctorDetail())
      }
    } catch (error) {

    }
  }
  useEffect(() => {
    if (
      location.pathname === "/birth-certificate" ||
      location.pathname === "/fitness-certificate" ||
      location.pathname === "/death-certificate" ||
      location.pathname === "/medical-certificate"
    ) {
      setIsCertOpen(true);
    }
  }, [location.pathname]);
  return (
    <>
      <div className="doctor-profile-card position-relative">
        <div className="user-background">
          <div className="user-parent-bx">
            {/* <img src="/profile-bg.png" alt="" /> */}
          </div>


        </div>

        <div className="patient-left-mega-bx">
          {/* <div>
                    <div className="main-user-profile-card">
                        <div className="main-user-picture">
                            <img src="/call-pic.jpg" alt="" />
                        </div>
                        <div className="user-detail-bx">
                            <h5>Dr. David Patel </h5>
                            <p>ID: DO-4001</p>
                        </div>
                    </div>
                </div> */}

          <div>
            <div className="main-user-profile-card">
              <div className="main-user-picture position-relative">
                <img src={isOwner ?
                  `${base_url}/${profiles?.profileImage}` : `${base_url}/${staffData?.profileImage}`} alt="" />
                <input
                  type="file"
                  onChange={handleSubmit}
                  id="profileImageInput"
                  accept="image/*"
                  style={{ display: "none" }}
                />

                <label htmlFor="profileImageInput" className="profile-edit-icon">
                  <FontAwesomeIcon icon={faPen} />
                </label>

              </div>

              <div className="user-detail-bxs">
                <h5>{isOwner ? profiles?.name : staffData?.name}</h5>
                <p>ID: {isOwner ? user?.nh12 : staffData?.nh12}</p>
              </div>
            </div>
          </div>



          <div className="new-item-lists">


            <ul className="nw-profile-list">
              <li className="nw-profile-item">
                <NavLink
                  to="/request-list"
                  className={({ isActive }) =>
                    "nw-nav-links " + (isActive ? "nw-active-link" : "")
                  }
                >
                  <FontAwesomeIcon icon={faTachometerAlt} className="nw-nav-icon" />
                  Dashboard
                </NavLink>
              </li>

              {isOwner && <li className="nw-profile-item">
                <NavLink
                  to="/profile-approval-request"
                  className={({ isActive }) =>
                    "nw-nav-links " + (isActive ? "nw-active-link" : "")
                  }
                >

                  <FontAwesomeIcon icon={faUserAltSlash} className="nw-nav-icon" />
                  Patient Profile Approval request
                </NavLink>
              </li>}

              <li className="nw-profile-item">
                <NavLink
                  to="/requests"
                  className={({ isActive }) =>
                    "nw-nav-links " + (isActive ? "nw-active-link" : "")
                  }
                >

                  <FontAwesomeIcon icon={faFile} className="nw-nav-icon" />
                  Appointment Requests
                </NavLink>
              </li>


              <li className="nw-profile-item">
                <NavLink
                  to="/appointment-list"
                  className={({ isActive }) =>
                    "nw-nav-links " + (isActive ? "nw-active-link" : "")
                  }
                >

                  <FontAwesomeIcon icon={faUserEdit} className="nw-nav-icon" />
                  Appointment
                </NavLink>
              </li>

              {(isOwner || permissions?.appointmentAdd) && (
                <li className="nw-profile-item">
                  <NavLink
                    to="/add-appointment"
                    className={({ isActive }) =>
                      "nw-nav-links " + (isActive ? "nw-active-link" : "")
                    }
                  >

                    <FontAwesomeIcon icon={faCreditCard} className="nw-nav-icon" />
                    My Add Appointment
                  </NavLink>
                </li>
              )}
              <li className="nw-profile-item">
                <a
                  href="#certificateList"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsCertOpen((prev) => !prev);
                  }}
                  className={`nav-link nw-nav-links product-toggle ${isCertOpen ? "active-menu" : ""}`}
                >
                  <FontAwesomeIcon icon={faCertificate} color="#00b4b5"/> Certificates
                  <FontAwesomeIcon
                    icon={faChevronRight} 
                    className={`ms-auto toggle-admin-icon ${isCertOpen ? "rotate" : ""}`}
                  />
                </a>

                <ul
                  className={`product-submenu collapse ${isCertOpen ? "show" : ""}`}
                  id="certificateList"
                >
                  <li className="nav-item">
                    <NavLink
                      to="/fitness-certificate"
                      className={({ isActive }) =>
                        isActive ? "nw-nav-links  submenu-link active-menu" : "nw-nav-links  submenu-link"
                      }
                    >
                      Fitness
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/medical-certificate"
                      className={({ isActive }) =>
                        isActive ? "nw-nav-links  submenu-link active-menu" : "nw-nav-links  submenu-link"
                      }
                    >
                      Medical
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/birth-certificate"
                      className={({ isActive }) =>
                        isActive ? "nw-nav-links  submenu-link active-menu" : "nw-nav-links  submenu-link"
                      }
                    >
                      Birth
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/death-certificate"
                      className={({ isActive }) =>
                        isActive ? "nw-nav-links  submenu-link active-menu" : "nw-nav-links  submenu-link"
                      }
                    >
                      Death
                    </NavLink>
                  </li>

                </ul>
              </li>

              <li className="nw-profile-item">
                <NavLink
                  to="/patient-history"
                  className={({ isActive }) =>
                    "nw-nav-links " + (isActive ? "nw-active-link" : "")
                  }
                >

                  <FontAwesomeIcon icon={faHistory} className="nw-nav-icon" /> Patient
                  history
                </NavLink>
              </li>
              {isOwner && (
                <>
                  <li className="nw-profile-item">
                    <NavLink
                      to="/employee"
                      className={({ isActive }) =>
                        "nw-nav-links " + (isActive ? "nw-active-link" : "")
                      }
                    >

                      <FontAwesomeIcon icon={faUsers} className="nw-nav-icon" /> Employee
                    </NavLink>
                  </li>
                  <li className="nw-profile-item">
                    <NavLink
                      to="/permission"
                      className={({ isActive }) =>
                        "nw-nav-links " + (isActive ? "nw-active-link" : "")
                      }
                    >

                      <FontAwesomeIcon icon={faKey} className="nw-nav-icon" /> Permission
                    </NavLink>
                  </li>
                  <li className="nw-profile-item">
                    <NavLink
                      to="payment-info"
                      className="nw-nav-links"
                    >

                      <FontAwesomeIcon icon={faCreditCard} className="nw-nav-icon" /> Payment Info
                    </NavLink>
                  </li>
                </>
              )}

              <li className="nw-profile-item">
                <a
                  onClick={() => setScannerOpen(true)}
                  href="javascript:void(0)"
                  className="nw-nav-links"
                >

                  <BiScan className="nw-nav-icon" /> Scan
                </a>
              </li>

              {aboutDoctor?.clinic && isOwner && (
                <li className="nw-profile-item">
                  <NavLink
                    to="/departments"
                    className={({ isActive }) =>
                      "nw-nav-links " + (isActive ? "nw-active-link" : "")
                    }
                  >

                    <FontAwesomeIcon icon={faBuilding} className="nw-nav-icon" />
                    Departments
                  </NavLink>
                </li>
              )}

              {isOwner ?
                <li className="nw-profile-item">
                  <NavLink
                    to={"/profile-edit-request"}
                    className={({ isActive }) =>
                      "nw-nav-links " + (isActive ? "nw-active-link" : "")
                    }
                  >

                    <FontAwesomeIcon icon={faUserCircle} className="nw-nav-icon" />
                    Profile
                  </NavLink>
                </li> :
                <li className="nw-profile-item">
                  <NavLink
                    to={`/view-employee/${staffUser?.name}/${staffUser?.nh12}`}
                    className={({ isActive }) =>
                      "nw-nav-links " + (isActive ? "nw-active-link" : "")
                    }
                  >

                    <FontAwesomeIcon icon={faUserCircle} className="nw-nav-icon" />
                    Profile
                  </NavLink>
                </li>}

              {(isOwner || permissions?.chat) && (
                <li className="nw-profile-item">
                  <NavLink
                    to="/chat"
                    className={({ isActive }) =>
                      "nw-nav-links " + (isActive ? "nw-active-link" : "")
                    }
                  >

                    <FontAwesomeIcon icon={faMessage} className="nw-nav-icon" /> Chat
                  </NavLink>
                </li>
              )}
              <li className="nw-profile-item">
                <NavLink
                  to="/neo-ai"
                  className={({ isActive }) =>
                    "nw-nav-links " + (isActive ? "nw-active-link" : "")
                  }
                >

                  <FontAwesomeIcon icon={faRobot} className="nw-nav-icon" /> Neo Ai
                </NavLink>
              </li>

              {isOwner ? <li className="nw-profile-item">
                <NavLink
                  to="/slots"
                  className={({ isActive }) =>
                    "nw-nav-links " + (isActive ? "nw-active-link" : "")
                  }
                >

                  <FontAwesomeIcon icon={faCalendar} className="nw-nav-icon" /> Slots
                </NavLink>
              </li>
                : <li className="nw-profile-item">
                  <NavLink
                    to="/my-permission"
                    className={({ isActive }) =>
                      "nw-nav-links " + (isActive ? "nw-active-link" : "")
                    }
                  >

                    <FontAwesomeIcon icon={faUserAltSlash} className="nw-nav-icon" /> My Permission
                  </NavLink>
                </li>}
              {isOwner && <li className="nw-profile-item">
                <NavLink
                  to="/change-password"
                  className={({ isActive }) =>
                    "nw-nav-links " + (isActive ? "nw-active-link" : "")
                  }
                >

                  <FontAwesomeIcon icon={faKey} className="nw-nav-icon" />
                  Change Password
                </NavLink>
              </li>}

              <li className="nw-profile-item">
                <a
                  href="javascript:void(0)"
                  className="nw-nav-links"
                  data-bs-toggle="modal"
                  data-bs-target="#logout"
                >

                  <FontAwesomeIcon icon={faArrowRightFromBracket} className="nw-nav-icon" />
                  Logout
                </a>
              </li>
            </ul>

          </div>
        </div>

      </div>

      {/*Logout Popup Start  */}
      {/* data-bs-toggle="modal" data-bs-target="#logout" */}
      <div className="modal step-modal fade" id="logout" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content rounded-0 ">
            <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
              <div>
                <h6 className="heading-grad mb-0 fz-24">Logout</h6>
              </div>
              <div>
                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "rgba(239, 0, 0, 1)" }}>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </div>
            </div>
            <div className="modal-body pb-5 px-4">
              <div className="row">
                <div className="col-lg-12">
                  <div className="logout-bx text-center" >
                    <img src="/logout.svg" alt="" />
                    <h5 className="py-2">Logout</h5>
                    <p className="py-2">Are you sure you want to log out?</p>

                    <div className="d-flex align-items-center gap-3 justify-content-center mt-3">
                      <button className="nw-thm-btn outline px-5" data-bs-dismiss="modal" aria-label="Close">No</button>
                      <button className="thm-btn px-3" data-bs-dismiss="modal" aria-label="Close">Yes, Logout</button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  Logout Popup End */}


      {/*Payment Status Popup Start  */}
      {/* data-bs-toggle="modal" data-bs-target="#scanner-Request" */}
      {scannerOpen &&
        <div className="modal fade show step-modal"
          id="scanner-Request"
          style={{ display: "block", background: "#00000080" }}
          data-bs-backdrop="static"
          data-bs-keyboard="false">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content rounded-5 p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-0">Scan </h6>
                </div>
                <div>
                  <button type="button" className="fz-18" onClick={closeScanner} style={{ color: "#00000040" }}>
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </button>
                </div>
              </div>
              <div className="modal-body p-0">
                <div className="row ">
                  <div className="col-lg-12">
                    {/* <Scanner onDetected={handleDetected}/> */}
                    <DoctorScanner open={scannerOpen} onDetected={handleDetected} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
      {/*  Payment Status Popup End */}

    </>
  )
}

export default LeftSidebar