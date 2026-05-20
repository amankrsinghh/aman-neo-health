import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCheck, faChevronDown, faCircleXmark, faDownload, faDroplet, faEnvelope, faEye, faFilePdf, faLocationDot, faPerson, faPhone, faPrint } from "@fortawesome/free-solid-svg-icons";
import { TbGridDots } from "react-icons/tb";
import { BsCapsule } from "react-icons/bs";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "../../utils/axios";
import { toast } from "react-toastify";
import { calculateAge, formatDateTime } from "../../Services/globalFunction";
import { IMAGE_BASE_URL as base_url } from "../../utils/config";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import ReportDownload from "./ReportDownload";
import Loader from "../Common/Loader";
import { getSecureApiData } from "../../Services/api";
import Pagination from "../Common/Pagination";

function PatientsPersonalInfo() {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [appointmentData, setAppointmentData] = useState();
  const [doctorAddress, setDoctorAddress] = useState();
  const [pastPresData, setPastPresData] = useState();
  const [pastAppointments, setPastAppointments] = useState([]);
  const [medicalHistory, setMedicalHisotry] = useState();
  const [prescription, setPrescription] = useState([]);
  const [patientData, setPatientData] = useState();
  const [demographic, setDemographic] = useState();
  const [labOptions, setLabOptions] = useState();
  const [testOptions, setTestOptions] = useState([]);
  const [selectedLab, setSelectedLab] = useState();
  const [labReports, setLabReports] = useState([]);
  const [selectedTest, setSelectedTest] = useState([]);
  const [showDownload, setShowDownload] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [customId, setCustomId] = useState();
  const [labAppointments, setLabAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([])
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [allotments, setAllotments] = useState([]);
  const [testReports, setTestReports] = useState([])
  const [patientUser, setPatientUser] = useState()
  const [activeTab, setActiveTab] = useState()
  const [cDocAp, setCDocAp] = useState(1)
  const [tDocPage, setTDocPage] = useState()
  const [cardData, setCardData] = useState({ name: '', isReady: false })
  const [cLabAp, setCLabAp] = useState(1)
  const [tLabPage, setTLabPage] = useState()

  const [cPresAp, setCPresAp] = useState(1)
  const [tPresPage, setTPresPage] = useState()

  const [cReport, setCReport] = useState(1)
  const [tReportPage, setTReportPage] = useState()
  // ── Single admin API call — loads everything ──────────────────────────
  useEffect(() => {
    if (!params.id) return;
    loadPatientDetail();
  }, [params.id]);

  const loadPatientDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/patients/detail/${params.id}`);
      if (res.data.success) {
        setCardData({...cardData,name:res?.data?.patient?.name})
        setPatientData(res.data.patient);
        setDemographic(res.data.demographic);
        setMedicalHisotry(res.data.medicalHistory);
        setCustomId(res.data.customId);
        setPatientUser(res.data.user)
        if (res.data.prescription) {
          setPrescription(res.data.prescription.prescriptions || [res.data.prescription]);
        }
      }
    } catch (err) {
      toast.error("Failed to load patient details");
    } finally {
      setLoading(false);
    }
  };

  // Load doctor appointments for this patient
  useEffect(() => {
    if (params.id && activeTab == "doctorAp") {

      loadAppointments();
    };
  }, [params.id, activeTab, cDocAp]);

  const loadAppointments = async (page = cDocAp) => {
    try {
      const res = await getSecureApiData(`api/admin/patients/doctor-appointments/${params.id}?page=${page}&limit=5`);
      if (res.success) {
        setPastAppointments(res.data);
        setTDocPage(res.totalPages)
        // setAppointmentData(mine[0]);
      }
    } catch { }
  };
  const loadPrescriptions = async (page = cPresAp) => {
    try {
      const res = await getSecureApiData(`api/admin/patients/doctor-prescription/${params.id}?page=${page}&limit=10`);
      if (res.success) {
        setPrescriptions(res.data);
        setTPresPage(res.totalPages)
        // setAppointmentData(mine[0]);
      }
    } catch { }
  };
  const loadReports = async (page = cReport) => {
    try {
      const res = await getSecureApiData(`api/admin/patients/${params.id}/lab-reports?page=${page}&limit=2`);
      if (res.success) {
        setLabReports(res.data);
        setTReportPage(res.totalPages)
        // setAppointmentData(mine[0]);
      }
    } catch { }
  };

  // Load lab appointments
  useEffect(() => {
    if (params.id && activeTab == "labReport") {

      loadReports()
    };
  }, [params.id, cReport, activeTab]);
  useEffect(() => {
    if (params.id && activeTab == "labAp") {
      loadLabAppointments()
    }
  }, [params.id, cLabAp, activeTab])
  useEffect(() => {
    if (params.id && activeTab == "prescriptions") {
      loadPrescriptions()
    }
  }, [params.id, cPresAp, activeTab])

  const loadLabAppointments = async (page = cLabAp) => {
    try {
      const res = await getSecureApiData(`api/admin/patients/lab-appointments/${params.id}?page=${page}&limit=2`);
      if (res.success) {
        setLabAppointments(res.data);
        setTLabPage(res.totalPages)
        // setLabAppointment(mine[0]);
      }
    } catch { }
  };

  // Load allotments
  // useEffect(() => {
  //   if (!params.id) return;
  //   (async () => {
  //     try {
  //       const res = await api.get(`/api/admin/patients/${params.id}/allotments`);
  //       if (res.data.success) setAllotments(res.data.data || []);
  //     } catch { }
  //   })();
  // }, [params.id]);



  // handleReportDownload
  const handleReportDownload = async (appointmentId, testId, reportId) => {
    try {
      setPdfLoading(reportId);
      const res = await api.get(`/api/admin/patients/${params.id}/lab-reports`);
      toast.success("Report data loaded. Use browser print for PDF.");
    } catch { toast.error("Download failed"); }
    finally { setPdfLoading(null); }
  };

  // Stub functions (called by JSX but not critical for display)
  async function fetchAppointmentData() { await loadPatientDetail(); }
  async function fetchLabs() { }
  async function fetchLabData() { }
  async function fetchPastAppointments() { await loadAppointments(); }
  async function fetchLabReports() { }

  const startChatWithUser = (user) => {
    sessionStorage.setItem("chatUser", JSON.stringify(user));
    navigate("/chat");
  };

  const appointmentAction = async (status) => {
    try {
      if (!appointmentData?._id) return;
      await api.patch(`/api/admin/doctor/${appointmentData._id}/approve-reject`, { status });
      toast.success(`Appointment ${status}`);
      loadAppointments();
    } catch { toast.error("Action failed"); }
  };

  const addLabTest = async () => {
    toast.info("Lab test feature requires doctor portal");
  };

  const deletePrescription = async (id) => {
    toast.info("Prescription management via Doctor portal");
  };

  const updateAppointment = async (data) => {
    toast.info("Update via Doctor portal");
  };

  const userId = null; // Not needed for admin view
  const pdfRef = useRef(null);
  const prescriptionRef = useRef(null);

  // Download prescription as PDF
  const handleDownload = async () => {
    try {
      if (!prescriptionRef.current) return;
      const element = prescriptionRef.current;
      const opt = {
        margin: 0.5,
        filename: `prescription_${customId || "patient"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
      };
      if (window.html2pdf) {
        await window.html2pdf().set(opt).from(element).save();
      } else {
        // Fallback: print
        window.print();
      }
    } catch (err) {
      toast.error("Download failed");
    }
  };

  const downloadPdf = async (reportId) => {
    try {
      setPdfLoading(reportId);
      toast.info("Download initiated");
    } catch { } finally { setPdfLoading(null); }
  };
  const cardRef = useRef(null);
  const handleCardDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      const link = document.createElement("a");
      link.download = `NeoCard_${patientUser?.nh12}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) { console.error("Download failed", err); }
  };
  return (
    <>
      {loading ? <Loader />
        : <div className="main-content flex-grow-1 p-3 overflow-auto">
          <div className="row mb-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h3 className="innr-title mb-2">View </h3>
                <div className="admin-breadcrumb">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb custom-breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="#" className="breadcrumb-link">
                          Dashboard
                        </a>
                      </li>

                      <li className="breadcrumb-item">
                        <a href="#" className="breadcrumb-link">
                          Patients
                        </a>
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
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="view-employee-bx">
                <div className="employee-tabs">
                  <ul className="nav nav-tabs gap-3 ps-2" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link active"
                        id="personal-tab"
                        data-bs-toggle="tab"
                        onClick={() => setActiveTab()}
                        href="#personal"
                        role="tab"
                      >
                        Personal Info
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link"
                        id="appointment-tab"
                        data-bs-toggle="tab"
                        href="#appointment"
                        onClick={() => setActiveTab('doctorAp')}
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
                        onClick={() => setActiveTab('labAp')}
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
                        onClick={() => setActiveTab('prescriptions')}
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
                        onClick={() => setActiveTab('labReport')}
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
                        My NeoCard
                      </a>
                    </li>



                  </ul>
                </div>
                <div className="">
                  <div className="patient-bio-tab px-0">
                    <div className="tab-content" id="myTabContent">

                      <div className="tab-pane fade "
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
                                      <th>Patient</th>
                                      <th>Appointment  Date</th>
                                      <th>Doctor</th>

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
                                                <img src={patientData?.profileImage ?
                                                  `${base_url}/${patientData?.profileImage}` : "/admin-tb-logo.png"} alt=""
                                                  onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/admin-tb-logo.png";
                                                  }} />
                                                <div className="admin-table-sub-details doctor-title">
                                                  <h6>{patientUser?.name} </h6>
                                                  <p>{patientUser?.nh12}</p>
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
                                                <img src={item?.doctor?.profileImage ?
                                                  `${base_url}/${item?.doctor?.profileImage}` : "/doctor-avatr.png"} alt=""
                                                  onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/doctor-avatr.png";
                                                  }} />
                                                <div className="admin-table-sub-details doctor-title">
                                                  <h6>{item?.doctorId?.name} </h6>
                                                  <p>{item?.doctorId?.nh12}</p>
                                                </div>
                                              </div>
                                            </div>
                                          </td>


                                          <td >{item?.status == 'completed' ? <span className="approved approved-active ">Completed </span>
                                            : <span className="approved approved-active leaved text-capitalize">{item?.status} </span>}</td>
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
                                                class="dropdown-menu dropdown-menu-end  tble-action-menu admin-dropdown-card"
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
                            <Pagination page={cDocAp} totalPages={tDocPage} onPageChange={(p) => setCDocAp(p)} />

                          </div>
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
                                      <th>Patient</th>
                                      <th>Appointment  Details</th>
                                      <th>Laboratory</th>
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
                                            <div className="admin-table-bx">
                                              <div className="admin-table-sub-bx">
                                                <img src={patientData?.profileImage ?
                                                  `${base_url}/${patientData?.profileImage}` : "/admin-tb-logo.png"} alt=""
                                                  onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/admin-tb-logo.png";
                                                  }} />
                                                <div className="admin-table-sub-details doctor-title">
                                                  <h6>{patientUser?.name} </h6>
                                                  <p>{patientUser?.nh12}</p>
                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                          <td>
                                            <ul className="ad-info-list">
                                              <li className="ad-info-item"><span className="ad-info-title">Appointment Date : </span> {new Date(item?.date)?.toLocaleString('en-GB')}</li>
                                              <li className="ad-info-item"><span className="ad-info-title">Total Amount : </span>₹ {item?.fees}</li>
                                              <li className="ad-info-item patient-report-item"><span className="ad-info-title">Test: </span>{item?.testId?.map((test, key) => <> {test?.shortName}</>)}</li>
                                            </ul>
                                          </td>

                                          <td>
                                            <div className="admin-table-bx">
                                              <div className="admin-table-sub-bx ">
                                                <div className="laboratory-pic">
                                                  <img src={item?.lab?.logo ?
                                                    `${base_url}/${item?.lab?.logo}` : "/profile-tab-avatar.png"} alt=""
                                                    onError={(e) => {
                                                      e.target.onerror = null;
                                                      e.target.src = "/profile-tab-avatar.png";
                                                    }} />
                                                </div>
                                                <div className="admin-table-sub-details ">
                                                  <h6>{item?.labId?.name}</h6>
                                                  <p>{item?.labId?.nh12}</p>
                                                </div>
                                              </div>
                                            </div>
                                          </td>

                                          <td >{item?.status == 'completed' ? <span className="approved approved-active ">Completed </span>
                                            : <span className="approved approved-active leaved text-capitalize">{item?.status} </span>}</td>
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
                                                class="dropdown-menu dropdown-menu-end  tble-action-menu admin-dropdown-card"
                                                aria-labelledby="acticonMenu1"
                                              >
                                                <li className="prescription-item">
                                                  <Link class="prescription-nav" to={`/lab-appointment-details/${item?._id}`}>
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
                          <Pagination page={cLabAp} totalPages={tLabPage} onPageChange={(p) => setCLabAp(p)} />
                        </div>
                      </div>

                      <div
                        className="tab-pane fade"
                        id="home"
                        role="tabpanel"
                      >
                        <div className="row">

                          {prescriptions?.length > 0 &&
                            prescriptions?.map((item, key) =>
                              <div className="col-lg-4 col-md-6 col-sm-12 mb-3">

                                <div className="qrcode-prescriptions-bx">
                                  <div className="admin-table-bx d-flex flex-row align-items-center justify-content-between qr-cd-headr">
                                    <div className="">
                                      <div className="admin-table-sub-details d-flex align-items-center gap-2">
                                        <img src="/prescriptions.png" alt="" />
                                        <div>
                                          <h6 className="fs-16 fw-600 text-black">Prescriptions</h6>
                                          <p className="fs-14 fw-500">{new Date(item?.prescriptionId?.createdAt)?.toLocaleDateString('en-GB')}</p>
                                        </div>
                                      </div>

                                    </div>

                                    <div>
                                      <span className="active-barcode">{item?.prescriptionId?.status}</span>
                                    </div>

                                  </div>

                                  <div className="barcode-active-bx">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                      <div className="admin-table-bx">
                                        <div className="">
                                          <div className="admin-table-sub-details d-flex align-items-center gap-2 doctor-title ">
                                            <img src={item?.doctor?.profileImage ?
                                              `${base_url}/${item?.doctor?.profileImage}` : "/doctor-avatr.png"} alt=""
                                              onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/admin-tb-logo.png";
                                              }} />
                                            <div>
                                              <h6>{item?.doctorId?.name}</h6>
                                              <p className="fs-14 fw-500">{item?.doctorId?.nh12}</p>
                                            </div>
                                          </div>

                                        </div>
                                      </div>

                                      <div className="d-flex align-items gap-2">
                                        <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faPrint} /></button>
                                        <button type="button" className="card-sw-btn" data-bs-toggle="modal" data-bs-target="#add-Prescription" onClick={() => setPastPresData(item?.prescriptionId)}><FontAwesomeIcon icon={faEye} /></button>
                                      </div>
                                    </div>

                                    <div className="barcd-scannr barcde-scnnr-card">
                                      <div className="barcd-content">
                                        <h4>{item?.prescriptionId?.customId}</h4>
                                        {/* <img src="/barcode.png" alt="" /> */}
                                        <Barcode value={item?.prescriptionId?.customId} width={4}
                                          displayValue={false}
                                          height={60} />
                                      </div>

                                      <div className="barcode-id-details">
                                        <div>
                                          <h6>Patient Id </h6>
                                          <p>{patientUser?.nh12}</p>
                                        </div>


                                        <div>
                                          <h6>Appointment ID </h6>
                                          <p>{item?.customId}</p>
                                        </div>
                                      </div>

                                    </div>


                                  </div>

                                </div>

                              </div>)}
                          <Pagination page={cPresAp} totalPages={tPresPage} onPageChange={(p) => setCPresAp(p)} />
                        </div>
                      </div>

                      <div className="tab-pane fade" id="lab" role="tabpanel">
                        <div className="row">

                          {labReports?.length > 0 &&
                            labReports?.map((item, key) =>
                              <div className="col-lg-4 col-md-6 col-sm-12 mb-3" key={key}>
                                <div className="qrcode-prescriptions-bx">
                                  <div className="admin-table-bx d-flex align-items-center flex-row justify-content-between qr-cd-headr">
                                    <div className="admin-table-sub-details final-reprt d-flex align-items-center gap-2">
                                      <img src="/reprt-plus.png" alt="" className="rounded-0" />
                                      <div>
                                        <h6 className="fs-16 fw-600 text-black">Final Diagnostic Report</h6>
                                        <p className="fs-14 fw-500">{item?.labId?.nh12?.slice(-6)}</p>

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
                                        <h4 className="mb-1">{item?.customId}</h4>

                                        <ul class="qrcode-list">
                                          <li class="qrcode-item">Test  <span class="qrcode-title">: {item?.testId?.shortName}</span></li>
                                          <li class="qrcode-item">Draw  <span class="qrcode-title"> : {new Date(item?.createdAt)?.toLocaleString('en-GB')}</span> </li>
                                        </ul>
                                        {/* <img src="/barcode.png" alt="" /> */}
                                        <Barcode value={item?._id} width={1} displayValue={false}
                                          height={60} />
                                      </div>

                                      <div className="barcode-id-details">
                                        <div>
                                          <h6>Patient Id </h6>
                                          <p>PS-{customId}</p>
                                        </div>
                                        <div>
                                          <h6>Appointment ID </h6>
                                          <p>{item?.appointmentId?.customId}</p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="text-center mt-3">
                                      <a
                                        disabled={pdfLoading !== null}
                                        target="_blank"
                                        href={base_url + '/' + item?.upload?.report}
                                        // onClick={() =>
                                        //   handleReportDownload(item?.appointmentId?._id, item?.testId?._id, item?._id)
                                        // }
                                        className="pdf-download-tbn py-2"><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} />
                                        {pdfLoading == item?._id ? 'Downloading' : 'Download'}</a>

                                    </div>

                                  </div>

                                </div>
                              </div>)}
                          <Pagination page={cReport} totalPages={tReportPage} onPageChange={(p) => setCReport(p)} />

                        </div>
                      </div>

                      <div className="tab-pane fade show active" id="personal" role="tabpanel">
                        <div className="row">
                          <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                            <div className="view-employee-bx patients-personal-info-card">
                              <div>
                                <div className="view-avatr-bio-bx text-center">
                                  <img src={patientData?.profileImage ?
                                    `${base_url}/${patientData?.profileImage}` : "/admin-tb-logo.png"} alt=""
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/admin-tb-logo.png";
                                    }} />
                                  <h4>{patientUser?.name}</h4>
                                  <p><span className="vw-id">ID:</span> {patientUser?.nh12}</p>
                                  <h6 className="vw-activ text-capitalize">{patientData?.status}</h6>

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

                                    {demographic?.contact?.emergencyContactName && <li className="vw-info-item">
                                      <span className="vw-info-icon"><FontAwesomeIcon icon={faPhone} /></span>
                                      <div>
                                        <p className="vw-info-title">Emergency Contact Name </p>
                                        <p className="vw-info-value"><span className="fw-700">({demographic?.contact?.emergencyContactName}) </span> {demographic?.contact?.emergencyContactNumber}</p>
                                      </div>
                                    </li>}

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
                          <div className="col-lg-9">
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
                      <div className="tab-pane fade" id="contact" role="tabpanel">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="sub-tab-brd">
                              <div className="custom-frm-bx ">
                                <label htmlFor="">Patient Name</label>
                                <input type="text" placeholder="" value={cardData?.name} onChange={(e) => setCardData({ ...cardData, name: e.target.value })} className="form-control nw-select-frm" />
                              </div>

                              <div className="text-end">
                                <button className="nw-filtr-thm-btn" disabled={cardData?.isReady || !patientUser?.nh12} onClick={() => setCardData({ ...cardData, isReady: !cardData.isReady })}>
                                  {cardData.isReady ? 'Ready' : 'Generate'}</button>
                              </div>

                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              {/* <div className="add-patients-clients">
                                                        <img src="/premium-card.png" alt="" />
                                                        <div className="patient-card-details premium-crd-details">
                                                            <h4>RAVI Kumar</h4>
                                                            <p>Patient ID</p>
                                                            <h6>PATIENT20240423</h6>
                                                        </div>

                                                        <div className="qr-code-generate"></div>

                                                    </div> */}

                              <div className="add-patients-clients premium-crd-details" ref={cardRef}>

                                <div className="patient-chip-card"></div>
                                <img src="/NeoCard.png" alt="" />
                                <div className="patient-card-details nw-patient-details">
                                  <h4 className="text-white">{cardData?.name?.length > 20 ?
                                    cardData?.name?.slice(0, 17) + '...' : cardData?.name}</h4>
                                  <h6>{patientUser?.nh12}</h6>
                                </div>
                                <div className="qr-code-generate"></div>

                              </div>




                              {cardData?.isReady && <div>
                                <button className="patient-crd-down-btn" onClick={handleCardDownload}><FontAwesomeIcon icon={faDownload} /></button>
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
          </div>


        </div>}

      {/* <!-- add-Department Alert Popup Start --> */}
      {/* <!--  data-bs-toggle="modal" data-bs-target="#add-Prescription" --> */}
      <div className="modal step-modal" id="add-Prescription" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
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
                          <button className="no-print"><FontAwesomeIcon icon={faPrint} /></button>
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
      {(showDownload && selectedReport) && <div className="d-none">
        <ReportDownload
          appointmentId={selectedReport?.appointmentId}
          currentTest={selectedReport?.testId}
          endLoading={() => setPdfLoading(null)}
          pdfLoading={pdfLoading}
        />
      </div>}
      {/* <!-- add-Department Popup End --> */}

    </>
  )
}

export default PatientsPersonalInfo