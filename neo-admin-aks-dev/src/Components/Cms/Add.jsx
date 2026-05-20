import { useState, useRef, useMemo } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import JoditEditor from "jodit-react";

function AddCMSPage() {
  const navigate = useNavigate();
  const editor = useRef(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",panel:"website",
    status: "active",
  });

  const [saving, setSaving] = useState(false);

  /* AUTO SLUG FROM TITLE */
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  /* INPUT CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
      ...(name === "title" && { slug: generateSlug(value) }),
    });
  };

  /* SAVE */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!form.slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    setSaving(true);

    try {
      await api.post(`/api/admin/cms/${form.slug}`, {
        title: form.title,
        content: form.content,
        status: form.status,
        panel: form.panel,
      });

      toast.success("CMS page created successfully");

      navigate(-1);
    } catch {
      toast.error("Failed to create page");
    } finally {
      setSaving(false);
    }
  };

   const config = useMemo(() => ({
    height: 400,
    readonly: false,
    toolbarAdaptive: false,
    iframe: true,
    iframeStyle: `
      body { font-family: sans-serif; padding: 10px; }
      ul { list-style-type: disc !important; padding-left: 2rem !important; margin: 0.5rem 0 !important; }
      ol { list-style-type: decimal !important; padding-left: 2rem !important; margin: 0.5rem 0 !important; }
      li { display: list-item !important; }
    `,
    buttons: [
      "bold", "italic", "underline", "|",
      "ul", "ol", "|",
      "font", "fontsize", "|",
      "align", "|",
      "link", "image", "|",
      "table", "|",
      "undo", "redo", "|",
      "hr", "eraser", "fullsize",
    ],
  }), []);
  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="gradient-text">Add CMS Page</h3>

        <NavLink to="/cms-page-list" className="nw-thm-btn">
          Back
        </NavLink>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="new-mega-card p-4">

          {/* TITLE */}
          <div className="mb-3">
            <label>Page Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter page title"
              required
            />
          </div>

          {/* SLUG */}
          <div className="mb-3">
            <label>Slug</label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="form-control"
              placeholder="about-us"
              required
            />
          </div>
           <div className="mb-3">
            <label>Panel</label>
            <select
              name="panel"
              value={form.panel}
              onChange={handleChange}
              className="form-select"
            >
              <option value="website">Website </option>
              <option value="lab">Laboratory</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
              <option value="hospital">Hospital</option>
            </select>
          </div>

          {/* STATUS */}
          <div className="mb-3">
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* ⭐ JODIT RICH EDITOR */}
          <div className="mb-3">
            <label>Page Content</label>

            <JoditEditor
              ref={editor}
              value={form.content}
              onBlur={(newContent) =>
                setForm({ ...form, content: newContent })
              }
              config={config}
            />
          </div>

          {/* SAVE BUTTON */}
          <div className="text-end">
            <button
              type="submit"
              className="nw-thm-btn"
              disabled={saving}
            >
              {saving ? "Creating..." : "Create Page"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

export default AddCMSPage;
