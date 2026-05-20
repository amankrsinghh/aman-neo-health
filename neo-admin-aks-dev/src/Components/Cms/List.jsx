import { useEffect, useState } from "react";
import { faPen, faTrash, faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import api from "../../utils/axios";

function List() {
  const [cmsPages, setCmsPages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [searchParams]=useSearchParams();
  const panel = searchParams.get("panel") || "";

  const fetchCms = async () => {
    try {
      const res = await api.get(`/api/admin/cms?panel=${panel}`);
      setCmsPages(res.data.data || []);
    } catch { toast.error("Failed to load CMS pages"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCms(); }, [panel]);

  const handleDelete = async (id, title) => {
    const r = await Swal.fire({
      title: `Delete "${title}"?`,
      text: "This cannot be undone",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#d33", confirmButtonText: "Delete"
    });
    if (!r.isConfirmed) return;
    try {
      await api.delete(`/api/admin/cms/${id}`);
      toast.success("Deleted successfully");
      fetchCms();
    } catch { toast.error("Delete failed"); }
  };

  const toggleStatus = async (page) => {
    try {
      await api.post(`/api/admin/cms/${page.slug}`, {
        title: page.title, content: page.content,
        status: page.status === "active" ? "inactive" : "active"
      });
      toast.success("Status updated");
      fetchCms();
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">
      <div className="row mb-3">
        <div className="d-flex align-items-center justify-content-between mega-content-bx">
          <div>
            <h3 className="innr-title mb-2 gradient-text">CMS Pages</h3>
            <div className="admin-breadcrumb">

            <nav aria-label="breadcrumb">
              <ol className="breadcrumb custom-breadcrumb">
                <li className="breadcrumb-item"><NavLink to="/" className="breadcrumb-link">Dashboard</NavLink></li>
                <li className="breadcrumb-item active">CMS Pages</li>
              </ol>
            </nav>
            </div>
          </div>
          <NavLink to="/add-cms" className="nw-thm-btn">
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Add CMS Page
          </NavLink>
        </div>
      </div>

      <div className="new-mega-card">
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : cmsPages.length === 0 ? (
          <div className="text-center p-5">
            <p className="text-muted mb-3">No CMS pages found.</p>
            <NavLink to="/add-cms" className="nw-thm-btn">Create your first page</NavLink>
          </div>
        ) : (
          <div className="table-section admin-mega-section">
            <div className="table table-responsive mb-0">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cmsPages.map((page, i) => (
                    <tr key={page._id}>
                      <td>{i + 1}</td>
                      <td className="fw-semibold">{page.title || "—"}</td>
                      <td className="text-capitalize">{page.panel || "—"}</td>
                      <td><code className="text-muted">{page.slug}</code></td>
                      <td>
                        <span
                          className={`approved ${page.status === "active" ? "approved-active" : "approved-reject"}`}
                          style={{ cursor:"pointer" }}
                          onClick={() => toggleStatus(page)}
                          title="Click to toggle"
                        >
                          {page.status}
                        </span>
                      </td>
                      <td style={{fontSize:13}}>
                        {new Date(page.updatedAt || page.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <NavLink to={`/edit-cms/${page.slug}/${page?.panel || ''}`} className="notifi-remv-btn" title="Edit">
                            <FontAwesomeIcon icon={faPen} />
                          </NavLink>
                          <button className="nw-action-btn" style={{color:"#FF4560"}}
                            onClick={() => handleDelete(page._id, page.title)} title="Delete">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default List;
