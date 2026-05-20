import { TbGridDots } from "react-icons/tb";
import { faCheck, faDownload, faFilter, faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { getSecureApiData, updateApiData } from "../../Service/api";
import { toast } from "react-toastify";
import { formatDateTime } from "../../Service/globalFunction";
import base_url from "../../baseUrl";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Loader from "../Common/Loader";
import { fetchEmpDetail } from "../../redux/features/userSlice";
function AppointmentRequest() {
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    const dispatch = useDispatch()
    const [appointmentRequest, setAppintmentRequest] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const { staffUser } = useSelector(state => state.user)
    const [doctorId, setDoctorId] = useState('')
    const [status, setStatus] = useState('pending')
    async function getAppointmentData(apStatus = status) {
        setLoading(true)
        try {
            const result = await getSecureApiData(`appointment/hospital/${userId}?status=${apStatus}&doctorId=${doctorId}`)
            if (result.success) {
                setAppintmentRequest(result.data)
                setCurrentPage(result.pagination.curretPage)
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
    }, [userId, doctorId])
    useEffect(() => {
        dispatch(fetchEmpDetail(localStorage.getItem("staffId")))
    }, [])
    useEffect(() => {
        if (staffUser?.role == "doctor") {
            setDoctorId(staffUser?._id)
        }
    }, [staffUser])
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
    return (
        <>
            {loading?<Loader/>
            :<div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div>
                        <h3 className="innr-title mb-2 gradient-text">Appointment Request</h3>
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
                                        Appointment Request
                                    </li>
                                </ol>
                            </nav>
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
                                            type="email"
                                            className="form-control  search-table-frm pe-5"
                                            id="email"
                                            placeholder="Search"
                                            required
                                        />
                                        <div className="adm-search-bx">
                                            <button className="text-secondary">
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
                                                <button className="fz-16 clear-btn" onClick={() => {
                                                    setStatus('pending')
                                                    getAppointmentData("pending")
                                                }}>Reset</button>
                                            </div>

                                            <div className="p-3">
                                                <ul className="filtring-list mb-3" onClick={(e) => e.stopPropagation()}>
                                                    <h6>Status</h6>
                                                    {["pending", "rejected", "cancel"].map((item) => (
                                                        <li key={item}>
                                                            <div className="form-check new-custom-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    id={item}
                                                                    checked={status == item}
                                                                    onChange={() => setStatus(item)}
                                                                />
                                                                <label htmlFor={item} className="form-check-label">
                                                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                                                </label>
                                                            </div>
                                                        </li>
                                                    ))}

                                                </ul>
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
                                                        <td>{item?.status == 'pending' ? <span className="approved approved-active leaved">Pending </span>
                                                            : <span className="approved approved-active inactive text-capitalize">{item?.status} </span>}</td>
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

                                                                    <li className="prescription-item">
                                                                        <button className=" prescription-nav " onClick={() => appointmentAction(item, 'approved')}>

                                                                            <span className="text-success"> <FontAwesomeIcon icon={faCheck} />  Mark as in progress</span>
                                                                        </button>
                                                                    </li>

                                                                    <li className="prescription-item">
                                                                        <button onClick={() => appointmentAction(item, 'rejected')} className=" prescription-nav " href="#">

                                                                            <span className="text-danger"> Cancel appointment</span>
                                                                        </button>
                                                                    </li>
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
                <div className="text-end mt-4">
                    <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                </div>

            </div>}
        </>
    )
}

export default AppointmentRequest