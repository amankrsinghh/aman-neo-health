import { NavLink, useNavigate } from "react-router-dom";
import { TbGridDots } from "react-icons/tb";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import Swal from "sweetalert2";
import { IMAGE_BASE_URL } from "../../utils/config";

function Blogs() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/blogs", { params: { page, limit, status: "all" } });
      setList(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch { setList([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchBlogs(); }, [page]);

  const deleteBlog = async (id) => {
    const r = await Swal.fire({ title: "Delete blog?", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (!r.isConfirmed) return;
    try {
      await api.delete(`/api/admin/blogs/${id}`);
      Swal.fire("Deleted!", "", "success");
      fetchBlogs();
    } catch { Swal.fire("Error", "Failed", "error"); }
  };

  const togglePublish = async (blog) => {
    try {
      await api.put(`/api/admin/blogs/${blog._id}`, { status: blog.status === "published" ? "draft" : "published" });
      fetchBlogs();
    } catch { }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const filtered = search ? list.filter(b => b.title?.toLowerCase().includes(search.toLowerCase())) : list;

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">
      <div className="row">
        <div className="d-flex align-items-center justify-content-between mega-content-bx">
          <div>
            <h3 className="innr-title mb-2 gradient-text">Blogs</h3>
            <div className="admin-breadcrumb">
              <nav aria-label="breadcrumb"><ol className="breadcrumb custom-breadcrumb">
                <li className="breadcrumb-item"><NavLink to="/" className="breadcrumb-link">Dashboard</NavLink></li>
                <li className="breadcrumb-item active">Blogs</li>
              </ol></nav>
            </div>
          </div>
          <NavLink to="/add-blog" className="nw-thm-btn"><FontAwesomeIcon icon={faPlus} className="me-1" /> Add Blog</NavLink>
        </div>
      </div>

      <div className="new-mega-card mt-3">
        <div className="d-flex mb-3">
          <div className="custom-frm-bx mb-0">
            <input type="text" className="form-control admin-table-search-frm search-table-frm"
              placeholder="Search blogs..." value={search} onChange={e => setSearch(e.target.value)} />
            <div className="adm-search-bx"><button className="tp-search-btn"><FontAwesomeIcon icon={faSearch} /></button></div>
          </div>
        </div>

        <div className="table-section admin-mega-section">
          <div className="table table-responsive mb-0">
            <table className="table mb-0">
              <thead><tr><th>#</th><th>Date</th><th>Image</th><th>Title</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
                  : filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-4 text-muted">No blogs found</td></tr>
                    : filtered.map((item, i) => (
                      <tr key={item._id}>
                        <td>{String((page - 1) * limit + i + 1).padStart(2, "0")}.</td>
                        <td>{fmt(item.createdAt)}</td>
                        <td>
                          <div className="blog-pic-bx">
                            <img src={item.image ? `${IMAGE_BASE_URL}blogs/${item.image}` : "/blog-pic.jpg"} alt=""
                              onError={e => { e.target.src = "/blog-pic.jpg"; }} />
                          </div>
                        </td>
                        <td style={{ maxWidth: 300 }}>{item.title}</td>
                        <td>
                          <span className={`approved ${item.status === "published" ? "approved-active" : "approved-pending"}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <ul className="d-flex align-items-center gap-2">
                            <li>
                              <div className="switch">
                                <input type="checkbox" id={`toggle-${item._id}`} checked={item.status === "published"} onChange={() => togglePublish(item)} />
                                <label htmlFor={`toggle-${item._id}`} className="mb-0"></label>
                              </div>
                            </li>
                            <li>
                              <NavLink to="/edit-blog" state={{ blog: item }} className="notifi-remv-btn">
                                <FontAwesomeIcon icon={faPen} />
                              </NavLink>
                            </li>
                            <li>
                              <a href="javascript:void(0)" className="notifi-remv-btn" onClick={() => deleteBlog(item._id)}>
                                <FontAwesomeIcon icon={faTrash} />
                              </a>
                            </li>
                          </ul>
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
export default Blogs;
