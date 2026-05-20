import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../../utils/axios";
import { toast } from "react-toastify";

function Index() {

  const [form, setForm] = useState({
    facebook: "",
    instagram: "",
    youtube: "",
    twitter: "",
    linkedin: "",email:"",contactNumber:"",address:""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH ================= */

  const loadData = async () => {
    try {
      const res = await api.get("/api/admin/social-links");

      if (res.data.data) {
        setForm({
          facebook: res.data.data.facebook || "",
          instagram: res.data.data.instagram || "",
          youtube: res.data.data.youtube || "",
          twitter: res.data.data.twitter || "",
          linkedin: res.data.data.linkedin || "",
          email: res.data.data.email || "",
          contactNumber: res.data.data.contactNumber || "",
          address: res.data.data.address || ""
        });
      }

    } catch {
      toast.error("Failed to load social links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= SAVE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.put("/api/admin/social-links", form);

      toast.success("Social links updated");

    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">

      {/* HEADER */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h3 className="innr-title mb-2 gradient-text">
            Social Links & Contact Settings
          </h3>

          <div className="admin-breadcrumb">
            <ol className="breadcrumb custom-breadcrumb">
              <li className="breadcrumb-item">
                <NavLink to="/" className="breadcrumb-link">
                  Dashboard
                </NavLink>
              </li>
              <li className="breadcrumb-item active">
                Social Links
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* FORM */}

      <div className="new-mega-card p-4">

        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : (

          <form onSubmit={handleSubmit}>
            <h4>Social Links</h4>

            <div className="row">

              {/* Facebook */}
              <div className="col-md-6 mb-3">
                <label>Facebook URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={form.facebook}
                  onChange={e =>
                    setForm({ ...form, facebook: e.target.value })
                  }
                />
              </div>

              {/* Instagram */}
              <div className="col-md-6 mb-3">
                <label>Instagram URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={form.instagram}
                  onChange={e =>
                    setForm({ ...form, instagram: e.target.value })
                  }
                />
              </div>

              {/* YouTube */}
              <div className="col-md-6 mb-3">
                <label>YouTube URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={form.youtube}
                  onChange={e =>
                    setForm({ ...form, youtube: e.target.value })
                  }
                />
              </div>

              {/* Twitter / X */}
              <div className="col-md-6 mb-3">
                <label>Twitter / X URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={form.twitter}
                  onChange={e =>
                    setForm({ ...form, twitter: e.target.value })
                  }
                />
              </div>

              {/* LinkedIn */}
              <div className="col-md-6 mb-3">
                <label>LinkedIn URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={form.linkedin}
                  onChange={e =>
                    setForm({ ...form, linkedin: e.target.value })
                  }
                />
              </div>

            </div>
            <h4>Contact Information</h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={e =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.contactNumber}
                  onChange={e =>
                    setForm({ ...form, contactNumber: e.target.value })
                  }
                />
              </div>

              {/* YouTube */}
              <div className="col-12 mb-3">
                <label>Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.address}
                  onChange={e =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="text-end mt-3">
              <button
                type="submit"
                className="nw-thm-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>

        )}
      </div>
    </div>
  );
}

export default Index;
