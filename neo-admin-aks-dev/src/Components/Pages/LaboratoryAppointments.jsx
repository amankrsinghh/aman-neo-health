import { TbGridDots } from "react-icons/tb";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { faFilter, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../../utils/axios";
import Swal from "sweetalert2";

const STATUS_OPTIONS = ["all", "pending", "visit_pending", "visited", "report_delivered", "cancelled"];

function LaboratoryAppointments() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("all");
  const limit = 10;

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/lab/all-appointments", { params: { page, limit, status } });
      setList(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch { setList([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, [page, status]);

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const statusClass = (s) => s === "report_delivered" ? "approved-active" : s === "visited" ? "approved-visited" : s === "cancelled" ? "approved-reject" : "approved-pending";

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">
      <div className="row mb-3">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h3 className="innr-title mb-2 gradient-text">Laboratory Appointments</h3>
            <div className="admin-breadcrumb">

              <nav aria-label="breadcrumb"><ol className="breadcrumb custom-breadcrumb">
                <li className="breadcrumb-item"><a href="#" className="breadcrumb-link">Dashboard</a></li>
                <li className="breadcrumb-item active">Lab Appointments</li>
              </ol></nav>
            </div>
          </div>
        </div>
      </div>

      <div className="new-mega-card">
        <div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
          <div className="dropdown">
            <a href="#" className="thm-btn lt-thm-btn" data-bs-toggle="dropdown"><FontAwesomeIcon icon={faFilter} /> Filter</a>
            <div className="dropdown-menu dropdown-menu-end user-dropdown tble-action-menu p-3" style={{ minWidth: 200 }}>
              <h6 className="mb-2">Status</h6>
              {STATUS_OPTIONS.map(s => (
                <div className="form-check new-custom-check" key={s}>
                  <input className="form-check-input" type="radio" name="labStatus" id={`ls-${s}`}
                    checked={status === s} onChange={() => { setStatus(s); setPage(1); }} />
                  <label className="form-check-label text-capitalize" htmlFor={`ls-${s}`}>{s.replace(/_/g, " ")}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="table-section admin-mega-section">
          <div className="table table-responsive mb-0">
            <table className="table mb-0">
              <thead>
                <tr><th>#</th><th>Appt ID</th><th>Patient</th><th>Details</th><th>Laboratory</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan={7} className="text-center py-4">Loading...</td></tr>
                  : list.length === 0 ? <tr><td colSpan={7} className="text-center py-4 text-muted">No appointments found</td></tr>
                    : list.map((item, i) => (
                      <tr key={item._id}>
                        <td>{String((page - 1) * limit + i + 1).padStart(2, "0")}.</td>
                        <td><span className="text-muted" style={{ fontSize: 12 }}>#{item._id?.slice(-8)}</span></td>
                        <td>
                          <div className="admin-table-bx"><div className="admin-table-sub-bx">
                            <img src={item.patientId?.profileImage || "/admin-tb-logo.png"} alt="" />
                            <div className="admin-table-sub-details">
                              <h6>{item.patientId?.name || "—"}</h6>
                              <p>{item.patientId?.contactNumber || "—"}</p>
                            </div>
                          </div></div>
                        </td>
                        <td>
                          <ul className="ad-info-list">
                            <li className="ad-info-item"><span className="ad-info-title">Date:</span> {fmt(item.appointmentDate)}</li>
                            <li className="ad-info-item"><span className="ad-info-title">Amount:</span> ₹{item.totalAmount || 0}</li>
                            <li className="ad-info-item patient-report-item"><span className="ad-info-title">Tests:</span> {item.tests?.map(t => t.name || t).join(", ") || "—"}</li>
                          </ul>
                        </td>
                        <td>
                          <div className="admin-table-bx"><div className="admin-table-sub-bx">
                            <div className="laboratory-pic"><img src="/profile-tab-avatar.png" alt="" /></div>
                            <div className="admin-table-sub-details">
                              <h6>{item.labId?.name || "—"}</h6>
                              <p>{item.labId?.contactNumber || "—"}</p>
                            </div>
                          </div></div>
                        </td>
                        <td><span className={`approved ${statusClass(item.status)}`}>{item.status?.replace(/_/g, " ")}</span></td>
                        <td>
                          <div className="dropdown">
                            <a href="javascript:void(0)" className="grid-dots-btn" data-bs-toggle="dropdown"><TbGridDots /></a>
                            <ul className="dropdown-menu dropdown-menu-end mt-2 admin-dropdown-card">
                              <li className="prescription-item">
                                <NavLink to={`/lab-appointment-details/${item._id}`} className="prescription-nav">View Details</NavLink>
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
export default LaboratoryAppointments;
