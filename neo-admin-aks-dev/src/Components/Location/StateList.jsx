import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { toast } from "react-toastify";

function StateList() {
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [countryCode, setCountryCode] = useState("");

  const [pagination, setPagination] = useState({});

  const [form, setForm] = useState({
    name: "",
    isoCode: "",
    countryCode: "",
  });

  const [editingId, setEditingId] = useState(null);

  /* ================= LOAD COUNTRIES ================= */

  const loadCountries = async () => {
    try {
      const res = await api.get(
        "/api/admin/location/countries?limit=1000"
      );
      setCountries(res.data.data);
    } catch {
      toast.error("Failed to load countries");
    }
  };

  /* ================= LOAD STATES ================= */

  const loadStates = async () => {
    setLoading(true);

    try {
      const res = await api.get(
        `/api/admin/location/states?page=${page}&limit=${limit}&search=${search}&countryCode=${countryCode}`
      );

      setStates(res.data.data);
      setPagination(res.data.pagination);

    } catch {
      toast.error("Failed to load states");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    loadStates();
  }, [page, search, countryCode]);

  /* ================= ADD / UPDATE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `/api/admin/location/states/${editingId}`,
          form
        );
        toast.success("State updated");
      } else {
        await api.post("/api/admin/location/states", form);
        toast.success("State added");
      }

      setForm({ name: "", isoCode: "", countryCode: "" });
      setEditingId(null);
      loadStates();

    } catch {
      toast.error("Failed to save");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (s) => {
    setForm({
      name: s.name,
      isoCode: s.isoCode,
      countryCode: s.countryCode,
    });

    setEditingId(s._id);
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this state?")) return;

    try {
      await api.delete(`/api/admin/location/states/${id}`);
      toast.success("Deleted successfully");
      loadStates();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="main-content p-3">

      <h3 className="mb-3">🏛️ State Management</h3>

      {/* ===== COUNTRY FILTER ===== */}

      <select
        className="form-select mb-3"
        value={countryCode}
        onChange={(e) => {
          setCountryCode(e.target.value);
          setPage(1);
        }}
      >
        <option value="">All Countries</option>

        {countries.map((c) => (
          <option key={c._id} value={c.isoCode}>
            {c.name}
          </option>
        ))}
      </select>

      {/* ===== SEARCH ===== */}

      <input
        placeholder="Search state..."
        className="form-control mb-3"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* ===== FORM ===== */}

      <form onSubmit={handleSubmit} className="mb-4">

        <input
          placeholder="State name"
          className="form-control mb-2"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          placeholder="ISO Code"
          className="form-control mb-2"
          value={form.isoCode}
          onChange={(e) =>
            setForm({ ...form, isoCode: e.target.value })
          }
          required
        />

        <select
          className="form-select mb-2"
          value={form.countryCode}
          onChange={(e) =>
            setForm({ ...form, countryCode: e.target.value })
          }
          required
        >
          <option value="">Select Country</option>

          {countries.map((c) => (
            <option key={c._id} value={c.isoCode}>
              {c.name}
            </option>
          ))}
        </select>

        <button className="btn btn-primary">
          {editingId ? "Update State" : "Add State"}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", isoCode: "", countryCode: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* ===== TABLE ===== */}

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <table className="table table-bordered table-striped">

          <thead>
            <tr>
              <th>Name</th>
              <th>ISO</th>
              <th>Country</th>
              <th width="180">Actions</th>
            </tr>
          </thead>

          <tbody>
            {states.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.isoCode}</td>
                <td>{s.countryCode}</td>

                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(s)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(s._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {states.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  No data found
                </td>
              </tr>
            )}

          </tbody>

        </table>
      )}

      {/* ===== PAGINATION ===== */}

      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2">

          <button
            className="btn btn-outline-primary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span className="align-self-center">
            Page {page} / {pagination.totalPages}
          </span>

          <button
            className="btn btn-outline-primary"
            disabled={page === pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}

export default StateList;