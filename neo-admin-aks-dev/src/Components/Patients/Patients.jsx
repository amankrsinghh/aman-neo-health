import { useEffect, useState } from "react";
import { TbGridDots } from "react-icons/tb";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Pagination from "../Common/Pagination";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import base_url from "../../Services/baseUrl";
import { calculateAge, statusClass } from "../../Services/globalFunction";
import { updateApiData } from "../../Services/api";

function Patients() {

    const [patients, setPatients] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    /* ================= FETCH ================= */
    const fetchPatients = async (p = 1, s = "") => {
        try {
            setLoading(true);
            const res = await api.get(`/api/admin/patients?page=${p}&search=${s}`);

            setPatients(res.data.data || []);
            setTotalPages(res.data.totalPages || 1);
            setPage(res.data.currentPage || 1);

        } catch (err) {
            toast.error("Failed to load patients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    /* ================= SEARCH ================= */
    const handleSearch = () => {
        fetchPatients(1, search);
    };
    const toggleStatus = async (patientId,status) => {
    try {
      setLoading(true);
      const res=await updateApiData(`api/admin/patients/status`,{patientId,status});
      if(res.success){
          toast.success("Status updated");
          fetchPatients();
      }else{
        toast.error(res.message)
      }
    } catch {
      toast.error("Failed to update status");
      setLoading(false);
    }
  };

    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Patients</h3>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="#" className="breadcrumb-link">Dashboard</a>
                                        </li>
                                        <li className="breadcrumb-item active">Patients</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='new-mega-card'>
                    <div className="row">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="custom-frm-bx mb-0">
                                        <input
                                            type="text"
                                            className="form-control admin-table-search-frm search-table-frm"
                                            placeholder="Search"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key == "Enter") {
                                                    handleSearch()
                                                }
                                            }}
                                        />
                                        <div className="adm-search-bx">
                                            <button className="tp-search-btn" onClick={handleSearch}>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Link to={'/add-patient'} className="thm-btn">Add Patient</Link>
                            </div>
                        </div>
                    </div>

                    {/* ================= TABLE ================= */}
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="table-section admin-mega-section">
                                <div className="table table-responsive mb-0">
                                    <table className="table mb-0">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Patient</th>
                                                <th>Contact</th>
                                                <th>Age</th>
                                                <th>Gender</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {loading ? (
                                                <tr><td colSpan="7" className="text-center">Loading...</td></tr>
                                            ) : patients.length === 0 ? (
                                                <tr><td colSpan="7" className="text-center">No Patients Found</td></tr>
                                            ) : (
                                                patients.map((p, index) => (
                                                    <tr key={p._id}>
                                                        <td>{(page - 1) * 10 + index + 1}.</td>

                                                        <td>
                                                            <div className="admin-table-bx">
                                                                <div className="admin-table-sub-bx">
                                                                    <img src={p?.profileImage ? `${base_url}/${p?.profileImage}` : "/admin-tb-logo.png"} alt=""
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = "/admin-tb-logo.png";
                                                                        }} />
                                                                    <div className="admin-table-sub-details">
                                                                        <h6>{p.userId?.name}</h6>
                                                                        <p>{p.userId?.nh12}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <ul className="ad-info-list">
                                                                <li className="ad-info-item">
                                                                    <span className="ad-info-title">Mobile No :</span> {p.userId?.contactNumber}
                                                                </li>
                                                                <li className="ad-info-item">
                                                                    <span className="ad-info-title">Email :</span> {p.userId?.email}
                                                                </li>
                                                            </ul>
                                                        </td>

                                                        <td>{calculateAge(p?.demographic?.dob)}</td>
                                                        <td>{p.gender}</td>

                                                        <td>
                                                            <span className={`approved text-capitalize ${statusClass(p?.status)}`}>
                                                                {p.status}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <div className="dropdown position-static">
                                                                <a href="javascript:void(0)" className="grid-dots-btn" data-bs-toggle="dropdown">
                                                                    <TbGridDots />
                                                                </a>

                                                                <ul className="dropdown-menu dropdown-menu-end mt-2 admin-dropdown-card">
                                                                    <li className="prescription-item">
                                                                        <NavLink to={`/patients-info/${p.userId?._id}`} className="prescription-nav">
                                                                            View Details
                                                                        </NavLink>
                                                                    </li>
                                                                    {p?.status=="approved"?
                                                                    <li className="prescription-item">
                                                                        <a onClick={()=>toggleStatus(p?._id,"pending")} className="prescription-nav">Inactive</a>
                                                                    </li>:
                                                                    <li className="prescription-item">
                                                                        <a onClick={()=>toggleStatus(p?._id,"approved")} className="prescription-nav">Active</a>
                                                                    </li>}
                                                                    {/* <li className="prescription-item">
                                                                        <a className="prescription-nav">Delete</a>
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

                                {/* ================= PAGINATION ================= */}
                                <Pagination page={page} totalPages={totalPages} onPageChange={(p) => fetchPatients(p, search)} />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Patients;
