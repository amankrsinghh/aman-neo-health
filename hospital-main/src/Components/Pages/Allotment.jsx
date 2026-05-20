import { IoCloudUploadOutline } from "react-icons/io5";
import { FaPlusSquare } from "react-icons/fa";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import api from "../../api/api";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getSecureApiData } from "../../Service/api";

function Allotment() {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams,setSearchParams]=useSearchParams()
  const isEdit = location.pathname.includes("/edit-allotment");
  const bedId = !isEdit ? id : null;
  const allotmentId = isEdit ? id : null;


  const navigate = useNavigate();
  const [floors, setFloors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [allotment, setAllotment] = useState({
    patientId: "",
    doctorId: "",
    allotmentDate: "",
    expectedDischargeDate: "",patientDepartment:null,
    reason: "",
    note: "",
    staffDate: ""
  })


  const [attendingStaff, setAttendingStaff] = useState([
    {
      type: "",       // Doctor / Nurse
      staffId: "",    // doctorId ya staffId
      date: ""
    }
  ]);



  const [patient, setPatient] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [staff, setStaff] = useState([]);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    floorId: "",
    departmentId: "",
    roomId: "",
    bedName: "",
    perDayFees: "",
  });


  const addStaffRow = () => {
    setAttendingStaff(prev => ([
      ...prev,
      { type: "", staffId: "", date: "" }
    ]));
  };


  const removeStaffRow = (index) => {
    setAttendingStaff(prev => prev.filter((_, i) => i !== index));
  };


  const handleStaffChange = (index, field, value) => {
    setAttendingStaff(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };





  const handleAllotmentChange = (e) => {
    const { name, value } = e.target;
    setAllotment(prev => ({ ...prev, [name]: value }));
  };


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
      const res = await getSecureApiData("api/department/list?limit=110");
      if(res.success){
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

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "floorId") {
      setForm((prev) => ({ ...prev, roomId: "" }));
      fetchRooms(value);
    }
  };

  const fetchBedById = async () => {
    try {
      const res = await api.get(`/bed/bed/single/${bedId}`);
      const bed = res.data.data;

      await fetchRooms(bed.floorId);

      setForm({
        floorId: bed.floorId,
        departmentId: bed.departmentId,
        roomId: bed.roomId,
        bedName: bed.bedName,
        perDayFees: bed.pricePerDay
      });
    } catch {
      toast.error("Failed to load bed");
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients/IPD-list?limit=100000");
      setPatient(res.data.data);
    } catch {
      toast.error("Failed to load patients");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/hospital-doctor/list?limit=1000&status=active");
      setDoctor(res.data.data);
    } catch {
      toast.error("Failed to load doctors");
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await getSecureApiData("api/staff/list?status=active&limit=1000");
      if(res.success){
        setStaff(res.staffData);
      }
    } catch {
      toast.error("Failed to load staff");
    }
  };


  const fetchAllotmentById = async () => {
    try {
      const res = await api.get(`/bed/allotment/${allotmentId}`);
      const data = res.data.data;
      await fetchRooms(data.bedId.floorId._id);
      setForm({
        floorId: data.bedId.floorId._id,
        departmentId: data.bedId.departmentId,
        roomId: data.bedId.roomId?._id,
        bedName: data.bedId.bedName,
        perDayFees: data.bedId.pricePerDay
      });

      setAllotment({
        patientId: data.patientId._id,
        doctorId: data.primaryDoctorId?._id || "",
        allotmentDate: data.allotmentDate?.slice(0, 10),
        expectedDischargeDate: data.expectedDischargeDate?.slice(0, 10),
        reason: data.admissionReason || "",
        note: data.note || ""
      });

      setAttendingStaff(
        data.attendingStaff?.length
          ? data.attendingStaff.map(s => ({
            type: s.staffType,
            staffId: s.staffId?._id,
            date: s.date?.slice(0, 10)
          }))
          : [{ type: "", staffId: "", date: "" }]
      );

    } catch {
      toast.error("Failed to load allotment");
    }
  };
  console.log(form)




  useEffect(() => {
    fetchFloors();
    fetchDepartments();
    fetchPatients();
    fetchDoctors();
    fetchStaff();

    if (isEdit && allotmentId) {
      fetchAllotmentById();
    }

    if (!isEdit && bedId) {
      fetchBedById();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
console.log( !form.floorId ,
      !form.departmentId ,
      !form.roomId ,
      !form.bedName ,
      !allotment.patientId ,
      !allotment.doctorId ,
      !allotment.allotmentDate)
    if (
      !form.floorId ||
      !form.departmentId ||
      !form.roomId ||
      !form.bedName ||
      !allotment.patientId ||
      !allotment.doctorId ||
      !allotment.allotmentDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    let data={...allotment}
    const ptDept=patient.find(item=>item?.patientId?._id==allotment?.patientId)
    
    if(ptDept){
      data.patientDepartment=ptDept?._id
    }

    try {
      setLoading(true);

      if (isEdit) {
        const res = await api.put(`/bed/allotment/update/${allotmentId}`, {
          allotmentDetails: data,
          attendingStaff
        });
        if (res.data.success) {
          toast.success("Allotment updated");
        } else {
          toast.error(res.data.message)
        }
      } else {
        const res = await api.post("/bed/allotment/add", {
          bedDetails: form,
          allotmentDetails: data,
          attendingStaff
        });
        if (res.data.success) {

          toast.success("Bed allotted");
        } else {
          toast.error(res.data.message)
        }
      }

      navigate("/bed-management");
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  if (searchParams.get("patientId")) {
    setAllotment((prev) => ({
      ...prev,
      patientId: searchParams.get("patientId"),
    }));
  }

  return () => {
  setSearchParams({});
};
}, []);
 


  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        <div className="row ">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="innr-title mb-2">{isEdit ? "Edit Allotment" : "New Allotment"}</h3>
              <div className="admin-breadcrumb">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb custom-breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#" className="breadcrumb-link">
                        Dashboard
                      </a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="#" className="breadcrumb-link">
                        Bed management
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Allotment
                    </li>
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
                <div className="">
                  <h5 className="add-contact-title">Bed Details</h5>
                </div>
              </div>

              {/* FLOOR */}
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="custom-frm-bx">
                  <label>Floor</label>
                  <select
                    className="form-select"
                    name="floorId"
                    disabled
                    value={form.floorId}
                  // onChange={handleChange}
                  >
                    <option value="">---Select Floor---</option>
                    {floors.map((f) => (
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
                    className="form-select"
                    name="departmentId"
                    value={form.departmentId}
                    onChange={handleChange}
                    disabled
                  >
                    <option value="">---Select Department---</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ROOM */}
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="custom-frm-bx">
                  <label>Room</label>
                  <select
                    className="form-select"
                    name="roomId"
                    value={form.roomId}
                    disabled
                  // onChange={handleChange}
                  >
                    <option value="">---Select Room---</option>
                    {rooms.map((r) => (
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
                    className="form-control"
                    placeholder="Enter Bed"
                    name="bedName"
                    disabled
                    value={form.bedName}
                  // onChange={handleChange}
                  />
                </div>
              </div>

              {/* FEES */}
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="custom-frm-bx">
                  <label>Bed Per Day Fees</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Per Day Fees"
                    name="perDayFees"
                    value={form.perDayFees}
                    disabled
                  // onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div className="my-3">
                  <h5 className="add-contact-title">Patient Details</h5>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="custom-frm-bx">
                  <label>Patient </label>
                  <div className="select-wrapper">
                    <select
                      className="form-select custom-select"
                      name="patientId"
                      value={allotment.patientId || ""}
                      onChange={handleAllotmentChange}
                    >
                      <option value="">---Select Patient---</option>
                      {patient.map(p => (
                        <option key={p._id} value={p?.patientId?._id}>
                          {p?.patientId?.name} {p?.patientId?.contactNumber && (p?.patientId?.contactNumber)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-lg-12 my-3">
                <div className="">
                  <h5 className="add-contact-title">Allotment Details</h5>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="custom-frm-bx">
                  <label htmlFor="">Attending Doctor</label>
                  <div className="select-wrapper">
                    <select
                      className="form-select custom-select"
                      name="doctorId"
                      value={allotment.doctorId}
                      onChange={handleAllotmentChange}
                    >
                      <option value="">---Select Attending Doctor---</option>
                      {doctor.map(d => (
                        <option key={d._id} value={d._id}>
                           {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="custom-frm-bx">
                  <label htmlFor="">Allotment Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="allotmentDate"
                    value={allotment.allotmentDate}
                    onChange={handleAllotmentChange}
                  />
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="custom-frm-bx">
                  <label htmlFor="">Expected Discharge Date</label>
                  <input
                    type="date"
                    name="expectedDischargeDate"
                    className="form-control"
                    value={allotment.expectedDischargeDate}
                    onChange={handleAllotmentChange}
                  />
                </div>
              </div>

              <div className="col-lg-12">
                <div className="custom-frm-bx">
                  <label htmlFor="">Admission Reason</label>
                  <textarea
                    name="reason"
                    className="form-control"
                    value={allotment.reason}
                    onChange={handleAllotmentChange}
                  ></textarea>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="custom-frm-bx">
                  <label htmlFor="">Note</label>
                  <textarea
                    name="note"
                    className="form-control"
                    value={allotment.note}
                    onChange={handleAllotmentChange}
                  >
                  </textarea>
                </div>
              </div>
            </div>

            <div className="">
              <h5 className="add-contact-title">Attending Doctors and Nurse</h5>
              {attendingStaff.map((row, index) => (
                <div className="education-frm-bx mb-3" key={index}>
                  <div className="row align-items-end">

                    {/* TYPE */}
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="custom-frm-bx">
                        <label>Select Type</label>
                        <select
                          className="form-select"
                          value={row.type}
                          onChange={(e) =>
                            handleStaffChange(index, "type", e.target.value)
                          }
                        >
                          <option value="">---Select Type---</option>
                          <option value="Doctor">Doctor</option>
                          <option value="Nurse">Nurse</option>
                        </select>
                      </div>
                    </div>

                    {/* STAFF */}
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="custom-frm-bx">
                        <label>Attending</label>
                        <select
                          className="form-select"
                          value={row.staffId}
                          onChange={(e) =>
                            handleStaffChange(index, "staffId", e.target.value)
                          }
                        >
                          <option value="">---Select---</option>

                          {row.type === "Doctor" &&
                            doctor.map(d => (
                              <option key={d._id} value={d._id}>
                                Dr. {d.name}
                              </option>
                            ))
                          }

                          {row.type === "Nurse" &&
                            staff.map(s => (
                              <option key={s._id} value={s.userId?._id}>
                                {s?.userId?.name}
                              </option>
                            ))
                          }
                        </select>
                      </div>
                    </div>

                    {/* DATE + DELETE */}
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="return-box">
                        <div className="custom-frm-bx flex-grow-1">
                          <label>Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={row.date}
                            onChange={(e) =>
                              handleStaffChange(index, "date", e.target.value)
                            }
                          />
                        </div>

                        {attendingStaff.length > 1 && (
                          <button
                            type="button"
                            className="text-danger ms-2"
                            onClick={() => removeStaffRow(index)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
              <div className="text-end">
                <button
                  type="button"
                  className="add-employee-btn"
                  onClick={addStaffRow}
                >
                  <FaPlusSquare /> Add More
                </button>
              </div>
            </div>

            <div className="mt-5 d-flex align-items-center justify-content-between gap-3">
              <Link to={-1} className="nw-thm-btn outline" >
                Go Back
              </Link>
              <button type="submit" className="nw-thm-btn" disabled={loading}>
                {loading
                  ? "Saving..."
                  : isEdit
                    ? "Update Allotment"
                    : "Confirm Allotment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Allotment;
