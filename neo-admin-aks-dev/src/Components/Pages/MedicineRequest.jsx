import { TbGridDots } from "react-icons/tb";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Pagination from "../Common/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import Swal from "sweetalert2";

function MedicineRequest() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("Pending");
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const limit = 10;

    const fetchList = async () => {
        try {
            setLoading(true);
            const res = await api.get("api/admin/medicine-requests", { params: { page, limit, search, status: statusFilter } });
            setList(res.data.data || []);
            setTotalPages(res.data.totalPages || 1);
        } catch { setList([]); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchList(); }, [page, statusFilter]);

    const handleApprove = async (id) => {
        const r = await Swal.fire({ title: "Approve?", icon: "question", showCancelButton: true, confirmButtonColor: "#00B4B5" });
        if (!r.isConfirmed) return;
        try {
            await api.patch(`/api/admin/hospitals/${id}/approve-reject`, { status: "approved" });
            Swal.fire("Approved!", "", "success"); fetchList();
        } catch { Swal.fire("Error", "Failed", "error"); }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) return Swal.fire("Required", "Enter reason", "warning");
        try {
            await api.patch(`/api/admin/hospitals/${rejectModal._id}/approve-reject`, { status: "rejected", reason: rejectReason });
            setRejectModal(null); setRejectReason("");
            Swal.fire("Rejected!", "", "success"); fetchList();
        } catch { Swal.fire("Error", "Failed", "error"); }
    };

    const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
    const statusClass = (s) => s === "Approved" ? "approved-active" : s === "rejected" ? "approved-reject" : s === "verify" ? "approved-visited" : "approved-pending";
    const actionSubmit = async (id, status) => {
        const r = await Swal.fire({ title: `${status === "Approved" ? "Approve" : "Reject"}?`, icon: "question", showCancelButton: true, confirmButtonColor: "#00B4B5" });
        if (!r.isConfirmed) return;
        try {
            await api.post(`/api/admin/medicine-request`, { requestId: id, status });
            Swal.fire(`${status === "Approved" ? "Approved" : "Rejected"}!`, "", "success"); fetchList();
        } catch { Swal.fire("Error", "Failed", "error"); }
    }
    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Medicine Request</h3>
                            <div className="admin-breadcrumb">

                                <nav aria-label="breadcrumb"><ol className="breadcrumb custom-breadcrumb">
                                    <li className="breadcrumb-item"><a href="#" className="breadcrumb-link">Dashboard</a></li>
                                    <li className="breadcrumb-item active">Medicine Request</li>
                                </ol></nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="new-mega-card">
                    <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                        <div className="custom-frm-bx mb-0">
                            <input type="text" className="form-control admin-table-search-frm search-table-frm"
                                placeholder="Search..." value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && fetchList()} />
                            <div className="adm-search-bx"><button className="tp-search-btn" onClick={fetchList}><FontAwesomeIcon icon={faSearch} /></button></div>
                        </div>
                        <div className="dropdown">
                            <a href="#" className="thm-btn lt-thm-btn" data-bs-toggle="dropdown"><FontAwesomeIcon icon={faFilter} /> Filter</a>
                            <div className="dropdown-menu dropdown-menu-end user-dropdown tble-action-menu p-3" style={{ minWidth: 180 }}>
                                <h6 className="mb-2">Status</h6>
                                {["all", "Pending", "Approved", "Rejected"].map(s => (
                                    <div className="form-check new-custom-check" key={s}>
                                        <input className="form-check-input" type="radio" name="hospitalStatus" id={`hospitals-${s}`}
                                            checked={statusFilter === s} onChange={() => { setStatusFilter(s); setPage(1); }} />
                                        <label className="form-check-label text-capitalize" htmlFor={`hospitals-${s}`}>{s}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="table-section admin-mega-section">
                        <div className="table table-responsive mb-0">
                            <table className="table mb-0">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Medicine</th>
                                        <th>Quantity</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? <tr><td colSpan={7} className="text-center py-4">Loading...</td></tr>
                                        : list.length === 0 ? <tr><td colSpan={7} className="text-center py-4 text-muted">No requests found</td></tr>
                                            : list.map((item, i) => (
                                                <tr key={item._id}>
                                                    <td>{String((page - 1) * limit + i + 1).padStart(2, "0")}.</td>
                                                    <td>
                                                        <div className="admin-table-bx">
                                                            <div className="admin-table-sub-bx">
                                                                <div className="admin-table-sub-details">
                                                                    <h6>{item.pharId?.name || item.hospitalId?.name || "—"}</h6>
                                                                    <p>{item?.pharId?.email || item?.hospitalId?.email || "—"}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{item.medicineId?.medicineName || "—"}</td>
                                                    <td>{item?.quantity || "—"}</td>
                                                    <td><span className={`approved ${statusClass(item.status)?.toLowerCase()}`}>{item.status}</span></td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <a href="javascript:void(0)" className="grid-dots-btn" data-bs-toggle="dropdown"><TbGridDots /></a>
                                                            <ul className="dropdown-menu dropdown-menu-end mt-2 admin-dropdown-card">
                                                                <li className="prescription-item">
                                                                    <NavLink to={item?.pharId?._id ?
                                                                        `/pharmacy-info-details/${item.pharId?._id}`
                                                                        : `/hospital-info-details/${item.hospitalId?._id}`} className="prescription-nav">View Details</NavLink>
                                                                </li>
                                                                {item?.status == "Pending" &&
                                                                    <><li className="prescription-item">
                                                                        <a className="prescription-nav status-paid-title" href="#"
                                                                            onClick={() => actionSubmit(item._id, "Approved")}>
                                                                            <FontAwesomeIcon icon={faCheck} /> Approve
                                                                        </a>
                                                                    </li>
                                                                        <li className="prescription-item">
                                                                            <a className="prescription-nav reject-title" href="#"
                                                                                data-bs-toggle="modal" data-bs-target="#hospitalRejectModal"
                                                                                onClick={() => actionSubmit(item._id, "Rejected")}>
                                                                                Reject
                                                                            </a>
                                                                        </li>
                                                                    </>}
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            <div className="modal step-modal" id="hospitalRejectModal" data-bs-backdrop="static" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-4 p-4">
                        <div className="d-flex align-items-center justify-content-between border-bottom pb-2">
                            <h6 className="lg_title mb-0 gradient-text">Reject Reason</h6>
                            <button type="button" data-bs-dismiss="modal"><FontAwesomeIcon icon={faClose} /></button>
                        </div>
                        <div className="modal-body p-0 pt-3">
                            {rejectModal && <p className="fw-semibold text-center mb-3">{rejectModal.name || rejectModal.hospitalName}</p>}
                            <div className="custom-frm-bx">
                                <label>Reason *</label>
                                <textarea className="form-control admin-table-search-frm" rows={3}
                                    value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
                            </div>
                            <div className="text-center mt-3">
                                <button className="nw-thm-btn rounded-4 w-75" onClick={handleReject}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default MedicineRequest;
