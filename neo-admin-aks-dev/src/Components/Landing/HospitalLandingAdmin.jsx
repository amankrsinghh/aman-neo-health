import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";

function HospitalLandingAdmin() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    hero: {
      title: "",
      subtitle: "",
      description: "",
      ctaText: "",
    },

    capabilities: [],
    modules: [],          // ✅ Correct field (DB compatible)
    trustFeatures: [],

    cta: {
      title: "",
      subtitle: "",
      buttonText: "",
    },

    isActive: true,
  });

  /* LOAD DATA */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const res = await api.get("/api/admin/landing/hospital");

        if (res.data?.data) {
          const d = res.data.data;

          setForm({
            hero: {
              title: d.hero?.title || "",
              subtitle: d.hero?.subtitle || "",
              description: d.hero?.description || "",
              ctaText: d.hero?.ctaText || "",
            },

            capabilities: d.capabilities || [],
            modules: d.modules || [],     // ✅ Correct mapping
            trustFeatures: d.trustFeatures || [],

            cta: {
              title: d.cta?.title || "",
              subtitle: d.cta?.subtitle || "",
              buttonText: d.cta?.buttonText || "",
            },

            isActive: d.isActive ?? true,
          });
        }
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* HERO CHANGE */
  const handleHeroChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  /* CTA CHANGE */
  const handleCTAChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      cta: { ...prev.cta, [field]: value },
    }));
  };

  /* ARRAY HANDLERS */
  const addItem = (key) => {
    setForm((prev) => ({
      ...prev,
      [key]: [...prev[key], { title: "" }],
    }));
  };

  const removeItem = (key, index) => {
    setForm((prev) => {
      const updated = [...prev[key]];
      updated.splice(index, 1);
      return { ...prev, [key]: updated };
    });
  };

  const updateItem = (key, index, value) => {
    setForm((prev) => {
      const updated = [...prev[key]];
      updated[index] = { ...updated[index], title: value };
      return { ...prev, [key]: updated };
    });
  };

  /* SAVE */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post("/api/admin/landing/hospital", form);
      toast.success("Hospital landing saved successfully");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  /* ===== LOADER ===== */
  if (loading) {
    return (
      <div className="main-content flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Loading landing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">

      <h3 className="gradient-text mb-3">Hospital Landing Page</h3>

      <form onSubmit={handleSubmit}>
        <div className="new-mega-card p-4">

          {/* ===== HERO ===== */}
          <h5>Hero Section</h5>

          <input
            className="form-control mb-2"
            placeholder="Title"
            value={form.hero.title}
            onChange={(e) => handleHeroChange("title", e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Subtitle"
            value={form.hero.subtitle}
            onChange={(e) => handleHeroChange("subtitle", e.target.value)}
          />

          <textarea
            className="form-control mb-3"
            placeholder="Description"
            rows={3}
            value={form.hero.description}
            onChange={(e) =>
              handleHeroChange("description", e.target.value)
            }
          />

          <input
            className="form-control mb-4"
            placeholder="CTA Text"
            value={form.hero.ctaText}
            onChange={(e) =>
              handleHeroChange("ctaText", e.target.value)
            }
          />

          {/* ===== CAPABILITIES ===== */}
          <h5>Hospital Services / Capabilities</h5>

          {form.capabilities?.map((item, i) => (
            <div key={i} className="d-flex mb-2 gap-2">
              <input
                className="form-control"
                placeholder="Service title"
                value={item.title}
                onChange={(e) =>
                  updateItem("capabilities", i, e.target.value)
                }
              />

              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeItem("capabilities", i)}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary mb-4"
            onClick={() => addItem("capabilities")}
          >
            + Add Service
          </button>

          {/* ===== MODULES ===== */}
          <h5>Modules</h5>

          {form.modules?.map((item, i) => (
            <div key={i} className="d-flex mb-2 gap-2">
              <input
                className="form-control"
                placeholder="Module title"
                value={item.title}
                onChange={(e) =>
                  updateItem("modules", i, e.target.value)
                }
              />

              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeItem("modules", i)}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary mb-4"
            onClick={() => addItem("modules")}
          >
            + Add Module
          </button>

          {/* ===== TRUST FEATURES ===== */}
          <h5>Trust & Safety Features</h5>

          {form.trustFeatures?.map((item, i) => (
            <div key={i} className="d-flex mb-2 gap-2">
              <input
                className="form-control"
                placeholder="Feature title"
                value={item.title}
                onChange={(e) =>
                  updateItem("trustFeatures", i, e.target.value)
                }
              />

              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeItem("trustFeatures", i)}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary mb-4"
            onClick={() => addItem("trustFeatures")}
          >
            + Add Feature
          </button>

          {/* ===== CTA ===== */}
          <h5>CTA Section</h5>

          <input
            className="form-control mb-2"
            placeholder="CTA Title"
            value={form.cta.title}
            onChange={(e) =>
              handleCTAChange("title", e.target.value)
            }
          />

          <input
            className="form-control mb-2"
            placeholder="CTA Subtitle"
            value={form.cta.subtitle}
            onChange={(e) =>
              handleCTAChange("subtitle", e.target.value)
            }
          />

          <input
            className="form-control mb-4"
            placeholder="Button Text"
            value={form.cta.buttonText}
            onChange={(e) =>
              handleCTAChange("buttonText", e.target.value)
            }
          />

          {/* ===== STATUS ===== */}
          <div className="mb-4">
            <label>Status</label>
            <select
              className="form-select"
              value={form.isActive ? "active" : "inactive"}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isActive: e.target.value === "active",
                }))
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* SAVE BUTTON */}
          <div className="text-end">
            <button
              type="submit"
              className="nw-thm-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Landing"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

export default HospitalLandingAdmin;