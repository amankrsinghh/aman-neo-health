import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft, faChevronRight, faCircleXmark, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoMdQrScanner } from "react-icons/io";
import Scanner from "../Pages/Scanner";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetail } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
import { getApiData } from "../../Service/api";
import base_url from "../../baseUrl";
import Loader from "../Common/Loader";

function TopHeader() {
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch()
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false)
  const { user, hospitalPerson, notification, hospitalBasic } = useSelector(state => state.user)
  useEffect(() => {
    dispatch(fetchUserDetail())
  }, [dispatch])

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login");
  };



  useEffect(() => {
    let overlay = document.querySelector('.mobile-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.classList.add('mobile-overlay');
      document.body.appendChild(overlay);
    }

    const dashboard = document.querySelector('.dashboard-left-side');
    const menuBtn = document.querySelector('.tp-mobile-menu-btn');
    const closeBtns = document.querySelectorAll('.tp-mobile-close-btn, .mobile-overlay');

    const handleMenuClick = (e) => {
      e.preventDefault();
      if (window.innerWidth < 992) {
        dashboard.classList.add('mobile-show');
        overlay.classList.add('show');
      } else {
        dashboard.classList.toggle('hide-sidebar');
      }
    };

    const handleClose = (e) => {
      e.preventDefault();
      dashboard.classList.remove('mobile-show');
      overlay.classList.remove('show');
    };

    menuBtn?.addEventListener('click', handleMenuClick);
    closeBtns.forEach(btn => btn.addEventListener('click', handleClose));

    // Cleanup on unmount
    return () => {
      menuBtn?.removeEventListener('click', handleMenuClick);
      closeBtns.forEach(btn => btn.removeEventListener('click', handleClose));
    };
  }, []);


  const handleDetected = (code) => {
    alert("Scanned barcode: " + code);
  };
  const handleSearch = async () => {
    setLoading(true)
    try {

      if (patientId) {
        const res = await getApiData(`patient/${patientId}`)
        if (res.success) {
          setPatientId("")
          navigate(`/patient-view/${res.userId}`)
        } else {
          toast.error("Patient not found")
        }
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      {loading ? <Loader />
        : <div className="tp-header-section d-flex align-items-center justify-content-between w-100 py-2 px-3">
          <div className="dash-vendr-header-left-bx">
            <a href="#" className="tp-mobile-menu-btn me-lg-0 me-sm-3" onClick={(e) => {
              e.preventDefault();
              setIsOpen((prev) => !prev);
            }}>
              {/* <FontAwesomeIcon icon={faBars} className="fa-lg" /> */}
              {/* <FontAwesomeIcon icon={faChevronLeft} className="fa-lg" /> */}
              <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} className="fa-lg" />
            </a>

            <div className="top-header-icon tp-header-search-br ">
              <div className="d-flex align-items-center gap-2">
                <div className="custom-frm-bx mb-0 position-relative">
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="form-control headr-search-table-frm " style={{paddingLeft : "40px"}}
                    id="email"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    placeholder=""
                    required
                  />
                  <div className="tp-search-bx">
                    <button className="tp-search-btn text-secondary" onClick={() => handleSearch()}>
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                  </div>
                </div>
                <div className="add-patient-bx">
                  <Link to="/add-patient" className="add-patient-btn">
                    <img src="/white-plus.png" alt="" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex top-header-icon-sec align-items-center">
            <div className="tp-right-admin-bx d-flex align-items-center">
              <div>
                {hospitalBasic?.kycStatus !== 'approved' && <span className="approved approved-active leaved">{hospitalBasic?.kycStatus} </span>}
              </div>
              <div>
                <button className="rq-scan-btn" data-bs-toggle="modal" data-bs-target="#scanner-Request" ><IoMdQrScanner className="fz-18" /> SCAN</button>
              </div>

              <div className="position-relative">
                <NavLink to="/notifcation" className="tp-bell-icon">
                  <FontAwesomeIcon icon={faBell} className="text-black" />
                  <div className="bell-nw-icon-alrt">
                    <span className="bell-title">{notification || 0}</span>
                  </div>
                </NavLink>
              </div>
              <div className="header-user dropdown tp-right-admin-details d-flex align-items-center">
                <a
                  href="#"
                  className="user-toggle d-flex align-items-center"
                  id="userMenu"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="admn-icon me-2">
                    <img
                      src={hospitalBasic?.logoFileId ? `${base_url}/api/file/${hospitalBasic.logoFileId}` : "/user-avatar.png"}
                      alt="User Avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/user-avatar.png";
                      }}
                    />
                  </div>
                </a>

                <ul
                  className="dropdown-menu dropdown-menu-end user-dropdown sallr-drop-box"
                  aria-labelledby="userMenu"
                >
                  <div className="profile-card-box">
                    <div className="profile-top-section">
                      <img
                        src={hospitalBasic?.logoFileId ? `${base_url}/api/file/${hospitalBasic.logoFileId}` : "/user-avatar.png"}
                        alt="Profile"
                        className="profile-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/user-avtar.png";
                        }}
                      />
                      <div className="profile-info">
                        <span className="profile-role text-capitalize">{user?.role}</span>
                        <h4 className="profile-name">{user?.name}</h4>
                        <p className="profile-id">ID : {user?.nh12}</p>
                      </div>
                    </div>
                    <div className="profile-logout-box">
                      <a href="#" className="logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                      </a>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>}

      {/*Payment Status Popup Start  */}
      {/* data-bs-toggle="modal" data-bs-target="#scanner-Request" */}
      <div className="modal step-modal" id="scanner-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content rounded-5 p-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="lg_title mb-0">Scan </h6>
              </div>
              <div>
                <button type="button" className="fz-18" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </div>
            </div>
            <div className="modal-body p-0">
              <div className="row ">
                <div className="col-lg-12">
                  <Scanner onDetected={handleDetected} />
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

export default TopHeader