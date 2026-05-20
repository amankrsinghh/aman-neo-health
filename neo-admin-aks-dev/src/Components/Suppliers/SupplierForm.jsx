import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/axios";

function SupplierForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // edit mode if exists

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    type: "pharmacy",
    score: 0
  });

  /* ================= LOAD FOR EDIT ================= */

  useEffect(() => {
    if (!id) return;

    const loadSupplier = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/admin/suppliers/${id}`);
        setForm(res.data.data);
      } catch {
        toast.error("Failed to load supplier");
      } finally {
        setLoading(false);
      }
    };

    loadSupplier();
  }, [id]);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.mobileNumber) {
      toast.error("Name & Mobile required");
      return;
    }

    try {
      setSaving(true);

      if (id) {
        await api.put(`/api/admin/suppliers/${id}`, form);
        toast.success("Supplier updated");
      } else {
        await api.post("/api/admin/suppliers", form);
        toast.success("Supplier added");
      }

      navigate("/suppliers");

    } catch (err) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="main-content d-flex justify-content-center align-items-center">
        <span className="spinner-border text-primary" />
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="main-content p-3">

      <h3 className="gradient-text mb-3">
        {id ? "Edit Supplier" : "Add Supplier"}
      </h3>

      <div className="new-mega-card p-4">

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <label>Name *</label>
          <input
            name="name"
            className="form-control mb-3"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* MOBILE */}
          <label>Mobile *</label>
          <input
            name="mobileNumber"
            className="form-control mb-3"
            value={form.mobileNumber}
            onChange={handleChange}
            required
          />

          {/* EMAIL */}
          <label>Email</label>
          <input
            name="email"
            type="email"
            className="form-control mb-3"
            value={form.email}
            onChange={handleChange}
          />

          {/* ADDRESS */}
          <label>Address</label>
          <textarea
            name="address"
            rows={3}
            className="form-control mb-3"
            value={form.address}
            onChange={handleChange}
          />

          {/* CITY */}
          <label>City</label>
          <input
            name="city"
            className="form-control mb-3"
            value={form.city}
            onChange={handleChange}
          />

          {/* PINCODE */}
          <label>Pincode</label>
          <input
            name="pincode"
            className="form-control mb-3"
            value={form.pincode}
            onChange={handleChange}
          />

          {/* TYPE */}
          <label>Type</label>
          <select
            name="type"
            className="form-select mb-3"
            value={form.type}
            onChange={handleChange}
          >
            <option value="pharmacy">Pharmacy Supplier</option>
            <option value="hospital">Hospital Supplier</option>
          </select>

          {/* SCORE */}
          <label>Score</label>
          <input
            type="number"
            name="score"
            className="form-control mb-4"
            value={form.score}
            onChange={handleChange}
          />

          {/* BUTTONS */}
          <div className="d-flex gap-2">

            <button
              type="submit"
              className="nw-thm-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : id
                ? "Update Supplier"
                : "Add Supplier"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/suppliers")}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default SupplierForm;