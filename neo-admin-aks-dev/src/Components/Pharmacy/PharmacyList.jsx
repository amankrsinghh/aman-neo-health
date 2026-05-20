import { useEffect, useState } from "react";
import { TbGridDots } from "react-icons/tb";
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight
} from "react-icons/hi";
import Pagination from "../Common/Pagination";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import { IMAGE_BASE_URL } from "../../utils/config";
import base_url from "../../Services/baseUrl";

function PharmacyList() {
  const [loading, setLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  /* ================= LOAD ================= */
  const loadPharmacies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/pharmacy", {
        params: { search, page }
      });
      setPharmacies(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to load pharmacies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPharmacies();
  }, [page]);

 

  /* ================= STATUS ================= */
  const toggleStatus = async (id) => {
    try {
      await api.patch(`/api/admin/pharmacy/${id}/status`);
      toast.success("Status updated");
      loadPharmacies();
    } catch {
      toast.error("Status update failed");
    }
  };

  /* ================= DELETE ================= */
  const deletePharmacy = async (id) => {
    const ok = await Swal.fire({
      title: "Delete pharmacy?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete"
    });

    if (!ok.isConfirmed) return;

    try {
      await api.delete(`/api/admin/pharmacy/${id}`);
      toast.success("Pharmacy deleted");
      loadPharmacies();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        <div className="row mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="innr-title mb-2 gradient-text">Pharmacy List</h3>
              <div className="admin-breadcrumb">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb custom-breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#" className="breadcrumb-link">Dashboard</a>
                    </li>
                    <li className="breadcrumb-item active">Pharmacy List</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {/* SEARCH */}
        <div className='new-mega-card'>
          <div className="row">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <div className="d-flex aligh-content-center mb-3">
                  <div className="custom-frm-bx mb-0">
                    <input
                      className="form-control admin-table-search-frm search-table-frm"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key == "Enter") {
                          loadPharmacies()
                        }
                      }}
                    />
                    <div className="adm-search-bx">
                      <button className="tp-search-btn" onClick={loadPharmacies}>
                        <FontAwesomeIcon icon={faSearch} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
                  <div>
                    <Link to={'/add-pharmacy'} className="thm-btn">Add Pharmacy</Link>
                  </div>
            </div>
          </div>
          {/* TABLE */}
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pharmacy</th>
                  <th>Contact Person</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <span className="spinner-border text-primary" role="status"></span>
                    </td>
                  </tr>
                )}

                {!loading && pharmacies.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No pharmacies found
                    </td>
                  </tr>
                )}

                {!loading &&
                  pharmacies.map((p, i) => (
                    <tr key={p._id}>
                      <td>{(page - 1) * limit + i + 1}.</td>

                      <td>
                        <ul className="ad-info-list">
                          <li className="ad-info-item">{p.name}</li>
                          <li className="ad-info-item">
                            <span className="ad-info-title">Mobile :</span> {p.contactNumber}
                          </li>
                          <li className="ad-info-item">
                            <span className="ad-info-title">Email :</span> {p.email}
                          </li>
                          {p?.userId?.nh12 && <li className="ad-info-item">
                            <span className="ad-info-title">Id :</span> {p?.userId?.nh12}
                          </li>}
                        </ul>
                      </td>

                      <td>
                        {p?.contactPerson ?
                          <div className="admin-table-bx">
                            <div className="admin-table-sub-details d-flex align-items-center gap-2">
                              <img src={p?.contactPerson?.photo ? base_url+'/' + p?.contactPerson?.photo : "/doctor-avatr.png"} alt="" />
                              <h6>{p?.contactPerson?.name}</h6>
                            </div>
                            <ul className="ad-info-list">
                              <li>Mobile No: {p?.contactPerson?.contactNumber}</li>
                              <li>Email: {p?.contactPerson.email}</li>
                            </ul>
                          </div> : '-'}
                      </td>

                      <td>{p?.address ? p?.address?.fullAddress?.length>50?  p?.address?.fullAddress?.slice(0,47)+'...' 
                      :p?.address?.fullAddress: "-"}</td>

                      <td>
                        <span
                          className={`approved text-capitalize ${p.status === "verify"
                            ? "approved-active"
                            : "approved-reject"
                            }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleStatus(p._id)}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td>
                        <div className="dropdown position-static">
                          <a className="grid-dots-btn" data-bs-toggle="dropdown">
                            <TbGridDots />
                          </a>
                          <ul className="dropdown-menu dropdown-menu-end admin-dropdown-card">
                            <li className="prescription-item">
                              <NavLink
                                to={`/pharmacy-info-details/${p.userId}`}
                                className="prescription-nav"
                              >
                                View Details
                              </NavLink>
                            </li>
                            <li className="prescription-item">
                              <a
                                className="prescription-nav"
                                onClick={() => toggleStatus(p._id)}
                              >
                                Toggle Status
                              </a>
                            </li>
                            {/* <li className="prescription-item">
                            <a
                              className="prescription-nav text-danger"
                              onClick={() => deletePharmacy(p._id)}
                            >
                              Delete
                            </a>
                          </li> */}
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
    </>
  );
}

export default PharmacyList;
