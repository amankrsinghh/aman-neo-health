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
import base_url from "../../Services/baseUrl";

function LaboratoryList() {

  const [labs, setLabs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= LOAD ================= */
  const loadLabs = async () => {
    try {
      const res = await api.get("/api/admin/lab", {
        params: { search, page }
      });
      // console.log("res.data.data",res.data.data)
      setLabs(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to load labs");
    }
  };

  useEffect(() => {
    loadLabs();
  }, [page]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      loadLabs();
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  /* ================= STATUS ================= */
  const toggleStatus = async (id) => {
    try {
      await api.patch(`/api/admin/lab/${id}/status`);
      toast.success("Status updated");
      loadLabs();
    } catch {
      toast.error("Status update failed");
    }
  };

  /* ================= DELETE ================= */
  const deleteLab = async (id) => {
    const ok = await Swal.fire({
      title: "Delete laboratory?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete"
    });

    if (!ok.isConfirmed) return;

    try {
      await api.delete(`/api/admin/lab/${id}`);
      toast.success("Laboratory deleted");
      loadLabs();
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
              <h3 className="innr-title mb-2 gradient-text">Laboratory List</h3>
              <div className="admin-breadcrumb">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb custom-breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#" className="breadcrumb-link">Dashboard</a>
                    </li>
                    <li className="breadcrumb-item active">Laboratory List</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="new-mega-card">

          {/* ================= SEARCH ================= */}
          <div className="row">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex gap-5">
                <div className="custom-frm-bx mb-0">
                  <input
                    type="email"
                    className="form-control admin-table-search-frm search-table-frm"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="adm-search-bx">
                    <button className="tp-search-btn">
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
                <Link to={'/add-lab'} className="thm-btn">Add Lab</Link>
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
                        <th>Contact Person</th>
                        <th>Laboratory</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {labs.map((lab, i) => (
                        <tr key={lab._id}>
                          <td>{i + 1}</td>

                          <td>
                            {lab?.contactPerson ?
                              <div className="admin-table-bx">
                                <div className="admin-table-sub-details d-flex align-items-center gap-2">
                                  <img src={lab?.contactPerson?.photo ? base_url +'/'+ lab?.contactPerson?.photo : "/doctor-avatr.png"} alt="" />
                                  <h6>{lab?.contactPerson?.name}</h6>
                                </div>
                                <ul className="ad-info-list">
                                  <li>Mobile No: {lab?.contactPerson?.contactNumber}</li>
                                  <li>Email: {lab?.contactPerson.email}</li>
                                </ul>
                              </div> : '-'}
                          </td>

                          <td>
                            <ul className="ad-info-list">
                              <li>{lab.name}</li>
                              <li>Email : {lab.email}</li>
                              <li>Mobile No : {lab.contactNumber}</li>
                              <li>{lab?.userId?.nh12}</li>
                            </ul>
                          </td>

                          <td>{lab?.address ? lab?.address?.fullAddress ?
                            lab?.address?.fullAddress?.slice(0, 47) + '...'
                            : lab?.address?.fullAddress : "-"}</td>

                          <td>
                            <span
                              className="approved approved-active text-capitalize"
                              style={{ cursor: "pointer" }}
                              onClick={() => toggleStatus(lab._id)}
                            >
                              {lab.status}
                            </span>
                          </td>

                          <td>
                            <div className="dropdown position-static">
                              <a className="grid-dots-btn" data-bs-toggle="dropdown">
                                <TbGridDots />
                              </a>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                  <NavLink
                                    to={`/lab-info-details/${lab.userId}`}
                                    className="prescription-nav"
                                  >
                                    View Details
                                  </NavLink>
                                </li>
                                <li>
                                  <a
                                    className="prescription-nav"
                                    onClick={() => toggleStatus(lab._id)}
                                  >
                                    Toggle Status
                                  </a>
                                </li>
                                {/* <li>
                                    <a
                                    className="prescription-nav text-danger"
                                    onClick={() => deleteLab(lab._id)}
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

                {/* ================= PAGINATION ================= */}

                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />


              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default LaboratoryList;
