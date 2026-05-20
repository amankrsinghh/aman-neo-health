import { TbGridDots } from "react-icons/tb";
import { faDownload, faFilter, faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";
import Loader from "../Common/Loader";
import { Link, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import base_url from "../../baseUrl";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import HospitalConsentLetter from "../../All Template file/ConsentLetter";
function PatientsEmergency() {
    const [patients, setPatients] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('')
    const [consentData,setConsentData]=useState()

    const fetchPatients = async (ptStatus = status) => {
        try {
            setLoading(true);
            const res = await API.get(`/patients/list?deptType=EMERGENCY&status=Active`, {
                params: { page, limit, search }
            });
            if (res.data?.success) {

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
        } catch (error) {
            console.log(error)
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
            const res=await API.put(`/patients/${id}`, {
                status: status === "Active" ? "Inactive" : "Active",
                ptDeptId: id,
                patientId
            });
            if(!res.data.success){
                toast.error(res.data.message)
            }else{
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

        saveAs(fileData, "OPD_Patients_List.xlsx");
    };

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
                                <NavLink to="/add-patient?type=EMERGENCY" className="add-nw-btn nw-thm-btn">
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
                                        </div>
                                        <div>
                                            <button className="nw-filtr-btn" onClick={downloadPatients}><FontAwesomeIcon icon={faDownload}  /></button>
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
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patients.length === 0 && (
                                                    <tr>
                                                        <td colSpan="5" className="text-center">
                                                            No patients found
                                                        </td>
                                                    </tr>
                                                )}

                                                {patients.map((p, index) => (
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
                                                            <span className={`approved ${p?.departmentInfo?.status === "Active" ? "approved-active" : "approved-active inactive"}`}>
                                                                {p?.departmentInfo?.status}
                                                            </span>
                                                        </td>

                                                        <td>
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
                                                                            onClick={() => toggleStatus(p?._id,p?.departmentInfo?._id, p?.departmentInfo?.status)}
                                                                        >
                                                                            {p?.departmentInfo?.status === "Active" ? "Inactivate" : "Activate"}
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a
                                                                            className="prescription-nav "
                                                                            href="#"
                                                                            onClick={() => setConsentData(p?.nh12)}
                                                                        >
                                                                            {consentData?"Downloading":'Consent letter'}
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
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
                    <div className="d-none">
                    <HospitalConsentLetter patientId={consentData} handleConsent={()=>setConsentData()}/>
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


export default PatientsEmergency