import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useParams } from "react-router-dom";

function AddFloor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [floorName, setFloorName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!floorName.trim()) {
      toast.error("Floor name is required");
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await api.put(`/bed/floor/update/${id}`, {
          floorName
        });
        toast.success("Floor updated successfully");
      } else {
        await api.post("/bed/floor/add", {
          floorName
        });
        toast.success("Floor added successfully");
      }

      navigate("/bed-management");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isEdit) {
      fetchFloor();
    }
  }, [id]);

  const fetchFloor = async () => {
    try {
      const res = await api.get(`/bed/floor/${id}`);
      setFloorName(res.data.data.floorName);
    } catch (err) {
      toast.error("Failed to load floor data");
    }
  };


  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        <div className="row mb-2">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="innr-title mb-2"> {isEdit ? "Edit Floor" : "Add Floor"}</h3>
              <div className="admin-breadcrumb">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb custom-breadcrumb">
                    <li className="breadcrumb-item">
                      <NavLink to="/dashboard"  className="breadcrumb-link">Dashboard</NavLink>
                    </li>
                    <li className="breadcrumb-item">
                      <NavLink to="/bed-management"  className="breadcrumb-link">Bed Management</NavLink>
                    </li>
                    <li className="breadcrumb-item active"> {isEdit ? "Edit Floor" : "Add Floor"}</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="new-panel-card">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-12">
                <div className="custom-frm-bx">
                  <label>Floor Name</label>
                  <input
                    type="text"
                    className="form-control nw-frm-select"
                    placeholder="Enter floor name"
                    value={floorName}
                    onChange={(e) => setFloorName(e.target.value)}
                  />
                </div>

                <div className="text-end d-flex justify-content-between mt-3">
                  <Link to={-1} className="nw-thm-btn outline" >
                    Go Back
                  </Link>
                  <button
                    type="submit"
                    className="nw-thm-btn"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : isEdit ? "Update" : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddFloor