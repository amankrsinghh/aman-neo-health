import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faArrowsTurnRight, faBorderAll, faBoxArchive, faChartBar, faChevronRight, faClose, faFileAlt, faHistory, faKitMedical, faLock, faMessage, faMoneyBill, faPersonArrowDownToLine, faRobot, faUserAltSlash, faUserCircle, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmpDetail, fetchUserDetail } from "../../redux/feature/userSlice";
import { useEffect, useState } from "react";
import base_url from "../../baseUrl";
import { toast } from "react-toastify";
import { getApiData, getSecureApiData } from "../../Services/api";
import Loader from "./Loader";
function LeftSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const userId=localStorage.getItem('userId')
  const { pathname } = useLocation();
  const {
    profiles, isOwner, user,staffData,staffUser,permissions,
    pharPerson, customId
  } = useSelector((state) => state.user);
  useEffect(() => {

    if (isOwner) {
      dispatch(fetchUserDetail());
    } else if (isOwner === 'false') {
      dispatch(fetchEmpDetail(localStorage.getItem('staffId')));
    }
  }, [dispatch]);
  const [scheduleList, setScheduleList] = useState([])
  const [loading,setLoading]=useState(false)
  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const response = await getSecureApiData(`pharmacy/my-schedule/${userId}`);
      if (response.success) {
        setScheduleList(response.data)
      } else {
        toast.error(response.message)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong")
    }finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchSchedules()
  }, [])


  return (
    <>
      {loading ? <Loader/>
      :<div className="dashboard-left-side text-white min-vh-100 flex-shrink-0">
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
                <img src={isOwner ? `${base_url}/${profiles?.logo}` : `${base_url}/${staffData?.profileImage}`} alt="" />
                <div>
                  <h6 className="new_title fw-500 mb-0 fz-18">{isOwner ? profiles?.name : staffData?.name}</h6>
                  <p>#{isOwner ? user?.nh12 : staffUser?.nh12}</p>
                </div>
              </div>
            </NavLink>
          </div>
          <div className="left-navigation flex-grow-1 overflow-auto">

            <ul className="nav flex-column mt-3" >
              <h6 className="">Navigation</h6>
              <li className="nav-item">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                  }
                >
                  <FontAwesomeIcon icon={faBorderAll} />
                  Dashboard
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/sell"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                  }
                >
                  <FontAwesomeIcon icon={faMoneyBill} />  Sell
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/inventory"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                  }
                >
                  <FontAwesomeIcon icon={faBoxArchive} />  Inventory
                </NavLink>
              </li>


              <li className="nav-item">
                <NavLink
                  to="#labReportsSubmenu"
                  className="nav-link product-toggle "
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="labReportsSubmenu"
                  data-bs-parent=".nav"
                >
                  <FontAwesomeIcon icon={faKitMedical} />  Schedule Medicine
                  <FontAwesomeIcon icon={faChevronRight} className="ms-auto toggle-admin-icon" />
                </NavLink>

                <ul className=" product-submenu collapse" id="labReportsSubmenu" data-bs-parent=".nav">
                  {scheduleList?.map(s=>
                  <li className="nav-item">
                    <NavLink to={`/medicine-list/${s?.details?.name}/${s?.scheduleId}`} className="nav-link submenu-link">{s?.details?.name}</NavLink>
                  </li>)}

                  

                  <li className="nav-item">
                    <NavLink to="/medicine-request" className="nav-link submenu-link">H1 Medicine Request</NavLink>
                  </li>



                </ul>
              </li>




              <li className="nav-item">


                <NavLink
                  to="/generate-list"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                  }
                >


                  <FontAwesomeIcon icon={faFileAlt} />  Generate PO List
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/supplier"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                  }
                >
                  <FontAwesomeIcon icon={faPersonArrowDownToLine} />  Supplier
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/returns"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                  }
                >
                  <FontAwesomeIcon icon={faArrowsTurnRight} /> Returns
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/new-analysis"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                  }
                >
                  <FontAwesomeIcon icon={faChartBar} /> Analysis
                </NavLink>
              </li>

              {isOwner && <li className="nav-item">
                <NavLink
                  to="/employee"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                  }
                >
                  <FontAwesomeIcon icon={faUsers} /> Employee
                </NavLink>
              </li>}

              {isOwner ? <li className="nav-item">
                <NavLink
                  to="/permission"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                  }
                >
                  <FontAwesomeIcon icon={faUserAltSlash} /> Permissions
                </NavLink>
              </li>:
              <li className="nav-item">
                <NavLink
                  to="/my-permission"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                  }
                >
                  <FontAwesomeIcon icon={faUserAltSlash} /> My Permissions
                </NavLink>
              </li>}

              {isOwner?
              <li className="nav-item">
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                  }
                >
                  <FontAwesomeIcon icon={faUserCircle} /> Profile
                </NavLink>
              </li>
              :<li className="nav-item">
                <NavLink
                  to={`/view-employee/${staffUser?.name}/${staffUser?.nh12}`}
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                  }
                >
                  <FontAwesomeIcon icon={faUserCircle} /> Profile
                </NavLink>
              </li>}
              {(isOwner || permissions?.chat) && <li className="nav-item">
                <NavLink
                  to="/chat"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                  }
                >
                  <FontAwesomeIcon icon={faMessage} /> Chat
                </NavLink>
              </li>}
              <li className="nav-item">
                <NavLink
                  to="/neo-ai"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                  }
                >
                  <FontAwesomeIcon icon={faRobot} /> NeoAi
                </NavLink>
              </li>

              {isOwner &&
                <> <li className="nav-item">
                  <NavLink
                    to="/change-password"
                    className={({ isActive }) =>
                      "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                    }
                  >
                    <FontAwesomeIcon icon={faLock} />  Change Password
                  </NavLink>
                </li>
                  <li className="nav-item">
                    <NavLink to="/audit-log" className="nav-link ">
                      <FontAwesomeIcon icon={faHistory} /> Audit Logs
                    </NavLink>
                  </li>
                </>}

              <li className="nav-item">
                <NavLink
                  to="/logout"
                  data-bs-toggle="modal" data-bs-target="#logout"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "nw-pharmacy-active" : "")
                  }
                >

                  <FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout
                </NavLink>
              </li>
            </ul>

          </div>
        </div>
      </div>}



      {/*Logout Popup Start  */}
      {/* data-bs-toggle="modal" data-bs-target="#logout" */}
      <div className="modal step-modal fade" id="logout" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
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
                      <button className="nw-thm-btn outline px-5" data-bs-dismiss="modal" aria-label="Close">No</button>
                      <button className="nw-thm-btn " data-bs-dismiss="modal" aria-label="Close"
                        onClick={() => {
                          localStorage.clear()
                          navigate('/login')
                        }}>Yes, Logout</button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  Logout Popup End */}



    </>
  )
}

export default LeftSidebar