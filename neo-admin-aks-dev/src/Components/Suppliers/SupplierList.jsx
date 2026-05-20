import { useEffect, useState } from "react";
import { TbGridDots } from "react-icons/tb";
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight
} from "react-icons/hi";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import api from "../../utils/axios";

function SupplierList() {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  /* ================= LOAD ================= */

  const loadSuppliers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/admin/suppliers", {
        params: { search, page, limit }
      });

      setSuppliers(res.data.data);
      setTotalPages(res.data.pagination?.totalPages || 1);

    } catch {
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [page]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      loadSuppliers();
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  /* ================= DELETE ================= */

  const deleteSupplier = async (id) => {
    const ok = await Swal.fire({
      title: "Delete supplier?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete"
    });

    if (!ok.isConfirmed) return;

    try {
      await api.delete(`/api/admin/suppliers/${id}`);
      toast.success("Supplier deleted");
      loadSuppliers();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">

      <h3 className="innr-title mb-3 gradient-text">
        Supplier Management
      </h3>

      {/* ===== SEARCH ===== */}

      <div className="d-flex justify-content-between mb-3">

        <div className="custom-frm-bx mb-0">
          <input
            className="form-control admin-table-search-frm"
            placeholder="Search supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="adm-search-bx">
            <button className="tp-search-btn">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        <NavLink to="/suppliers/add" className="btn btn-primary">
          + Add Supplier
        </NavLink>

      </div>

      {/* ===== TABLE ===== */}

      <div className="table-responsive">
        <table className="table">

          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Type</th>
              <th>Score</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <span className="spinner-border text-primary" />
                </td>
              </tr>
            )}

            {!loading && suppliers.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">
                  No suppliers found
                </td>
              </tr>
            )}

            {!loading &&
              suppliers.map((s, i) => (
                <tr key={s._id}>

                  <td>{(page - 1) * limit + i + 1}</td>

                  {/* NAME */}
                  <td>
                    <b>{s.name}</b>
                    <div className="small text-muted">
                      {s.email || "-"}
                    </div>
                  </td>

                  {/* CONTACT */}
                  <td>
                    📞 {s.mobileNumber || "-"}
                  </td>

                  {/* ADDRESS */}
                  <td>
                    {s.address || "-"}
                    <div className="small text-muted">
                      {s.city} {s.pincode}
                    </div>
                  </td>

                  {/* TYPE */}
                  <td>
                    <span className="badge bg-info text-dark">
                      {s.type}
                    </span>
                  </td>

                  {/* SCORE */}
                  <td>
                    ⭐ {s.score}
                  </td>

                  {/* ACTION */}
                  <td>
                    <div className="dropdown">
                      <a className="grid-dots-btn" data-bs-toggle="dropdown">
                        <TbGridDots />
                      </a>

                      <ul className="dropdown-menu dropdown-menu-end admin-dropdown-card">

                        <li>
                          <NavLink
                            to={`/suppliers/edit/${s._id}`}
                            className="dropdown-item"
                          >
                            Edit
                          </NavLink>
                        </li>

                        <li>
                          <a
                            className="dropdown-item text-danger"
                            onClick={() => deleteSupplier(s._id)}
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

      {/* ===== PAGINATION ===== */}

      <div className="d-flex justify-content-between align-items-center mt-3">

        <p>Page {page} of {totalPages}</p>

        <div className="d-flex gap-2">

          <button disabled={page === 1} onClick={() => setPage(1)}>
            <HiChevronDoubleLeft />
          </button>

          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            <HiChevronLeft />
          </button>

          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            <HiChevronRight />
          </button>

          <button disabled={page === totalPages} onClick={() => setPage(totalPages)}>
            <HiChevronDoubleRight />
          </button>

        </div>
      </div>

    </div>
  );
}

export default SupplierList;