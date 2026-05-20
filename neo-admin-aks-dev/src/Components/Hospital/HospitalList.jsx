import { TbGridDots } from "react-icons/tb";
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import Pagination from "../Common/Pagination";
import { faFilter, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import base_url from "../../Services/baseUrl";

function HospitalList() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  /* ================= FETCH HOSPITALS ================= */
  const fetchHospitals = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/admin/hospitals", {
        params: { page, limit, search },
      });

      const apiTotalPages = res.data.totalPages || 1;

      setHospitals(res.data.data || []);
      setTotalPages(apiTotalPages);

      // Safety: page overflow fix
      if (page > apiTotalPages && apiTotalPages > 0) {
        setPage(apiTotalPages);
      }
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [page,]);

  /* ================= DELETE HOSPITAL ================= */
  const deleteHospital = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This hospital will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/api/admin/hospitals/${id}`);

      Swal.fire("Deleted!", "Hospital has been deleted.", "success");

      // Re-fetch list
      fetchHospitals();
    } catch (error) {
      Swal.fire("Error", "Failed to delete hospital", "error");
    }
  };

  /* ================= PAGINATION HANDLERS ================= */
  const goFirst = () => page !== 1 && setPage(1);
  const goPrev = () => page > 1 && setPage(page - 1);
  const goNext = () => page < totalPages && setPage(page + 1);
  const goLast = () => page < totalPages && setPage(totalPages);

  const toggleStatus = async (id, status) => {
    try {
      setLoading(true);
      await api.patch(`/api/admin/hospitals/${id}/approve-reject`, { status });
      toast.success("Status updated");
      fetchHospitals();
    } catch {
      toast.error("Failed to update status");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        {/* HEADER */}
        <div className="row mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="innr-title mb-2 gradient-text">Hospital List</h3>
              <div className="admin-breadcrumb">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb custom-breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#" className="breadcrumb-link">
                        Dashboard
                      </a>
                    </li>
                    <li className="breadcrumb-item active">Hospital List</li>
                  </ol>
                </nav>
              </div>

            </div>
          </div>
        </div>

        <div className="new-mega-card">
          {/* SEARCH */}
          <div className="row">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex gap-3">
                <div className="custom-frm-bx mb-0">
                  <input
                    type="text"
                    className="form-control admin-table-search-frm search-table-frm"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => {
                      setPage(1);
                      setSearch(e.target.value);
                    }}
                    onKeyDown={(e)=>{
                      if(e.key=="Enter"){
                        fetchHospitals()
                      }
                    }}
                  />
                  <div className="adm-search-bx">
                    <button className="tp-search-btn" onClick={fetchHospitals}>
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                  </div>
                </div>


                {/* <div className="dropdown">
                  <a href="#" className="thm-btn lt-thm-btn">
                    <FontAwesomeIcon icon={faFilter} /> Filter
                  </a>
                </div> */}
              </div>
              <div>
                <Link to={'/add-hospital'} className="thm-btn">Add Hospital</Link>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="row">
            <div className="col-lg-12">
              <div className="table-section admin-mega-section">
                <div className="table table-responsive mb-0">
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Hospital</th>
                        <th>Contact Person</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            Loading...
                          </td>
                        </tr>
                      ) : hospitals.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No hospitals found
                          </td>
                        </tr>
                      ) : (
                        hospitals.map((item, index) => (
                          <tr key={item._id}>
                            <td>
                              {String(
                                (page - 1) * limit + index + 1
                              ).padStart(2, "0")}
                              .
                            </td>

                            <td>
                              <ul className="ad-info-list">
                                <li className="hospital-title">
                                  {item.hospitalName}
                                </li>
                                <li>
                                  <span>Mobile No :</span>{" "}
                                  {item.mobileNo || "—"}
                                </li>
                                <li>
                                  <span>Email :</span> {item.email || "—"}
                                </li>
                                {item?.userId?.nh12 && (
                                  <li>
                                    <span>Id :</span> {item?.userId?.nh12}
                                  </li>
                                )}
                              </ul>
                            </td>

                            <td>
                              {item?.contact?<div className="admin-table-bx ">
                                <div className="d-flex align-items-start  gap-2">
                                  <img src={item?.contact?.profilePhotoId ?
                                  `${base_url}/api/file/${item?.contact?.profilePhotoId}`:"/doctor-avatr.png"} alt="" />
                                  <h6>{item.contact?.name || "—"}</h6>
                                </div>
                                <div>Mobile No : {item.contact?.mobileNumber || "—"}</div>
                                <div>Email : {item.contact?.email || "—"}</div>
                              </div>:'-'}
                            </td>

                            <td>{item?.address ? 
                            item?.address?.fullAddress?.length > 50 ? item?.address?.fullAddress?.slice(0,47)+'...' 
                            :item?.address?.fullAddress: "—"}</td>

                            <td>
                              <span
                                className={`text-capitalize approved ${item.kycStatus === "approved"
                                    ? "approved-active"
                                    : (item.kycStatus === "rejected" || item.kycStatus === "block")
                                      ? "reject"
                                      : "approved-pending"
                                  }`}
                              >
                                {item.kycStatus}
                              </span>
                            </td>

                            <td>
                              <div className="dropdown position-static">
                                <a
                                  href="javascript:void(0)"
                                  className="grid-dots-btn"
                                  data-bs-toggle="dropdown"
                                >
                                  <TbGridDots />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end mt-2 admin-dropdown-card">
                                  <li className="prescription-item">
                                    <NavLink
                                      to={`/hospital-info-details/${item._id}`}
                                      className="prescription-nav"
                                    >
                                      View Details
                                    </NavLink>
                                  </li>
                                  <li className="prescription-item">
                                    <button
                                      className="prescription-nav w-100"
                                      onClick={() => toggleStatus(item?._id,item?.kycStatus !== "approved" ? "approved" : "rejected")}
                                      to={`/hospital-info-details/${item._id}`}
                                    >
                                      {item?.kycStatus !== "approved" ? "Approved" : "Rejected"}
                                    </button>
                                  </li>

                                  {/* <li className="prescription-item">
                                    <a
                                      href="#"
                                      className="prescription-nav text-danger"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        deleteHospital(item._id);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faTrash} /> Delete
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

                {/* PAGINATION */}

                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />


              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HospitalList;
