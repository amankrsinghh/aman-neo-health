import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faBuilding, faCalendarPlus, faCheck, faCheckCircle, faClose, faFileAlt, faHouseMedical, faUser, faUserDoctor, faUserGear, faUsers, } from "@fortawesome/free-solid-svg-icons"
import { TbGridDots } from "react-icons/tb";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSecureApiData, updateApiData } from "../../Services/api";
import { formatDateTime } from "../../Services/globalFunction";
import base_url from "../../baseUrl";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";


function DoctorRequestsList() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId')
    const [cardData, setCardData] = useState({
        pendingApt: 0, completeApt: 0,
        pendingRequest: 0, cancelApt: 0, totalApt: 0, todayApt: 0, approveApt: 0
    })
    const [appointmentRequest, setAppintmentRequest] = useState([])
    const [pendingAppointment, setPendingAppointment] = useState([])
    const [loading, setLoading] = useState(false)
    async function getDashboardData() {
        setLoading(true)
        try {
            const result = await getSecureApiData(`doctor/dashboard/${userId}`)
            if (result.success) {
                setCardData(result.cardData)
                setAppintmentRequest(result.appointmentRequest)
                setPendingAppointment(result.pendingAppointment)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userId) {
            getDashboardData()
        }
    }, [userId])

    const appointmentAction = async (id, status) => {
        const data = { doctorId: userId, appointmentId: id, status }
        setLoading(true)
        try {
            const response = await updateApiData(`appointment/doctor-action`, data);
            if (response.success) {
                // setCurrentPage(response.pagination.page)
                // setTotalPage(response.pagination.totalPages)
                getDashboardData()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    const startChatWithUser = async (user) => {
        // create or get conversation
        sessionStorage.removeItem('voiceCall');
        sessionStorage.removeItem('videoCall');
        sessionStorage.setItem('chatUser', JSON.stringify(user))
        navigate('/chat')
    };
    const startCallWithUser = async (user) => {
        // create or get conversation
        sessionStorage.removeItem('voiceCall');
        sessionStorage.setItem('videoCall', "true")
        sessionStorage.setItem('fromAppointment', "true")
        sessionStorage.setItem('chatUser', JSON.stringify(user))
        navigate('/chat')
    };
    return (
        <>
            {loading ? <Loader />
                :
                <div className="profile-right-card">
                    <div className="all-profile-data-bx">
                        <div className="row mb-3">
                            <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                                <div className="patient-nw-card cursor-pointer" onClick={() => navigate('/requests')}>
                                    <div className="patient-data-content">
                                        <span className="patient-dashboard-card"> <FontAwesomeIcon icon={faFileAlt} /> </span>
                                        <h5>{cardData?.pendingApt}</h5>
                                    </div>
                                    <p className="pt-2">Pending Request</p>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                                <div className="patient-nw-card patient-appointment-crd cursor-pointer" onClick={() => {
                                    const today = new Date().toISOString().split('T')[0];
                                    navigate(`/appointment-list`, { state: { startDate: today, endDate: today } });
                                }}>
                                    <div className="patient-data-content">
                                        <span className="patient-dashboard-card"> <FontAwesomeIcon icon={faHouseMedical} /> </span>
                                        <h5>{cardData?.todayApt}</h5>
                                    </div>
                                    <p className="pt-2">Today Appointment</p>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                                <div className="patient-nw-card patient-pending-crd cursor-pointer" onClick={() => navigate('/appointment-list', { state: { statuses: ['pending', 'approved'] } })}>
                                    <div className="patient-data-content">
                                        <span className="patient-dashboard-card"> <FontAwesomeIcon icon={faCalendarPlus} /> </span>
                                        <h5>{cardData?.approveApt}</h5>
                                    </div>
                                    <p className="pt-2">Pending Appointment</p>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                                <div className="patient-nw-card patient-total-crd cursor-pointer" onClick={() => navigate('/appointment-list')}>
                                    <div className="patient-data-content">
                                        <span className="patient-dashboard-card"> <FontAwesomeIcon icon={faUserGear} /> </span>
                                        <h5>{cardData?.totalApt}</h5>
                                    </div>
                                    <p className="pt-2">Total Appointment</p>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                                <div className="patient-nw-card patient-completed-crd cursor-pointer" onClick={() => navigate('/appointment-list', { state: { statuses: ['completed'] } })}>
                                    <div className="patient-data-content">
                                        <span className="patient-dashboard-card"> <FontAwesomeIcon icon={faCheckCircle} /> </span>
                                        <h5>{cardData?.completeApt}</h5>
                                    </div>
                                    <p className="pt-2">Completed Appointment</p>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                                <div className="patient-nw-card patient-cancel-crd cursor-pointer" onClick={() => navigate('/appointment-list', { state: { statuses: ['cancel', 'rejected'] } })}>
                                    <div className="patient-data-content">
                                        <span className="patient-dashboard-card"> <FontAwesomeIcon icon={faCheckCircle} /> </span>
                                        <h5>{cardData?.cancelApt}</h5>
                                    </div>
                                    <p className="pt-2">Cancel Appointment</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                                <div className="patient-nw-card  nw-hospital-staff-crd cursor-pointer" onClick={() => navigate('/employee')}>
                                    <div className="patient-data-content">
                                        <span className="patient-dashboard-card"> <FontAwesomeIcon icon={faUsers} /> </span>
                                        <h5>{cardData?.totalStaff || 0}</h5>
                                    </div>
                                    <p className="pt-2">Staff  </p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                                <div className="patient-nw-card  nw-hospital-patient-crd cursor-pointer" onClick={() => navigate('/patient-history')}>
                                    <div className="patient-data-content">
                                        <span className="patient-dashboard-card"> <FontAwesomeIcon icon={faUser} /> </span>
                                        <h5>{cardData?.totalPatient || 0}</h5>
                                    </div>
                                    <p className="pt-2">Total Patients</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                                <div className="patient-nw-card  patient-total-crd cursor-pointer" onClick={() => navigate('/requests')}>
                                    <div className="patient-data-content">
                                        <span className="patient-dashboard-card"> <FontAwesomeIcon icon={faUserDoctor} /> </span>
                                        <h5>{cardData?.totalDoctors || 0}</h5>
                                    </div>
                                    <p className="pt-2">Doctors  </p>
                                </div>
                            </div>
                            {cardData?.totalDepartments > 0 && <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                                <div className="patient-nw-card patient-appointment-crd cursor-pointer" onClick={() => navigate('/departments')}>
                                    <div className="patient-data-content">
                                        <span className="patient-dashboard-card"> <FontAwesomeIcon icon={faBuilding} /> </span>
                                        <h5>{cardData?.totalDepartments}</h5>
                                    </div>
                                    <p className="pt-2">Departments  </p>
                                </div>
                            </div>}
                        </div>
                        <div className="row mb-3">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <h5 className="fz-20 fw-700 text-black mb-0">Appointment Requests</h5>
                                </div>
                                <div>
                                    {appointmentRequest?.length > 10 && <Link to='/requests' className="nw-thm-btn outline "> View All </Link>}
                                </div>
                            </div>

                            <div className="col-lg-12">
                                <div className="table-section">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0 ">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Appointment  Id</th>
                                                    <th>Patient Details</th>
                                                    <th>Appointment  Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {appointmentRequest?.length > 0 ?
                                                    appointmentRequest?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{key + 1}.</td>
                                                            <td> #{item?.customId}</td>
                                                            <td>
                                                                <div className="admin-table-bx">
                                                                    <div className="admin-table-sub-details d-flex align-items-center gap-2">
                                                                        <img src={item?.patientId?.patientId?.profileImage ?
                                                                            `${base_url}/${item?.patientId?.patientId?.profileImage}` : "/profile.png"} alt="" />
                                                                        <div>
                                                                            <h6 className="">{item?.patientId?.name}</h6>
                                                                            <p>{item?.patientId?.nh12}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td>{formatDateTime(item?.date)}</td>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <button onClick={() => appointmentAction(item?._id, 'approved')} className="accept-title fw-700 fz-14 pe-2" style={{ borderRight: "1px solid #4D667E33" }}> <FontAwesomeIcon icon={faCheck} /> Accept</button>
                                                                    <button onClick={() => appointmentAction(item?._id, 'reject')} className="otp-timing fw-700 fz-14"> <FontAwesomeIcon icon={faClose} /> Reject</button>
                                                                </div>

                                                            </td>
                                                        </tr>) : (
                                                        <tr>
                                                            <td colSpan="5" className="text-center py-4 fw-600">
                                                                No appointment request
                                                            </td>
                                                        </tr>
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>




                                </div>
                            </div>
                        </div>

                        <div className="row ">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <h5 className="fz-20 fw-700 text-black mb-0">Pending Appointment</h5>
                                </div>
                                <div>
                                    {pendingAppointment?.length > 10 && <Link to='/appointment-list' className="nw-thm-btn outline "> View All </Link>}
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="table-section">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Appointment  Id</th>
                                                    <th>Patient Details</th>
                                                    <th>Appointment  Date</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pendingAppointment?.length > 0 ?
                                                    pendingAppointment?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{key + 1}.</td>

                                                            <td> #{item?.customId}</td>

                                                            <td>
                                                                <div className="admin-table-bx">
                                                                    <div className="admin-table-sub-details d-flex align-items-center gap-2">
                                                                        <img src={item?.patientId?.patientId?.profileImage ?
                                                                            `${base_url}/${item?.patientId?.patientId?.profileImage}` : "/profile.png"} alt="" />
                                                                        <div>
                                                                            <h6 className="">{item?.patientId?.name}</h6>
                                                                            <p>{item?.patientId?.nh12}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td>{formatDateTime(item?.date)}</td>
                                                            <td>

                                                                <span className="pending-data text-capitalize">{item?.status} </span>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-centet gap-2">
                                                                    <div className="dropdown position-static">
                                                                        <a
                                                                            href="javascript:void(0)"
                                                                            className="grid-dots-btn"
                                                                            id="acticonMenu1"
                                                                            data-bs-toggle="dropdown"
                                                                            aria-expanded="false"
                                                                        >
                                                                            <TbGridDots />
                                                                        </a>
                                                                        <ul
                                                                            className="dropdown-menu dropdown-menu-end  tble-action-menu admin-dropdown-card"
                                                                            aria-labelledby="acticonMenu1" style={{width:'250px'}}
                                                                        >
                                                                            <li className="prescription-item">
                                                                                <NavLink to={`/detail-view/${item?.patientId?.name}/${item?._id}`} className="prescription-nav" >
                                                                                    View Details
                                                                                </NavLink>
                                                                            </li>
                                                                            <li className="prescription-item">
                                                                                <button onClick={() => startChatWithUser(item)} className="prescription-nav w-100 text-start" >
                                                                                    Chat Now
                                                                                </button>
                                                                            </li>
                                                                            <li className="prescription-item">
                                                                                <button onClick={() => startCallWithUser(item)} className="prescription-nav w-100 text-start" >
                                                                                    Video Call
                                                                                </button>
                                                                            </li>
                                                                            <li className="prescription-item">
                                                                                <button onClick={() => appointmentAction(item?._id, 'completed')} className="prescription-nav text-start d-inline-block w-100"  >
                                                                                    <span className="accept-title "><FontAwesomeIcon icon={faCheck} />  Mark as in Complete</span>
                                                                                </button>
                                                                            </li>

                                                                            <li className="prescription-item">
                                                                                <button onClick={() => appointmentAction(item?._id, 'cancel')} className="text-start d-inline-block w-100 prescription-nav" >

                                                                                    <span className="danger-title">Cancel appointment</span>
                                                                                </button>
                                                                            </li>
                                                                        </ul>
                                                                    </div>

                                                                </div>
                                                            </td>
                                                        </tr>) : (
                                                        <tr>
                                                            <td colSpan="6" className="text-center py-4 fw-600">
                                                                No pending appointment
                                                            </td>
                                                        </tr>
                                                    )}

                                            </tbody>
                                        </table>
                                    </div>




                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default DoctorRequestsList