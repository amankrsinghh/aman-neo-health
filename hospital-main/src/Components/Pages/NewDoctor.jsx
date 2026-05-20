import { FaPlusCircle } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";

function NewDoctor() {
  const navigate = useNavigate();
  const [doctorId, setDoctorId] = useState("");
  const [doctorData, setDoctorData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔍 Check doctor ID
  const handleCheckDoctor = async () => {
    if (!doctorId) return;

    setLoading(true);
    try {
      const res = await api.get(`/comman/check-doctor-id/${doctorId}`);
      setDoctorData(res.data.data);
      navigate(`/edit-doctor-data/${res.data.data._id}`);
      setError("");
    } catch (err) {
      setDoctorData(null);
      setError("Doctor ID not found");
    } finally {
      setLoading(false);
    }
  };

  // Add doctor
  const handleAddDoctor = async () => {
    if (!doctorData) return;
    try {
      await api.post("/comman/add-existing-doctor", {
        userId: doctorData._id
      });
      toast.success("Doctor added successfully");
      setDoctorId("");
      setDoctorData(null);
    } catch (err) {
      console.log(err)
      toast.error(
        err?.response?.data?.message || "Failed to add doctor"
      );
    }
  };


  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">
      <h3 className="innr-title mb-2 ">Add Doctors</h3>

      <div className="new-panel-card col-lg-8">
        <div className="hospital-add-doctor mb-2">
          <div>
            <h4 className="fz-18 text-black fw-700 mb-0">Add Doctor</h4>
            <p className="mb-0">Please enter doctor ID and doctor details</p>
          </div>

          <div>
            <NavLink to="/add-doctor" className="nw-exprt-btn">
              <FaPlusCircle /> Add Doctor/Nurse Manually
            </NavLink>
          </div>
        </div>

        {/* Doctor ID Input */}
        <div className="custom-frm-bx-second">
          <label>Doctor ID</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Doctor ID"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            onBlur={handleCheckDoctor}
          />

          {loading && <small className="text-info">Checking...</small>}
          {error && <small className="text-danger">{error}</small>}
        </div>

        {/* ✅ Doctor Detail Table */}
        {doctorData && (
          <div className="table-responsive mt-3">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Doctor ID</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{doctorData.name}</td>
                  <td>{doctorData.email}</td>
                  <td>{doctorData.role}</td>
                  <td>{doctorId}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 🔘 Button Logic */}
        <div className="text-center mt-4">
          <button
            className="nw-thm-btn w-75"
            disabled={!doctorData}
            onClick={handleAddDoctor}
          >
            {doctorData ? "Add" : "Submit"}
          </button>
        </div>
      </div>
      <div className="text-end mt-3">
        <Link to={-1} className="nw-thm-btn outline" >
          Go Back
        </Link>
      </div>
    </div>
  );
}

export default NewDoctor;
