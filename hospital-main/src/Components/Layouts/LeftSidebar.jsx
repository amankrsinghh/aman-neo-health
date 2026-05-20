import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket, faBed, faBorderAll, faBriefcase, faBuilding, faCertificate, faChevronRight, faClose, faFlask, faFlaskVial, faHistory, faHospitalUser, faLock, faMessage, faServer, faUserAlt, faUserAltSlash, faUserDoctor, faUsers, } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmpDetail, fetchUserDetail } from "../../redux/features/userSlice";
import base_url from "../../baseUrl";

function LeftSidebar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, hospitalBasic, hospitalPerson } = useSelector(state => state.user)
  const { permissions, isOwner, staffUser } = useSelector(state => state.user)
  useEffect(() => {
    dispatch(fetchUserDetail())
    dispatch(fetchEmpDetail(localStorage.getItem('staffId')))
  }, [dispatch])
  const handleLogout = () => {
    localStorage.clear()
    navigate("/login");
  };


  const location = useLocation();

  const isPatientActive =
    location.pathname === "/patient-ipd" ||
    location.pathname === "/patient-opd" ||
    location.pathname === "/patient-emergency";

  const isAppointmentActive =
    location.pathname === "/appointment" ||
    location.pathname === "/appointment-request";

  const isBedActive =
    location.pathname === "/bed-management" ||
    location.pathname === "/bed-allotment-history";

  const isLabActive =
    location.pathname === "/tests" ||
    location.pathname === "/lab-slots" ||
    location.pathname === "/test-report-appointment";

  const isPharmacyActive =
    location.pathname === "/inventory" ||
    location.pathname === "/medicine-request" ||
    location.pathname === "/sell" ||
    location.pathname === "/supplier" ||
    location.pathname === "/returns" ||
    location.pathname === "/purchase-order";
  
  const isCertActive =
    location.pathname === "/birth-certificate" ||
    location.pathname === "/fitness-certificate" ||
    location.pathname === "/death-certificate" || 
    location.pathname === "/medical-certificate";
  return (
    <>
      <div className="dashboard-left-side text-white min-vh-100 flex-shrink-0">
        <div className="text-end admn-mob-close-bx">
          <NavLink
            href="#"
            className="d-lg-none tp-mobile-close-btn mb-3 fs-6 text-white"
          >
            <FontAwesomeIcon icon={faClose} />
          </NavLink>
        </div>

        <div className="task-vendr-left-title-bx">
          <div className="dashboard-logo-tp d-flex justify-content-center align-items-center">
            <h4 className="mb-0">
              <NavLink to="/" className="dash-hp-title">
                <img src="/logo.png" alt="" />
              </NavLink>
            </h4>
          </div>
        </div>

        <div className="d-flex flex-column p-3">

          <div className="task-vendor-profile-crd">
            <NavLink to="#">
              <div className="task-vendor-profile-bx">
                <img src={hospitalBasic?.logoFileId ?
                  `${base_url}/api/file/${hospitalBasic.logoFileId}` : "/user-avatar.png"} alt=""
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/user-avtar.png";
                  }} />
                <div>
                  <h6 className="new_title fz-14 fw-600 mb-0 text-white"> {user?.name || "User"}</h6>
                  <p>#{user?.nh12 || "00000000"}</p>
                </div>
              </div>
            </NavLink>
          </div>

          <div className="left-navigation flex-grow-1 overflow-auto">
            <ul className="nav flex-column mt-3" >
              <li className="nav-item">
                <NavLink to="/dashboard" className={({ isActive }) =>
                  isActive ? "nav-link active-menu" : "nav-link"
                }>
                  <FontAwesomeIcon icon={faBorderAll} />
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/doctor" className={({ isActive }) =>
                  isActive ? "nav-link active-menu" : "nav-link"
                }>
                  <FontAwesomeIcon icon={faUserDoctor} /> Doctors
                </NavLink>
              </li>

              {/* <li className="nav-item">
                <NavLink
                  to="#labReportsSubmenup"
                  className="nav-link product-toggle "
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="labReportsSubmenup"
                  data-bs-parent=".nav"
                >
                  <FontAwesomeIcon icon={faHospitalUser} /> Patients
                  <FontAwesomeIcon icon={faChevronRight} className="ms-auto toggle-admin-icon" />
                </NavLink>

                <ul className=" product-submenu collapse" id="labReportsSubmenup" data-bs-parent=".nav">
                  
                  <li className="nav-item">
                    <NavLink to="/patient-ipd" className="nav-link submenu-link">IPD</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/patient-opd" className="nav-link  submenu-link">OPD</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/patient-emergency" className="nav-link  submenu-link">EMERGENCY</NavLink>
                  </li>
                </ul>
              </li> */}

              <li className="nav-item">
                <a
                  href="#labReportsSubmenup"
                  className={`nav-link product-toggle ${isPatientActive ? "active-menu" : ""}`}
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="labReportsSubmenup"
                >
                  <FontAwesomeIcon icon={faHospitalUser} /> Patients
                  <FontAwesomeIcon icon={faChevronRight} className="ms-auto toggle-admin-icon" />
                </a>

                <ul
                  className="product-submenu collapse"
                  id="labReportsSubmenup"
                >
                  <li className="nav-item">
                    <NavLink
                      to="/patient-ipd"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      IPD
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/patient-opd-data"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      OPD
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/patient-emergency-data"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      EMERGENCY
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/patient-history"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      History
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* <li className="nav-item">
                <NavLink
                  to="#labReportsSubmenu"
                  className="nav-link product-toggle "
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="labReportsSubmenu"
                  data-bs-parent=".nav"
                >
                  <FontAwesomeIcon icon={faBriefcase} /> Appointment
                  <FontAwesomeIcon icon={faChevronRight} className="ms-auto toggle-admin-icon" />
                </NavLink>

                <ul className=" product-submenu collapse" id="labReportsSubmenu" data-bs-parent=".nav">
                  <li className="nav-item">
                    <NavLink to="/appointment" className="nav-link submenu-link">All Appointments</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/appointment-request" className="nav-link  submenu-link">Appointment Request</NavLink>
                  </li>
                </ul>
              </li> */}

              <li className="nav-item">
                <a
                  href="#labReportsSubmenu"
                  className={`nav-link product-toggle ${isAppointmentActive ? "active-menu" : ""}`}
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded={isAppointmentActive ? "true" : "false"}
                  aria-controls="labReportsSubmenu"
                >
                  <FontAwesomeIcon icon={faBriefcase} /> Appointment
                  <FontAwesomeIcon icon={faChevronRight} className="ms-auto toggle-admin-icon" />
                </a>

                <ul
                  className={`product-submenu collapse ${isAppointmentActive ? "show" : ""}`}
                  id="labReportsSubmenu"
                  data-bs-parent=".nav"
                >
                  <li className="nav-item">
                    <NavLink
                      to="/appointment"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      All Appointments
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/appointment-request"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      Appointment Request
                    </NavLink>
                  </li>
                </ul>
              </li>



              {/* <li className="nav-item">
                <NavLink
                  to="#slabReportsSubmenu"
                  className="nav-link product-toggle "
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="slabReportsSubmenu"
                  data-bs-parent=".nav"
                >
                  <FontAwesomeIcon icon={faBed} /> Bed management
                  <FontAwesomeIcon icon={faChevronRight} className="ms-auto toggle-admin-icon" />
                </NavLink>

                <ul className=" product-submenu collapse" id="slabReportsSubmenu" data-bs-parent=".nav">
                  <li className="nav-item">
                    <NavLink to="/bed-management" className="nav-link submenu-link">Bed Allotment</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/bed-allotment-history" className="nav-link  submenu-link">Bed Allotment History</NavLink>
                  </li>
                </ul>
              </li> */}

              <li className="nav-item">
                <a
                  href="#slabReportsSubmenu"
                  className={`nav-link product-toggle ${isBedActive ? "active-menu" : ""}`}
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded={isBedActive ? "true" : "false"}
                  aria-controls="slabReportsSubmenu"
                >
                  <FontAwesomeIcon icon={faBed} /> Bed management
                  <FontAwesomeIcon icon={faChevronRight} className="ms-auto toggle-admin-icon" />
                </a>

                <ul
                  className={`product-submenu collapse ${isBedActive ? "show" : ""}`}
                  id="slabReportsSubmenu"
                  data-bs-parent=".nav"
                >
                  <li className="nav-item">
                    <NavLink
                      to="/bed-management"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      Bed Allotment
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/bed-allotment-history"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      Bed Allotment History
                    </NavLink>
                  </li>
                </ul>
              </li>


              {/* <li className="nav-item">
                <NavLink
                  to="#slabReportsSubmenulab"
                  className="nav-link product-toggle "
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="slabReportsSubmenulab"
                  data-bs-parent=".nav"
                >
                  <FontAwesomeIcon icon={faFlask} /> Laboratory
                  <FontAwesomeIcon icon={faChevronRight} className="ms-auto toggle-admin-icon" />
                </NavLink>

                <ul className=" product-submenu collapse" id="slabReportsSubmenulab" data-bs-parent=".nav">
                  <li className="nav-item">
                    <NavLink to="/tests" className="nav-link submenu-link">Tests</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/lab-slots" className="nav-link submenu-link">Slots</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/test-report-appointment" className="nav-link  submenu-link">Lab Reports</NavLink>
                  </li>
                </ul>
              </li> */}

              <li className="nav-item">
                <a
                  href="#slabReportsSubmenulab"
                  className={`nav-link product-toggle ${isLabActive ? "active-menu" : ""}`}
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded={isLabActive ? "true" : "false"}
                  aria-controls="slabReportsSubmenulab"
                >
                  <FontAwesomeIcon icon={faFlask} /> Laboratory
                  <FontAwesomeIcon icon={faChevronRight} className="ms-auto toggle-admin-icon" />
                </a>

                <ul
                  className={`product-submenu collapse ${isLabActive ? "show" : ""}`}
                  id="slabReportsSubmenulab"
                  data-bs-parent=".nav"
                >
                  <li className="nav-item">
                    <NavLink
                      to="/tests"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      Tests
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/lab-slots"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      Slots
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/test-report-appointment"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      Lab Reports
                    </NavLink>
                  </li>
                </ul>
              </li>




              {/* <li className="nav-item">
                <NavLink
                  to="#slabReportsSubmenupharmacy"
                  className="nav-link product-toggle "
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="slabReportsSubmenupharmacy"
                  data-bs-parent=".nav"
                >
                  <FontAwesomeIcon icon={faFlaskVial} /> Pharmacy
                  <FontAwesomeIcon icon={faChevronRight} className="ms-auto toggle-admin-icon" />
                </NavLink>

                <ul className=" product-submenu collapse" id="slabReportsSubmenupharmacy" data-bs-parent=".nav">
                  
                  <li className="nav-item">
                    <NavLink to="/inventory" className="nav-link submenu-link">Inventory</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/medicine-request" className="nav-link  submenu-link">H1 Medicine Request</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/sell" className="nav-link  submenu-link">Sell</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/supplier" className="nav-link submenu-link">Supplier</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/returns" className="nav-link  submenu-link">Returns</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/purchase-order" className="nav-link  submenu-link">Purchase Order</NavLink>
                  </li>
                </ul>
              </li> */}

              <li className="nav-item">
                <a
                  href="#slabReportsSubmenupharmacy"
                  className={`nav-link product-toggle ${isPharmacyActive ? "active-menu" : ""}`}
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded={isPharmacyActive ? "true" : "false"}
                  aria-controls="slabReportsSubmenupharmacy"
                >
                  <FontAwesomeIcon icon={faFlaskVial} /> Pharmacy
                  <FontAwesomeIcon icon={faChevronRight} className="ms-auto toggle-admin-icon" />
                </a>

                <ul
                  className={`product-submenu collapse ${isPharmacyActive ? "show" : ""}`}
                  id="slabReportsSubmenupharmacy"
                  data-bs-parent=".nav"
                >
                  <li className="nav-item">
                    <NavLink
                      to="/inventory"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      Inventory
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/medicine-request"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      H1 Medicine Request
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/sell"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      Sell
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/supplier"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      Supplier
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/returns"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      Returns
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/purchase-order"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      Purchase Order
                    </NavLink>
                  </li>
                </ul>
              </li>


              {isOwner &&
                <li className="nav-item">
                  <NavLink to="/department" className={({ isActive }) =>
                    isActive ? "nav-link active-menu" : "nav-link"
                  }>
                    <FontAwesomeIcon icon={faBuilding} /> Departments
                  </NavLink>
                </li>
              }
              <li className="nav-item">
                <a
                  href="#certificateList"
                  className={`nav-link product-toggle ${isCertActive ? "active-menu" : ""}`}
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded={isCertActive ? "true" : "false"}
                  aria-controls="certificateList"
                >
                  <FontAwesomeIcon icon={faCertificate} /> Certificates
                  <FontAwesomeIcon icon={faChevronRight} className="ms-auto toggle-admin-icon" />
                </a>

                <ul
                  className={`product-submenu collapse ${isCertActive ? "show" : ""}`}
                  id="certificateList"
                  data-bs-parent=".nav"
                >
                  <li className="nav-item">
                    <NavLink
                      to="/fitness-certificate"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      Fitness
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/medical-certificate"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      Medical
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/birth-certificate"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      Birth
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/death-certificate"
                      className={({ isActive }) =>
                        isActive ? "nav-link submenu-link active-menu" : "nav-link submenu-link"
                      }
                    >
                      Death
                    </NavLink>
                  </li>               

                </ul>
              </li>
              
              {!isOwner && permissions?.staff?.list && <li className="nav-item">
                <NavLink to="/staff-management" className={({ isActive }) =>
                  isActive ? "nav-link active-menu" : "nav-link"
                }>
                  <FontAwesomeIcon icon={faUsers} /> Staff
                </NavLink>
              </li>}
              {isOwner && <li className="nav-item">
                <NavLink to="/staff-management" className={({ isActive }) =>
                  isActive ? "nav-link active-menu" : "nav-link"
                }>
                  <FontAwesomeIcon icon={faUsers} /> Staff
                </NavLink>
              </li>}
              {isOwner ?
                <li className="nav-item">
                  <NavLink to="/permission-type" className={({ isActive }) =>
                    isActive ? "nav-link active-menu" : "nav-link"
                  }>
                    <FontAwesomeIcon icon={faUserAltSlash} /> Permissions
                  </NavLink>
                </li>
                :
                <li className="nav-item">
                  <NavLink to="/my-permission" className={({ isActive }) =>
                    isActive ? "nav-link active-menu" : "nav-link"
                  }>
                    <FontAwesomeIcon icon={faUserAltSlash} />My Permissions
                  </NavLink>
                </li>
              }
              {(isOwner || permissions?.chat?.access) && <li className="nav-item">
                <NavLink to="/chat" className={({ isActive }) =>
                  isActive ? "nav-link active-menu" : "nav-link"
                }>
                  <FontAwesomeIcon icon={faMessage} /> Chat
                </NavLink>
              </li>}
              {!isOwner &&
                <li className="nav-item">
                  <NavLink to={`/staff-info-view/${staffUser?.nh12}`} className={({ isActive }) =>
                    isActive ? "nav-link active-menu" : "nav-link"
                  }>
                    <FontAwesomeIcon icon={faUserAlt} />My Profile
                  </NavLink>
                </li>
              }
              {isOwner &&
                <>
                  <li className="nav-item">
                    <NavLink to="/profile" className={({ isActive }) =>
                      isActive ? "nav-link active-menu" : "nav-link"
                    }>
                      <FontAwesomeIcon icon={faUserAlt} /> Profile
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/services" className={({ isActive }) =>
                      isActive ? "nav-link active-menu" : "nav-link"
                    }>
                      <FontAwesomeIcon icon={faServer} /> Services
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/change-password" className={({ isActive }) =>
                      isActive ? "nav-link active-menu" : "nav-link"
                    }>
                      <FontAwesomeIcon icon={faLock} /> Change Password
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/audit-log" className={({ isActive }) =>
                      isActive ? "nav-link active-menu" : "nav-link"
                    }>
                      <FontAwesomeIcon icon={faHistory} /> Audit Logs
                    </NavLink>
                  </li>
                </>}
              <li className="nav-item">
                <NavLink to="/" onClick={handleLogout} className="nav-link " data-bs-toggle="modal" data-bs-target="#logout" >
                  <FontAwesomeIcon icon={faArrowRightToBracket} /> Logout
                </NavLink>
              </li>
            </ul>

          </div>
        </div>
      </div>

      {/*Logout Popup Start  */}
      {/* data-bs-toggle="modal" data-bs-target="#logout" */}
      {/* <div className="modal step-modal" id="logout" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                                  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                  <div className="modal-dialog modal-dialog-centered modal-md">
                                      <div className="modal-content rounded-0 p-4">
                                         <div>
                                             
                                              </div>
                                          <div className="modal-body p-0">
                                              <div className="row">
                                                <div className="col-lg-12">
                                                  <div className="logout-bx text-center" >
                                                    <img src="/logout.svg" alt="" />
                                                    <h5 className="py-2">Logout</h5>
                                                    <p className="py-2">Are you sure you want to log out?</p>

                                                    <div className="d-flex align-items-center gap-3 justify-content-center mt-3">
                                                      <button className="nw-thm-btn outline px-5"  data-bs-dismiss="modal" aria-label="Close">No</button>
                                                      <button className="nw-thm-btn " data-bs-dismiss="modal" aria-label="Close">Yes, Logout</button>
                                                    </div>

                                                  </div>
                                                </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
          </div> */}
      {/*  Logout Popup End */}



    </>
  )
}

export default LeftSidebar