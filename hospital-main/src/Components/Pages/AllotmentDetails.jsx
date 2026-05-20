import {
  faCirclePlus,
  faCircleXmark,
  faDownload,
  faEdit,
  faEye,
  faFileExport,
  faFilePdf,
  faPen,
  faPrint,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPlusSquare } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { BsCapsule } from "react-icons/bs";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "../../api/api";
import React, { Fragment } from "react";
import { deleteApiData, getSecureApiData, securePostData, updateApiData } from "../../Service/api";
import base_url from "../../baseUrl";
import Barcode from "react-barcode";
import AllotmentPayment from "./AllotmentPayment";
import { toast } from "react-toastify";
import Select from "react-select";
import DischargePatient from "./DischargePatient";
import Loader from "../Common/Loader";
import { useSelector } from "react-redux";
import BedInvoice from "../../All Template file/Bed invoice";
import DailyIPDNotes from "./DailyIPDNotes";
import AddAllotmentTest from "./AddAllotmentTest";
import DepartmentTransfer from "./DepartmentTransfer";
function AllotmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testOptions, setTestOptions] = useState([])
  const user = JSON.parse(localStorage.getItem('user'))
  const userId = user.id
  const [data, setData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeRx, setActiveRx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoData, setDemoData] = useState()
  const [medicalHistory, setMedicalHisotry] = useState()
  const [customId, setCustomId] = useState()
  const [patientData, setPatientData] = useState()
  const [demographic, setDemographic] = useState()
  const [paymentData, setPaymentData] = useState()
  const [selectedTest, setSelectedTest] = useState([])
  const [reports, setReports] = useState([])
  const [prescriptionData, setPrescriptionData] = useState()
  const { hospitalCustomId } = useSelector(state => state.user)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [openDailyNotes, setOpenDailyNotes] = useState(false);
  const [notesData, setNotesData] = useState()
  const [deptTransfer, setDepartmentTransfer] = useState({ _id: null, departmentId: null, allotmentId: null })
  const [dischargeData, setDischargeData] = useState({
    paymentId: "",
    allotmentId: id,
    hospitalId: userId,
    patientId: "",
    dischargeDateOnly: "",
    dischargeTimeOnly: "",
    note: "",
    dischargeDate: null,
  })

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/bed/allotment/${id}`);
      const data = res.data.data
      setData(data);
      setSelectedTest(data?.testIds || [])
      setDischargeData({ ...dischargeData, paymentId: data?.paymentId, patientId: data?.patientId?._id })
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (!data?.patientId?._id) return;

    fetchPatientProfile(data?.patientId?._id)
    fetchDischargePatient()
    fetchAllotmentPayment()
    fetchPrescriptionData()
    fetchReportsData()
  }, [data]);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "-");

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const handleDeletePrescription = async (id) => {
    if (!window.confirm("Delete this prescription?")) return;

    const res = await deleteApiData(`api/bed/prescription/${id}`);
    if (res.success) {
      toast.success("Prescription deleted")
      fetchDetails()
      setPrescriptionData()
    }
    setPrescriptions((prev) => prev.filter((p) => p._id !== id));
  };
  async function fetchPatientProfile(ptId) {
    if (!ptId) {
      return
    }
    setLoading(true)
    try {
      const result = await getSecureApiData(`patient/profile-detail/${ptId}`)
      if (result.success) {
        setDemographic(result?.demographic)
        setPatientData(result?.user)
        setCustomId(result?.patientUser?.nh12)
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }
  async function fetchDischargePatient() {
    try {
      const res = await getSecureApiData(`api/bed/discharge-patient/${id}`);

      if (res.success) {
        const dischargeDateTime = res?.data?.dischargeDate
          ? new Date(res.data.dischargeDate)
          : null;

        const formattedData = {
          ...res.data,
          dischargeId: res?.data?._id,

          // Combined datetime (original)
          dischargeDate: res?.data?.dischargeDate || "",

          // Separate fields for inputs
          dischargeDateOnly: dischargeDateTime
            ? dischargeDateTime.toISOString().split("T")[0]
            : "",

          dischargeTimeOnly: dischargeDateTime
            ? dischargeDateTime.toTimeString().slice(0, 5)
            : "",
        };

        setDischargeData(formattedData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchAllotmentPayment() {
    try {
      const res = await getSecureApiData(`api/bed/allotment-payment/${id}`)
      if (res.success) {
        const formattedData = {
          ...res.data,
          payments: res.data.payments?.map(p => ({
            ...p,
            date: p.date
              ? new Date(p.date).toISOString().split("T")[0]
              : ""
          }))
        };

        setPaymentData(formattedData);
      }
    } catch (error) {

    }
  }
  async function fetchPrescriptionData() {
    if (!data?.prescriptionId) {
      return
    }
    try {
      const res = await getSecureApiData(`api/bed/prescription-data/${data?.prescriptionId}`)
      if (res.success) {
        setPrescriptionData(res.data);
      }
    } catch (error) {

    }
  }
  async function fetchReportsData() {
    if (!data?.labAppointment) {
      return
    }
    try {
      const res = await getSecureApiData(`api/bed/test-reports/${data?.labAppointment?._id}`)
      if (res.success) {
        setReports(res.testReports);
      }
    } catch (error) {

    }
  }
  async function addLabTests(e) {
    e.preventDefault()
    setLoading(true)
    const data = { allotmentId: id, testIds: selectedTest }
    try {
      const res = await securePostData(`api/bed/add-tests`, data)
      if (res.success) {
        document.getElementById("closeTest")?.click()
        toast.success("Test added successfully")
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  // Total Service Amount
  const totalAmount = paymentData?.services?.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  ) + paymentData?.ipdPayment?.reduce(
    (sum, item) => sum + (item.fees || 0),
    0
  ) + paymentData?.bedCharges?.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  // Total Paid Amount
  const paidAmount = paymentData?.payments?.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  // Pending Amount
  const pendingAmount = totalAmount - paidAmount;


  async function fetchSelectedLabData() {
    setLoading(true)

    try {
      const result = await getSecureApiData(`lab/test/${userId}?limit=1000&type=hospital`)
      if (result.success) {
        const options = result.data?.filter(item => item?.status == 'active')?.map((lab) => ({
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
    fetchSelectedLabData()
  }, [])

  const downloadReport = async (fileName) => {
    if (!fileName) return;

    const fileUrl = `${base_url}/${fileName}`;

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  const printRef = useRef();
  const prescriptionPrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;

    window.location.reload(); // page restore
  };
  const allotmentRef = useRef();
  const allotmentPrint = () => {
    const printContents = allotmentRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;

    window.location.reload(); // page restore
  };

  return (
    <>
      {loading ? <Loader />
        : <div className="main-content flex-grow-1 p-3 overflow-auto">
          <div className="row mb-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap">
              <div>
                <h3 className="innr-title mb-2 gradient-text">
                  Allotment Details
                </h3>
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
                          Bed management
                        </a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Allotment Details
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>

              <div className="exprt-bx d-flex align-items-center gap-2 flex-wrap">
                {/* {data?.status == "Active" && <>
                  {data && data?.status == "Active" && (
                    <button
                      className="nw-add-btn"
                      onClick={() => navigate(`/allotment/prescription-data/${data?._id}?type=allotment`)}
                    >
                      Add Prescriptions
                    </button>
                  )}
                  <button
                    className="thm-btn "
                    data-bs-toggle="modal"
                    data-bs-target="#add-Payment"
                  >
                    Payment Add
                  </button>
                  {(data?.status == "Active" && testOptions?.length > 0) &&
                    <button className="nw-lg-thm-btn" data-bs-toggle="modal" data-bs-target="#add-Lab">{data?.labAppointment ? 'View' : 'Add'} Lab Test</button>}
                  <button
                    className="nw-thm-btn w-auto"
                    data-bs-toggle="modal"
                    data-bs-target="#discharge-Patient"
                  >
                    Discharge Patient
                  </button>
                </>} */}
                <div className="dropdown position-static">
                  <button className="nw-thm-btn" id="acticonMenu1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Action
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end  tble-action-menu admin-dropdown-card"
                    aria-labelledby="acticonMenu1"
                  >

                    <li className="prescription-item">
                      <button className="prescription-nav w-100" data-bs-toggle="modal"
                        data-bs-target="#add-Payment">
                        Add Payment
                      </button>
                    </li>
                    {data?.status == "Active" && <>
                      <li className="prescription-item">
                        <NavLink to={`/edit-allotment/${id}`} className="prescription-nav">
                          Edit Allotment
                        </NavLink>
                      </li>
                      <li className="prescription-item">
                        <NavLink to={`/allotment/prescription-data/${id}?type=allotment`} className="prescription-nav">
                          Add Prescription
                        </NavLink>
                      </li>
                      <li className="prescription-item">
                        <a
                          href="#"
                          className="prescription-nav"
                          data-bs-toggle="modal"
                          data-bs-target="#department-Transfer"
                          data-bs-dismiss="modal"
                          onClick={(e) => {
                            e.preventDefault()
                            setDepartmentTransfer({
                              _id: data?.bedId?._id,
                              allotmentId: id,
                              departmentId: data?.departmentId?._id
                            })
                          }}
                        >
                          Department Transfer

                        </a>
                      </li>

                      <li className="prescription-item">
                        <button
                          className="prescription-nav w-100"
                          data-bs-toggle="modal"
                          data-bs-target="#add-LabTest"
                        >
                          Add Lab Test

                        </button>
                      </li>
                      <li className="prescription-item">
                        <a
                          href="#"
                          className="prescription-nav"
                          data-bs-toggle="modal"
                          data-bs-dismiss="modal"
                          data-bs-target="#add-IPD-Notes"
                          onClick={() => {
                            setNotesData({ allotmentId: id })
                            setOpenDailyNotes(true)
                          }}
                        >
                          Add Daily Notes

                        </a>
                      </li>

                      <li className="prescription-item">
                        <Link className=" prescription-nav" to={`/discharge/${data._id}`} >

                          Discharge Patient
                        </Link>
                      </li>
                    </>}
                    <li className="prescription-item">
                      <Link to={`/daily-ipd-history?allotment=${id}`}

                        className="prescription-nav" >
                        Notes History
                      </Link>
                    </li>
                    <li className="prescription-item">
                      <NavLink to={`/transfer-history/${id}`} className="prescription-nav" >
                        Transfer History
                      </NavLink>
                    </li>
                    {data?.dischargeId && <li className="prescription-item">
                      <Link to={`/discharge/${data?._id}`} className="prescription-nav" >
                        Discharge History
                      </Link>
                    </li>}

                    {data?.status == "Discharged" && !data?.transferId && <li className="prescription-item">
                      <a
                        href="#"
                        className="prescription-nav"
                        data-bs-toggle="modal"
                        onClick={() => setSelected(data)}
                        data-bs-target="#hospital-Transfer"
                      >
                        Hospital Transfer
                      </a>
                    </li>}
                    {data?.transferId &&
                      <li className="prescription-item">
                        <NavLink to={`/patient-transfer/${data?.transferId}`} className="prescription-nav">
                          See Transfer
                        </NavLink>
                      </li>}
                    <li className="prescription-item">
                      <button className=" prescription-nav w-100" disabled={pdfLoading} onClick={() => {

                        setPdfLoading(true)
                      }}>

                        {pdfLoading ? 'Printing...' : 'Print'} Details
                      </button>
                    </li>
                  </ul>
                </div>
                <button className="nw-exprt-btn" onClick={() => setPdfLoading(true)}>
                  <FontAwesomeIcon icon={faFileExport} /> {pdfLoading ? 'Downloading...' : 'Download'}{" "}
                </button>
                {/* <button className="nw-exprt-btn">
                  <FontAwesomeIcon icon={faFileExport} /> Export{" "}
                </button> */}
              </div>
            </div>
          </div>

          <div className="new-panel-card" >
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="neo-health-patient-info-card mb-3">
                  <h5>Patient Information</h5>
                  <div className="nw-allotment-details my-3">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <h6>Name</h6>
                        <p>{data?.patientId?.name}</p>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <h6>Patient ID</h6>
                        <p>{customId}</p>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <h6>Age</h6>
                        <p>{calculateAge(demographic?.dob)} Years</p>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <h6>Gender</h6>
                        <p>{patientData?.gender}</p>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <h6>Phone</h6>
                        <p>{patientData?.contactNumber}</p>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <h6>Email</h6>
                        <p>{patientData?.email}</p>
                      </div>

                      <div className="col-md-12 mb-3">
                        <h6>Address</h6>
                        <p>{demographic?.address}</p>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <h6>Emergency Contact Name</h6>
                        <p>{demographic?.contact?.emergencyContactName}</p>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <h6>Emergency Contact Phone</h6>
                        <p>{demographic?.contact?.emergencyContactNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="neo-health-patient-info-card mb-3">
                  <h5>Allotment Details</h5>
                  <div className="nw-allotment-details my-3">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <h6>Allotment Date</h6>
                        <p>{formatDate(data?.allotmentDate)}</p>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <h6>Expected Discharge Date</h6>
                        <p>{formatDate(data?.expectedDischargeDate)}</p>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <h6>Actual Discharge</h6>
                        <p className={data?.dischargeDate ? "" : "not-discharge"}>
                          {data?.dischargeDate
                            ? formatDate(data?.dischargeDate)
                            : "Not discharged yet"}
                        </p>
                      </div>

                      {/* <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                      <h6>Gender</h6>
                      <p>{demoData?.gender}</p>
                    </div> */}

                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <h6>Head Doctor</h6>
                        <p className="chnge fw-500">
                          {data?.primaryDoctorId?.name}
                        </p>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <h6>Doctor ID</h6>
                        <p>{data?.primaryDoctorId?.nh12}</p>
                      </div>

                      <div className="col-md-12 mb-3">
                        <h6>Admission Reason</h6>
                        <p>{data?.admissionReason || "-"}</p>
                      </div>

                      <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                        <h6>Note</h6>
                        <p>{data?.note || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="neo-health-patient-info-card mb-3">
                  <h5 className="mb-3">Attending Doctors and Nurse</h5>
                  <div className="table-section new-allotment-table">
                    <div className="table table-responsive mb-0">
                      <table className="table mb-0">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.attendingStaff?.map((s, i) => (
                            <tr key={i}>
                              <td>{s.staffId?.name}</td>
                              <td>{s.staffType}</td>
                              <td>{formatDate(s.date)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {reports?.length > 0 && reports?.map((item, key) =>
                  <div className="qrcode-prescriptions-bx mb-2" key={key}>
                    <div className="admin-table-bx d-flex align-items-center justify-content-between qr-cd-headr">
                      <div className="admin-table-sub-details final-reprt d-flex align-items-center gap-2">
                        <img src="/reprt-plus.png" alt="" className="rounded-0" />
                        <div>
                          <h6 className="fs-16 fw-600 text-black">
                            Final Diagnostic Report
                          </h6>
                          <p className="fs-14 fw-500">RE-89767</p>
                        </div>
                      </div>
                    </div>

                    <div className="barcode-active-bx">
                      <div className="admin-table-bx mb-2">
                        <div className="admin-table-sub-details d-flex align-items-center doctor-title ">
                          <div>
                            <h6>{user?.name}</h6>
                            <p className="fs-14 fw-500">{hospitalCustomId}</p>
                          </div>
                        </div>
                        <div className="admin-table-sub-details d-flex align-items-center doctor-title ">
                          {/* <div>
                            <h6>Dr. David Patel </h6>
                            <p className="fs-14 fw-500 text-end">DO-4001</p>
                          </div> */}
                        </div>
                      </div>

                      <div className="barcd-scannr barcde-scnnr-card">
                        <div className="barcd-content">
                          <h4 className="mb-1">{item?.customId}</h4>

                          <ul className="qrcode-list">
                            <li className="qrcode-item">
                              Test <span className="qrcode-title">: {item?.testId?.shortName}</span>
                            </li>
                            <li className="qrcode-item">
                              Draw{" "}
                              <span className="qrcode-title">
                                {" "}
                                : {new Date(item?.createdAt)?.toLocaleString('en-GB')}
                              </span>{" "}
                            </li>
                            {item?.upload?.comment && <li className="qrcode-item">
                              Note <span className="qrcode-title">: {item?.upload?.comment}</span>
                            </li>}
                          </ul>

                          {/* <img src="/barcode.png" alt="" /> */}
                          <Barcode value={item?._id} width={1} displayValue={false}
                            height={60} />
                        </div>

                        <div className="barcode-id-details">
                          <div>
                            <h6>Patient Id </h6>
                            <p>{customId}</p>
                          </div>

                          <div>
                            <h6>Appointment ID </h6>
                            <p>{item?.appointmentId?.customId}</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-center mt-3">
                        <button className="pdf-download-tbn py-2" onClick={() => downloadReport(item?.upload?.report)}>
                          <FontAwesomeIcon
                            icon={faFilePdf}
                            style={{ color: "#EF5350" }}
                          />{" "}
                          Download Report
                        </button>
                      </div>
                    </div>
                  </div>)}
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="neo-health-patient-info-card mb-3">
                  <h5>Bed Information</h5>
                  <div className="nw-allotment-details my-3">
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                        <h6>Room Number</h6>
                        <p>{data?.bedId?.roomId?.roomName}</p>
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                        <h6>Floor</h6>
                        <p>{data?.bedId?.floorId?.floorName}</p>
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                        <h6>Bad</h6>
                        <p className="">{data?.bedId?.bedName}</p>
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                        <h6>Department</h6>
                        <p>{data?.departmentId?.departmentName}</p>
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                        <h6>Daily Rate</h6>
                        <p>₹ {data?.bedId?.pricePerDay}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {prescriptionData && <div className="neo-health-patient-info-card mb-3">
                  <h5>Prescriptions</h5>
                  <div className="row">
                    <div className="allot-pres mb-3">
                      <div className="mt-3">
                        <div className="barcd-scannr barcde-scnnr-card ms-0">
                          <div className="barcd-content">
                            <h4>{prescriptionData?.customId}</h4>
                            {/* <img src="/barcode.png" alt="" /> */}
                            <Barcode value={`${prescriptionData?._id}`} width={1} displayValue={false}
                              height={60} />

                          </div>

                          <div className="barcode-id-details">
                            <div>
                              <h6>Patient Id </h6>
                              <p>{customId}</p>
                            </div>

                            <div>
                              <h6>Prescription ID </h6>
                              <p>{prescriptionData?.customId}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="allot-pres">
                      <div className="d-flex flex-column justify-content-between h-100">
                        <div className="admin-table-bx">
                          <div className="">
                            <div className="admin-table-sub-details d-flex align-items-center gap-2 doctor-title ">
                              <img src={prescriptionData?.doctorId?.doctorId?.profileImage ?
                                `${base_url}/${prescriptionData?.doctorId?.doctorId?.profileImage}` : "/doctor-avatr.png"} alt="" />
                              <div>
                                <h6>{prescriptionData?.doctorId?.name}</h6>
                                <p className="fs-14 fw-500">
                                  {prescriptionData?.doctorId?.nh12}
                                </p>
                              </div>
                            </div>
                            <div className="admin-table-sub-details my-3">
                              <p>
                                Date :{" "}
                                <span className="nw-booked-icon fw-500">
                                  {formatDate(prescriptionData?.createdAt)}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex align-items justify-content-between">
                          <div>
                            <button
                              type="button"
                              className="text-success"
                              onClick={() =>
                                navigate(`/allotment/prescription-data/${id}`)
                              }
                            >
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                            {/* <button
                              type="button"
                              className="text-danger"
                              onClick={() => handleDeletePrescription(prescriptionData?._id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button> */}
                          </div>

                          <div className="d-flex align-items gap-2">
                            <div>
                              <span
                                className={`approved rounded-5 py-1 ${prescriptionData?.status === "Active" ? "active" : "inactive"
                                  }`}
                              >
                                {prescriptionData?.status}
                              </span>
                            </div>

                            <button type="button" className="card-sw-btn" onClick={() => {
                              setActiveRx(prescriptionData)
                              setTimeout(() => { prescriptionPrint() }, 200)
                            }}>
                              <FontAwesomeIcon icon={faPrint} />
                            </button>
                            <a
                              href="#"
                              type="button"
                              className="card-sw-btn"
                              data-bs-toggle="modal"
                              data-bs-target="#add-Prescription"
                              onClick={() => setActiveRx(prescriptionData)}
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>}

                <div className="neo-health-patient-info-card mb-3">
                  <div className="row">
                    <div className="d-flex aling-items-center justify-content-between mb-3">
                      <h5 className="mb-0">Billing Information</h5>
                      <div>
                        <button className="nw-adding-bill-btn" data-bs-toggle="modal" data-bs-target="#add-Payment">
                          <FontAwesomeIcon icon={faCirclePlus} />
                        </button>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="table-section new-allotment-table nw-payment-table">
                        <div className="table table-responsive mb-0">
                          <table className="table mb-0">
                            <thead>
                              <tr>
                                <th>Item</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paymentData?.services?.length > 0 && <tr>Services</tr>}
                              {paymentData?.services?.map((item, key) =>
                                <tr key={key}>
                                  <td>{item?.name}</td>
                                  <td>₹ {item?.amount}</td>
                                </tr>)}
                              {paymentData?.ipdPayment?.length > 0 && <tr>Ipd Payments</tr>}
                              {paymentData?.ipdPayment?.map((item, key) =>
                                <tr key={key}>
                                  <td>{item?.userId?.name} ({item?.userId?.role == 'doctor' ? 'Doctor' : 'Healthcare Staff'})</td>
                                  <td>₹ {item?.fees}</td>
                                </tr>)}
                              {paymentData?.bedCharges?.length > 0 && <tr>Bed Charges</tr>}
                              {paymentData?.bedCharges?.map((item, key) =>
                                <tr key={key}>
                                  <td>{item?.bedId?.bedName}</td>
                                  <td>₹ {item?.amount}</td>
                                </tr>)}

                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="laboratory-report-bx border-top ">
                        <div className="lab-amount-bx mt-2 px-3">
                          <ul className="lab-amount-list">
                            <li className="lab-amount-item">
                              Total :{" "}
                              <span className="price-title fw-700">₹{totalAmount}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <h5 className="mb-3">Payment</h5>
                    <div className="col-lg-12">
                      <div className="table-section new-allotment-table nw-payment-table">
                        <div className="table table-responsive mb-0">
                          <table className="table mb-0">
                            <thead>
                              <tr>
                                <th>Payment Type</th>
                                <th>Date</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paymentData?.payments?.map((item, key) =>
                                <tr key={key}>
                                  <td>{item?.type}</td>
                                  <td>{new Date(item?.date)?.toLocaleDateString('en-GB')}</td>
                                  <td>₹ {item?.amount}</td>
                                </tr>)}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="appointment-crd-details my-2">
                    <ul className="appointment-crd-list">
                      <li className="appointment-crd-item">
                        Total Payment{" "}
                        <span className="appointment-crd-title">₹ {totalAmount}</span>
                      </li>
                      <li className="appointment-crd-item">
                        Payment Add{" "}
                        <span className="appointment-crd-title">₹ {paymentData?.payments?.reduce(
                          (sum, item) => sum + (item.amount || 0),
                          0
                        )}</span>
                      </li>
                      <li className="appointment-crd-item">
                        Pending Payment{" "}
                        <span className="appointment-crd-title"> ₹ {pendingAmount}</span>
                      </li>
                      <li className="appointment-crd-item">
                        Payment Status{" "}
                        <span className=" approved approved-active py-1">
                          {" "}
                          {paymentData?.status}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {dischargeData?.dischargeNote && (
                    <div className="report-remark mt-3">
                      <h6 className="fw-400">Discharge Note: </h6>
                      <p>{dischargeData?.dischargeNote}</p>
                    </div>
                  )}
                </div>
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
      <AllotmentPayment allotmentId={data?._id} patientId={data?.patientId?._id} getData={fetchAllotmentPayment} />
      {/* <!-- Payment Add Popup End --> */}

      {/* <!-- Discharge Patient Popup Start --> */}
      {/* <!--  data-bs-toggle="modal" data-bs-target="#discharge-Patient" --> */}
      <DischargePatient allotmentId={data?._id} fetchData={() => fetchDetails()} />
      {/* <!-- Discharge Patient Popup End --> */}
      <div className="d-none" >
        <BedInvoice allotmentId={id} pdfLoading={pdfLoading} endLoading={() => setPdfLoading(false)} />
      </div>

      <DailyIPDNotes data={notesData} openTrigger={openDailyNotes} />
      <AddAllotmentTest allotmentId={id} />
      <DepartmentTransfer data={deptTransfer} getData={fetchDetails} />

      {/* <!-- add-Department Alert Popup Start --> */}
      {/* <!--  data-bs-toggle="modal" data-bs-target="#add-Prescription" --> */}
      <div
        className="modal step-modal"
        id="add-Prescription"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content rounded-5 p-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="lg_title mb-0"> Prescription</h6>
              </div>
              <div>
                <button
                  type="button"
                  className=""
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ color: "#00000040" }}
                >
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </div>
            </div>
            <div className="modal-body" >
              <div className="row ">
                <div className="col-lg-12">
                  <div className="view-report-card bg-transparent" ref={printRef}>
                    {activeRx && (
                      <>
                        <div className="view-report-header">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <span className="active-status">
                                {activeRx.status}
                              </span>
                              <h5>RX-{activeRx?._id?.slice(-5)}</h5>
                              <h6>
                                Date:{" "}
                                {new Date(
                                  activeRx.createdAt
                                ).toLocaleDateString("en-IN")}
                              </h6>
                            </div>

                            <div>
                              <button>
                                <FontAwesomeIcon icon={faDownload} />
                              </button>
                              <button onClick={prescriptionPrint}>
                                <FontAwesomeIcon icon={faPrint} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="view-report-content">
                          <div className="sub-content-title">
                            <h4>RX.</h4>
                            <h3>
                              <BsCapsule style={{ color: "#00B4B5" }} />{" "}
                              Medications
                            </h3>
                          </div>

                          {activeRx?.medications?.map((m, i) => (
                            <div key={i} className="view-medications-bx mb-3">
                              <h5>
                                {i + 1}. {m.name}
                              </h5>
                              <ul className="viwe-medication-list">
                                <li>Frequency: {m.frequency}</li>
                                <li>Duration: {m.duration}</li>
                                <li>Refills: {m.refills || "-"}</li>
                                <li>Instructions: {m.instructions || "-"}</li>
                              </ul>
                            </div>
                          ))}

                          <div className="diagnosis-bx mb-3">
                            <h5>Diagnosis</h5>
                            <p>{activeRx?.diagnosis}</p>
                          </div>

                          <div className="diagnosis-bx mb-3">
                            <h5>Notes</h5>
                            <p>{activeRx?.notes || "-"}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- add-lab Popup End --> */}
      <div className="modal step-modal fade" id="add-Lab" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content rounded-0">
            <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
              <div>
                <h6 className="lg_title mb-0">{data?.labAppointment ? 'View' : 'Add'}  Lab Test </h6>
              </div>
              <div>
                <button type="button" className="" id="closeTest" data-bs-dismiss="modal" aria-label="Close" style={{ color: "rgba(239, 0, 0, 1)" }}>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </div>
            </div>
            <div className="modal-body pb-5 px-4 pb-5">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="add-deprtment-pic">
                    <img src="/add-lab.png" alt="" />
                    <p className="pt-2">Please add new lab test assign to patient</p>
                  </div>

                  <form onSubmit={addLabTests}>
                    <div className="custom-frm-bx">
                      <label htmlFor="">Test Select</label>
                      <div class="select-wrapper">
                        <Select
                          options={testOptions}
                          isMulti
                          required
                          name="testId"
                          value={testOptions?.filter(item =>
                            selectedTest?.includes(item.value)   // 👈 correct
                          )}
                          classNamePrefix="custom-select"
                          placeholder="Select areas(s)"
                          onChange={(options) => {
                            setSelectedTest(options.map(opt => opt.value)); // ✅ array of IDs
                          }}
                        />
                      </div>
                    </div>

                    {data?.labAppointment ? '' : <div className="mt-3">
                      <button type="submit" className="nw-thm-btn w-100"> Submit</button>
                    </div>}
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AllotmentDetails;
