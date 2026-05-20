import { TbGridDots } from "react-icons/tb";
import { faCheck, faDownload, faFilter, faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getSecureApiData, securePostData, updateApiData } from "../../Service/api";
import { formatDateTime } from "../../Service/globalFunction";
import base_url from "../../baseUrl";
import Loader from "../Common/Loader";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import DoctorAppointmentBilling from "./DoctorAppointmentBilling";
import { fetchEmpDetail } from "../../redux/features/userSlice";
import DoctorAptBookingReceipt from "../../All Template file/Booking receipt";
function PatientsOptData() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    const dispatch = useDispatch()
    const [appointmentRequest, setAppintmentRequest] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState(['approved'])
    const [doctorId, setDoctorId] = useState('')
    const [activeApt, setActiveApt] = useState(null)
    const { staffUser } = useSelector(state => state.user)
    const { hospitalBasic, paymentInfo } = useSelector(state => state.user)
    const [isSaving, setIsSaving] = useState(false)
    const [pdfLoading, setPdfLoading] = useState(null)
    async function getAppointmentData() {
        setLoading(true)
        try {
            const result = await getSecureApiData(`appointment/hospital/${userId}?page=${currentPage}&search=${search}&deptType=OPD&startDate=${startDate}&endDate=${endDate}&statuses=${status}&doctorId=${doctorId}`)
            if (result.success) {
                setAppintmentRequest(result.data)
                setCurrentPage(result.pagination.currentPage)
                setTotalPages(result.pagination.totalPages)
            } else {
                toast.error(result.message)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userId) {
            getAppointmentData()
        }
    }, [userId, currentPage, doctorId])
    useEffect(() => {
        dispatch(fetchEmpDetail(localStorage.getItem("staffId")))
    }, [])
    useEffect(() => {
        console.log(staffUser)
        if (staffUser?.role == "doctor") {
            setDoctorId(staffUser?._id)
        }
    }, [staffUser])
    const handleStatusChange = (value) => {
        setStatus((prev) =>
            prev.includes(value)
                ? prev.filter((s) => s !== value)
                : [...prev, value]
        );
    };
    const handleReset = () => {
        setStatus([])
        setStartDate(null)
        setEndDate(null)
        getAppointmentData()
    }
    const appointmentAction = async (item, status) => {
        const data = { doctorId: item?.doctorId?._id, appointmentId: item?._id, status }
        setLoading(true)
        try {
            const response = await updateApiData(`appointment/hospital/doctor-action`, data);
            if (response.success) {
                getAppointmentData()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        } finally {
            setLoading(false)
        }
    }
    const downloadAppointments = () => {
        if (!appointmentRequest || appointmentRequest.length === 0) return;

        // Map the data for export
        const data = appointmentRequest.map((item, index) => ({
            No: index + 1,
            Appointment_ID: item?.customId || "-",
            Patient_Name: item?.patientId?.name || "-",
            Patient_ID: item?.patientId?.nh12 || "-",
            Doctor_Name: item?.doctorId?.name || "-",
            Doctor_ID: item?.doctorId?.nh12 || "-",
            Appointment_Date: formatDateTime(item?.date) || "-",
            Status: item?.status || "-"
        }));

        // Create a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Create a new workbook and append worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");

        // Write workbook and save
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, "Appointments_List.xlsx");
    };
    const [aptPaymentForm, setAptPaymentForm] = useState({
        appointmentId: "", discountType: "", discountValue: "",
        totalAmount: 0, subTotal: 0, paymentType: ""
    })
    const [isDiscount, setIsDiscount] = useState(false)
    const [discountType, setDiscountType] = useState("")
    const [discountValue, setDiscountValue] = useState(0)
    const totalAmount = aptPaymentForm.totalAmount

    let finalAmount = totalAmount

    if (isDiscount && discountValue) {
        if (discountType === "Fixed") {
            finalAmount = totalAmount - discountValue
        } else if (discountType === "Percentage") {
            finalAmount = totalAmount - (totalAmount * discountValue) / 100
        }
    }
    const paymentSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            ...aptPaymentForm,
            discountType: isDiscount ? discountType : "",
            discountValue: isDiscount ? discountValue : 0,
            totalAmount: finalAmount
        }
        setIsSaving(true)
        try {
            const res = await securePostData('doctor/appointment-payment', payload)
            if (res.success) {
                toast.success(res.message)
                document.getElementById("closeModal").click()
                setAptPaymentForm({
                    appointmentId: "",
                    discountType: "",
                    discountValue: "",
                    totalAmount: 0,
                    subTotal: 0,
                    paymentMethod: ""
                })
                setDiscountType("")
                setDiscountValue(0)
                setIsDiscount(false)
                getAppointmentData()
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            setIsSaving(false)
        }
    }
    const [vitalsData, setVitalsData] = useState({
        height: "", weight: "", bloodPressure: "", pulse: "",
        temperature: "", respiratoryRate: "", oxygenSaturation: "", bloodSugar: "",
        bmi: "", painLevel: "", vision: "", hearing: "", other: "",
    })
    const vitalChange = (e) => {
        setVitalsData({ ...vitalsData, [e.target.name]: e.target.value })
    }
    const vitalSubmit = async (e) => {
        e.preventDefault()
        const data = { ...vitalsData, appointmentId: activeApt?._id }
        setLoading(true)
        try {
            const res = await securePostData('doctor/add-patient-vitals', data)
            if (res.success) {
                document.getElementById("closeVital").click()
                toast.success(res.message)
                setVitalsData(null)
                getAppointmentData()
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    async function sendReminder(patientId, appointmentId,doctorId) {
        const data = { patientId, appointmentId, doctorId }
        try {
            const result = await securePostData('doctor/send-reminder', data)
            if (result.success) {
                toast.success("Reminder send")
            } else {
                toast.info(result.message)
            }
        } catch (error) {

        }
    }
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row mb-2">
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Appointments</h3>
                                <div className="admin-breadcrumb">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb custom-breadcrumb">
                                            <li className="breadcrumb-item">
                                                <NavLink to="/dashboard" className="breadcrumb-link">
                                                    Dashboard
                                                </NavLink>
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page"
                                            >
                                                Appointments
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>

                            <div className="add-nw-bx">
                                <NavLink to="/add-appointment" className="add-nw-btn nw-thm-btn">
                                    <img src="/plus-icon.png" alt="" /> Add Appointment
                                </NavLink>
                            </div>
                        </div>
                    </div>

                    <div className='new-panel-card'>
                        <div className="row">
                            <div className="d-flex align-items-center justify-content-between mb-3 gap-2 nw-box ">
                                <div>
                                    <div className="d-flex align-items-center gap-2 ">
                                        <div className="custom-frm-bx mb-0">
                                            <input
                                                type="text"
                                                className="form-control  search-table-frm pe-5"
                                                id="email"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder="Enter appointment id"
                                                required
                                            />
                                            <div className="adm-search-bx">
                                                <button className="text-secondary" onClick={() => getAppointmentData()}>
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="dropdown">
                                            <a href="#" className="nw-filtr-btn" id="acticonMenus" data-bs-toggle="dropdown"
                                                aria-expanded="false">
                                                <FontAwesomeIcon icon={faFilter} />
                                            </a>

                                            <div className="dropdown-menu dropdown-menu-end user-dropdown tble-action-menu"
                                                aria-labelledby="acticonMenus">
                                                <div
                                                    className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-bottom">
                                                    <h6 className="mb-0 fz-18">Filter</h6>
                                                    <button onClick={() => handleReset()} className="fz-16 clear-btn">Reset</button>
                                                </div>

                                                <div className="p-3">
                                                    <ul className="filtring-list mb-3" onClick={(e) => e.stopPropagation()}>
                                                        <h6>Status</h6>
                                                        {["approved","reject", "pending", "cancel"].map((item) => (
                                                            <li key={item}>
                                                                <div className="form-check new-custom-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={item}
                                                                        checked={status.includes(item)}
                                                                        onChange={() => handleStatusChange(item)}
                                                                    />
                                                                    <label htmlFor={item} className="form-check-label">
                                                                        {item.charAt(0).toUpperCase() + item.slice(1)}
                                                                    </label>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="mt-3 filtring-list ">
                                                        <div className="row">
                                                            <h6>Date Range</h6>
                                                            <div className="col-lg-6">
                                                                <div className="custom-frm-bx">
                                                                    <input
                                                                        type="date"
                                                                        className="form-control admin-table-search-frm"
                                                                        value={startDate || ""}
                                                                        onChange={(e) => setStartDate(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="custom-frm-bx">
                                                                    <input
                                                                        type="date"
                                                                        className="form-control admin-table-search-frm"
                                                                        value={endDate || ""}
                                                                        onChange={(e) => setEndDate(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-top">
                                                    <a href="javascript:void(0)" className="thm-btn thm-outline-btn rounded-4 px-4 py-2 outline"> Cancel</a>
                                                    <button onClick={() => getAppointmentData()} className="thm-btn rounded-4 px-4 py-2"> Apply</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <button className="nw-filtr-btn" onClick={downloadAppointments}><FontAwesomeIcon icon={faDownload} /></button>
                                        </div>

                                    </div>
                                </div>

                                {totalPages > 1 && <div className="page-selector">
                                    <div className="filters">
                                        <select className="form-select custom-page-dropdown nw-custom-page "
                                            value={currentPage}
                                            onChange={(e) => setCurrentPage(e.target.value)}>
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="table-section">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Appointment  Id</th>
                                                    <th>Department</th>
                                                    <th>Patient Details</th>
                                                    <th>Appointment  Date</th>
                                                    <th>Doctor</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {appointmentRequest?.length > 0 ?
                                                    appointmentRequest?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{key + 1}.</td>
                                                            <td> #{item?.customId}</td>
                                                             <td> {item?.department?.departmentName}</td>
                                                            <td>
                                                                <div className="admin-table-bx">
                                                                    <div className="admin-table-sub-bx">
                                                                        <img src={item?.patientId?.patientId?.profileImage ?
                                                                            `${base_url}/${item?.patientId?.patientId?.profileImage}` : "/admin-tb-logo.png"} alt="" />
                                                                        <div className="admin-table-sub-details doctor-title">
                                                                            <h6>{item?.patientId?.name}</h6>
                                                                            <p>{item?.patientId?.nh12 || item?.patientId?.nh12}</p>
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
                                                                            `${base_url}/${item?.doctorId?.doctorId?.profileImage}` : "/doctor-avatr.png"} alt="" />
                                                                        <div className="admin-table-sub-details doctor-title">
                                                                            <h6>{item?.doctorId?.name} </h6>
                                                                            <p>{item?.doctorId?.nh12 || item?.doctorId?.nh12}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            {/* <td >
                                                                {item?.status == 'completed' ? <span className="approved approved-active ">Completed </span> :
                                                                item?.status == 'cancel' ? <span className="approved approved-active reject text-capitalize">{item?.status} </span> : <span className="approved approved-active leaved text-capitalize">{item?.status} </span>}
                                                                </td> */}

                                                                <td>
                                                                {item?.status === 'completed' ? (
                                                                    <span className="approved approved-active">Completed</span>
                                                                ) : item?.status === 'cancel' ? (
                                                                    <span className="approved approved-active reject text-capitalize">
                                                                    {item?.status}
                                                                    </span>
                                                                ) : item?.status === 'rejected' ? (
                                                                    <span className="approved approved-active inactive text-capitalize">
                                                                    {item?.status}
                                                                    </span>
                                                                ) : (
                                                                    <span className="approved approved-active leaved text-capitalize">
                                                                    {item?.status}
                                                                    </span>
                                                                )}
                                                                </td>

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
                                                                        className="dropdown-menu dropdown-menu-end   admin-dropdown-card"
                                                                        aria-labelledby="acticonMenu1"
                                                                    >
                                                                        <li className="prescription-item">
                                                                            <NavLink to={`/doctor-appointment-details/${item?._id}`} className="prescription-nav" >
                                                                                View  Appointment
                                                                            </NavLink>
                                                                        </li>
                                                                        {/* <li className="prescription-item">
                                                                        <NavLink to="/add-appointment" className="prescription-nav" href="#" >
                                                                            Edit
                                                                        </NavLink>
                                                                    </li>
                                                                    <li className="prescription-item">
                                                                        <a className="prescription-nav" href="#" data-bs-toggle="modal" data-bs-target="#edit-Supplier">
                                                                            Reschedule
                                                                        </a>
                                                                    </li> */}

                                                                        {item?.status !== 'cancel' && item?.status !== 'completed' && item?.status !== 'rejected' &&
                                                                            <> <li className="prescription-item">
                                                                                <button className=" prescription-nav pe-2 w-100" onClick={() => appointmentAction(item, 'completed')}>

                                                                                    <span className="text-success fz-14"> <FontAwesomeIcon icon={faCheck} />  Mark as completed</span>
                                                                                </button>
                                                                            </li>

                                                                                {item?.status !== "approved" && <li className="prescription-item">
                                                                                    <button className=" prescription-nav " onClick={() => appointmentAction(item, 'cancel')}>
                                                                                        <span className="text-danger"> Cancel appointment</span>
                                                                                    </button>
                                                                                </li>}
                                                                            </>}
                                                                        {(item?.status == "approved" || item?.status == "completed") && !item?.invoiceId && <li className="prescription-item">
                                                                            <button className=" prescription-nav w-100"
                                                                                onClick={() => {
                                                                                    setActiveApt(item)

                                                                                    setAptPaymentForm(prev => ({
                                                                                        ...prev,
                                                                                        appointmentId: item?._id,
                                                                                        totalAmount: item?.fees,
                                                                                        subTotal: item?.fees
                                                                                    }))
                                                                                }}
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#apt-Payment">
                                                                                Payment
                                                                            </button>
                                                                        </li>}
                                                                        {item?.status == "approved" && <li className="prescription-item">
                                                                            <button className=" prescription-nav w-100"
                                                                                onClick={() => {
                                                                                    setActiveApt(item)
                                                                                    if (item?.vitals && Object.keys(item?.vitals)?.length > 0) {
                                                                                        setVitalsData(item?.vitals)
                                                                                    }
                                                                                }}
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#apt-Vitals">
                                                                                Vitals
                                                                            </button>
                                                                        </li>}
                                                                        {item?.invoiceId &&
                                                                            <li className="prescription-item">
                                                                                <button className=" prescription-nav w-100"
                                                                                    onClick={() => {
                                                                                        setActiveApt(item)
                                                                                        setPdfLoading(true)
                                                                                    }}>
                                                                                    Download Invoice
                                                                                </button>
                                                                            </li>}
                                                                            {item?.status=="completed" && item?.prescriptionId &&
                                                                            <li className="prescription-item">
                                                                                <button className=" prescription-nav w-100"
                                                                                    onClick={() =>sendReminder(item?.patientId?._id,item?._id,item?.doctorId?._id)}>
                                                                                    Send Reminder
                                                                                </button>
                                                                            </li>}
                                                                    </ul>
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
                    </div>
                    <div className="modal step-modal fade" id="apt-Payment" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                        aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-md">
                            <div className="modal-content rounded-0">
                                <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                                    <div>
                                        <h6 className="lg_title mb-0">Payment Add</h6>
                                    </div>
                                    <div>

                                        <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                                            <FontAwesomeIcon icon={faCircleXmark} />
                                        </button>
                                    </div>
                                </div>
                                <div className="modal-body pb-5 px-4 pb-5">
                                    <form onSubmit={paymentSubmit} className="row justify-content-center">
                                        {/* <div className="col-lg-12">
                                            <div className="laboratory-report-bx">
                                                <ul className="laboratory-report-list">

                                                    {paymentInfo && <>
                                                        <li className="laboratory-item border-0">Bank Name  <span className="laboratory-title">{paymentInfo?.bankName}</span></li>
                                                        <li className="laboratory-item border-0">Account Number  <span className="laboratory-title">{paymentInfo?.accountNumber}</span></li>
                                                        <li className="laboratory-item border-0">Account Holder Name  <span className="laboratory-title">{paymentInfo?.accountHolderName}</span></li>
                                                        <li className="laboratory-item border-0">Branch Name  <span className="laboratory-title">{paymentInfo?.branch}</span></li>
                                                        <li className="laboratory-item border-0">IFSC Code <span className="laboratory-title">{paymentInfo?.ifscCode}</span></li>
                                                        {paymentInfo?.qr && <li className="laboratory-item border-0">Qr  <span className="laboratory-title"><img src={`${base_url}/${paymentInfo?.qr}`} alt="" srcset="" /></span></li>}
                                                    </>}
                                                </ul>

                                            </div>
                                        </div> */}
                                        <div className="my-3">
                                            <h5 className="add-contact-title text-black mb-3">Appointment Payment</h5>


                                            <div className="education-frm-bx mb-3 py-2 bg-transparent" >
                                                <div action="">
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Doctor Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control nw-frm-select"
                                                                    placeholder="Enter Service name"
                                                                    value={activeApt?.doctorId?.name}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="return-box">
                                                                <div className="custom-frm-bx flex-column flex-grow-1">
                                                                    <label htmlFor="">Doctor Fees</label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control nw-frm-select"
                                                                        placeholder="Enter amount"
                                                                        value={activeApt?.fees}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>




                                        <div className="col-lg-12">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Payment Method</label>
                                                <div class="select-wrapper">
                                                    <select value={aptPaymentForm?.paymentMethod} onChange={(e) => setAptPaymentForm({ ...aptPaymentForm, paymentMethod: e.target.value })} class="form-select custom-select" required>
                                                        <option value={''}> Select</option>
                                                        <option value={'CASH'}> Cash</option>
                                                        <option value={'CARD'}>Card</option>
                                                        <option value={'ONLINE'}>Online</option>
                                                    </select>
                                                </div>

                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-between'>
                                            <label htmlFor="">Discount</label>
                                            <div className="switch">
                                                <input
                                                    type="checkbox"
                                                    id="toggle8"
                                                    checked={isDiscount}
                                                    onChange={() => setIsDiscount(prev => !prev)}
                                                />
                                                <label htmlFor="toggle8">
                                                </label>
                                            </div>
                                        </div>

                                        <div className="laboratory-report-bx">
                                            <ul className="laboratory-report-list">
                                                <li className="laboratory-item border-0">Sub Total <span className="laboratory-title">${totalAmount}</span></li>
                                                {isDiscount &&
                                                    <>
                                                        <li className="laboratory-item border-0">Discount Type <span className="laboratory-title">
                                                            <div className="custom-frm-bx">

                                                                <select className='form-select' value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                                                                    <option value="" selected>Select</option>
                                                                    <option value="Fixed">Fixed</option>
                                                                    <option value="Percentage">Percentage</option>
                                                                </select>
                                                            </div>
                                                        </span></li>
                                                        <li className="laboratory-item border-0">Discount Value <span className="laboratory-title">
                                                            <div className="custom-frm-bx">

                                                                <input type='number' value={discountValue} className='form-control' onChange={(e) => setDiscountValue(e.target.value)} />
                                                            </div>
                                                        </span></li>
                                                    </>}
                                                <li className="laboratory-item border-0">Total Amount <span className="laboratory-title">${finalAmount}</span></li>
                                            </ul>
                                        </div>

                                        <div className="d-flex gap-3 justify-content-end">
                                            <button className="nw-thm-btn outline" type='button' id='closeModal' data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                                            <button className="nw-thm-btn w-auto" type='submit' disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'} Payment</button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-none">
                        {activeApt && <DoctorAptBookingReceipt paymentId={activeApt?.invoiceId}
                            endLoading={() => setPdfLoading(false)}
                            pdfLoading={pdfLoading} />}
                    </div>
                    <div className="modal step-modal fade" id="apt-Vitals" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                        aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content rounded-0">
                                <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                                    <div>
                                        <h6 className="lg_title mb-0">Vitals</h6>
                                    </div>
                                    <div>

                                        <button type="button" className="" id="closeVital" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                                            <FontAwesomeIcon icon={faCircleXmark} />
                                        </button>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={vitalSubmit} className="row justify-content-center">
                                        <div className="row">

                                                <div className="col-lg-4">
                                                    <div className="custom-frm-bx">
                                                        <label>Height (cm)</label>
                                                    <input type="number" name="height" value={vitalsData.height} onChange={vitalChange} className="form-control nw-frm-select" />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4">
                                                    <div className="custom-frm-bx">
                                                        <label>Weight (kg)</label>
                                                    <input type="number" name="weight" value={vitalsData.weight} onChange={vitalChange} className="form-control nw-frm-select" />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4">
                                                    <div className="custom-frm-bx">
                                                        <label>Blood Pressure</label>
                                                    <input type="text" name="bloodPressure" value={vitalsData.bloodPressure} onChange={vitalChange} className="form-control nw-frm-select" />

                                                    </div>
                                                    
                                                </div>

                                                <div className="col-lg-4 ">
                                                    <div className="custom-frm-bx">
                                                        <label>Pulse</label>
                                                    <input type="number" name="pulse" value={vitalsData.pulse} onChange={vitalChange} className="form-control nw-frm-select" />

                                                    </div>
                                                    
                                                </div>

                                                <div className="col-lg-4">
                                                    <div className="custom-frm-bx">
                                                        <label>Temperature (°F)</label>
                                                    <input type="number" name="temperature" value={vitalsData.temperature} onChange={vitalChange} className="form-control nw-frm-select" />

                                                    </div>
                                                    
                                                </div>

                                                <div className="col-lg-4">
                                                    <div className="custom-frm-bx">
                                                        <label>Respiratory Rate</label>
                                                    <input type="number" name="respiratoryRate" value={vitalsData.respiratoryRate} onChange={vitalChange} className="form-control nw-frm-select" />

                                                    </div>
                                                    
                                                </div>

                                                <div className="col-lg-4">
                                                    <div className="custom-frm-bx">
                                                         <label>Oxygen Saturation (%)</label>
                                                    <input type="number" name="oxygenSaturation" value={vitalsData.oxygenSaturation} onChange={vitalChange} className="form-control nw-frm-select" />

                                                    </div>
                                                    
                                                   
                                                </div>

                                                <div className="col-lg-4">
                                                    <div className="custom-frm-bx">
                                                        <label>Blood Sugar</label>
                                                    <input type="number" name="bloodSugar" value={vitalsData.bloodSugar} onChange={vitalChange} className="form-control nw-frm-select" />

                                                    </div>
                                                    
                                                </div>

                                                <div className="col-lg-4">
                                                    <div className="custom-frm-bx">
                                                        <label>BMI</label>
                                                    <input type="number" name="bmi" value={vitalsData.bmi} onChange={vitalChange} className="form-control nw-frm-select" />

                                                    </div>
                                                    
                                                </div>

                                                <div className="col-lg-4">
                                                    <div className="custom-frm-bx">
                                                        <label>Pain Level (1-10)</label>
                                                    <input type="number" name="painLevel" value={vitalsData.painLevel} onChange={vitalChange} className="form-control nw-frm-select" />

                                                    </div>
                                                    
                                                </div>

                                                <div className="col-lg-4 ">
                                                    <div className="custom-frm-bx">
                                                        <label>Vision</label>
                                                    <input type="text" name="vision" value={vitalsData.vision} onChange={vitalChange} className="form-control nw-frm-select" />

                                                    </div>
                                                    
                                                </div>

                                                <div className="col-lg-4">
                                                    <div className="custom-frm-bx">
                                                         <label>Hearing</label>
                                                    <input type="text" name="hearing" value={vitalsData.hearing} onChange={vitalChange} className="form-control nw-frm-select" />

                                                    </div>
                                                   
                                                </div>

                                                <div className="col-lg-12">
                                                    <div className="custom-frm-bx">
                                                        <label>Other Notes</label>
                                                    <textarea name="other" value={vitalsData.other} onChange={vitalChange} className="form-control nw-frm-select" />

                                                    </div>
                                                    
                                                </div>

                                            </div>

                                        <div className="d-flex gap-3 justify-content-end">
                                            <button className="nw-thm-btn outline" type='button' id='closeModal' data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                                            {Object.keys(activeApt?.vitals || {}).length === 0 && (
                                                <button
                                                    className="nw-thm-btn w-auto"
                                                    type='submit'
                                                    disabled={isSaving}
                                                >
                                                    {isSaving ? 'Saving...' : 'Save'}
                                                </button>
                                            )}
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-end mt-4">
                        <Link to={-1} className="nw-thm-btn outline" >
                    Go Back
                  </Link>
                    </div>
                </div>}
        </>
    )
}

export default PatientsOptData