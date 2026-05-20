import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBarcode,
    faBriefcase,
    faCirclePlus,
    faClose,
    faDownload,
    faFileEdit,
    faFilter,
    faFlask,
    faFlaskVial,
    faGear,
    faPen,
    faSearch,
    faSyringe,
    faUserAltSlash,
    faUserDoctor,

} from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import { faFileAlt, faFileArchive } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import { getSecureApiData, securePostData, updateApiData } from "../../Service/api";
import base_url from "../../baseUrl";
import { toast } from "react-toastify";
import api from "../../api/api";
import Loader from "../Common/Loader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
function TestReportsAppointment() {
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    const [allTest, setAllTest] = useState([])
    const [totalPages, setTotalPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    // const { isOwner, permissions } = useSelector(state => state.user)
    const [payData, setPayData] = useState({ appointmentId: null, paymentStatus: 'due' })
    const [actData, setActData] = useState({ appointmentId: null, status: '', staff: '' })
    const [activeData, setActiveData] = useState({})
    const [staffList, setStaffList] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [status, setStatus] = useState('')
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const fetchLabTest = async () => {
        try {
            const response = await getSecureApiData(`lab/test/${userId}`);
            if (response.success) {
                // setCurrentPage(response.pagination.page)
                // setTotalPage(response.pagination.totalPages)
                setAllTest(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        }
    }
    useEffect(() => {
        fetchLabTest()
        fetchLabAppointment()
    }, [userId])
    const [appointments, setAppointments] = useState([])
    const fetchLabAppointment = async () => {
        setLoading(true)
        try {
            const response = await getSecureApiData(`api/hospital/lab-appointment/${userId}?page=${currentPage}&dateFrom=${startDate}&dateTo=${endDate}&status=${status}&search=${search}`);
            if (response.success) {
                // setCurrentPage(response.pagination.page)
                // setTotalPage(response.pagination.totalPages)
                setAppointments(response.data)
                setTotalPage(response.totalPages)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }
    const appointmentAction = async (e, type) => {
        e.preventDefault()
        let data = {}
        if (type == 'status') {

            data = { type, labId: userId, appointmentId: actData.appointmentId, status: actData?.status, staff: actData?.staff }

            try {
                const response = await updateApiData(`api/hospital/lab-action`, data);
                if (response.success) {
                    document.getElementById('closeStatus').click()
                    fetchLabAppointment()
                } else {
                    toast.error(response.message)
                }
            } catch (err) {
                toast.error(err?.response?.data?.message || "Something went wrong");;
            }
        }
        else if (type == 'payment') {

            data = { type, labId: userId, appointmentId: payData.appointmentId, paymentStatus: payData.paymentStatus }
            try {
                const response = await updateApiData(`appointment/lab/payment-action`, data);
                if (response.success) {
                    fetchLabAppointment()
                } else {
                    toast.error(response.message)
                }
            } catch (err) {
                toast.error(err?.response?.data?.message || "Something went wrong");;
            }
        }

    }
    const sendReport = async (appointmentId, email, type) => {
        const data = { appointmentId, email, type }
        try {
            const response = await securePostData(`lab/send-report`, data);
            if (response.success) {
                toast.success("Report sent")
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        }
    }

    const fetchStaff = async () => {
        try {
            const res = await getSecureApiData(`api/staff/list?limit=1000&status=active`);
            setStaffList(res.staffData);
        } catch (err) {
            toast.error("Failed to load staff");
        }
    };
    useEffect(() => {
        fetchLabAppointment()
    }, [currentPage])
    useEffect(() => {
        fetchStaff()
    }, [])
    const handleStatusChange = (value) => {
        setStatus((prev) =>
            prev.includes(value)
                ? prev.filter((s) => s !== value)
                : [...prev, value]
        );
    };
    const handleReset = () => {
        setStatus('')
        setStartDate('')
        setEndDate('')
        setCurrentPage(1)
    }
    const downloadAppointments = () => {
        if (!appointments || appointments.length === 0) {
            alert("No appointments to download");
            return;
        }

        // Map data for Excel
        const data = appointments.map((item, index) => ({
            "S.No": index + 1,
            "Patient Name": item?.patientId?.name || "-",
            "Patient ID": item?.patientId?.nh12 || item?.patientId?.unique_id || "-",
            "Appointment ID": item?.customId || "-",
            "Test(s)": item?.testId?.map(t => t.shortName).join(", ") || "-",
            "Appointment Date": item?.date
                ? new Date(item?.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                : "-",
            "Total Amount": item?.fees || "-",
            "Payment Status": item?.paymentStatus || "-",
            "Appointment Status": item?.status || "-"
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, "Lab_Appointments_List.xlsx");
    };
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2">Test Reports / Appoiments</h3>
                                <div className="admin-breadcrumb">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb custom-breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="#" className="breadcrumb-link">
                                                    Dashboard
                                                </a>
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page"
                                            >
                                                Test Reports / Appoiments
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>

                            <div className="add-nw-bx">
                                <Link
                                    to="/add-lab-appointment"
                                    className="nw-thm-btn"
                                >
                                    <FontAwesomeIcon icon={faCirclePlus} className="me-1" />
                                    Add Appointment
                                </Link>
                            </div>
                        </div>
                    </div>


                    <div className="new-panel-card">
                        <div className="row">
                            <div className="d-flex align-items-center justify-content-between mb-3 gap-2 nw-box ">
                                <div>
                                    <div className="d-flex align-items-center gap-2 ">
                                        <div className="custom-frm-bx mb-0">
                                            <input
                                                type="email"
                                                className="form-control  search-table-frm pe-5"
                                                id="email"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder="Enter patient name or id"
                                                required
                                                onKeyDown={(e) => {
                                                    if (e.key == "Enter") {
                                                        fetchLabAppointment()
                                                    }
                                                }}
                                            />
                                            <div className="adm-search-bx">
                                                <button className="text-secondary" onClick={() => fetchLabAppointment()}>
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
                                                    <a href="#" className="fz-16 clear-btn" onClick={() => handleReset()}>Reset</a>
                                                </div>

                                                <div className="p-3">
                                                    <ul className="filtring-list mb-3" onClick={(e) => e.stopPropagation()}>
                                                        <h6>Status</h6>
                                                        {["pending", "approved", "deliver-report", "pending-report", "cancel", "rejected"].map((item, key) => (
                                                            <li key={key}>
                                                                <div className="form-check new-custom-check">
                                                                    <input className="form-check-input" type="checkbox" id={item}
                                                                        checked={status == item}
                                                                        onChange={() => setStatus(item)} />
                                                                    <label className="form-check-label text-capitalize" htmlFor={item}>{item}</label>
                                                                </div>
                                                            </li>))}

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
                                                    <a href="javascript:void(0)" onClick={() => fetchLabAppointment()} className="thm-btn rounded-4 px-4 py-2"> Apply</a>
                                                </div>

                                            </div>
                                        </div>
                                        <div>
                                            <button className="nw-filtr-btn" onClick={downloadAppointments}><FontAwesomeIcon icon={faDownload} /></button>
                                        </div>

                                    </div>
                                </div>

                                {totalPages > 1 && <div className="page-selector d-flex align-items-center mb-2 mb-md-0 gap-2">
                                    <div>
                                        <select
                                            className="form-select custom-page-dropdown nw-custom-page"
                                            name="currentPage"
                                            value={currentPage}
                                            onChange={(e) => setCurrentPage(e.target.value)}
                                        >
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
                                <div className="table-section ">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>S.no.</th>
                                                    <th>Patient Details</th>
                                                    <th>Appointment ID</th>
                                                    <th>Test</th>
                                                    <th>Payment Status</th>
                                                    <th>Appointment Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {appointments?.length > 0 ?
                                                    appointments?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{key + 1}</td>
                                                            <td>
                                                                <div className="admin-table-bx">
                                                                    <div className="admin-table-sub-bx">
                                                                        <img src={item?.patientId?.patientId?.profileImage ?
                                                                            `${base_url}/${item?.patientId?.patientId?.profileImage}` : "/profile.png"} alt="" />
                                                                        <div className="admin-table-sub-details">
                                                                            <h6>{item?.patientId?.name} </h6>
                                                                            <p>ID: {item?.patientId?.nh12 || item?.patientId?.unique_id}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <ul className="admin-appointment-list">
                                                                    <li className="admin-appoint-item">
                                                                        <span className="admin-appoint-id">
                                                                            Appointment ID : #{item?.customId}
                                                                        </span>
                                                                    </li>
                                                                    <li className="admin-appoint-item">
                                                                        Appointment Book Date : {item?.date ? new Date(item?.date)?.toLocaleDateString('en-GB', {
                                                                            day: '2-digit',
                                                                            month: 'short',
                                                                            year: 'numeric'
                                                                        }) : '-'}
                                                                    </li>
                                                                    <li className="admin-appoint-item">
                                                                        Total Amount : ₹{item?.fees}
                                                                    </li>
                                                                </ul>
                                                            </td>
                                                            <td>
                                                                <ul className="admin-test-list">
                                                                    {item?.tests?.map((test, key) =>
                                                                        <li className="admin-test-item" key={key}>{test?.category?.name}</li>)}
                                                                    {/* <li className="admin-test-item">Haemoglobin</li> */}
                                                                </ul>
                                                            </td>
                                                            <td>
                                                                <ul className="admin-paid-list ">
                                                                    <li>
                                                                        <span className={`paid text-capitalize ${item?.paymentStatus === 'due' && 'due'}`}>{item?.paymentStatus}</span>
                                                                    </li>
                                                                    <li>
                                                                        <a
                                                                            href="javascript:void(0)"
                                                                            onClick={() => setPayData({ appointmentId: item?._id, paymentStatus: item?.paymentStatus })}
                                                                            className="edit-btn" data-bs-toggle="modal" data-bs-target="#payment-Status"
                                                                        >
                                                                            <FontAwesomeIcon icon={faPen} />
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </td>
                                                            <td>
                                                                <ul className="admin-paid-list">
                                                                    <li>
                                                                        <span className="paid text-capitalize">
                                                                            {item?.status}
                                                                        </span>
                                                                    </li>
                                                                    <li>
                                                                        <a
                                                                            href="javascript:void(0)"
                                                                            onClick={() => {
                                                                                setActiveData(item)
                                                                                setActData({ appointmentId: item?._id, status: item?.status, staff: item?.staff })
                                                                            }}
                                                                            className="edit-btn" data-bs-toggle="modal" data-bs-target="#appointment-Status"
                                                                        >
                                                                            <FontAwesomeIcon icon={faPen} />
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </td>
                                                            <td>
                                                                <a
                                                                    href="javascript:void(0)"
                                                                    className=" admin-sub-dropdown dropdown-toggle"
                                                                    data-bs-toggle="dropdown"
                                                                    aria-expanded="false"
                                                                >
                                                                    <FontAwesomeIcon icon={faGear} /> Action
                                                                </a>

                                                                <div className="dropdown position-static">
                                                                    <a
                                                                        href="javascript:void(0)"
                                                                        className="attendence-edit-btn"
                                                                        id="acticonMenu1"
                                                                        data-bs-toggle="dropdown"
                                                                        aria-expanded="false"
                                                                    >
                                                                        {/* <i className="fas fa-pen"></i> */}
                                                                    </a>
                                                                    <ul
                                                                        className="dropdown-menu dropdown-menu-end user-dropdown tble-action-menu "
                                                                        aria-labelledby="acticonMenu1"
                                                                    >
                                                                        {item?.status == 'deliver-report' && <li className="drop-item">
                                                                            <Link
                                                                                className="dropdown-item"
                                                                                to={`/test-report/${item._id}`}
                                                                            >
                                                                                <FontAwesomeIcon icon={faFlask} />
                                                                                Edit Report
                                                                            </Link>
                                                                        </li>}
                                                                        <li className="drop-item">
                                                                            <Link className="dropdown-item" to={`/patient-view/${item?.patientId?._id}`}>
                                                                                <FontAwesomeIcon icon={faUserAltSlash} />
                                                                                Patient Details
                                                                            </Link>
                                                                        </li>
                                                                        <li className="drop-item">
                                                                            <Link className="dropdown-item" to={`/appointment-details/${item?._id}`}>
                                                                                <FontAwesomeIcon icon={faFlaskVial} />
                                                                                Appointment Details
                                                                            </Link>
                                                                        </li>

                                                                        {(item?.status !== 'rejected' && item?.status !== 'cancel' &&
                                                                            item?.status !== 'deliver-report') && <li className="drop-item">
                                                                                <NavLink to={`/generate-report/${item?._id}`} className="dropdown-item" href="#">
                                                                                    <FontAwesomeIcon icon={faFileAlt} />
                                                                                    Generate Report
                                                                                </NavLink>
                                                                            </li>}

                                                                        {(item?.status !== 'rejected' && item?.status !== 'cancel') && <li className="drop-item">
                                                                            <NavLink to={`/label/${item?._id}`} className="dropdown-item" href="#">
                                                                                <FontAwesomeIcon icon={faBarcode} />
                                                                                Labels
                                                                            </NavLink>
                                                                        </li>}
                                                                        {(item?.status !== 'rejected' && item?.status !== 'cancel') && <li className="drop-item">
                                                                            <NavLink to={`/sample/${item?._id}`} className="dropdown-item" href="#">
                                                                                <FontAwesomeIcon icon={faSyringe} />
                                                                                Collection
                                                                            </NavLink>
                                                                        </li>}

                                                                        {item?.status == 'deliver-report' && <li className="drop-item">
                                                                            <NavLink to={`/view-report/${item?._id}`} className="dropdown-item" href="#">
                                                                                <FontAwesomeIcon icon={faFileArchive} />
                                                                                Report  view
                                                                            </NavLink>
                                                                        </li>}
                                                                        {item?.status == 'deliver-report' && <li className="drop-item">
                                                                            <NavLink to={`/invoice/${item?._id}`} className="dropdown-item" href="#">
                                                                                <FontAwesomeIcon icon={faFileEdit} />
                                                                                Invoice
                                                                            </NavLink>
                                                                        </li>}
                                                                        {(item?.status === 'pending-report' || item?.status === 'deliver-report') && <>
                                                                            {item?.doctorId && <li className="drop-item">
                                                                                <button className="dropdown-item" onClick={() => sendReport(item?._id, item?.doctorId?.email, 'doctor')}>
                                                                                    <FontAwesomeIcon icon={faUserDoctor} />
                                                                                    Send  Report Doctor
                                                                                </button>
                                                                            </li>}
                                                                            <li className="drop-item">
                                                                                <button className="dropdown-item" onClick={() => sendReport(item?._id, item?.patientId?.email, 'patient')}>
                                                                                    <FontAwesomeIcon icon={faBriefcase} />
                                                                                    Send  Report Patient
                                                                                </button>
                                                                            </li>
                                                                        </>}
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
                        </div>
                    </div>
                    <div className="text-end mt-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="nw-thm-btn outline"
                        >
                            Go Back
                        </button>
                    </div>


                </div>}


            {/*Payment Status Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#payment-Status" */}
            <div className="modal step-modal" id="payment-Status" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-5 p-4">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="lg_title mb-0">Payment Status</h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close">
                                    <FontAwesomeIcon icon={faClose} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body p-0">
                            <div className="row ">
                                <form onSubmit={(e) => appointmentAction(e, 'payment')} className="col-lg-12 mt-5">
                                    <div className="custom-frm-bx">
                                        <label htmlhtmlFor="">Status</label>
                                        <select name="paymentStatus" value={payData.paymentStatus}
                                            onChange={(e) => setPayData({ ...payData, paymentStatus: e.target.value })}
                                            className="form-select nw-control-frm">
                                            <option value="due">Due</option>
                                            <option value="paid">Paid</option>

                                        </select>
                                    </div>

                                    <div>
                                        <button type="submit" className="nw-thm-btn w-100" data-bs-dismiss="modal"> Submit</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Payment Status Popup End */}


            {/*Appointment Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#appointment-Status" */}
            <div className="modal step-modal" id="appointment-Status" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-5 p-4">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="lg_title mb-0">Appointment Status</h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" id="closeStatus" aria-label="Close">
                                    <FontAwesomeIcon icon={faClose} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body p-0">
                            <form className="row" onSubmit={(e) => appointmentAction(e, 'status')}>
                                <div className="col-lg-12 mt-3">
                                    <div className="custom-frm-bx">
                                        <label htmlhtmlFor="">Status</label>
                                        <select name="status" value={actData.status}
                                            onChange={(e) => setActData({ ...actData, status: e.target.value })} className="form-select nw-control-frm">
                                            <option value="pending" >Pending</option>
                                            <option value="cancel" disabled>Cancel</option>
                                            <option value="approved" >Approved</option>
                                            <option value="rejected" >Rejected</option>
                                            <option value="report-pending">Pending Report</option>
                                            <option value="deliver-report">Deliver Report</option>
                                        </select>
                                    </div>


                                </div>

                                <div className="col-lg-12">
                                    <div className="custom-frm-bx">
                                        <label htmlhtmlFor="">Select Doctor</label>
                                        <select className="form-select nw-control-frm" value={actData.staff} onChange={(e) => setActData({ ...actData, staff: e.target.value })}>
                                            <option>----Select Doctor----</option>
                                            {staffList?.map((item, key) =>
                                                <option value={item?.userId?._id}>{item?.userId?.name}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <button type="submit" className="nw-thm-btn w-100"> Submit</button>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Appointment Popup End */}
        </>
    )
}

export default TestReportsAppointment