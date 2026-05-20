import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { toast } from "react-toastify";

function CountryList() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [pagination, setPagination] = useState({});

  const [form, setForm] = useState({
    name: "",
    isoCode: "",
  });

  const [editingId, setEditingId] = useState(null);

  /* ================= LOAD DATA ================= */

  const loadCountries = async () => {
    setLoading(true);

    try {
      const res = await api.get(
        `/api/admin/location/countries?page=${page}&limit=${limit}&search=${search}`
      );

      setCountries(res.data.data);
      setPagination(res.data.pagination);

    } catch {
      toast.error("Failed to load countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, [page, search]);

  /* ================= ADD / UPDATE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/api/admin/location/countries/${editingId}`, form);
        toast.success("Country updated");
      } else {
        await api.post("/api/admin/location/countries", form);
        toast.success("Country added");
      }

      setForm({ name: "", isoCode: "" });
      setEditingId(null);
      loadCountries();

    } catch {
      toast.error("Failed to save");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (c) => {
    setForm({
      name: c.name,
      isoCode: c.isoCode,
    });
    setEditingId(c._id);
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this country?")) return;

    try {
      await api.delete(`/api/admin/location/countries/${id}`);
      toast.success("Deleted successfully");
      loadCountries();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="main-content p-3">

      <h3 className="mb-3">🌍 Country Management</h3>

      {/* ===== SEARCH ===== */}

      <input
        placeholder="Search country..."
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
          placeholder="Country name"
          className="form-control mb-2"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          placeholder="ISO Code (IN)"
          className="form-control mb-2"
          value={form.isoCode}
          onChange={(e) =>
            setForm({ ...form, isoCode: e.target.value })
          }
          required
        />

        <button className="btn btn-primary">
          {editingId ? "Update Country" : "Add Country"}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setForm({ name: "", isoCode: "" });
              setEditingId(null);
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
              <th>ISO Code</th>
              <th width="180">Actions</th>
            </tr>
          </thead>

          <tbody>
            {countries.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.isoCode}</td>
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

            {countries.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center">
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

export default CountryList;