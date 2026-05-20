import { faBed, faBriefcase, faBuilding, faCalendar, faUser, faUserDoctor, faUsers } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TbGridDots } from "react-icons/tb";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSecureApiData, updateApiData } from "../../Service/api";
import base_url from "../../baseUrl";
import { calculatePaymentDetails, formatDateTime } from "../../Service/globalFunction";
import { toast } from "react-toastify";
import Loader from "../Common/Loader";
import AllotmentPayment from "./AllotmentPayment";
import DischargePatient from "./DischargePatient";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmpDetail } from "../../redux/features/userSlice";
import BedInvoice from "../../All Template file/Bed invoice";



function Dashboard() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null);
  const [cardData, setCardData] = useState({})
  const [selected, setSelected] = useState()
  const [departments, setDepartments] = useState([])
  const dispatch = useDispatch()
  const { staffUser, isOwner } = useSelector(state => state.user)
  const [nextStep, setNextStep] = useState()
  const [profileComlete, setProfileComplete] = useState(0)
  const [doctorId, setDoctorId] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const userId = user?.id
  const [appointments, setAppointments] = useState([])
  const [appointmentRequest, setAppointmentRequest] = useState([])
  async function getAppointmentData() {

    try {
      const result = await getSecureApiData(`appointment/hospital/${userId}?page=1&doctorId=${doctorId}`)
      if (result.success) {
        setAppointments(result.data)
      }
    } catch (error) {

    }
  }
  async function getAppointmentRequestData() {

    try {
      const result = await getSecureApiData(`appointment/hospital/${userId}?page=1&status=pending${doctorId}`)
      if (result.success) {
        setAppointmentRequest(result.data)
      }
    } catch (error) {

    }
  }
  async function getDashboardData() {

    setLoading(true)
    try {
      const result = await getSecureApiData(`api/hospital/dashboard`)
      if (result.success) {
        setCardData(result.data)
        setDepartments(result.departments)
        setNextStep(result.nextStep)
        setProfileComplete(result.profileComplete)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (user) {
      Promise.all([
        getAppointmentData(),
        getAppointmentRequestData(),
        getDashboardData(),
      ])
    }
  }, [user, doctorId])
  const appointmentAction = async (item, status) => {
    const data = { doctorId: item?.doctorId?._id, appointmentId: item?._id, status }

    try {
      const response = await updateApiData(`appointment/hospital/doctor-action`, data);
      if (response.success) {
        getAppointmentRequestData()
        getAppointmentData()
      } else {
        toast.error(response.message)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");;
    }
  }
  const [allotments, setAllotments] = useState([])
  async function fetchAllotments() {
    try {
      const result = await getSecureApiData(`api/bed/allotment/history/${userId}?page=${1}&limit=5&doctorId=${doctorId}`)
      if (result.success) {
        setAllotments(result.data)
      }
    } catch (error) {

    }
  }
  useEffect(() => {
    if (userId) {

      fetchAllotments()
    }
  }, [userId, doctorId])
  useEffect(() => {
    dispatch(fetchEmpDetail(localStorage.getItem("staffId")))
  }, [])
  useEffect(() => {
    if (staffUser?.role == "doctor") {
      setDoctorId(staffUser?._id)
    }
  }, [staffUser])

  return (
    <>
      {loading ? <Loader />
        : <div className="main-content flex-grow-1 p-3 overflow-auto">
          <div className="row mb-3">
            <div className="col-6 col-md-4 col-lg mb-3">
              <div className="new-hospital-card">
                <div className="hostpital-content-bx">
                  <span className="usr-nw-icon"> <FontAwesomeIcon icon={faUserDoctor} /> </span>
                  <h6>{cardData?.totalDoctors || 0}</h6>
                </div>
                <p >Doctors </p>
              </div>
            </div>

            <div className="col-6 col-md-4 col-lg mb-3">
              <div className="new-hospital-card nw-hospital-patient-crd">
                <div className="hostpital-content-bx">
                  <span className="usr-nw-icon"> <FontAwesomeIcon icon={faUser} /> </span>
                  <h6>{cardData?.totalPatients || 0}</h6>
                </div>
                <p >Patients </p>
              </div>
            </div>

            <div className="col-6 col-md-4 col-lg mb-3">
              <div className="new-hospital-card nw-hospital-department-crd">
                <div className="hostpital-content-bx">
                  <span className="usr-nw-icon"> <FontAwesomeIcon icon={faBuilding} /> </span>
                  <h6>{cardData?.totalDepartments || 0}</h6>
                </div>
                <p >Departments </p>
              </div>
            </div>

            <div className="col-6 col-md-4 col-lg mb-3">
              <div className="new-hospital-card nw-hospital-staff-crd">
                <div className="hostpital-content-bx">
                  <span className="usr-nw-icon"> <FontAwesomeIcon icon={faUsers} /> </span>
                  <h6>{cardData?.totalStaffs || 0}</h6>
                </div>
                <p >Staff  </p>
              </div>
            </div>

            <div className="col-6 col-md-4 col-lg mb-3">
              <div className="new-hospital-card nw-hospital-appoint-crd">
                <div className="hostpital-content-bx">
                  <span className="usr-nw-icon"> <FontAwesomeIcon icon={faBriefcase} /> </span>
                  <h6>{cardData?.totalAppointments || 0}</h6>
                </div>
                <p >Total Appointment  </p>
              </div>
            </div>

            <div className="col-6 col-md-4 col-lg mb-3">
              <div className="new-hospital-card nw-hospital-request-crd">
                <div className="hostpital-content-bx">
                  <span className="usr-nw-icon"> <FontAwesomeIcon icon={faCalendar} /> </span>
                  <h6>{cardData?.pendingAppointments || 0}</h6>
                </div>
                <p >Appointment Request </p>
              </div>
            </div>

            <div className="col-6 col-md-4 col-lg mb-3">
              <div className="new-hospital-card nw-hospital-bed-crd">
                <div className="hostpital-content-bx">
                  <span className="usr-nw-icon"> <FontAwesomeIcon icon={faBed} /> </span>
                  <h6>{cardData?.bookedBed || 0}</h6>
                </div>
                <p >Bed booked</p>
              </div>
            </div>
          </div>
          {nextStep && isOwner && <div className="row mb-3">
            <div className="col-10">
              <div className="progress-container">
                <span
                  className="profile-progress-bar"
                  style={{ width: `${profileComlete}%` }}
                >{profileComlete} %</span>
              </div>
            </div>
            <div className="col-2 text-center">
              <Link to={nextStep} className="rq-scan-btn text-center w-100">Complete Now</Link>
            </div>
          </div>}

          <div className="row">
            <div className="col-lg-8 col-sm-12">
              <div className="new-panel-card rounded-2 mb-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h5 className="fw-700 fz-20 mb-0"><FontAwesomeIcon icon={faCalendar} /> Appointment</h5>
                  </div>
                  {appointments?.length > 4 && <div>
                    <NavLink to="/appointment" className="papperclip-btn fw-500">View All</NavLink>
                  </div>}
                </div>

                <div className="table-section">
                  <div className="table table-responsive mb-0">
                    <table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Appointment  Id</th>
                          <th>Patient Details</th>
                          <th>Appointment  Date</th>
                          <th>Doctor</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments?.length > 0 ?
                          appointments?.map((item, key) =>
                            <tr key={key}>
                              <td>{key + 1}.</td>
                              <td> #{item?.customId}</td>
                              <td>
                                <div className="admin-table-bx">
                                  <div className="admin-table-sub-bx">
                                    <img src={item?.patientId?.patientId?.profileImage ?
                                      `${base_url}/${item?.patientId?.patientId?.profileImage}` : "/admin-tb-logo.png"} alt=""
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/profile.png";
                                      }} />
                                    <div className="admin-table-sub-details doctor-title">
                                      <h6>{item?.patientId?.name}</h6>
                                      <p>{item?.patientId?.nh12}</p>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                {formatDateTime(item?.date)}
                              </td>

                              <td>
                                <div className="admin-table-bx">
                                  <div className="admin-table-sub-bx">
                                    <img src={item?.doctorId?.doctorId?.profileImage ?
                                      `${base_url}/${item?.doctorId?.doctorId?.profileImage}` : "/doctor-avatr.png"} alt=""
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/profile.png";
                                      }} />
                                    <div className="admin-table-sub-details doctor-title">
                                      <h6>{item?.doctorId?.name}</h6>
                                      <p>{item?.doctorId?.nh12}</p>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td >{item?.status == 'completed' ? <span className="approved approved-active ">Completed </span>
                                : <span className="approved approved-active leaved text-capitalize">{item?.status} </span>}</td>
                              <td>
                                <div className="dropdown">
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
                                    aria-labelledby="acticonMenu1"
                                  >
                                    <li className="prescription-item">
                                      <Link className="prescription-nav" to={`/doctor-appointment-details/${item?._id}`}>
                                        View  Appointment
                                      </Link>
                                    </li>
                                    {/* <li className="prescription-item">
                                <a className="prescription-nav" href="#" data-bs-toggle="modal" data-bs-target="#edit-Supplier">
                                  Edit
                                </a>
                              </li>
                              <li className="prescription-item">
                                <a className="prescription-nav" href="#" data-bs-toggle="modal" data-bs-target="#edit-Supplier">
                                  Delete
                                </a>
                              </li> */}

                                  </ul>
                                </div>

                              </td>
                            </tr>) :
                          <span className="text-black">No appointment found</span>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="new-panel-card rounded-2 mb-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h5 className="fw-700 fz-20 mb-0"><FontAwesomeIcon icon={faCalendar} /> Bed Allotment </h5>
                  </div>
                  <div>
                    <NavLink to="/bed-allotment-history" className="papperclip-btn fw-500">View All</NavLink>
                  </div>
                </div>

                <div className="table-section">
                  <div className="table table-responsive mb-0">
                    <table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Patient Details</th>
                          <th>Bed Information</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Action</th>

                        </tr>
                      </thead>
                      <tbody>

                        {allotments?.length > 0 ? allotments?.map((item, key) => {
                          const payment = calculatePaymentDetails(item);
                          return (<tr key={key}>
                            <td>{key + 1}.</td>
                            <td>
                              <div className="admin-table-bx">
                                <div className="admin-table-sub-bx">
                                  <img src={item?.patientId?.patientId?.profileImage ?
                                    `${base_url}/${item?.patientId?.patientId?.profileImage}` : "/admin-tb-logo.png"} alt=""
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/profile.png";
                                    }} />
                                  <div className="admin-table-sub-details doctor-title">
                                    <h6>{item?.patientId?.name}</h6>
                                    <p>{item?.patientId?.nh12}</p>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="admin-table-bx">
                                <ul className="ad-info-list">
                                  <li className="ad-info-item"> Room Number :<span className="add-info-title">{item?.bedId?.roomId?.roomName}</span></li>
                                  <li className="ad-info-item"> <b>Floor :</b><span className="add-info-title"> {item?.bedId?.floorId?.floorName}</span></li>
                                  <li className="ad-info-item"> <b>Bed :</b><span className="add-info-title"> {item?.bedId?.bedName}</span></li>
                                  <li className="ad-info-item"> Daily Rate :<span className="add-info-title"> ₹ {item?.bedId?.pricePerDay}</span></li>
                                  <li className="ad-info-item"> Department :<span className="add-info-title"> {item?.departmentId?.departmentName}</span></li>
                                  {/* <li className="ad-info-item"> Day:<span className="add-info-title"> 5</span></li> */}
                                </ul>
                              </div>
                            </td>
                            <td>
                              <div className="admin-table-bx">
                                <ul className="ad-info-list">
                                  <li className="ad-info-item"> <b>Allotment Date :</b><span className="add-info-title"> {new Date(item?.allotmentDate)?.toLocaleDateString('en-GB',
                                    { day: "numeric", month: "long", year: "numeric" })}</span></li>
                                  <li className="ad-info-item"> <b>Expected Discharge Date :</b><span className="add-info-title"> {item?.expectedDischargeDate ?
                                    new Date(item?.expectedDischargeDate)?.toLocaleDateString('en-GB') : '-'}</span></li>
                                  <li className="ad-info-item"> <b>Actual Discharge :</b><span className="add-info-title not-discharge">
                                    {item?.status == 'Active' ? 'Not discharged yet' : new Date(item?.dischargeId?.createdAt)?.toLocaleDateString('en-GB',
                                      { day: "numeric", month: "long", year: "numeric" })}</span></li>

                                </ul>
                              </div>
                            </td>


                            <td>{item?.status == 'Active' ? <span className="approved approved-active">Booked</span> :
                              <span className="approved approved-active discharge">Discharged</span>
                            }</td>
                            <td>


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
                                  aria-labelledby="acticonMenu1"
                                >
                                  <li className="prescription-item">
                                    <NavLink to={`/allotment-details/${item?._id}`} className="prescription-nav" >
                                      View Details
                                    </NavLink>
                                  </li>
                                  <li className="prescription-item">
                                    <NavLink to={`/edit-allotment/${item?._id}`} className="prescription-nav">
                                      Edit Allotment
                                    </NavLink>
                                  </li>
                                  <li className="prescription-item">
                                    <a className="prescription-nav" onClick={() => setSelected(item)} href="#" data-bs-toggle="modal" data-bs-target="#add-Payment">
                                      Add Payment
                                    </a>
                                  </li>

                                  <li className="prescription-item">
                                    <a className=" prescription-nav" onClick={() => setSelected(item)} href="#" data-bs-toggle="modal" data-bs-target="#discharge-Patient" >

                                      Discharge Patient
                                    </a>
                                  </li>

                                  <li className="prescription-item">
                                    <button onClick={() => {
                                      setSelected(item)
                                      setPdfLoading(true)
                                    }} className=" prescription-nav" disabled={pdfLoading}>

                                      Print Details
                                    </button>
                                  </li>
                                </ul>
                              </div>

                            </td>
                          </tr>)
                        }) : 'No allotments'}


                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-12">
              <div className="department-newest-card mb-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h5 className="fw-700 fz-20 mb-0 text-white"><FontAwesomeIcon icon={faBuilding} /> Departments</h5>
                  </div>
                  <div>
                    <NavLink to="/department" className="papperclip-btn fw-500">View All</NavLink>
                  </div>
                </div>
                <div>
                  <ul className="department-newest-list">
                    {departments?.length > 0 ? departments?.map((item, key) => (
                      <li className="department-newest-item" key={key}>
                        {item?.departmentName} <span className="newest-title">{item?.doctorCount}</span>
                      </li>
                    )) :
                      <span className="text-white">No department found</span>}
                  </ul>
                </div>
              </div>
              <div className="appointment-request-list">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h5 className="fw-700 fz-20 mb-0"><FontAwesomeIcon icon={faCalendar} /> Appointment Request</h5>
                  </div>
                  <div>
                    <NavLink to="/appointment-request" className="papperclip-btn fw-500">View All</NavLink>
                  </div>
                </div>

                {appointmentRequest?.length > 0 ?
                  appointmentRequest?.map((item, key) =>
                    <div className="request-upcoming-card mb-3" key={key}>
                      <h5>Patient Details</h5>
                      <div className="right-table-bx">
                        <div>
                          <div className="admin-table-sub-bx">
                            <img src={item?.patientId?.patientId?.profileImage ?
                              `${base_url}/${item?.patientId?.patientId?.profileImage}` : "/profile.png"} alt=""
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/profile.png";
                              }} />
                            <div className="admin-table-sub-details ">
                              <h6>{item?.patientId?.name}</h6>
                              <p>{item?.patientId?.nh12}</p>
                            </div>
                          </div>
                          <div className="admin-table-bx mt-lg-3">
                            <ul className="ad-info-list">
                              <li className="ad-info-item py-0"> Doctor :<span className="add-info-title"> {item?.doctorId?.name}</span></li>
                              <li className="ad-info-item py-0"> Date : <span className="add-info-title">{formatDateTime(item?.date)}</span></li>
                            </ul>
                          </div>
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <button className="nw-filtr-thm-btn"
                            onClick={() => appointmentAction(item, 'approved')}>Accept</button>
                          <button className="nw-danger-thm-btn"
                            onClick={() => appointmentAction(item, 'rejected')}>Reject</button>
                        </div>
                      </div>
                    </div>) :
                  <span className="text-black">No appointment request found</span>}
              </div>
            </div>
          </div>
          <div className="text-end mt-3">
            <Link to={-1} className="nw-thm-btn outline" >
              Go Back
            </Link>
          </div>

        </div>}
      {/* <!-- Payment Add Popup Start --> */}
      {/* <!--  data-bs-toggle="modal" data-bs-target="#add-Payment" --> */}
      <AllotmentPayment allotmentId={selected?._id} patientId={selected?.patientId?._id} />
      {/* <!-- Payment Add Popup End --> */}
      <div className="d-none" >
        <BedInvoice allotmentId={selected?._id} pdfLoading={pdfLoading} endLoading={() => setPdfLoading(false)} />
      </div>
      {/* <!-- Discharge Patient Popup Start --> */}
      {/* <!--  data-bs-toggle="modal" data-bs-target="#discharge-Patient" --> */}
      <DischargePatient allotmentId={selected?._id} fetchData={() => fetchAllotments()} />

      {/* <!-- Discharge Patient Popup End --> */}
    </>
  )
}

export default Dashboard