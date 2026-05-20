import { TbGridDots } from "react-icons/tb";
import { faChevronRight, faDownload, faFilter, faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";
import Loader from "../Common/Loader";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import base_url from "../../baseUrl";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DailyIPDNotes from "./DailyIPDNotes";
import AllotmentPayment from "./AllotmentPayment";
import AddAllotmentTest from "./AddAllotmentTest";
import DepartmentTransfer from "./DepartmentTransfer";
import HospitalConsentLetter from "../../All Template file/ConsentLetter";
import PatientConsentForm from "../../All Template file/patient_consent_form_react_component";
function PatientsIPD() {
    const [patients, setPatients] = useState([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate()
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('')
    const [selectedAllotment, setSelectedAllotment] = useState()
    const [notesData, setNotesData] = useState({ allotmentId: null })
    const [openDailyNotes, setOpenDailyNotes] = useState(false);
    const [consentData,setConsentData]=useState()
    const [pdfLoading,setPdfLoading]=useState(false)
    const [deptTransfer,setDepartmentTransfer]=useState({_id:null,departmentId:null,allotmentId:null})
    const fetchPatients = async (ptStatus = status) => {
        try {
            setLoading(true);
            const res = await API.get(`/hospital/ipd-patient?deptType=IPD&status=Active`, {
                params: { page, limit, search }
            });
            if (res.data.success) {
                setPatients(res.data.data);
                setPagination(res.data.pagination);
                setTotalPages(res.data.pagination.totalPages)
            } else {
                toast.error(res.data.message)

            }
        } catch (err) {
            console.log(err)
            toast.error("Failed to load patients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [page, limit,]);


    const deletePatient = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This patient will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (!result.isConfirmed) return;

        try {
            await API.delete(`/patients/${id}`);
            toast.success("Patient deleted successfully");
            fetchPatients();
        } catch {
            toast.error("Delete failed");
        }
    };


    const toggleStatus = async (patientId,id, status) => {
        const result = await Swal.fire({
            title: "Inactivate Patient?",
            text: "Patient will be marked inactive",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes"
        });
        if (!result.isConfirmed) return;
        try {
            const res = await API.put(`/patients/${id}`, {
                status: status === "Active" ? "Inactive" : "Active",
                ptDeptId: id,
                patientId
            });
            if (!res.data.success) {
                toast.error(res.data.message)
            } else {
                fetchPatients();
            }
        } catch {
            toast.error("Status update failed");
        }
    };

    const downloadPatients = () => {

        const data = patients.map((p, index) => ({
            No: (page - 1) * limit + index + 1,
            Name: p?.name || "",
            Patient_ID: p?.nh12 || p?.unique_id || "-",
            Contact: p?.patientUser?.contactNumber || "",
            Email: p?.email || "-",
            Status: p?.departmentInfo?.status || "-"
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const fileData = new Blob([excelBuffer], {
            type: "application/octet-stream"
        });

        saveAs(fileData, "IPD_Patients_List.xlsx");
    };

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
                    <div className="row ">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Patients</h3>
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
                                                Patients
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                            <div className="add-nw-bx">
                                <NavLink to="/add-patient?type=IPD" className="add-nw-btn nw-thm-btn">
                                    <img src="/plus-icon.png" alt="" /> Add Patient
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
                                                className="form-control search-table-frm pe-5"
                                                placeholder="Search patient"
                                                value={search}
                                                onChange={(e) => {
                                                    setPage(1);
                                                    setSearch(e.target.value);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        fetchPatients();
                                                    }
                                                }}
                                            />
                                            <div className="adm-search-bx">
                                                <button className="text-secondary" onClick={fetchPatients}>
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </button>
                                            </div>
                                        </div>
                                        {/* <div className="dropdown">
                                            <a href="#" className="nw-filtr-btn" id="acticonMenus" data-bs-toggle="dropdown"
                                                aria-expanded="false">
                                                <FontAwesomeIcon icon={faFilter} />
                                            </a>

                                            <div className="dropdown-menu dropdown-menu-end user-dropdown tble-action-menu"
                                                aria-labelledby="acticonMenus">
                                                <div
                                                    className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-bottom">
                                                    <h6 className="mb-0 fz-18">Filter</h6>
                                                    <button type="button" onClick={() => {
                                                        setStatus('')
                                                        fetchPatients('')
                                                    }} className="fz-16 clear-btn">Reset</button>
                                                </div>

                                                <div className="p-3">
                                                    <ul className="filtring-list mb-3" onClick={(e) => e.stopPropagation()}>
                                                        <h6>Status</h6>

                                                        <li>
                                                            <div className="form-check new-custom-check">
                                                                <input
                                                                    type="radio"
                                                                    name="status"
                                                                    id="active"
                                                                    className="form-check-input"
                                                                    checked={status === "Active"}
                                                                    onChange={() => setStatus("Active")}
                                                                />
                                                                <label className="form-check-label" htmlFor="active">
                                                                    Active
                                                                </label>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="form-check new-custom-check">
                                                                <input
                                                                    type="radio"
                                                                    name="status"
                                                                    className="form-check-input"
                                                                    id="inactive"
                                                                    checked={status === "Inactive"}
                                                                    onChange={() => setStatus("Inactive")}
                                                                />
                                                                <label className="form-check-label" htmlFor="inactive">
                                                                    Inactive
                                                                </label>
                                                            </div>
                                                        </li>

                                                    </ul>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-top">
                                                    <a href="javascript:void(0)" className="thm-btn thm-outline-btn rounded-4 px-4 py-2 outline"> Cancel</a>
                                                    <button type="button" className="thm-btn rounded-4 px-4 py-2" onClick={() => fetchPatients()}> Apply</button>
                                                </div>

                                            </div>
                                        </div> */}
                                        <div>
                                            <button className="nw-filtr-btn" onClick={downloadPatients} ><FontAwesomeIcon icon={faDownload} /></button>
                                        </div>

                                    </div>
                                </div>

                                {totalPages > 1 && <div className="page-selector">
                                    <div className="filters">
                                        <select className="form-select custom-page-dropdown nw-custom-page "
                                            value={page}
                                            onChange={(e) => setPage(e.target.value)}>
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
                                                    <th>Patient Details</th>
                                                    <th>Contact</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                    {/* <th>Allotment Action</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patients?.length === 0 && (
                                                    <tr>
                                                        <td colSpan="5" className="text-center">
                                                            No patients found
                                                        </td>
                                                    </tr>
                                                )}

                                                {patients?.map((p, index) => (
                                                    <tr key={p._id}>
                                                        <td>{(page - 1) * limit + index + 1}.</td>

                                                        <td>
                                                            <Link to={`/patient-view/${p?._id}`} className="admin-table-bx">
                                                                <div className="admin-table-sub-bx">
                                                                    <img src={p?.patientUser?.profileImage ?
                                                                        `${base_url}/${p?.patientUser?.profileImage}` : "/profile.png"} alt=""
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = "/profile.png";
                                                                        }} />
                                                                    <div className="admin-table-sub-details">
                                                                        <h6>{p.name}</h6>
                                                                        <p>{p?.nh12 || p?.unique_id}</p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </td>

                                                        <td>
                                                            <ul className="ad-info-list">
                                                                <li className="ad-info-item">{p?.patientUser?.contactNumber}</li>
                                                                <li className="ad-info-item">{p?.email || "-"}</li>
                                                            </ul>
                                                        </td>

                                                        <td>
                                                            <span style={{ cursor: 'pointer' }} onClick={() => toggleStatus(p?._id,p?.departmentInfo?._id, p?.departmentInfo?.status)} className={`approved ${p?.departmentInfo?.status === "Active" ? "approved-active" : " approved-active inactive"}`}>
                                                                {p?.departmentInfo?.status}
                                                            </span>
                                                        </td>

                                                        {/* <td>
                                                            <div className="dropdown position-static">
                                                                <a className="grid-dots-btn" data-bs-toggle="dropdown">
                                                                    <TbGridDots />
                                                                </a>

                                                                <ul className="dropdown-menu dropdown-menu-end admin-dropdown-card">
                                                                    <li className="prescription-item">
                                                                        <NavLink className="prescription-nav" to={`/patient-view/${p._id}`}>
                                                                            View profile
                                                                        </NavLink>
                                                                    </li>
                                                                    <li className="prescription-item">
                                                                        <NavLink className="prescription-nav" to={`/patients/edit/${p._id}`}>
                                                                            Edit details
                                                                        </NavLink>
                                                                    </li>
                                                                    <li className="prescription-item">
                                                                        <a
                                                                            className="prescription-nav"
                                                                            href="#"
                                                                            onClick={() => toggleStatus(p._id, p?.departmentInfo?.status)}
                                                                        >
                                                                            {p?.departmentInfo?.status === "Active" ? "Inactivate" : "Activate"}
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </td> */}
                                                        <td>
                                                            {p?.departmentInfo?.allotmentId ?
                                                                <a className="grid-dots-btn" onClick={() => setSelectedAllotment(p?.allotmentInfo)} href="#"
                                                                    data-bs-toggle="modal" data-bs-target="#bed-Option">
                                                                    <TbGridDots />
                                                                </a> : <Link to={`/bed-management?patientId=${p?._id}`} className="nw-thm-btn">Allot Bed</Link>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>



                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-end mt-4">
                        <Link
                            to={-1}
                            className="nw-thm-btn outline"
                        >
                            Go Back
                        </Link>
                    </div>
                </div>}
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
                                                    onClick={(e)=>{
                                                        e.preventDefault()
                                                        setDepartmentTransfer({_id:selectedAllotment?.bedId,
                                                            allotmentId:selectedAllotment?._id,
                                                            departmentId:selectedAllotment?.departmentId
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
                                    <li className="bed-list-item">
                                        <button onClick={() =>setPdfLoading(true)
                                            
                                        }
                                            className="bed-nav-link" >
                                            {pdfLoading?"Downloading...":"Consent Letter"}
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
            <AllotmentPayment allotmentId={selectedAllotment?._id} getData={fetchPatients} />
            <DepartmentTransfer data={deptTransfer} getData={fetchPatients} />
            <div className="d-none">

            <PatientConsentForm insertId={selectedAllotment?.patientDepartment} pdfLoading={pdfLoading} endLoading={()=>setPdfLoading(false)}/>
            </div>
        </>
    )
}


export default PatientsIPD