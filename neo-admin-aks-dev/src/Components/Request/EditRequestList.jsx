import { useEffect, useState } from "react";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

function EditRequestList() {

  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= LOAD ================= */

  const loadRequests = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/admin/edit-requests", {
        params: { page },
      });

      setRequests(res.data.data);
      setTotalPages(res.data.totalPages);

    } catch {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [page]);

  /* ================= STATUS UPDATE ================= */

  const updateStatus = async (id, status) => {
    const ok = await Swal.fire({
      title: `Mark as ${status}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!ok.isConfirmed) return;

    try {
      await api.patch(`/api/admin/edit-requests/${id}/status`, { status });
      toast.success("Status updated");
      loadRequests();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="main-content p-3">

      <h3>Edit Requests</h3>

      <div className="table-responsive">
        <table className="table">

          <thead>
            <tr>
              <th>#</th>
              <th>User Type</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td colSpan="6" className="text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              requests.map((r, i) => (
                <tr key={r._id}>
                  <td>{(page - 1) * 10 + i + 1}</td>

                  <td style={{ textTransform: "capitalize" }}>
                    {r.type}
                  </td>

                  <td>{r.message}</td>

                  <td>
                    <span
                      className={`badge ${
                        r.status === "approved"
                          ? "bg-success"
                          : r.status === "rejected"
                          ? "bg-danger"
                          : "bg-warning"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>

                  <td>

                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() =>
                        updateStatus(r._id, "approved")
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        updateStatus(r._id, "rejected")
                      }
                    >
                      Reject
                    </button>

                  </td>
                </tr>
              ))}

          </tbody>

        </table>
      </div>

      {/* PAGINATION */}

      <div className="d-flex justify-content-between mt-3">
        <p>
          Page {page} of {totalPages}
        </p>

        <div>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="btn btn-outline-secondary btn-sm me-2"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="btn btn-outline-secondary btn-sm"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}

export default EditRequestList;