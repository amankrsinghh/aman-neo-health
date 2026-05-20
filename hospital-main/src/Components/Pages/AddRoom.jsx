import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { getSecureApiData } from "../../Service/api";

function AddRoom() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const navigate = useNavigate();

  const [floors, setFloors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    floorId: "",
    departmentId: "",
    roomName: ""
  });

  /* ---------------- FETCH FLOORS ---------------- */
  const fetchFloors = async () => {
    try {
      const res = await api.get("/bed/floor/list");
      setFloors(res.data.data);
    } catch {
      toast.error("Failed to load floors");
    }
  };

  /* ---------------- FETCH DEPARTMENTS ---------------- */
  const fetchDepartments = async () => {
    try {
      const res = await getSecureApiData(`api/department/list?limit=100`);
      if(res.success){
        setDepartments(res.data);
      }
    } catch {
      toast.error("Failed to load departments");
    }
  };

  useEffect(() => {
    fetchFloors();
    fetchDepartments();
  }, []);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.floorId || !form.departmentId || !form.roomName.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await api.put(`/bed/room/update/${id}`, form);
        toast.success("Room updated successfully");
      } else {
        await api.post("/bed/room/add", form);
        toast.success("Room added successfully");
      }

      navigate("/bed-management");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save room");
    } finally {
      setLoading(false);
    }
  };


  const fetchRoomById = async () => {
    try {
      const res = await api.get(`/bed/room/single/${id}`);
      setForm({
        floorId: res.data.data.floorId,
        departmentId: res.data.data.departmentId,
        roomName: res.data.data.roomName
      });
    } catch {
      toast.error("Failed to load room data");
    }
  };
  useEffect(() => {
    fetchFloors();
    fetchDepartments();

    if (isEdit) {
      fetchRoomById();
    }
  }, [id]);
  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">
      <div className="row mb-2">
        <h3 className="innr-title">{isEdit ? "Edit Room" : "Add Room"}</h3>
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

      <div className="new-panel-card">
        <form onSubmit={handleSubmit}>
          <div className="row">

            {/* FLOOR */}
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="custom-frm-bx">
                <label>Floor</label>
                <select
                    className="form-select nw-frm-select"
                    name="floorId"
                    value={form.floorId}
                    onChange={handleChange}
                  >
                    <option value="">---Select Floor---</option>
                    {floors.map(f => (
                      <option key={f._id} value={f._id}>
                        {f.floorName}
                      </option>
                    ))}
                  </select>
              </div>
            </div>

            {/* DEPARTMENT */}
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="custom-frm-bx">
                <label>Department</label>
                <select
                    className="form-select nw-frm-select"
                    name="departmentId"
                    value={form.departmentId}
                    onChange={handleChange}
                  >
                    <option value="">---Select Department---</option>
                    {departments.map(d => (
                      <option key={d._id} value={d._id}>
                        {d.departmentName}
                      </option>
                    ))}
                  </select>
              </div>
            </div>

            {/* ROOM NAME */}
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="custom-frm-bx">
                <label>Room</label>
                <input
                  type="text"
                  className="form-control nw-frm-select"
                  placeholder="Enter Room"
                  name="roomName"
                  value={form.roomName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* SUBMIT */}
            <div className="d-flex justify-content-between mt-3">
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
        </form>
      </div>
    </div>
  );
}

export default AddRoom