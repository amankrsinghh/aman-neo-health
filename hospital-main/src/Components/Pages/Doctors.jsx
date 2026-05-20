import { TbGridDots } from "react-icons/tb";
import { faDownload, faFilter, faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { data, Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";
import base_url from "../../baseUrl";
import Loader from "../Common/Loader";
import { useSelector } from "react-redux";
import { specialtyOptions } from "../../Service/globalFunction";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getSecureApiData } from "../../Service/api";
import DoctorEmpanelmentCert from "../../All Template file/Doctor Empanelment Certificate";
function Doctors() {
    const { permissions, isOwner } = useSelector(state => state.user)
    const [staffList, setStaffList] = useState([]);
    const [page, setPage] = useState(1);
    const user=JSON.parse(localStorage.getItem('user'))
    const userId=user.id
    const [limit, setLimit] = useState(6);
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false)
    const [departments, setDepartments] = useState([])
    const [deptList, setDeptList] = useState([])
    const [doctorStatus, setDoctorStatus] = useState([])
    const [pdfLoading,setPdfLoading]=useState(false)
    const navigate = useNavigate()
    const fetchStaff = async (dept = departments, status = doctorStatus) => {
        setLoading(true)
        try {
            const res = await api.get(`/hospital-doctor/list?page=${page}&limit=${limit}&search=${search}&doctorStatus=${status}&departments=${dept}`);
            if (res.data.success) {

                setStaffList(res.data.data);
                setPagination(res.data.pagination);
            } else {
                toast.error(res.data.message)
            }
        } catch (err) {
            toast.error("Failed to load staff");
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [page, limit]);

    useEffect(() => {
        fetchDepartments()
    }, [])
    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const res = await getSecureApiData("api/department/list?limit=100");
            setDeptList(res.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteDoctor = async (doctorId) => {
        if (!window.confirm("Are you sure you want to delete this doctor?")) {
            return;
        }

        try {
            const res = await api.delete(`/hospital-doctor/${doctorId}`);
            if (res.data.success) {

                toast.success("Doctor deleted successfully");
                // list refresh
                fetchStaff();
            } else {
                toast.error(res.data.message)
            }

        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to delete doctor"
            );
        }
    };
    const downloadDoctors = () => {

        const data = staffList.map((doc, index) => ({
            No: (page - 1) * limit + index + 1,
            Name: doc?.doctorId?.name || "",
            Specialty: doc?.doctorAbout?.specialty?.name || "-",
            Patients: doc?.uniquePatientCount || 0,
            Contact: doc?.doctorId?.contactNumber || "",
            Email: doc?.doctorId?.email || "",
            Status: doc?.employement?.status || ""
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Doctors");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const fileData = new Blob([excelBuffer], {
            type: "application/octet-stream"
        });

        saveAs(fileData, "Doctors_List.xlsx");
    };
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row ">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Doctors</h3>
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
                                                Doctors
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                            <div className="add-nw-bx">
                                {(isOwner || permissions?.doctors?.add) && (
                                    <NavLink to="/new-doctor" className="add-nw-btn nw-thm-btn">
                                        <img src="/plus-icon.png" alt="" /> Add Doctor
                                    </NavLink>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='new-panel-card'>
                        <div className="row">
                            <div className="d-flex align-items-center justify-content-between mb-3 gap-2 nw-box mobile-hospital-box">
                                <div className="d-flex align-items-center gap-2 ">
                                    <div className="custom-frm-bx mb-0">
                                        <input
                                            type="text"
                                            className="form-control  search-table-frm pe-5"
                                            placeholder="Search"
                                            value={search}
                                            onChange={(e) => {
                                                setPage(1);
                                                setSearch(e.target.value);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    fetchStaff();
                                                }
                                            }}
                                        />
                                        <div className="adm-search-bx">
                                            <button className="text-secondary" onClick={fetchStaff}>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* <div>
                                        <button className="nw-filtr-btn"><FontAwesomeIcon icon={faFilter}/></button>
                                    </div> */}
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
                                                <button type="button" className="fz-16 clear-btn" onClick={() => {
                                                    setDepartments([])
                                                    setDoctorStatus([])
                                                    setTimeout(() => {
                                                        fetchStaff([], [])
                                                    }, 500)
                                                }} >Reset</button >
                                            </div>

                                            <div className="p-3 doctor-speciality">
                                                <ul className="filtring-list mb-3" onClick={(e) => e.stopPropagation()}>
                                                    <h6>Departments</h6>

                                                    {deptList?.map((item, index) => (
                                                        <li key={index}>
                                                            <div className="form-check new-custom-check">

                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    value={item?._id}
                                                                    id={`specialty-${index}`}
                                                                    checked={departments.includes(item._id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setDepartments([...departments, item._id]);
                                                                        } else {
                                                                            setDepartments(
                                                                                departments.filter(s => s !== item._id)
                                                                            );
                                                                        }
                                                                    }}
                                                                />

                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor={`specialty-${index}`}
                                                                >
                                                                    {item?.departmentName}
                                                                </label>

                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <ul className="filtring-list mb-3" onClick={(e) => e.stopPropagation()}>
                                                    <h6>Status</h6>
                                                    <li>
                                                        <div className="form-check new-custom-check">
                                                            <input className="form-check-input" checked={doctorStatus?.includes("active")}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setDoctorStatus([...doctorStatus, "active"]);
                                                                    } else {
                                                                        setDoctorStatus(
                                                                            doctorStatus.filter(s => s !== "active")
                                                                        );
                                                                    }
                                                                }}
                                                                value={"active"} type="checkbox" id="active" />
                                                            <label className="form-check-label" htmlFor="active">Active</label>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="form-check new-custom-check">
                                                            <input className="form-check-input" checked={doctorStatus?.includes("inactive")}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setDoctorStatus([...doctorStatus, "inactive"]);
                                                                    } else {
                                                                        setDoctorStatus(
                                                                            doctorStatus.filter(s => s !== "inactive")
                                                                        );
                                                                    }
                                                                }}
                                                                value={"inactive"} type="checkbox" id="inactive" />
                                                            <label className="form-check-label" htmlFor="inactive">Inactive</label>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="form-check new-custom-check">
                                                            <input className="form-check-input" checked={doctorStatus?.includes("onleave")}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setDoctorStatus([...doctorStatus, "onleave"]);
                                                                    } else {
                                                                        setDoctorStatus(
                                                                            doctorStatus.filter(s => s !== "onleave")
                                                                        );
                                                                    }
                                                                }}
                                                                value={"onleave"} type="checkbox" id="leave" />
                                                            <label className="form-check-label" htmlFor="leave">On Leave</label>
                                                        </div>
                                                    </li>

                                                </ul>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-top">
                                                <button type="button" className="thm-btn thm-outline-btn rounded-4 px-4 py-2 outline"> Cancel</button>
                                                <button type="button" onClick={() => fetchStaff()} className="thm-btn rounded-4 px-4 py-2"> Apply</button>
                                            </div>

                                        </div>
                                    </div>
                                    <div>
                                        <button className="nw-filtr-btn" onClick={downloadDoctors}><FontAwesomeIcon icon={faDownload} /></button>
                                    </div>
                                </div>
                                {pagination?.totalPages > 1 && <div className="page-selector">
                                    <div className="filters p-0">
                                        <select className="form-select custom-page-dropdown nw-custom-page "
                                            value={page}
                                            onChange={(e) => setPage(e.target.value)}>
                                            {Array.from({ length: pagination?.totalPages }, (_, i) => (
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
                                                    <th>Name</th>
                                                    <th>Specialty</th>
                                                    <th>Patients</th>
                                                    {/* <th>Experience</th> */}
                                                    <th>Contact</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {staffList?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="8" className="text-center">
                                                            No doctors found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    staffList?.map((doc, index) => (
                                                        <tr key={doc._id}>
                                                            <td>{(page - 1) * limit + index + 1}.</td>

                                                            <td>
                                                                <div className="admin-table-bx">
                                                                    <div className="admin-table-sub-bx">
                                                                        <img
                                                                            src={
                                                                                doc?.doctorId?.profileImage
                                                                                    ? `${base_url}/${doc?.doctorId?.profileImage}`
                                                                                    : "/profile.png"
                                                                            }

                                                                            alt=""
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = "/profile.png";
                                                                            }}
                                                                        />
                                                                        <div className="admin-table-sub-details">
                                                                            <h6>{doc?.name}</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td>{doc?.doctorAbout?.specialty?.name || "-"}</td>
                                                            <td>{doc?.uniquePatientCount || 0}</td>
                                                            {/* <td>{doc?.professionalInfo?.experience ? `${doc?.professionalInfo?.experience} years` : "-"}</td> */}

                                                            <td>
                                                                <ul className="ad-info-list">
                                                                    <li className="ad-info-item">{doc?.contactNumber}</li>
                                                                    <li className="ad-info-item">{doc?.email}</li>
                                                                </ul>
                                                            </td>
                                                            <td>
                                                                {/* <span
                                                                    className={`approved  ${doc?.employement?.status === "Active"
                                                                        ? "approved-active "
                                                                        : doc?.status === "On Leeave "
                                                                            ? "leaved"
                                                                            : "inactive "
                                                                        }`}
                                                                >
                                                                    {doc?.employement?.status}
                                                                </span> */}
                                                                <span
                                                                    className={`approved ${doc?.employement?.status === "active"
                                                                            ? "approved-active"
                                                                            : doc?.employement?.status === "onleave"
                                                                                ? "approved-active leaved"
                                                                                : "approved-active inactive"
                                                                        }`}
                                                                >
                                                                    {doc?.employement?.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="dropdown position-static">
                                                                    <a
                                                                        href="#"
                                                                        className="grid-dots-btn"
                                                                        data-bs-toggle="dropdown"
                                                                    >
                                                                        <TbGridDots />
                                                                    </a>
                                                                    <ul className="dropdown-menu dropdown-menu-end admin-dropdown-card">
                                                                        <li className="prescription-item">
                                                                            <NavLink
                                                                                to={`/doctor-view/${doc._id}`}
                                                                                className="prescription-nav"
                                                                            >
                                                                                View profile
                                                                            </NavLink>
                                                                        </li>
                                                                        <li className="prescription-item">
                                                                            <NavLink
                                                                                to={`/edit-doctor-data/${doc._id}`}
                                                                                className="prescription-nav"
                                                                            >
                                                                                Edit details
                                                                            </NavLink>
                                                                        </li>
                                                                        <li className="prescription-item">
                                                                            <NavLink
                                                                                to={`/doctor-slots/${doc._id}`}
                                                                                className="prescription-nav"
                                                                            >
                                                                                Slots
                                                                            </NavLink>
                                                                        </li>
                                                                        <li className="prescription-item">
                                                                            <button
                                                                                onClick={()=>setPdfLoading(doc?._id)}
                                                                                className="prescription-nav"
                                                                            >
                                                                                {pdfLoading==doc?._id?'Downloading...':'Download'} Empanelment 
                                                                            </button>
                                                                        </li>
                                                                        {/* <li>
                                                            <a className="prescription-nav" href="#">
                                                            Inactivate
                                                            </a>
                                                        </li> */}
                                                                        {/* <li>
                                                                            <a
                                                                                href="#"
                                                                                className="prescription-nav text-danger"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    handleDeleteDoctor(doc._id);
                                                                                }}
                                                                            >
                                                                                Delete
                                                                            </a>
                                                                        </li> */}
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
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
                    <div className="d-none">
                             <DoctorEmpanelmentCert hospitalId={userId} doctorId={pdfLoading} pdfLoading={pdfLoading} endLoading={()=>setPdfLoading(false)}/>                   
                    </div>
                </div>}
        </>
    )
}

export default Doctors