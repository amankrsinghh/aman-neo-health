import { TbGridDots } from "react-icons/tb";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { faCheck, faClose, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import Swal from "sweetalert2";
import { IMAGE_BASE_URL } from "../../utils/config";
import Pagination from "../Common/Pagination";
import { calculateAge, statusClass } from "../../Services/globalFunction";
function DoctorEditRequest() {
    const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const limit = 10;

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/edit-requests", {
        params: { type: "doctor", status: statusFilter, page, limit, search }
      });
      setList(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch { setList([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchList(); }, [page, statusFilter,]);

  const handleAction = async (id, status) => {
    const label = status === "approved" ? "Approve" : "Reject";
    const r = await Swal.fire({
      title: `${label} this request?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: status === "approved" ? "#00B4B5" : "#d33",
      confirmButtonText: `Yes, ${label}`
    });
    if (!r.isConfirmed) return;
    try {
      await api.patch(`/api/admin/edit-requests/${id}/status`, { status });
      Swal.fire("Done!", `Request ${status}.`, "success");
      fetchList();
    } catch { Swal.fire("Error", "Failed to update", "error"); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  
  // Get the user object from whichever ref is populated
  const getUser = (item) => item.doctorId || item.doctorId || item.labId || item.pharId || item.hospitalId || {};
  const getImg = (u) => {
      if (u.profileImage) return `${IMAGE_BASE_URL}/${u.profileImage}`;
      return "/admin-tb-logo.png";
    
  };
  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        <div className="row mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="innr-title mb-2 gradient-text">Doctor Edit Request</h3>
              <div className="admin-breadcrumb">

                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb custom-breadcrumb">
                    <li className="breadcrumb-item"><a href="#" className="breadcrumb-link">Dashboard</a></li>
                    <li className="breadcrumb-item active">Doctor Edit Request</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="new-mega-card">
          {/* Filter bar */}
          <div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <div className="custom-frm-bx mb-0">
                <input type="text" className="form-control admin-table-search-frm search-table-frm"
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      fetchList()
                    }
                  }}
                  placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                <div className="adm-search-bx">
                  <button className="tp-search-btn"><FontAwesomeIcon icon={faSearch} /></button>
                </div>
              </div>
              <div className="dropdown">
                <a href="#" className="thm-btn lt-thm-btn" data-bs-toggle="dropdown">
                  <FontAwesomeIcon icon={faFilter} /> Filter
                </a>
                <div className="dropdown-menu dropdown-menu-end user-dropdown tble-action-menu p-3" style={{ minWidth: 160 }}>
                  <h6 className="mb-2">Status</h6>
                  {["all", "pending", "approved", "rejected"].map(s => (
                    <div className="form-check new-custom-check" key={s}>
                      <input className="form-check-input" type="radio" name={`er-doctor`} id={`er-doctor-${s}`}
                        checked={statusFilter === s} onChange={() => { setStatusFilter(s); setPage(1); }} />
                      <label className="form-check-label text-capitalize" htmlFor={`er-doctor-${s}`}>{s}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-section admin-mega-section">
            <div className="table table-responsive mb-0">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Age</th>
                    <th>Specialty</th>
                    <th>Organization /<br/> Hospital Name</th>
                    <th>Request Date</th>
                    <th>Note</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-4">Loading...</td></tr>
                  ) : list.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-4 text-muted">No edit requests found</td></tr>
                  ) : list.map((item, i) => {
                    const user = getUser(item);
                    return (
                      <tr key={item._id}>
                        <td>{String((page - 1) * limit + i + 1).padStart(2, "0")}.</td>

                        {/* Contact person */}
                        <td>
                          
                            <div className="admin-table-bx">
                              <div className="admin-table-sub-bx">
                                <img src={getImg(item)} alt=""
                                  onError={e => { e.target.src = "/admin-tb-logo.png"; }} />
                                
                              </div>
                            </div> 
                        </td>
                        <td>
                          {item?.doctorId?.name}
                        </td>
                        <td>
                          <ul className="ad-info-list mt-1">
                            {item?.doctorId?.contactNumber && <li className="ad-info-item" style={{ fontSize: 12 }}>Mobile : {item?.doctorId?.contactNumber}</li>}
                            {item?.doctorId?.email && <li className="ad-info-item" style={{ fontSize: 12 }}>Email : {item?.doctorId?.email}</li>}
                          </ul>
                        </td>
                        <td>
                          {calculateAge(item?.dob)}
                        </td>
                        <td>{item?.about?.specialty?.name}</td>
                        <td>{item?.about?.hospitalName}</td>
                        <td>
                          {fmt(item?.createdAt)}
                        </td>
                        <td>
                          {item?.message}
                        </td>                    



                        <td>
                          <span className={`approved ${statusClass(item.status)}`}>
                            {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                          </span>
                        </td>

                        <td>
                          <div className="dropdown">
                            <a href="javascript:void(0)" className="grid-dots-btn" data-bs-toggle="dropdown">
                              <TbGridDots />
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end mt-2 admin-dropdown-card">
                              {item.status === "pending" && (
                                <>
                                  <li className="prescription-item">
                                    <a className="prescription-nav status-paid-title" href="#"
                                      onClick={e => { e.preventDefault(); handleAction(item._id, "approved"); }}>
                                      <FontAwesomeIcon icon={faCheck} className="me-1" /> Approve
                                    </a>
                                  </li>
                                  <li className="prescription-item">
                                    <a className="prescription-nav reject-title" href="#"
                                      onClick={e => { e.preventDefault(); handleAction(item._id, "rejected"); }}>
                                      Reject
                                    </a>
                                  </li>
                                </>
                              )}
                              {item.status !== "pending" && (
                                <li className="prescription-item">
                                  <a className="prescription-nav" href="#"
                                    onClick={e => { e.preventDefault(); handleAction(item._id, "pending"); }}>
                                    Reset to Pending
                                  </a>
                                </li>
                              )}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </>
  );
}
export default DoctorEditRequest;
