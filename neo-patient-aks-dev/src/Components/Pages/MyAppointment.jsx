
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { faCalendar, faEllipsisVertical, faLocationDot, faMessage, faPhone, faVideo, } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import { getSecureApiData, securePostData } from "../../Services/api"
import base_url from "../../baseUrl"
import { useDispatch, useSelector } from "react-redux"
import { fetchPatientDetail } from "../../Redux/features/patient"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { formatDateTime } from "../../Services/globalFunction"
import Loader from "../Layouts/Loader"

function MyAppointment() {
    const [searchParams,setSearchParams]=useSearchParams()
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId')
    const [cLabPage, setCLabPage] = useState(1)
    const [tLabPage, setTLabPage] = useState(1)
    const [totalLabAppointment, setTotalLabAppointment] = useState(0)
    const [doctorPage, setDoctorPage] = useState(1)
    const [tDoctorPage, setTDoctorPage] = useState(1)
    const [totalDoctorAppointment, setTotalDoctorAppointment] = useState(0)
    const [labAppointments, setLabAppointments] = useState([])
    const [appointments, setAppointments] = useState([])
    const [activeTab, setActiveTab] = useState("doctor");
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { profiles, medicalHistory, demographic, labAppointment, kyc, prescription, isRequest } = useSelector(state => state.patient)
    useEffect(() => {
        dispatch(fetchPatientDetail())
    }, [dispatch])
    async function fetchLabAppointments() {
        setLoading(true)
        try {
            const response = await getSecureApiData(`appointment/patient-lab/${userId}?page=${cLabPage}`)
            if (response.success) {
                setLabAppointments(response.data)
                setTLabPage(response.totalPage)
                setTotalLabAppointment(response.total)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    async function fetchDoctorAppointments() {
        setLoading(true)
        try {
            const response = await getSecureApiData(`patient/appointment/${userId}?page=${doctorPage}`)
            if (response.success) {
                setAppointments(response.data)
                setTDoctorPage(response.totalPage)
                setTotalDoctorAppointment(response.totalDoctorApt)
                setTotalLabAppointment(response.totalLabApt)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (!userId) return;

        if (activeTab === "doctor") {
            fetchDoctorAppointments();
        } else if (activeTab === "lab") {
            fetchLabAppointments();
        }
    }, [userId, doctorPage, cLabPage, activeTab]);


    const startChatWithUser = async (user) => {
        // create or get conversation
        sessionStorage.setItem('fromAppointment', "true")
        sessionStorage.setItem('chatUser', JSON.stringify(user))
        sessionStorage.removeItem('voiceCall')
        sessionStorage.removeItem('videoCall')
        navigate('/chat')
    };
    useEffect(()=>{
        if(searchParams.get('activeTab')=="lab"){
            setActiveTab("lab")
            setSearchParams({})
        }
    },[searchParams])
    const startCallWithUser = async (user) => {
        // create or get conversation
        sessionStorage.setItem('voiceCall', "true")
        sessionStorage.setItem('fromAppointment', "true")
        sessionStorage.setItem('chatUser', JSON.stringify(user))
        sessionStorage.removeItem('videoCall')
        navigate('/chat')
    };
    const startVideoCallWithUser = async (user) => {
        // create or get conversation
        sessionStorage.setItem('videoCall', "true")
        sessionStorage.setItem('fromAppointment', "true")
        sessionStorage.setItem('chatUser', JSON.stringify(user))
        sessionStorage.removeItem('voiceCall')
        navigate('/chat')
    };
    return (
        <>
            {loading ? <Loader />
                :
                <div className="profile-right-card">
                    <div className="profile-tp-header">
                        <h5 className="heading-grad fz-24 mb-0"> My Appointment </h5>
                    </div>
                    <div className="">
                        <div className="employee-tabs">
                            <ul className="nav nav-tabs gap-3 mt-3 px-3" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a
                                        className={`nav-link ${activeTab === "doctor" ? "active" : ""}`}
                                        id="home-tab"
                                        data-bs-toggle="tab"
                                        href="#home"
                                        onClick={() => setActiveTab("doctor")}
                                        role="tab"
                                    >
                                        Doctor Appointment
                                        <span className="count-card">{totalDoctorAppointment}</span>
                                    </a>
                                </li>

                                <li className="nav-item" role="presentation">
                                    <a
                                        className={`nav-link ${activeTab === "lab" ? "active" : ""}`}
                                        onClick={() => setActiveTab("lab")}
                                        id="profile-tab"
                                        data-bs-toggle="tab"
                                        href="#profile"
                                        role="tab"
                                    >
                                        Test Appointment

                                        <span className="count-card">{totalLabAppointment}</span>
                                    </a>
                                </li>

                            </ul>

                            <div className="new-panel-card">
                                <div className="employee-tabs">
                                    <div className="tab-content" id="myTabContent">
                                        <div
                                            className={`tab-pane fade ${activeTab === "doctor" ? "show active" : ""}`}
                                            id="home"
                                            role="tabpanel"
                                        >

                                            <div className="all-profile-data-bx">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        {appointments?.length > 0 ?
                                                            appointments?.map((item, key) =>
                                                                <div className="my-appointment-info-card mb-3" key={key}>
                                                                    <div className="my-appointment-tp-bx">
                                                                        <div className="appoint-left-title-bx">
                                                                            <h5 className="fz-16 fw-700 mb-0 text-black"> <span className="cal-icon"><FontAwesomeIcon icon={faCalendar} /></span> {formatDateTime(item?.date)}  </h5>
                                                                        </div>
                                                                        <div>

                                                                            {(item?.status == 'approved' && new Date() < new Date(item?.date)) &&
                                                                                <div className="appoint-right-title-bx">
                                                                                    <span className="nw-result-bx">Upcoming</span>
                                                                                </div>}
                                                                            {item?.status == 'cancel' && <div className="appoint-right-title-bx">
                                                                                <span className="nw-result-bx canceled-title">Canceled</span>
                                                                            </div>}
                                                                            {item?.status == 'pending' &&
                                                                                <div className="appoint-right-title-bx">
                                                                                    <span className="nw-result-bx pending-bx">Pending</span>
                                                                                </div>}
                                                                            {item?.status == 'completed' &&
                                                                                <div className="appoint-right-title-bx">
                                                                                    <span className="nw-result-bx completed-title">Completed</span>
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className="appointment-info-parent-bx">
                                                                        <div className="appointment-info-sub-bx">
                                                                            <img src={item?.doctorId?.doctorId?.profileImage ?
                                                                                `${base_url}/${item?.doctorId?.doctorId?.profileImage}` : "/doctor-timing.png"} alt="" />
                                                                            <div className="appointment-info-details">
                                                                                <h4 className="">{item?.doctorId?.name}</h4>
                                                                                <h6 className="nw-appointment-title">{item?.doctorAddress?.specialty?.name} {item?.doctorAddress?.specialty&&<span className="slash-title" >|</span>} {item?.hospitalId ? item?.hospitalId?.name : item?.doctorAddress?.hospitalName}</h6>
                                                                                <p className=""><FontAwesomeIcon icon={faLocationDot} /> {item?.doctorAddress?.fullAddress}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="appointment-info-mega-bx">
                                                                            {item?.status == 'rejected' && <div className="not-accpent-bx">
                                                                                <h6 className="not-accept-title">Not Accept</h6>
                                                                            </div>}
                                                                            {item?.status == 'approved' && <div className="not-accpent-bx">
                                                                                <h6 className="not-accept-title accept-title">Accept Request</h6>
                                                                            </div>}
                                                                            {item?.status !== 'rejected' && item?.status !== 'approved' &&
                                                                                <div></div>}
                                                                            <div>
                                                                                <ul className="doctor-social-list">
                                                                                    <li className="doctor-social-item"><button onClick={() => startChatWithUser(item?.doctorId)} className="doctor-social-btn" > <FontAwesomeIcon icon={faMessage} /> </button></li>
                                                                                    <li className="doctor-social-item"><button onClick={() => startCallWithUser(item?.doctorId)} className="doctor-social-btn" > <FontAwesomeIcon icon={faPhone} /> </button></li>
                                                                                    <li className="doctor-social-item"><button onClick={() => startVideoCallWithUser(item?.doctorId)} className="doctor-social-btn" > <FontAwesomeIcon icon={faVideo} /> </button></li>
                                                                                    <li className="doctor-social-item"><Link to={`/appointment-detail/${item?.doctorId?.name}/${item?._id}`} className="nw-vertical-btn" > <FontAwesomeIcon icon={faEllipsisVertical} /> </Link></li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {item?.status == 'cancel' &&
                                                                        <div className="mt-2">
                                                                            <p className="appoint-cancel">Cancel Date :{formatDateTime(item?.updatedAt)}</p>
                                                                        </div>}
                                                                </div>) : 'No doctor Appointment'}

                                                    </div>
                                                    {tDoctorPage > 1 && <div className="d-flex text-end gap-2 justify-content-end mt-3">
                                                        <button onClick={() => setDoctorPage(doctorPage - 1)} disabled={doctorPage == 1} className="nw-thm-btn outline">Prev</button>
                                                        <button onClick={() => setDoctorPage(doctorPage + 1)} disabled={doctorPage == tDoctorPage} className="nw-thm-btn">Next</button>
                                                    </div>}
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`tab-pane fade ${activeTab === "lab" ? "show active" : ""}`}
                                            id="profile"
                                            role="tabpanel"
                                        >
                                            <div className="all-profile-data-bx">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        {labAppointments?.length > 0 ?
                                                            labAppointments?.map((item, key) =>
                                                                <div className="my-appointment-info-card mb-3" key={key}>
                                                                    <div className="my-appointment-tp-bx">
                                                                        <div className="appoint-left-title-bx">
                                                                            <h5 className="fz-16 fw-700 mb-0 text-black"> <span className="cal-icon">
                                                                                <FontAwesomeIcon icon={faCalendar} /></span> {formatDateTime(item?.date)} </h5>
                                                                        </div>
                                                                        {(new Date() < new Date(item?.date) && item?.status == 'approved') &&
                                                                            <div className="appoint-right-title-bx">
                                                                                <span className="nw-result-bx">Upcoming</span>
                                                                            </div>}
                                                                        {item?.status == 'cancel' &&
                                                                            <div className="appoint-right-title-bx">
                                                                                <span className="nw-result-bx canceled-title">Canceled</span>
                                                                            </div>}
                                                                        {item?.status == 'pending-report' &&
                                                                            <div className="appoint-right-title-bx">
                                                                                <span className="nw-result-bx pending-bx">Pending Report</span>
                                                                            </div>}
                                                                        {item?.status == 'deliver-report' &&
                                                                            <div className="appoint-right-title-bx">
                                                                                <span className="nw-result-bx completed-title">Completed</span>
                                                                            </div>
                                                                        }
                                                                    </div>

                                                                    <div className="appointment-info-parent-bx">
                                                                        <div className="appointment-info-sub-bx">
                                                                            <img src={item?.labId?.labId?.logo ?
                                                                                `${base_url}/${item?.labId?.labId?.logo}` : "/lab-pic.png"} alt="" />
                                                                            <div className="appointment-info-details">
                                                                                <h4 className="">{item?.labId?.name}</h4>
                                                                                <p className=""><FontAwesomeIcon icon={faLocationDot} /> {item?.labAddress?.fullAddress}</p>
                                                                                <p>Tests Name: <span className="cbc-report-title">{item?.tests?.map(t => t.subCat?.map(sub=>sub?.subCatId?.subCategory)).join(", ")}
                                                                                </span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="appointment-info-mega-bx">
                                                                            {item?.status == 'rejected' && <div className="not-accpent-bx">
                                                                                <h6 className="not-accept-title">Not Accept</h6>
                                                                            </div>}
                                                                            {item?.status == 'approved' && <div className="not-accpent-bx">
                                                                                <h6 className="not-accept-title accept-title">Accept Request</h6>
                                                                            </div>}
                                                                            {item?.status !== 'rejected' && item?.status !== 'approved' &&
                                                                                <div></div>}
                                                                            <div>
                                                                                <ul className="doctor-social-list">
                                                                                    <li className="doctor-social-item"><button onClick={() => startChatWithUser(item?.labId)} className="doctor-social-btn" > <FontAwesomeIcon icon={faMessage} /> </button></li>
                                                                                    <li className="doctor-social-item"><button onClick={() => startCallWithUser(item?.labId)} className="doctor-social-btn" > <FontAwesomeIcon icon={faPhone} /> </button></li>
                                                                                    <li className="doctor-social-item"><Link to={`/lab-appointment-details/${item?.labId?.name}/${item?._id}`} className="nw-vertical-btn" > <FontAwesomeIcon icon={faEllipsisVertical} /> </Link></li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {item?.status == 'cancel' &&
                                                                        <div className="mt-2">
                                                                            <p className="appoint-cancel">Cancel Date :{formatDateTime(item?.updatedAt)}</p>
                                                                        </div>}

                                                                </div>) : 'No lab Appointment'}


                                                    </div>
                                                    {tLabPage > 1 && <div className="d-flex text-end gap-2 justify-content-end mt-3">
                                                        <button onClick={() => setCLabPage(cLabPage - 1)} disabled={cLabPage == 1} className="nw-thm-btn outline">Prev</button>
                                                        <button onClick={() => setCLabPage(cLabPage + 1)} disabled={cLabPage == tLabPage} className="nw-thm-btn">Next</button>
                                                    </div>}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            }

            <div className="text-end mt-4">
                <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
            </div>

        </>
    )
}

export default MyAppointment