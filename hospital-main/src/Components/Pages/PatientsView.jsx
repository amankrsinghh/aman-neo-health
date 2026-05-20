import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCheck, faChevronDown, faChevronRight, faCircleXmark, faDownload, faDroplet, faEnvelope, faEye, faFilePdf, faLocationDot, faPerson, faPhone, faPrint, faSearch } from "@fortawesome/free-solid-svg-icons";
import { TbGridDots } from "react-icons/tb";
import { BsCapsule } from "react-icons/bs";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { deleteApiData, getApiData, getSecureApiData, securePostData, updateApiData } from "../../Service/api";
import { toast } from "react-toastify";
import { calculateAge, formatDateTime } from "../../Service/globalFunction";
import base_url from "../../baseUrl";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import ReportDownload from "./ReportDownload";
import Loader from "../Common/Loader";
import MedicalPrescription from "../../All Template file/Medical Prescription";
import DailyIPDNotes from "./DailyIPDNotes";
import AddAllotmentTest from "./AddAllotmentTest";
import AllotmentPayment from "./AllotmentPayment";
import DepartmentTransfer from "./DepartmentTransfer";
import LabReportPdf from "../../All Template file/Lab report file/Lab report";
function PatientsView() {
  const navigate = useNavigate()
  const params = useParams()
  const [isBedAvailable, setIsBedAvailable] = useState()
  const user = JSON.parse(localStorage.getItem('user'))
  const userId = user?.id
  const [loading, setLoading] = useState(false)
  const [appointmentData, setAppointmentData] = useState()
  const [doctorAddress, setDoctorAddress] = useState()
  const [pastPresData, setPastPresData] = useState()
  const [pastAppointments, setPastAppointments] = useState([])
  const [medicalHistory, setMedicalHisotry] = useState()
  const [prescription, setPrescription] = useState([])
  const [patientData, setPatientData] = useState()
  const [demographic, setDemographic] = useState()
  const [labOptions, setLabOptions] = useState()
  const [testOptions, setTestOptions] = useState([])
  const [selectedLab, setSelectedLab] = useState()
  const [patientUser, setPatientUser] = useState()
  const [labReports, setLabReports] = useState([])
  const [selectedTest, setSelectedTest] = useState([])
  const [showDownload, setShowDownload] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [customId, setCustomId] = useState()
  const [labAppointments, setLabAppointments] = useState([])
  const [allotmentData, setAllotmentData] = useState([])
  const [selectedType, setSelectedType] = useState('')
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState()
  const [activePres, setActivePres] = useState()
  const [pdfLoading, setPdfLoading] = useState(null)
  const [labPdfLoading, setLabPdfLoading] = useState(null)
  const [selectedAllotment, setSelectedAllotment] = useState()
  const [notesData, setNotesData] = useState({ allotmentId: null })
  const [openDailyNotes, setOpenDailyNotes] = useState(false);
  const [deptTransfer, setDepartmentTransfer] = useState({ _id: null, departmentId: null, allotmentId: null })
  const [opdTime, setOpdTime] = useState()
  const [availableDoctor, setAvailableDoctor] = useState()
  const [selectedDoctor, setSelectedDoctor] = useState()
  const [opdLoading, setOpdLoading] = useState(false)
  const [prescriptionsList, setPrescriptionsList] = useState([])
  const [cDocAp, setCDocAp] = useState(1)
  const [tDocAp, setTDocAp] = useState()
  const [cLabAp, setCLabAp] = useState(1)
  const [tLabAp, setTLabAp] = useState()
  const [cPresAp, setCPresAp] = useState(1)
  const [tPresAp, setTPresAp] = useState()
  const [cLabReport, setCLabReport] = useState(1)
  const [tLabReport, setTLabReport] = useState()
  const [cAllotment, setCAllotment] = useState(1)
  const [tAllotment, setTAllotment] = useState()

  async function fetchAppointmentData() {
    setLoading(true)
    try {
      const result = await getSecureApiData(`doctor/appointment/${params.id}`)
      if (result.success) {
        setAppointmentData(result.data)
        setDoctorAddress(result.doctorAddress)
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }
  const fetchDepartments = async () => {
    try {

      const res = await getSecureApiData(`api/department/list?type=${selectedType}`);
      if (res.success) {
        setDepartments(res.data);
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchAvailableDoctor = async () => {
    if (!opdTime) {
      return toast.error("Please select time")
    }
    setOpdLoading(true)
    try {

      const res = await getSecureApiData(`api/hospital-doctor/available/${selectedDepartment}/${opdTime}`);
      if (res.success) {
        setAvailableDoctor(res.doctors);
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setOpdLoading(false)
    }
  };
  const bedAvailable = async () => {
    try {
      const res = await getSecureApiData(`api/bed/bed/available`);
      if (res.success) {
        setIsBedAvailable(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  useEffect(() => {
    bedAvailable()
  }, [])
  useEffect(() => {
    fetchDepartments()
  }, [selectedType])
  async function fetchAllotment() {
    // setLoading(true)
    try {
      const result = await getSecureApiData(`api/hospital/patient-allotment/${params.id}/${userId}?page=${cAllotment}&limit=10`)
      if (result.success) {
        setAllotmentData(result.allotments)
        setTAllotment(result.pagination?.totalPages)
      }
    } catch (error) {

    } finally {
      // setLoading(false)
    }
  }
  useEffect(() => {
    fetchAllotment()
  }, [params, cAllotment])
  async function fetchPrescriptions() {
    // setLoading(true)
    try {
      const result = await getSecureApiData(`api/hospital/patient-prescriptions/${params.id}/${userId}?page=${cPresAp}&limit=10`)
      if (result.success) {
        setPrescriptionsList(result.prescriptions)
        setTPresAp(result.pagination?.totalPages)
      }
    } catch (error) {

    } finally {
      // setLoading(false)
    }
  }
  useEffect(() => {
    fetchPrescriptions()
  }, [cPresAp])
  async function fetchLabs() {
    const result = await getApiData(`lab`)
    if (result.success) {
      const options = result.data.map((lab) => ({
        value: lab._id,
        label: lab.name
      }));
      setLabOptions(options)
    }
  }
  async function fetchLabData() {
    setLoading(true)
    try {
      const result = await getSecureApiData(`lab/test/${selectedLab}?limit=10000`)
      if (result.success) {
        const options = result.data.map((lab) => ({
          value: lab._id,
          label: lab.shortName
        }));
        setTestOptions(options)
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchLabs()
  }, [])
  useEffect(() => {
    if (selectedLab) {

      fetchLabData()
    }
  }, [selectedLab])
  useEffect(() => {
    fetchPatientProfile()
  }, [params])
  async function fetchPatientProfile() {
    if (!params.id) {
      return
    }
    setLoading(true)
    try {
      const result = await getSecureApiData(`patient/profile-detail/${params.id}`)
      if (result.success) {
        setDemographic(result?.demographic)
        setMedicalHisotry(result.medicalHistory)
        setPrescription(result?.prescription?.prescriptions)
        setPatientData(result?.user)
        setPatientUser(result?.patientUser)
        setCustomId(result?.customId)
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }
  async function fetchPastAppointments() {
    if (!userId) {
      return
    }
    // setLoading(true)
    try {
      const result = await getSecureApiData(`appointment/hospital/past-appointments/${userId}/${params.id}?page=${cDocAp}&limit=5`)
      if (result.success) {
        setPastAppointments(result?.data)
        setTDocAp(result.totalPage)
      }
    } catch (error) {

    } finally {
      // setLoading(false)
    }
  }
  async function fetchPastLabAppointments() {
    if (!userId) {
      return
    }
    // setLoading(true)
    try {
      const res = await getSecureApiData(`appointment/lab/past-appointments/${userId}/${params.id}?page=${cLabAp}&limit=10`)
      if (res.success) {
        setLabAppointments(res?.data)
        setTLabAp(res.totalPage)
      }
    } catch (error) {

    } finally {
      // setLoading(false)
    }
  }
  async function fetchLabReports() {
    if (!params.id || !userId) {
      return
    }
    // setLoading(true)
    try {
      const result = await getSecureApiData(`api/hospital/patient-lab-report/${userId}/${params.id}?page=${cLabReport}&limit=10`)

      if (result.success) {
        setLabReports(result?.data)
        setTLabReport(result.pagination?.totalPages)
      }
    } catch (error) {

    } finally {
      // setLoading(false)
    }
  }
  useEffect(() => {
    fetchPastAppointments()
  }, [userId, cDocAp])
  useEffect(() => {
    fetchPastLabAppointments()
  }, [userId, cLabAp])
  useEffect(() => {
    fetchPastAppointments()
  }, [userId, cDocAp])
  useEffect(() => {
    fetchLabReports()
  }, [userId, cLabReport])

  const startChatWithUser = async (user) => {
    // create or get conversation
    sessionStorage.setItem('chatUser', JSON.stringify(user))
    navigate('/chat')
  };
  const appointmentAction = async (status) => {
    const data = { doctorId: userId, appointmentId: params?.id, status }
    setLoading(true)
    try {
      const response = await updateApiData(`appointment/hospital/doctor-action`, data);
      if (response.success) {
        // setCurrentPage(response.pagination.page)
        // setTotalPage(response.pagination.totalPages)
        fetchAppointmentData()
      } else {
        toast.error(response.message)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");;
    } finally {
      setLoading(false)
    }
  }
  const prescriptionAction = async (item, status) => {
    const data = { prescriptionId: item?.prescriptionId?._id, status: status ? 'Active' : 'Inactive' }
    setLoading(true)
    try {
      const response = await securePostData(`appointment/prescription-action`, data);
      if (response.success) {
        // setCurrentPage(response.pagination.page)
        // setTotalPage(response.pagination.totalPages)
        fetchAppointmentData()
      } else {
        toast.error(response.message)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");;
    } finally {
      setLoading(false)
    }
  }
  const deletePrescription = async (id) => {
    setLoading(true)
    try {
      const response = await deleteApiData(`appointment/prescription/${id}`);
      if (response.success) {
        toast.success("Prescription Deleted")
        fetchAppointmentData()
      } else {
        toast.error(response.message)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");;
    } finally {
      setLoading(false)
    }
  }
  const handleTestSubmit = async (e) => {
    e.preventDefault()
    const data = {
      doctorId: appointmentData?.doctorId?._id, patientId: appointmentData?.patientId?._id, appointmentId: params.id,
      labTest: { lab: selectedLab, labTests: selectedTest }
    }
    try {
      const result = await updateApiData('appointment/doctor', data)
      if (result.success) {
        toast.success("Test added to the prescriptions")
        const modalEl = document.getElementById("add-Lab");
        const modalInstance = Modal.getInstance(modalEl);

        if (modalInstance) {
          modalInstance.hide();
        }
      }
    } catch (error) {

    }
  }
  const admitPatient = async (e) => {
    e.preventDefault()
    const data = { patientId: params.id, departmentId: selectedDepartment }
    try {
      const res = await securePostData('api/patients/admit', data)
      if (res.success) {
        document?.getElementById("closeAdmit")?.click()
        toast.success(`Patient added to ${selectedType}`)
        if (selectedType == "OPD") {
          navigate(`/patient-${selectedType?.toLocaleLowerCase()}`)
        } else {
          navigate(`/bed-management?patientId=${params.id}`)
        }
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  const admitOPDPatient = async (e) => {
    e.preventDefault()
    setOpdLoading(true)
    const today = new Date().toISOString().split("T")[0]  // "2026-05-07"
    const date = opdTime
      ? new Date(`${today}T${opdTime}`)
      : new Date()
    const data = {
      patientId: params.id, hospitalId: userId, status: "approved",
      departmentId: selectedDepartment, doctorId: selectedDoctor, date
    }
    try {
      const res = await securePostData('appointment/hospital/doctor', data)
      if (res.success) {
        document?.getElementById("closeOPD")?.click()
        toast.success(`Patient added to ${selectedType}`)
        navigate(`/patient-opd-data`)

      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setOpdLoading(false)
    }
  }
  const prescriptionRef = useRef()
  const handleDownload = async () => {
    setActivePres(pastPresData)
    setPdfLoading(true)
  };

  // const handleReportDownload = (appointmentId, testId, id) => {
  //   setPdfLoading(id)
  //   setSelectedReport({ appointmentId, testId });
  //   setShowDownload(true);
  // };
  useEffect(() => {
    if (pastPresData) {
      const modalEl = document.getElementById("prescription-Modal");
      if (modalEl) {
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
      }
    }
  }, [pastPresData]);
  const closeModal = () => {
    const modalEl = document.getElementById("bed-Option");
    const modal = window.bootstrap?.Modal.getInstance(modalEl);

    if (modal) {
      modal.hide();
    }
  };
  const handleButtonClick = (path) => {
    const modalEl = document.getElementById("bed-Option");
    const modal = window.bootstrap?.Modal.getInstance(modalEl);

    if (modal) {
      modal.hide();
    }
    navigate(path)
  }
  return (
    <>
      {loading ? <Loader />
        : <div className="main-content flex-grow-1 p-3 overflow-auto">
          <div className="row mb-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <h3 className="innr-title mb-2">View </h3>
                <div className="d-flex gap-5 align-items-center">
                  <div className="admin-breadcrumb">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb custom-breadcrumb mb-0">
                        <li className="breadcrumb-item">
                          <NavLink to="/dashboard" className="breadcrumb-link">
                            Dashboard
                          </NavLink>
                        </li>

                        <li className="breadcrumb-item">
                          <NavLink to="/patient" className="breadcrumb-link">
                            Patients
                          </NavLink>
                        </li>

                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          View
                        </li>
                      </ol>
                    </nav>
                  </div>
                  {allotmentData?.length > 0 &&
                    <div className="d-flex gap-2 align-items-center">
                      <h6 className="mb-0 text-black"><span style={{ color: "#052F59", fontWeight: "600" }}>Bed-: </span>{allotmentData[0]?.bedId?.bedName}</h6>
                      <h6 className="mb-0 text-black"><span style={{ color: "#052F59", fontWeight: "600" }}>Department-:</span> {allotmentData[0]?.departmentId?.departmentName}</h6>
                      <span className={`approved rounded-5 py-1  ${allotmentData[0]?.status == "Discharged" && "discharge"}`}>  {allotmentData[0]?.status}</span>
                    </div>}
                </div>
              </div>
              <div className="d-flex gap-2">
                {allotmentData[0]?.status !== "Active" && <Link className="nw-thm-btn" to={isBedAvailable ? `/bed-management?patientId=${params.id}` : "#"}>Bed Allotment</Link>}
                <button className="nw-thm-btn" data-bs-toggle="modal" disabled={!isBedAvailable} data-bs-target="#admit-Patient" onClick={() => setSelectedType('IPD')}>IPD</button>
                <button className="nw-thm-btn" data-bs-toggle="modal" data-bs-target="#opd-Patient" onClick={() => setSelectedType('OPD')}>OPD</button>
                <button className="nw-danger-thm-btn" data-bs-toggle="modal" data-bs-target="#admit-Patient" onClick={() => setSelectedType('EMERGENCY')}>Emergency</button>
              </div>
            </div>
          </div>

          <div className="view-employee-bx patient-view-bx">
            <div className="row">
              <div className="col-lg-3 col-md-12 col-sm-12 mb-3">
                <div className="view-employee-bx patients-personal-info-card">
                  <div>
                    <div className="view-avatr-bio-bx text-center">
                      <img src={patientData?.profileImage ?
                        `${base_url}/${patientData?.profileImage}` : "/admin-tb-logo.png"} alt="" />
                      <h4>{patientData?.name}</h4>
                      <p><span className="vw-id">ID:</span> {patientUser?.nh12}</p>
                      <h6 className="vw-activ">Active</h6>

                    </div>

                    <div>
                      <ul className="vw-info-list">
                        <li className="vw-info-item">
                          <span className="vw-info-icon"><FontAwesomeIcon icon={faPerson} /></span>
                          <div>
                            <p className="vw-info-title">Age</p>
                            <p className="vw-info-value">{calculateAge(demographic?.dob)} Year</p>
                          </div>
                        </li>

                        <li className="vw-info-item">
                          <span className="vw-info-icon"><FontAwesomeIcon icon={faCalendar} /></span>
                          <div>
                            <p className="vw-info-title">Gender </p>
                            <p className="vw-info-value">{patientData?.gender}</p>
                          </div>
                        </li>

                        <li className="vw-info-item">
                          <span className="vw-info-icon"><FontAwesomeIcon icon={faDroplet} /></span>
                          <div>
                            <p className="vw-info-title">Blood  Group </p>
                            <p className="vw-info-value">{demographic?.bloodGroup}</p>
                          </div>
                        </li>

                        <li className="vw-info-item">
                          <span className="vw-info-icon"><FontAwesomeIcon icon={faEnvelope} /></span>
                          <div>
                            <p className="vw-info-title">Email </p>
                            <p className="vw-info-value">{patientData?.email}</p>
                          </div>
                        </li>

                        <li className="vw-info-item">
                          <span className="vw-info-icon"><FontAwesomeIcon icon={faPhone} /></span>
                          <div>
                            <p className="vw-info-title">Phone </p>
                            <p className="vw-info-value">{patientData?.contactNumber}</p>
                          </div>
                        </li>

                        <li className="vw-info-item">
                          <span className="vw-info-icon"><FontAwesomeIcon icon={faPhone} /></span>
                          <div>
                            <p className="vw-info-title">Emergency Contact Name </p>
                            <p className="vw-info-value"><span className="fw-700">({demographic?.contact?.emergencyContactName}) </span> {demographic?.contact?.emergencyContactNumber}</p>
                          </div>
                        </li>

                        <li className="vw-info-item">
                          <span className="vw-info-icon"><FontAwesomeIcon icon={faLocationDot} /></span>
                          <div>
                            <p className="vw-info-title">Address</p>
                            <p className="vw-info-value">{demographic?.address}</p>
                          </div>
                        </li>

                      </ul>

                    </div>

                  </div>
                </div>
              </div>

              <div className="col-lg-9 col-md-12 col-sm-12">
                <div className="view-employee-bx">
                  <div className="employee-tabs">
                    <ul className="nav nav-tabs gap-3 ps-2" id="myTab" role="tablist">
                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link active"
                          id="appointment-tab"
                          data-bs-toggle="tab"
                          href="#appointment"
                          role="tab"
                        >
                          Doctor Appointments
                        </a>
                      </li>
                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link"
                          id="lab-appointment-tab"
                          data-bs-toggle="tab"
                          href="#lab-appointment"
                          role="tab"
                        >
                          Lab Appointments
                        </a>
                      </li>

                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link"
                          id="home-tab"
                          data-bs-toggle="tab"
                          href="#home"
                          role="tab"
                        >
                          Prescriptions
                        </a>
                      </li>

                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link"
                          id="lab-tab"
                          data-bs-toggle="tab"
                          href="#lab"
                          role="tab"
                        >
                          Lab Test
                        </a>
                      </li>


                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link"
                          id="contact-tab"
                          data-bs-toggle="tab"
                          href="#contact"
                          role="tab"
                        >
                          Allotment
                        </a>
                      </li>

                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link"
                          id="personal-tab"
                          data-bs-toggle="tab"
                          href="#personal"
                          role="tab"
                        >
                          Other Personal Details
                        </a>
                      </li>

                    </ul>
                  </div>
                  <div className="">
                    <div className="patient-bio-tab px-0">
                      <div className="tab-content" id="myTabContent">

                        <div className="tab-pane fade show active"
                          id="appointment"
                          role="tabpanel">
                          <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                              <div className="table-section">
                                <div className="table table-responsive mb-0">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>#</th>
                                        <th>Appointment  Id</th>
                                        <th>Doctor</th>
                                        <th>Appointment  Date</th>

                                        <th>Status</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>

                                      {pastAppointments?.length > 0 &&
                                        pastAppointments?.map((item, key) =>
                                          <tr key={key}>
                                            <td>{key + 1}.</td>
                                            <td> #{item?.customId}</td>
                                            <td>
                                              <div className="admin-table-bx">
                                                <div className="admin-table-sub-bx">
                                                  <img src={item?.doctorId?.doctorId?.profileImage ?
                                                    `${base_url}/${item?.doctorId?.doctorId?.profileImage}` : "/doctor-avatr.png"} alt="" />
                                                  <div className="admin-table-sub-details doctor-title">
                                                    <h6>{item?.doctorId?.name} </h6>
                                                    <p>{item?.doctorId?.nh12}</p>
                                                  </div>
                                                </div>
                                              </div>
                                            </td>

                                            <td>
                                              {formatDateTime(item?.date)}
                                            </td>

                                            {/* <td >
                                              {item?.status == 'completed' ? <span className="approved approved-active ">Completed </span>
                                              : <span className="approved approved-active leaved ">{item?.status} </span>}
                                              </td> */}

                                            <td>
                                              {item?.status === 'completed' ? (
                                                <span className="approved approved-active">Completed</span>
                                              ) : item?.status === 'rejected' ? (
                                                <span className="approved approved-active inactive">Rejected</span>
                                              ) : (
                                                <span className="approved approved-active leaved">
                                                  {item?.status}
                                                </span>
                                              )}
                                            </td>

                                            <td>
                                              <div class="dropdown">
                                                <a
                                                  href="javascript:void(0)"
                                                  class="grid-dots-btn"
                                                  id="acticonMenu1"
                                                  data-bs-toggle="dropdown"
                                                  aria-expanded="false"
                                                >
                                                  <TbGridDots />
                                                </a>
                                                <ul
                                                  class="dropdown-menu dropdown-menu-end  admin-dropdown-card"
                                                  aria-labelledby="acticonMenu1"
                                                >
                                                  <li className="prescription-item">
                                                    <Link class="prescription-nav" to={`/doctor-appointment-details/${item?._id}`}>
                                                      View  Appointment
                                                    </Link>
                                                  </li>
                                                  {/* <li className="prescription-item">
                                                  <a class="prescription-nav" href="#" >
                                                    Edit
                                                  </a>
                                                </li>
                                                <li className="prescription-item">
                                                  <a class="prescription-nav" href="#" >
                                                    Delete
                                                  </a>
                                                </li> */}

                                                </ul>
                                              </div>

                                            </td>
                                          </tr>)}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                            {tDocAp > 1 && <div className="d-flex my-3 justify-content-between">
                              <button onClick={() => setCDocAp(prev => prev - 1)} disabled={cDocAp == 1} className="nw-thm-btn outline">Prev</button>
                              <button onClick={() => setCDocAp(prev => prev + 1)} disabled={cDocAp == tDocAp} className="nw-thm-btn">Next</button>
                            </div>}
                          </div>
                        </div>
                        <div className="tab-pane fade"
                          id="lab-appointment"
                          role="tabpanel">
                          <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                              <div className="table-section">
                                <div className="table table-responsive mb-0">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>#</th>
                                        <th>Appointment  Id</th>
                                        <th>Test</th>
                                        <th>Appointment  Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>

                                      {labAppointments?.length > 0 &&
                                        labAppointments?.map((item, key) =>
                                          <tr key={key}>
                                            <td>{key + 1}.</td>
                                            <td> #{item?.customId}</td>
                                            <td>
                                              <ul className="admin-test-list">
                                                {item?.tests?.map((test, key) =>
                                                  <li className="admin-test-item" key={key}>{test?.category?.name}</li>)}
                                                {/* <li className="admin-test-item">Haemoglobin</li> */}
                                              </ul>
                                            </td>

                                            <td>
                                              {formatDateTime(item?.date)}
                                            </td>

                                            <td >{item?.status == 'completed' ? <span className="approved approved-active ">Completed </span>
                                              : <span className="approved approved-active leaved">{item?.status} </span>}</td>
                                            <td>
                                              <div class="dropdown">
                                                <a
                                                  href="javascript:void(0)"
                                                  class="grid-dots-btn"
                                                  id="acticonMenu1"
                                                  data-bs-toggle="dropdown"
                                                  aria-expanded="false"
                                                >
                                                  <TbGridDots />
                                                </a>
                                                <ul
                                                  class="dropdown-menu dropdown-menu-end   admin-dropdown-card"
                                                  aria-labelledby="acticonMenu1"
                                                >
                                                  <li className="prescription-item">
                                                    <Link class="prescription-nav" to={`/appointment-details/${item?._id}`}>
                                                      View  Appointment
                                                    </Link>
                                                  </li>
                                                  {/* <li className="prescription-item">
                                                  <a class="prescription-nav" href="#" >
                                                    Edit
                                                  </a>
                                                </li>
                                                <li className="prescription-item">
                                                  <a class="prescription-nav" href="#" >
                                                    Delete
                                                  </a>
                                                </li> */}

                                                </ul>
                                              </div>

                                            </td>
                                          </tr>)}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                            {tLabAp > 1 && <div className="d-flex my-3 justify-content-between">
                              <button onClick={() => setCLabAp(prev => prev - 1)} disabled={cLabAp == 1} className="nw-thm-btn outline">Prev</button>
                              <button onClick={() => setCLabAp(prev => prev + 1)} disabled={cLabAp == tLabAp} className="nw-thm-btn">Next</button>
                            </div>}
                          </div>
                        </div>

                        <div
                          className="tab-pane fade"
                          id="home"
                          role="tabpanel"
                        >
                          <div className="row">
                            {/* <div className="text-end mb-3">
                              <NavLink to="/add-prescription" className="thm-btn rounded-3">Add Prescriptions</NavLink>
                            </div> */}



                            {prescriptionsList?.length > 0 &&
                              prescriptionsList?.map((item, key) =>
                                <div className="col-lg-12 mb-3" key={key}>
                                  <div className="new-pharmacy-detail-card">
                                    <div className="admin-table-bx d-flex align-items-center justify-content-between nw-pharmacy-details w-100 ">
                                      <div className="admin-table-sub-details d-flex align-items-center gap-2">
                                        <img src={item?.status == 'Inactive' ? "/in-active.png" :
                                          "/prescriptions.png"
                                        } alt="" />
                                        <div>
                                          <h6 className="fs-16 fw-600 text-black">Prescriptions</h6>
                                          <p className="fs-14 fw-500">{new Date(item?.createdAt)?.toLocaleDateString('en-GB')}</p>
                                        </div>
                                      </div>

                                      <div className="admin-table-bx">
                                        <div className="admin-table-sub-details d-flex align-items-center gap-2 doctor-title ">
                                          <img src={item?.doctorId?.doctorId?.profileImage ?
                                            `${base_url}/${item?.doctorId?.doctorId?.profileImage}` : "/doctor-avatr.png"} alt="" />
                                          <div>
                                            <h6>{item?.doctorId?.name} </h6>
                                            <p className="fs-14 fw-500">{item?.doctorId?.nh12}</p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="d-flex align-items-center gap-2 patient-mb-active">
                                        <div>
                                          {item?.status === 'Inactive' ? <span className="approved rounded-5 in-active py-1">Inactive</span> :
                                            <span className="approved rounded-5 py-1">Active</span>}
                                        </div>

                                        {/* <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faPrint} /></button> */}
                                        <button type="button" className="card-sw-btn" onClick={() => setPastPresData(item)} data-bs-toggle="modal" data-bs-target="#add-Prescription"><FontAwesomeIcon icon={faEye} /></button>
                                      </div>
                                    </div>
                                


                                    <div className="row mt-3">
                                      <div className="col-lg-4">
                                        <div className="patient-barcode-cards">
                                          <div className="barcd-content">
                                            <h4>{item?.customId}</h4>

                                            <Barcode value={item?.customId} width={2} displayValue={false}
                                              height={60} />

                                          </div>

                                          <div className="barcode-id-details">
                                            <div>
                                              <h6>Patient Id </h6>
                                              <p>{customId}</p>
                                            </div>
                                           {item?.appointmentId ?<div>
                                              <h6>Appointment ID </h6>
                                              <p>{item?.appointmentId?.customId}</p>
                                            </div>:<div>
                                              <h6>Allotment ID </h6>
                                              <p>{item?.allotmentId?.customId}</p>
                                            </div>}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>)}
                                {tPresAp > 1 && <div className="d-flex my-3 justify-content-between">
                              <button onClick={() => setCPresAp(prev => prev - 1)} disabled={cPresAp == 1} className="nw-thm-btn outline">Prev</button>
                              <button onClick={() => setCPresAp(prev => prev + 1)} disabled={cPresAp == tPresAp} className="nw-thm-btn">Next</button>
                            </div>}
                          </div>
                        </div>

                        <div className="tab-pane fade" id="lab" role="tabpanel">
                          <div className="row">

                            {labReports?.length > 0 &&
                              labReports?.map((item, key) =>
                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3" key={key}>
                                  <div className="qrcode-prescriptions-bx">
                                    <div className="admin-table-bx d-flex align-items-center justify-content-between qr-cd-headr w-100">
                                      <div className="admin-table-sub-details final-reprt d-flex align-items-center gap-2">
                                        <img src="/reprt-plus.png" alt="" className="rounded-0" />
                                        <div>
                                          <h6 className="fs-16 fw-600 text-black">Final Diagnostic Report</h6>
                                          <p className="fs-14 fw-500">{item?._id?.slice(-6)}</p>

                                        </div>
                                      </div>
                                    </div>
                                    <div className="barcode-active-bx">
                                      <div className="mb-2">
                                        <div className="admin-table-sub-details d-flex align-items-center justify-content-between doctor-title ">
                                          <div>
                                            <h6>{item?.labId?.name}</h6>
                                            <p className="fs-14 fw-500">{item?.labId?.nh12}</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="barcd-scannr barcde-scnnr-card">
                                        <div className="barcd-content">
                                          <h4 className="mb-1">{item?._id?.slice(-4)}</h4>

                                          <ul class="qrcode-list">
                                            <li class="qrcode-item">Test  <span class="qrcode-title">: {item?.subCatId?.subCategory}</span></li>
                                            <li class="qrcode-item">Draw  <span class="qrcode-title"> : {new Date(item?.createdAt)?.toLocaleString('en-GB')}</span> </li>
                                          </ul>
                                          {/* <img src="/barcode.png" alt="" /> */}
                                          <Barcode value={item?._id} width={1} displayValue={false}
                                            height={60} />
                                        </div>

                                        <div className="barcode-id-details">
                                          <div>
                                            <h6>Patient Id </h6>
                                            <p>{patientUser?.nh12}</p>
                                          </div>
                                          <div>
                                            <h6>Appointment ID </h6>
                                            <p>{item?.appointmentId?.customId}</p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="text-center mt-3">
                                        <button
                                          disabled={labPdfLoading == item?.appointmentId?._id}
                                          onClick={() => setLabPdfLoading(item?.appointmentId?._id)}
                                          // onClick={() =>
                                          //   handleReportDownload(item?.appointmentId?._id, item?.testId?._id, item?._id)
                                          // }
                                          className="pdf-download-tbn py-2"><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} />
                                          {labPdfLoading == item?.appointmentId?._id ? 'Downloading' : 'Download'}</button>

                                      </div>

                                    </div>

                                  </div>
                                </div>)}
                            {tLabReport > 1 && <div className="d-flex my-3 justify-content-between">
                              <button onClick={() => setCLabReport(prev => prev - 1)} disabled={cLabReport == 1} className="nw-thm-btn outline">Prev</button>
                              <button onClick={() => setCLabReport(prev => prev + 1)} disabled={cLabReport == tLabReport} className="nw-thm-btn">Next</button>
                            </div>}
                          </div>
                        </div>
                        <div className="tab-pane fade" id="contact" role="tabpanel">
                          <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                              <div className="table-section ">
                                <div className="table table-responsive mb-0">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>#</th>
                                        <th>Doctor</th>
                                        <th>Bed Information</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>

                                      {allotmentData?.length > 0 &&
                                        allotmentData?.map((item, key) =>
                                          <tr key={key}>
                                            <td>{key + 1}.</td>
                                            <td>
                                              <div className="admin-table-bx">
                                                <div className="admin-table-sub-bx">
                                                  {/* <img src="/admin-tb-logo.png" alt="" /> */}
                                                  <div className="admin-table-sub-details doctor-title">
                                                    <h6>{item?.primaryDoctorId?.name} </h6>
                                                    <p>{item?.primaryDoctorId?.nh12}</p>
                                                  </div>
                                                </div>
                                              </div>
                                            </td>
                                            <td>
                                              <div className="admin-table-bx">
                                                <ul className="ad-info-list">
                                                  <li className="ad-info-item"> Room Number :<span className="add-info-title"> {item?.bedId?.roomId?.roomName}</span></li>
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
                                                  <li className="ad-info-item"> <b>Allotment Date :</b>
                                                    <span className="add-info-title"> {new Date(item?.allotmentDate)?.toLocaleDateString('en-GB',
                                                      { day: "numeric", month: "long", year: "numeric" })}</span></li>
                                                  {item?.expectedDischargeDate &&
                                                    <li className="ad-info-item"> <b>Expected Discharge Date :</b>
                                                      <span className="add-info-title">  {new Date(item?.expectedDischargeDate)?.toLocaleDateString('en-GB',
                                                        { day: "numeric", month: "long", year: "numeric" })}</span></li>
                                                  }
                                                  <li className="ad-info-item"> <b>Actual Discharge :</b>
                                                    <span className="add-info-title not-discharge">
                                                      {item?.status == 'Active' ? 'Not discharged yet' : new Date(item?.dischargeId?.createdAt)?.toLocaleDateString('en-GB',
                                                        { day: "numeric", month: "long", year: "numeric" })}</span></li>
                                                </ul>
                                              </div>
                                            </td>
                                            <td ><span className={`approved approved-active ${item?.status == "Discharged" && "discharge"}`}>{item?.status}</span></td>
                                            <td>


                                              <div className="dropdown position-static">
                                                <a
                                                  href="javascript:void(0)"
                                                  className="grid-dots-btn"
                                                  id="acticonMenu1"
                                                  // data-bs-toggle="dropdown"
                                                  data-bs-toggle="modal"
                                                  onClick={() => setSelectedAllotment(item)}
                                                  data-bs-target="#bed-Option"
                                                // aria-expanded="false"
                                                >
                                                  <TbGridDots />
                                                </a>
                                                <ul
                                                  className="dropdown-menu dropdown-menu-end  admin-dropdown-card"
                                                  aria-labelledby="acticonMenu1"
                                                >
                                                  <li className="prescription-item">
                                                    <Link className="prescription-nav" to={`/allotment-details/${item?._id}`} >
                                                      View Details
                                                    </Link>
                                                  </li>



                                                </ul>
                                              </div>

                                            </td>
                                          </tr>)}




                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                            {tAllotment > 1 && <div className="d-flex my-3 justify-content-between">
                              <button onClick={() => setCAllotment(prev => prev - 1)} disabled={cAllotment == 1} className="nw-thm-btn outline">Prev</button>
                              <button onClick={() => setCAllotment(prev => prev + 1)} disabled={cAllotment == tAllotment} className="nw-thm-btn">Next</button>
                            </div>}
                          </div>
                        </div>

                        <div className="tab-pane fade" id="personal" role="tabpanel">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="">
                                <div className="ovrview-bx mb-3">
                                  <h4 className="new_title">Medical History</h4>
                                  {/* <p className="">Robert Davis is a board-certified cardiologist with over 8 years of experience in diagnosing and treating heart conditions. She specializes in preventive cardiology and heart failure management.</p> */}
                                </div>

                                <div className="medical-history-content">
                                  <div>
                                    <h4 className="fz-16 fw-700">Do you have any chronic conditions?</h4>
                                    <h5 className="hearth-disese">{medicalHistory?.chronicCondition}</h5>
                                  </div>

                                  <div className="mt-3">
                                    <h4 className="fz-16 fw-700">Are you currently on any medications?</h4>
                                    <h5 className="hearth-disese">{medicalHistory?.onMedication ? 'Yes' : 'No'}</h5>
                                  </div>

                                </div>

                                <div className="medical-history-content my-3">
                                  <div>
                                    <h4 className="fz-16 fw-700">Medication Details</h4>
                                    <p>{medicalHistory?.medicationDetail}</p>
                                  </div>

                                  <div className="mt-3">
                                    <h4 className="fz-16 fw-700">Allergies</h4>
                                    <p>{medicalHistory?.allergies}</p>
                                  </div>

                                </div>

                                <div className="ovrview-bx mb-3">
                                  <h4 className="new_title">Family Medical History</h4>
                                </div>
                                <div className="medical-history-content my-3">
                                  <div>
                                    <h4 className="fz-16 fw-700">Any family history of chronic disease?</h4>
                                    <h5 className="hearth-disese">{medicalHistory?.familyHistory?.chronicHistory}</h5>

                                  </div>

                                  <div className="mt-3">
                                    <h4 className="fz-16 fw-700">Chronic Diseases in Family</h4>
                                    <p> {medicalHistory?.familyHistory?.diseasesInFamily}</p>
                                  </div>

                                </div>

                                <div className="ovrview-bx mb-3">
                                  <h4 className="new_title">Prescriptions and Reports</h4>
                                </div>

                                <div className="row">
                                  {prescription?.length > 0 &&
                                    prescription?.map((item, key) =>
                                      <div className="col-lg-6 mb-3" key={key}>
                                        <div className="prescription-patients-card">
                                          <div className="prescription-patients-picture">
                                            <img src={item?.fileUrl ?
                                              `${base_url}/${item?.fileUrl}` : "/patient-card-one.png"} alt="" />
                                          </div>
                                          <div className="card-details-bx">
                                            <div className="card-info-title">
                                              <h3>{item?.name}</h3>
                                              {/* <p>8/21/2025</p> */}
                                            </div>

                                            <div className="">
                                              <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faEye} /></button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-end mt-3">
            <Link to={-1} className="nw-thm-btn outline" >
              Go Back
            </Link>
          </div>
          <div className="d-none">
            <LabReportPdf appointmentId={labPdfLoading} pdfLoading={labPdfLoading} endLoading={() => setPdfLoading(false)} />
          </div>

        </div>}

      {/* <!-- add-Department Alert Popup Start --> */}
      {/* <!--  data-bs-toggle="modal" data-bs-target="#add-Prescription" --> */}
      <div className="modal step-modal fade" id="add-Prescription" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content rounded-5 p-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="lg_title mb-0"> Prescription</h6>
              </div>
              <div>
                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </div>
            </div>
            <div className="modal-body" ref={prescriptionRef}>
              <div className="row ">
                <div className="col-lg-12">
                  <div className="view-report-card bg-transparent">
                    <div className="view-report-header">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <span className="active-status">{pastPresData?.status}</span>
                          <h5>{pastPresData?.customId}</h5>
                          <h6>Date: {new Date(pastPresData?.createdAt)?.toLocaleDateString('en-GB')}</h6>
                        </div>

                        <div>
                          <button className="no-print" onClick={handleDownload}><FontAwesomeIcon icon={faDownload} /></button>
                          {/* <button className="no-print"><FontAwesomeIcon icon={faPrint} /></button> */}
                        </div>
                      </div>

                    </div>

                    <div className="view-report-content">
                      <div className="sub-content-title">
                        <h4>RX.</h4>
                        <h3><BsCapsule style={{ color: "#00B4B5" }} /> Medications</h3>
                      </div>

                      {pastPresData?.medications?.map((item, key) =>
                        <div className="view-medications-bx mb-3" key={key}>
                          <h5>{key + 1}. {item?.name}</h5>
                          <ul className="viwe-medication-list">
                            <li className="viwe-medication-item">Refills: {item?.refills} </li>
                            <li className="viwe-medication-item">Frequency: {item?.frequency} </li>
                            <li className="viwe-medication-item">Duration: {item?.duration}</li>
                            <li className="viwe-medication-item">Instructions: {item?.instructions}</li>

                          </ul>
                        </div>)}



                      <div className="diagnosis-bx mb-3">
                        <h5>Diagnosis</h5>
                        <p>{pastPresData?.diagnosis}</p>
                      </div>

                      <div className="diagnosis-bx mb-3">
                        <h5>Notes</h5>
                        <p>{pastPresData?.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      <div className="modal step-modal fade" id="admit-Patient" data-bs-backdrop="static"
        data-bs-keyboard="false" tabIndex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content rounded-0">
            <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
              <div>
                <h6 className="lg_title mb-0">Add in {selectedType}</h6>
              </div>
              <div>
                <button type="button" className="" id="closeAdmit" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </div>
            </div>
            <div className="modal-body">
              <form onSubmit={admitPatient} className="row justify-content-center">
                <div className="col-lg-12">
                  <div className="custom-frm-bx">
                    <label htmlFor="">Select Department</label>
                    <div class="select-wrapper">
                      <select class="form-select custom-select" required onChange={(e) => setSelectedDepartment(e.target.value)}>
                        <option value="">Select</option>
                        {departments?.map((item, key) =>
                          <option value={item?._id} key={key} > {item?.departmentName}</option>)}

                      </select>
                    </div>

                  </div>
                </div>

                <div className="d-flex gap-3 justify-content-end">
                  <button className="nw-thm-btn outline" type='button' id='closeModal' data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                  <button className="nw-thm-btn w-auto" type='submit' aria-label="Close">Save </button>
                </div>


              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="modal step-modal fade" id="opd-Patient" data-bs-backdrop="static"
        data-bs-keyboard="false" tabIndex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content rounded-0">
            <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
              <div>
                <h6 className="lg_title mb-0">Add in OPD</h6>
              </div>
              <div>
                <button type="button" className="" id="closeOPD" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </div>
            </div>
            <div className="modal-body">
              <form onSubmit={admitOPDPatient} className="row justify-content-center">
                <div className="col-lg-12">
                  <div className="custom-frm-bx">
                    <label htmlFor="">Select Department</label>
                    <div class="select-wrapper">
                      <select class="form-select custom-select" required onChange={(e) => setSelectedDepartment(e.target.value)}>
                        <option value="">Select</option>
                        {departments?.map((item, key) =>
                          <option value={item?._id} key={key} > {item?.departmentName}</option>)}

                      </select>
                    </div>

                  </div>
                </div>
                {selectedDepartment &&
                  <div className="row align-items-center">
                    <div className="col-lg-10">
                      <div className="custom-frm-bx">
                        <label htmlFor="">Select Time</label>
                        <input type="time" name="" id="" value={opdTime} onChange={(e) => setOpdTime(e.target.value)} className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <button type="button" disabled={opdLoading} className="nw-thm-btn" onClick={() => fetchAvailableDoctor()}><FontAwesomeIcon icon={faSearch} /></button>
                    </div>
                  </div>}
                {availableDoctor?.length > 0 && <div className="col-lg-12">
                  <div className="custom-frm-bx">
                    <label htmlFor="">Select Doctor</label>
                    <div class="select-wrapper">
                      <select class="form-select custom-select" required onChange={(e) => setSelectedDoctor(e.target.value)}>
                        <option value="">Select</option>
                        {availableDoctor?.map((item, key) =>
                          <option value={item?._id} key={key} > {item?.name}</option>)}

                      </select>
                    </div>

                  </div>
                </div>}

                <div className="d-flex gap-3 justify-content-end">
                  <button className="nw-thm-btn outline" type='button' id='closeModal' data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                  {availableDoctor?.length !== 0 && <button className="nw-thm-btn w-auto" disabled={opdLoading} type='submit' aria-label="Close">{opdLoading ? 'Saving' : 'Save'} </button>}
                </div>


              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="d-none">
        <MedicalPrescription presId={activePres?._id}
          endLoading={() => setPdfLoading(false)}
          pdfLoading={pdfLoading} />
      </div>
      <div
        className="modal step-modal fade"
        id="bed-Option"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content rounded-4">
            <div className="modal-body pb-2 px-4">
              <div className="">
                <ul className="bed-management-list">
                  <li className="bed-list-item">
                    <button
                      type="button"
                      onClick={() => handleButtonClick(`/allotment-details/${selectedAllotment?._id}`)}
                      data-bs-dismiss="modal"
                      className="bed-nav-link"
                    >
                      View Details
                      <span className="nw-chevron-btn">

                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </button>
                  </li>

                  <li className="bed-list-item">
                    <a
                      href="#"
                      className="bed-nav-link"
                      data-bs-toggle="modal"
                      onClick={closeModal}
                      data-bs-target="#add-Payment"
                    >
                      Add Payment
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </a>
                  </li>
                  {!selectedAllotment?.dischargeId &&
                    <>
                      <li className="bed-list-item">
                        <button
                          type="button"
                          className="bed-nav-link"
                          onClick={() => handleButtonClick(`/edit-allotment/${selectedAllotment?._id}`)}
                          data-bs-dismiss="modal"
                        >
                          Edit Allotment
                          <span className="nw-chevron-btn">
                            <FontAwesomeIcon icon={faChevronRight} />
                          </span>
                        </button>
                      </li>
                      <li className="bed-list-item">
                        <button
                          type="button"
                          className="bed-nav-link"
                          onClick={() => handleButtonClick(`/allotment/prescription-data/${selectedAllotment?._id}`)}
                          data-bs-dismiss="modal"
                        >
                          Add Prescriptions
                          <span className="nw-chevron-btn">

                            <FontAwesomeIcon icon={faChevronRight} />
                          </span>
                        </button>

                      </li>
                      <li className="bed-list-item">
                        <a
                          href="#"
                          className="bed-nav-link"
                          data-bs-toggle="modal"
                          data-bs-target="#department-Transfer"
                          data-bs-dismiss="modal"
                          onClick={(e) => {
                            e.preventDefault()
                            setDepartmentTransfer({
                              _id: selectedAllotment?.bedId,
                              allotmentId: selectedAllotment?._id,
                              departmentId: selectedAllotment?.departmentId
                            })
                          }}
                        >
                          Department Transfer
                          <span className="nw-chevron-btn">
                            <FontAwesomeIcon icon={faChevronRight} />
                          </span>
                        </a>
                      </li>

                      <li className="bed-list-item">
                        <button
                          className="bed-nav-link"
                          data-bs-toggle="modal"
                          data-bs-target="#add-LabTest"
                          onClick={closeModal}
                        >
                          Add Lab Test
                          <span className="nw-chevron-btn">
                            <FontAwesomeIcon icon={faChevronRight} />
                          </span>
                        </button>
                      </li>
                      <li className="bed-list-item">
                        <a
                          href="#"
                          className="bed-nav-link"
                          data-bs-toggle="modal"
                          data-bs-dismiss="modal"
                          data-bs-target="#add-IPD-Notes"
                          onClick={() => {
                            setNotesData({ allotmentId: selectedAllotment?._id })
                            setOpenDailyNotes(true)
                          }}
                        >
                          Add Daily Notes
                          <span className="nw-chevron-btn">
                            <FontAwesomeIcon icon={faChevronRight} />
                          </span>
                        </a>
                      </li>
                      <li className="bed-list-item">
                        <button onClick={() => handleButtonClick(`/discharge/${selectedAllotment?._id}`)}
                          data-bs-dismiss="modal" className="bed-nav-link">
                          Discharge Patient
                          <span className="nw-chevron-btn">
                            <FontAwesomeIcon icon={faChevronRight} />
                          </span>
                        </button>
                      </li>
                    </>}
                  <li className="bed-list-item">
                    <button onClick={() => handleButtonClick(`/daily-ipd-history?allotment=${selectedAllotment?._id}`)}
                      data-bs-dismiss="modal"
                      className="bed-nav-link" >
                      Notes History
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DailyIPDNotes data={notesData} openTrigger={openDailyNotes} />
      <AddAllotmentTest allotmentId={selectedAllotment?._id} />
      <AllotmentPayment allotmentId={selectedAllotment?._id} getData={fetchAllotment} />
      <DepartmentTransfer data={deptTransfer} getData={fetchAllotment} />
    </>
  )
}

export default PatientsView