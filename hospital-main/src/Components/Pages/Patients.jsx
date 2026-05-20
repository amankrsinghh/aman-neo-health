import { TbGridDots } from "react-icons/tb";
import { faDownload, faFilter, faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loader from "../Common/Loader";

function Patients() {
    const [patients, setPatients] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const res = await api.get("/patients/list", {
                params: { page, limit, search }
            });
            setPatients(res.data.data);
            setPagination(res.data.pagination);
            setTotalPages(res.data.pagination.totalPages)
        } catch (err) {
            console.log(err)
            toast.error("Failed to load patients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [page, limit, ]);


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
            await api.delete(`/patients/${id}`);
            toast.success("Patient deleted successfully");
            fetchPatients();
        } catch {
            toast.error("Delete failed");
        }
    };


    const toggleStatus = async (id, status) => {
        const result = await Swal.fire({
            title: "Inactivate Patient?",
            text: "Patient will be marked inactive",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes"
        });
        if (!result.isConfirmed) return;
        try {
            await api.put(`/patients/${id}`, {
                status: status === "Active" ? "Inactive" : "Active",
                patientId:id
            });
            fetchPatients();
        } catch {
            toast.error("Status update failed");
        }
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
                                <NavLink to="/add-patient" className="add-nw-btn nw-thm-btn">
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
                                            />
                                            <div className="adm-search-bx">
                                                <button className="text-secondary" onClick={()=>fetchPatients()}>
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
                                                    <a href="#" className="fz-16 clear-btn">Reset</a>
                                                </div>

                                                <div className="p-3">
                                                    <ul className="filtring-list mb-3">
                                                        <h6>Status</h6>
                                                        <li>
                                                            <div className="form-check new-custom-check">
                                                                <input className="form-check-input" type="checkbox" id="active" />
                                                                <label className="form-check-label" for="cardiology">active</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="form-check new-custom-check">
                                                                <input className="form-check-input" type="checkbox" id="inactive" />
                                                                <label className="form-check-label" for="inactive">Inactive</label>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-top">
                                                    <a href="javascript:void(0)" className="thm-btn thm-outline-btn rounded-4 px-4 py-2 outline"> Cancel</a>
                                                    <a href="javascript:void(0)" className="thm-btn rounded-4 px-4 py-2"> Apply</a>
                                                </div>

                                            </div>
                                        </div>
                                        <div>
                                            <button className="nw-filtr-btn"><FontAwesomeIcon icon={faDownload} /></button>
                                        </div>

                                    </div>
                                </div>

                                {totalPages > 1 && <div className="page-selector">
                                    <div className="filters">
                                        <select className="form-select custom-page-dropdown nw-custom-page "
                                            value={page}
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
                                                            <div className="admin-table-bx">
                                                                <div className="admin-table-sub-bx">
                                                                    <img src="/admin-tb-logo.png" alt="" />
                                                                    <div className="admin-table-sub-details">
                                                                        <h6>{p.name}</h6>
                                                                        <p>{p?.nh12}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <ul className="ad-info-list">
                                                                <li>{p?.patientUser?.contactNumber}</li>
                                                                <li>{p?.email || "-"}</li>
                                                            </ul>
                                                        </td>

                                                        <td>
                                                            <span className={`approved ${p?.departmentInfo[0]?.status === "Active" ? "approved-active" : "inactive"}`}>
                                                                {p?.departmentInfo[0]?.status}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <div className="dropdown">
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
                                                                            onClick={() => toggleStatus(p._id, p?.departmentInfo[0]?.status)}
                                                                        >
                                                                            {p?.departmentInfo[0]?.status === "Active" ? "Inactivate" : "Activate"}
                                                                        </a>
                                                                    </li>
                                                                    <li className="prescription-item">
                                                                        <a
                                                                            className="prescription-nav text-danger"
                                                                            href="#"
                                                                            onClick={() => deletePatient(p._id)}
                                                                        >
                                                                            Delete
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

                                    <div className="d-flex gap-2">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => setPage(page - 1)}
                                        >
                                            Prev
                                        </button>
                                        <span>{page} / {pagination.totalPages || 1}</span>
                                        <button
                                            disabled={page === pagination.totalPages}
                                            onClick={() => setPage(page + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default Patients