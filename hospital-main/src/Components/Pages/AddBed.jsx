import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { getSecureApiData } from "../../Service/api";

function AddBed() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [floors, setFloors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myDoctors, setMyDoctors] = useState([])
  const [doctorData, setDoctorData] = useState()
  const [addData, setAddData] = useState(JSON.parse(localStorage.getItem('addBedData')))
  const [form, setForm] = useState({
    floorId: "",
    departmentId: "",
    roomId: "",
    bedName: "",
    perDayFees: "", doctorId: ""
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
  const fetchDoctors = async () => {
    try {
      const res = await api.get("/hospital-doctor/list?limit=1000&status=active");
      setMyDoctors(res.data.data);
    } catch {
      toast.error("Failed to load doctors");
    }
  };

  /* ---------------- FETCH DEPARTMENTS ---------------- */
  const fetchDepartments = async () => {
    try {
      const res = await getSecureApiData(`api/department/list?limit=100`);
      if (res.success) {
        setDepartments(res.data);
      }
    } catch {
      toast.error("Failed to load departments");
    }
  };

  /* ---------------- FETCH ROOMS (CASCADE) ---------------- */
  const fetchRooms = async (floorId) => {
    if (!floorId) {
      setRooms([]);
      return;
    }

    try {
      const res = await api.get(`/bed/room/${floorId}`);
      setRooms(res.data.data);
    } catch {
      toast.error("Failed to load rooms");
    }
  };





  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "floorId") {
      setForm(prev => ({ ...prev, roomId: "" }));
      fetchRooms(value);
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form?.doctorId?.length < 12) {
      return toast.error("Please enter a valid doctor id   ")
    }

    if (
      !form.floorId ||
      !form.departmentId ||
      !form.roomId ||
      !form.doctorId.trim() ||
      !form.bedName.trim() ||
      form.perDayFees === "" || form.perDayFees === null
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        // 🔁 UPDATE
        const res = await api.put(`/bed/bed/update/${id}`, form);
        if (res.data.success) {
          localStorage.removeItem('addBedData')
          toast.success("Bed updated successfully");
        } else {
          toast.error(res.data.message)
        }
      } else {
        // ➕ ADD
        const res = await api.post("/bed/bed/add", form);
        if (res.data.success) {
          localStorage.removeItem('addBedData')
          toast.success("Bed added successfully");
        } else {
          toast.error(res.data.message)
        }
      }

      navigate("/bed-management");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save bed");
    } finally {
      setLoading(false);
    }
  };

  const fetchBedById = async () => {
    try {
      const res = await api.get(`/bed/bed/single/${id}`);
      const bed = res.data.data;

      // 1️⃣ Load rooms first
      await fetchRooms(bed.floorId);

      // 2️⃣ Then set form
      setForm({
        floorId: bed.floorId,
        departmentId: bed.departmentId?._id || bed.departmentId,
        roomId: bed.roomId?._id || bed.roomId,
        bedName: bed.bedName, doctorId: bed.doctorId?._id || "",
        perDayFees: bed.pricePerDay
      });

    } catch {
      toast.error("Failed to load bed");
    }
  };
  useEffect(() => {
    if (addData) {
      fetchRooms(addData?.floorId)
      setForm({
        ...form, roomId: addData?.roomId, floorId: addData?.floorId,
        departmentId: addData?.departmentId
      })
    }
  }, [addData])

  useEffect(() => {
    fetchDoctors()
  }, [])
  useEffect(() => {
    fetchFloors();
    fetchDepartments();

    if (isEdit) {
      fetchBedById();
    }
  }, [id]);
  
  

  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        <form action="">
          <div className="row mb-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h3 className="innr-title mb-2">{isEdit ? "Edit Bed" : "Add Bed"}</h3>
                <div className="admin-breadcrumb">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb custom-breadcrumb">
                      <li className="breadcrumb-item">
                        <NavLink to="/dashboard" className="breadcrumb-link">
                          Dashboard
                        </NavLink>
                      </li>

                      <li className="breadcrumb-item">
                        <NavLink to="/bed-management" className="breadcrumb-link">
                          Bed management
                        </NavLink>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Add Bed
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </form>

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

              {/* ROOM */}
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="custom-frm-bx ">
                  <label>Room</label>
                  <select
                    className="form-select nw-frm-select"
                    name="roomId"
                    value={form.roomId}
                    onChange={handleChange}
                    disabled={!rooms.length}
                  >
                    <option value="">---Select Room---</option>
                    {rooms.map(r => (
                      <option key={r._id} value={r._id}>
                        {r.roomName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* BED NAME */}
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="custom-frm-bx">
                  <label>Bed</label>
                  <input
                    type="text"
                    className="form-control nw-frm-select"
                    placeholder="Enter Bed"
                    name="bedName"
                    value={form.bedName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* FEES */}
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="custom-frm-bx">
                  <label>Bed Per Day Fees</label>
                  <input
                    type="number"
                    className="form-control nw-frm-select"
                    placeholder="Enter Per Day Fees"
                    name="perDayFees"
                    value={form.perDayFees}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="custom-frm-bx">
                  <label>Doctor NHC (Id)</label>
                  <select
                      className="form-select custom-select"
                      name="doctorId"
                      value={form.doctorId}
                    onChange={handleChange}
                    >
                      <option value="">---Select Attending Doctor---</option>
                      {myDoctors.map(d => (
                        <option key={d._id} value={d?._id}>
                           {d.name}
                        </option>
                      ))}
                    </select>
                  {/* <input
                    type="number"
                    className="form-control nw-frm-select"
                    name="doctorId"
                    value={form.doctorId}
                    onChange={handleChange}
                  /> */}
                </div>
              </div>
          


              {/* SUBMIT */}
              <div className="d-flex justify-content-between mt-3">
                <button type="button" className="nw-thm-btn outline" onClick={() => {
                  localStorage.removeItem('addBedData')
                  navigate("/bed-management")
                }}>
                  Go Back
                </button>
                <button
                  type="submit"
                  className="nw-thm-btn"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default AddBed