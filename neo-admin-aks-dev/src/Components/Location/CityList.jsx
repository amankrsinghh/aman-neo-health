import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { toast } from "react-toastify";

function CityList() {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [countryCode, setCountryCode] = useState("");
  const [stateCode, setStateCode] = useState("");

  const [pagination, setPagination] = useState({});

  const [form, setForm] = useState({
    name: "",
    countryCode: "",
    stateCode: "",
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

  /* ================= LOAD STATES (BY COUNTRY) ================= */

  const loadStates = async (code) => {
    if (!code) {
      setStates([]);
      return;
    }

    try {
      const res = await api.get(
        `/api/admin/location/states?countryCode=${code}&limit=1000`
      );
      setStates(res.data.data);
    } catch {
      toast.error("Failed to load states");
    }
  };

  /* ================= LOAD CITIES ================= */

  const loadCities = async () => {
    setLoading(true);

    try {
      const res = await api.get(
        `/api/admin/location/cities?page=${page}&limit=${limit}&search=${search}&countryCode=${countryCode}&stateCode=${stateCode}`
      );

      setCities(res.data.data);
      setPagination(res.data.pagination);

    } catch {
      toast.error("Failed to load cities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    loadStates(countryCode);
    setStateCode("");
  }, [countryCode]);

  useEffect(() => {
    loadCities();
  }, [page, search, countryCode, stateCode]);

  /* ================= ADD / UPDATE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `/api/admin/location/cities/${editingId}`,
          form
        );
        toast.success("City updated");
      } else {
        await api.post("/api/admin/location/cities", form);
        toast.success("City added");
      }

      setForm({ name: "", countryCode: "", stateCode: "" });
      setEditingId(null);
      loadCities();

    } catch {
      toast.error("Failed to save");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (c) => {
    setForm({
      name: c.name,
      countryCode: c.countryCode,
      stateCode: c.stateCode,
    });

    setEditingId(c._id);
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this city?")) return;

    try {
      await api.delete(`/api/admin/location/cities/${id}`);
      toast.success("Deleted successfully");
      loadCities();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="main-content p-3">

      <h3 className="mb-3">🏙️ City Management</h3>

      {/* ===== COUNTRY FILTER ===== */}

      <select
        className="form-select mb-2"
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

      {/* ===== STATE FILTER ===== */}

      <select
        className="form-select mb-3"
        value={stateCode}
        onChange={(e) => {
          setStateCode(e.target.value);
          setPage(1);
        }}
      >
        <option value="">All States</option>

        {states.map((s) => (
          <option key={s._id} value={s.isoCode}>
            {s.name}
          </option>
        ))}
      </select>

      {/* ===== SEARCH ===== */}

      <input
        placeholder="Search city..."
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
          placeholder="City name"
          className="form-control mb-2"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
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

        <select
          className="form-select mb-2"
          value={form.stateCode}
          onChange={(e) =>
            setForm({ ...form, stateCode: e.target.value })
          }
          required
        >
          <option value="">Select State</option>

          {states.map((s) => (
            <option key={s._id} value={s.isoCode}>
              {s.name}
            </option>
          ))}
        </select>

        <button className="btn btn-primary">
          {editingId ? "Update City" : "Add City"}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", countryCode: "", stateCode: "" });
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
              <th>State</th>
              <th>Country</th>
              <th width="180">Actions</th>
            </tr>
          </thead>

          <tbody>
            {cities.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.stateCode}</td>
                <td>{c.countryCode}</td>

                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {cities.length === 0 && (
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

export default CityList;