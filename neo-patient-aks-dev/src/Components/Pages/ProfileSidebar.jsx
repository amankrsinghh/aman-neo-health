import { faAmbulance, faArrowRightFromBracket, faCalendarPlus, faCircleXmark, faCreditCard, faFile, faFlask, faHeart, faKey, faMessage, faRobot, faShareAlt, faSyringe, faUserEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { fetchPatientDetail } from "../../Redux/features/patient"
import { useEffect } from "react"
import base_url from "../../baseUrl"

function ProfileSidebar() {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const { profiles, medicalHistory, demographic, labAppointment, kyc, prescription, isRequest,customId,allowEdit } = useSelector(state => state.patient)
    useEffect(()=>{
        dispatch(fetchPatientDetail())
    },[dispatch])

    return (
        <>
            <div className="doctor-profile-card">
                <div className="user-background">
                    <div className="user-parent-bx">
                        <img src="/profile-bg.png" alt="" />
                    </div>

                    <div className="main-user-profile-card">
                        <div className="main-user-picture">
                            <img src={profiles?.profileImage?
                            `${base_url}/${profiles?.profileImage}`:"/call-pic.jpg"} alt="" />
                        </div>
                        <div className="user-detail-bx">
                            <h5>{profiles?.name}</h5>
                            <p>ID: {customId}</p>
                        </div>
                    </div>

                </div>

                <div className="new-item-list">
                    <ul className="nw-profile-list">
  <li className="nw-profile-item">
    <Link to="/my-appointment" className="nw-nav-link">
      <FontAwesomeIcon icon={faCalendarPlus} className="nw-nav-icon" /> 
      My Appointment
    </Link>
  </li>
  <li className="nw-profile-item">
    <Link to="/lab-report" className="nw-nav-link">
      <FontAwesomeIcon icon={faFlask} className="nw-nav-icon" /> Lab Report
    </Link>
  </li>
  <li className="nw-profile-item">
    <Link to="/prescription" className="nw-nav-link">
      <FontAwesomeIcon icon={faFile} className="nw-nav-icon" />
      Prescriptions
    </Link>
  </li>
  {/* <li className="nw-profile-item"><Link to='/prescription' className="nw-nav-link"> <FontAwesomeIcon icon={faSyringe} className="nw-nav-icon" />Vaccination</Link></li> */}
  {/* <li className="nw-profile-item"><Link to='/ambulance-booking-histroy' className="nw-nav-link"> <FontAwesomeIcon icon={faAmbulance} className="nw-nav-icon" />Ambulance Booking History</Link></li> */}
  <li className="nw-profile-item">
    <Link to={"/profile"} className="nw-nav-link">
      <FontAwesomeIcon icon={faUserEdit} className="nw-nav-icon" />
      Profile
    </Link>
  </li>

  <li className="nw-profile-item">
    <Link to="/health-card-details" className="nw-nav-link">
      <FontAwesomeIcon icon={faCreditCard} className="nw-nav-icon" />
      My NeoHealthCard
    </Link>
  </li>
  <li className="nw-profile-item">
    <Link to="/share-health-card" className="nw-nav-link">
      <FontAwesomeIcon icon={faShareAlt} className="nw-nav-icon" />
      Share NeoHealthCard
    </Link>
  </li>
  <li className="nw-profile-item">
    <Link to="/chat" className="nw-nav-link">
      <FontAwesomeIcon icon={faMessage} className="nw-nav-icon" />
      My Chat
    </Link>
  </li>
  <li className="nw-profile-item">
    <Link to="/neo-ai" className="nw-nav-link">
      <FontAwesomeIcon icon={faRobot} className="nw-nav-icon" />
      Neo Ai
    </Link>
  </li>

  <li className="nw-profile-item">
    <Link to="/favorite" className="nw-nav-link">
      <FontAwesomeIcon icon={faHeart} className="nw-nav-icon" />
      Favorite
    </Link>
  </li>

  <li className="nw-profile-item">
    <Link to="/change-password" className="nw-nav-link">
      <FontAwesomeIcon icon={faKey} className="nw-nav-icon" />
      Change Password
    </Link>
  </li>

  <li className="nw-profile-item">
    <Link
      className="nw-nav-link"
      data-bs-toggle="modal"
      data-bs-target="#logout"
    >
    
      <FontAwesomeIcon icon={faArrowRightFromBracket} className="nw-nav-icon" />
      Logout
    </Link>
  </li>
                    </ul>
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
                                            <button className="thm-btn px-3" data-bs-dismiss="modal" aria-label="Close" onClick={()=>{
                                                localStorage.clear()
                                                navigate('/')
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

export default ProfileSidebar