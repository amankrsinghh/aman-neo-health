import { TbGridDots } from "react-icons/tb";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { faFilter, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../../utils/axios";
import Swal from "sweetalert2";

const STATUS_OPTIONS = ["all", "pending", "approved", "completed", "rejected", "cancel"];

function DoctorAppointments() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const limit = 10;

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/doctor/all-appointments", {
        params: { page, limit, status, search }
      });
      setList(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch { setList([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, [page, status]);

  const deleteAppt = async (id) => {
    const r = await Swal.fire({ title: "Delete?", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (!r.isConfirmed) return;
    try {
      await api.delete(`/api/admin/doctor/appointment/${id}`);
      Swal.fire("Deleted!", "", "success");
      fetchAppointments();
    } catch { Swal.fire("Error", "Failed to delete", "error"); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const statusClass = (s) => s === "completed" ? "approved-active" : s === "pending" ? "approved-pending" : s === "approved" ? "approved-visited" : "approved-reject";

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">
      <div className="row mb-3">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h3 className="innr-title mb-2 gradient-text">Doctor Appointments</h3>
            <div className="admin-breadcrumb">

              <nav aria-label="breadcrumb"><ol className="breadcrumb custom-breadcrumb">
                <li className="breadcrumb-item"><a href="#" className="breadcrumb-link">Dashboard</a></li>
                <li className="breadcrumb-item active">Doctor Appointments</li>
              </ol></nav>
            </div>
          </div>
        </div>
      </div>

      <div className="new-mega-card">
        <div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
          <div className="d-flex align-items-center gap-2">
            <div className="custom-frm-bx mb-0">
              <input type="text" className="form-control admin-table-search-frm search-table-frm"
                placeholder="Search patient/doctor..." value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && fetchAppointments()} />
              <div className="adm-search-bx"><button className="tp-search-btn" onClick={fetchAppointments}><FontAwesomeIcon icon={faSearch} /></button></div>
            </div>
            <div className="dropdown">
              <a href="#" className="thm-btn lt-thm-btn" data-bs-toggle="dropdown"><FontAwesomeIcon icon={faFilter} /> Filter</a>
              <div className="dropdown-menu dropdown-menu-end user-dropdown tble-action-menu p-3" style={{ minWidth: 200 }}>
                <h6 className="mb-2">Status</h6>
                {STATUS_OPTIONS.map(s => (
                  <div className="form-check new-custom-check" key={s}>
                    <input className="form-check-input" type="radio" name="apptStatus" id={`st-${s}`}
                      checked={status === s} onChange={() => { setStatus(s); setPage(1); }} />
                    <label className="form-check-label text-capitalize" htmlFor={`st-${s}`}>{s}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="table-section admin-mega-section">
          <div className="table table-responsive mb-0">
            <table className="table mb-0">
              <thead>
                <tr><th>#</th><th>Appt ID</th><th>Patient</th><th>Date</th><th>Doctor</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan={7} className="text-center py-4">Loading...</td></tr>
                  : list.length === 0 ? <tr><td colSpan={7} className="text-center py-4 text-muted">No appointments found</td></tr>
                    : list.map((item, i) => (
                      <tr key={item._id}>
                        <td>{String((page - 1) * limit + i + 1).padStart(2, "0")}.</td>
                        <td><span className="text-muted" style={{ fontSize: 12 }}>#{item._id?.slice(-8)}</span></td>
                        <td>
                          <div className="admin-table-bx">
                            <div className="admin-table-sub-bx">
                              <img src={item.patientId?.profileImage || "/admin-tb-logo.png"} alt="" />
                              <div className="admin-table-sub-details">
                                <h6>{item.patientId?.name || "—"}</h6>
                                <p>{item.patientId?.contactNumber || "—"}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{fmt(item.date)}</td>
                        <td>
                          <div className="admin-table-bx">
                            <div className="admin-table-sub-bx">
                              <img src={item.doctorId?.profileImage || "/doctor-avatr.png"} alt="" />
                              <div className="admin-table-sub-details doctor-title">
                                <h6>{item.doctorId?.name || "—"}</h6>
                                <p>{item.doctorId?.contactNumber || "—"}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td><span className={`approved ${statusClass(item.status)}`}>{item.status}</span></td>
                        <td>
                          <div className="dropdown">
                            <a href="javascript:void(0)" className="grid-dots-btn" data-bs-toggle="dropdown"><TbGridDots /></a>
                            <ul className="dropdown-menu dropdown-menu-end mt-2 admin-dropdown-card">
                              <li className="prescription-item">
                                <NavLink to={`/doctor-appointment-details/${item._id}`} className="prescription-nav">View Details</NavLink>
                              </li>
                              <li className="prescription-item">
                                <a className="prescription-nav text-danger" href="#" onClick={e => { e.preventDefault(); deleteAppt(item._id); }}>
                                  <FontAwesomeIcon icon={faTrash} /> Delete
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

          <div className="custom-pagination-wrapper d-flex justify-content-between align-items-center flex-wrap mt-3">
            <nav><ul className="pagination custom-pagination mb-0">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`} onClick={() => setPage(1)}><a className="page-link" href="#"><HiChevronDoubleLeft /></a></li>
              <li className={`page-item ${page === 1 ? "disabled" : ""}`} onClick={() => page > 1 && setPage(p => p - 1)}><a className="page-link" href="#"><HiChevronLeft /></a></li>
              <li className="page-item active"><a className="page-link" href="#">{page}</a></li>
              <li className={`page-item ${page === totalPages ? "disabled" : ""}`} onClick={() => page < totalPages && setPage(p => p + 1)}><a className="page-link" href="#"><HiChevronRight /></a></li>
              <li className={`page-item ${page === totalPages ? "disabled" : ""}`} onClick={() => setPage(totalPages)}><a className="page-link" href="#"><HiChevronDoubleRight /></a></li>
            </ul></nav>
            <span className="text-muted" style={{ fontSize: 13 }}>Page {page} of {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DoctorAppointments;
