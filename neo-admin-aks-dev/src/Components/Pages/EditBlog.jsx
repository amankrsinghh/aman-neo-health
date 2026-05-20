import { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import "jodit/es5/jodit.min.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { IoCloudUploadOutline } from "react-icons/io5";
import api from "../../utils/axios";
import { toast } from "react-toastify";
import { IMAGE_BASE_URL } from "../../utils/config";

function EditBlog() {
  const editor = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const blogData = location.state?.blog; // passed from Blogs list

  const [form, setForm] = useState({
    title: "", description: "", content: "", category: "Health",
    author: "NeoHealth", status: "published", tags: ""
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [blogId, setBlogId] = useState(null);

  useEffect(() => {
    if (blogData) {
      setBlogId(blogData._id);
      setForm({
        title: blogData.title || "",
        description: blogData.description || "",
        content: blogData.content || "",
        category: blogData.category || "Health",
        author: blogData.author || "NeoHealth",
        status: blogData.status || "published",
        tags: Array.isArray(blogData.tags) ? blogData.tags.join(", ") : blogData.tags || ""
      });
      if (blogData.image) {
        setPreview(`${IMAGE_BASE_URL}/uploads/blogs/${blogData.image}`);
      }
    }
  }, [blogData]);

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title required");
    if (!blogId) return toast.error("Blog ID missing — go back to blogs list");

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);

      const res = await api.put(`/api/admin/blogs/${blogId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        toast.success("Blog updated!");
        navigate("/blogs");
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally { setSaving(false); }
  };

  const config = {
    readonly: false, height: 300, toolbarSticky: false,
    placeholder: "Write content...",
    uploader: { insertImageAsBase64URI: true },
    toolbarAdaptive: false,
    style: { fontSize: "16px", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px" },
    buttons: ["bold", "italic", "underline", "|", "fontsize", "brush", "|", "align", "ul", "ol", "|", "paragraph", "link", "image", "hr"]
  };

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">
      <div className="row mb-3">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h3 className="innr-title mb-2 gradient-text">Edit Blog</h3>
            <div className="admin-breadcrumb">

              <nav aria-label="breadcrumb">
                <ol className="breadcrumb custom-breadcrumb">
                  <li className="breadcrumb-item"><NavLink to="/" className="breadcrumb-link">Dashboard</NavLink></li>
                  <li className="breadcrumb-item"><NavLink to="/blogs" className="breadcrumb-link">Blogs</NavLink></li>
                  <li className="breadcrumb-item active">Edit Blog</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="new-mega-card">
        <form onSubmit={handleSubmit}>
          <div className="row">

            <div className="col-lg-12">
              <div className="custom-frm-bx">
                <label>Title *</label>
                <input type="text" className="form-control admin-table-search-frm"
                  placeholder="Blog title" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
            </div>

            <div className="col-lg-8">
              <div className="custom-frm-bx">
                <label>Short Description *</label>
                <input type="text" className="form-control admin-table-search-frm"
                  placeholder="Short summary" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              </div>
            </div>

            <div className="col-lg-2">
              <div className="custom-frm-bx">
                <label>Category</label>
                <select className="form-control admin-table-search-frm"
                  value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {["Health", "Wellness", "Medical", "Nutrition", "Fitness", "News", "Other"].map(c =>
                    <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="col-lg-2">
              <div className="custom-frm-bx">
                <label>Status</label>
                <select className="form-control admin-table-search-frm"
                  value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="custom-frm-bx addblog">
                <label>Full Content</label>
                <JoditEditor ref={editor} value={form.content} config={config}
                  onBlur={v => setForm(f => ({ ...f, content: v }))} onChange={() => { }} />
              </div>
            </div>

            <div className="col-lg-12">
              <div className="custom-frm-bx">
                <label>Tags <span className="text-muted" style={{ fontSize: 12 }}>(comma separated)</span></label>
                <input type="text" className="form-control admin-table-search-frm"
                  placeholder="health, wellness, tips" value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="custom-frm-bx">
                <label>Thumbnail Image</label>
                <div className="upload-box p-3 justify-content-start" style={{ cursor: "pointer" }}
                  onClick={() => document.getElementById("editBlogImg").click()}>
                  {preview ? (
                    <img src={preview} alt="preview"
                      style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8 }}
                      onError={e => { e.target.src = "/blog-pic.jpg"; }} />
                  ) : (
                    <>
                      <div className="upload-icon mb-2"><IoCloudUploadOutline /></div>
                      <p className="fw-semibold mb-1">Click to change image</p>
                      <small className="format-title">JPEG, PNG format</small>
                      <div className="mt-3"><span className="browse-btn">Browse File</span></div>
                    </>
                  )}
                </div>
                <input type="file" className="d-none" id="editBlogImg"
                  accept=".png,.jpg,.jpeg" onChange={handleImg} />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-3 col-12">
              <NavLink to="/blogs" className="nw-filtr-thm-btn outline">Cancel</NavLink>
              <button type="submit" className="nw-filtr-thm-btn" disabled={saving}>
                {saving ? "Updating..." : "Update Blog"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
export default EditBlog;
