import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import api from "../../utils/axios";

function EditFaqs() {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const faqId = params.get("id");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [panel,setPanel]=useState("main")
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false); // 🔥 track changes

  /* ================= LOAD FAQ ================= */
  useEffect(() => {
    if (!faqId) {
      navigate("/faqs");
      return;
    }

    const fetchFaq = async () => {
      try {
        const res = await api.get(`/api/admin/faqs/${faqId}`);
        setQuestion(res.data.data.question);
        setPanel(res.data.data.panel)
        setAnswer(res.data.data.answer);
      } catch {
        toast.error("Failed to load FAQ");
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, [faqId, navigate]);

  /* ================= UPDATE FAQ ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question || !answer) {
      toast.warning("Question and Answer are required");
      return;
    }

    const confirm = await Swal.fire({
      title: "Save changes?",
      text: "Do you want to update this FAQ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
    });

    if (!confirm.isConfirmed) return;

    try {
      setSaving(true);
      await api.put(`/api/admin/faqs/${faqId}`, { question, answer,panel });
      toast.success("FAQ updated successfully");
      navigate("/faqs");
    } catch {
      toast.error("Failed to update FAQ");
    } finally {
      setSaving(false);
    }
  };

  /* ================= CANCEL ================= */
  const handleCancel = async (e) => {
    e.preventDefault();

    if (!dirty) {
      navigate("/faqs");
      return;
    }

    const confirm = await Swal.fire({
      title: "Discard changes?",
      text: "Unsaved changes will be lost!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, discard",
    });

    if (confirm.isConfirmed) {
      navigate("/faqs");
    }
  };

  if (loading) return <div className="p-3">Loading...</div>;

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">
      {/* HEADER */}
      <div className="row">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h3 className="innr-title mb-2 gradient-text">FAQs</h3>
            <div className="admin-breadcrumb">
              <ol className="breadcrumb custom-breadcrumb">
                <li className="breadcrumb-item">
                  <NavLink to="/" className="breadcrumb-link">
                    Dashboard
                  </NavLink>
                </li>
                <li className="breadcrumb-item">
                  <NavLink to="/faqs" className="breadcrumb-link">
                    FAQs
                  </NavLink>
                </li>
                <li className="breadcrumb-item active">Edit FAQs</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="new-mega-card">
        <div className="row">
          <form onSubmit={handleSubmit}>
            <div className="col-lg-12">
              <div className="custom-frm-bx">
                <label>Question</label>
                <input
                  type="text"
                  className="form-control admin-table-search-frm"
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    setDirty(true);
                  }}
                  required
                />
              </div>
            </div>

            <div className="col-lg-12">
              <div className="custom-frm-bx">
                <label>Panel</label>
                <select className="form-control" value={panel}
                  onChange={(e) => {
                    setPanel(e.target.value);
                    setDirty(true);
                  }}>
                  <option value="main">Website</option>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="hospital">Hospital</option>
                  <option value="lab">Laboratory</option>
                </select>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="custom-frm-bx">
                <label>Answer</label>
                <textarea
                  className="form-control admin-table-search-frm"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setDirty(true);
                  }}
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-3">
              <button
                className="nw-filtr-thm-btn outline"
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="nw-filtr-thm-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditFaqs;
