import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft, faChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import base_url from "../../baseUrl";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { getApiData } from "../../Services/api";
import { fetchEmpDetail } from "../../redux/feature/userSlice";

function TopHeader() {
  const [isOpen, setIsOpen] = useState(true);
  const [patientId, setPatientId] = useState()
  const [loading, setLoading] = useState(false)
  const {unRead,user}=useSelector((state)=>state.user)
  const navigate = useNavigate()
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
  const dispatch = useDispatch();

  const {
    profiles, isOwner, customId,staffData,staffUser,employment,
    pharPerson
  } = useSelector((state) => state.user);
  const handleSearch = async () => {
    if (!patientId) return toast.error("Please enter a patient id")
    setLoading(true)
    try {

      if (patientId) {
        const res = await getApiData(`patient/${patientId}`)
        if (res.success) {
          setPatientId("")
          navigate(`/prescriptions-bar/${res.userId}`)
        } else {
          toast.error("Patient not found")
        }
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }
  useEffect(()=>{
    dispatch(fetchEmpDetail(localStorage.getItem('staffId')))
  },[])
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
                    type="number"
                    value={patientId}
                    className="form-control headr-search-table-frm pe-5"
                    id="email"
                    onChange={(e) => setPatientId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch()
                      }
                    }}
                    placeholder="Search"
                    required
                  />
                  <div className="tp-search-bx">
                    <button className="tp-search-btn" onClick={handleSearch}>
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

              <div className="position-relative">
                <NavLink to="/notification" className="tp-bell-icon">
                  <FontAwesomeIcon icon={faBell} className="text-black" />
                  {unRead>0 &&<div className="bell-nw-icon-alrt">
                    <span className="bell-title">{unRead}</span>
                  </div>}
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
                    <img src={isOwner ? `${base_url}/${profiles?.logo}` : `${base_url}/${staffData?.profileImage}`} alt="" />
                  </div>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end user-dropdown sallr-drop-box p-0"
                  aria-labelledby="userMenu"
                >
                  <div className="profile-card-box gap-0">
                    <div className="profile-top-section">
                      <img
                        src={isOwner ? `${base_url}/${profiles?.logo}` : `${base_url}/${staffData?.profileImage}`}
                        alt="Profile"
                        className="profile-image"
                      />
                      <div className="profile-info">
                        <span className="profile-role">{isOwner ? 'Admin' : employment?.role}</span>
                        <h4 className="profile-name">{isOwner ? profiles?.name : staffData?.name}</h4>
                        <p className="profile-id">ID : {isOwner ? user?.nh12 : staffUser?.nh12}</p>
                      </div>
                    </div>
                    <div className="profile-logout-box">
                      <Link to='/login' onClick={() => localStorage.clear()} className=" btn btn-danger text-white">
                        <i className="fas fa-sign-out-alt"></i> Logout
                      </Link>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>}
    </>
  )
}

export default TopHeader