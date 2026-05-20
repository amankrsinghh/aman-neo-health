import { IoCloudUploadOutline } from "react-icons/io5";
import { FaPlusSquare } from "react-icons/fa";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useNavigate, NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { getSecureApiData, securePostData, updateApiData } from "../../Service/api";
import Loader from "../Common/Loader";

function AddPrescriptions() {
  const navigate = useNavigate();
  const { id } = useParams();
  const allotmentId = id;
  const [loading, setLoading] = useState()
  const [allotmentData, setAllotmentData] = useState()
  const [status, setStatus] = useState("Active");
  const [formData, setFormData] = useState({
    doctorId: "",
    patientId: "",
    allotmentId: "",
    reVisit: 0,
    medications: [
      {
        name: "",
        frequency: "",
        duration: "",
        refills: "",
        instructions: ""
      }
    ],
    notes: "",
    diagnosis: "",
    status: "",
  });



  useEffect(() => {
    const fetchAllotment = async () => {
      const res = await api.get(`/bed/allotment/${allotmentId}`);
      const d = res.data.data;
      setAllotmentData(d)
      setFormData({
        ...formData,
        doctorId: d.primaryDoctorId?._id,
        patientId: d.patientId?._id,
        allotmentId: allotmentId
      });
    };
    fetchAllotment();
  }, [allotmentId]);
  const handleMedicationChange = (index, e) => {
    const { name, value } = e.target;

    const updatedMedications = [...formData.medications];
    updatedMedications[index][name] = value;

    setFormData((prev) => ({
      ...prev,
      medications: updatedMedications
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name: "",
          frequency: "",
          duration: "",
          refills: "",
          instructions: ""
        }
      ]
    }));
  };
  const removeMedication = (index) => {
    const updatedMedications = formData.medications.filter(
      (_, i) => i !== index
    );

    setFormData((prev) => ({
      ...prev,
      medications: updatedMedications
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.diagnosis.trim()) {
      return toast.error("Diagnosis is required");
    }

    // Medications validation
    for (let i = 0; i < formData.medications.length; i++) {
      const med = formData.medications[i];

      if (!med.name.trim()) {
        return toast.error(`Medication ${i + 1}: Name is required`);
      }

      if (!med.frequency.trim()) {
        return toast.error(`Medication ${i + 1}: Frequency is required`);
      }

      if (!med.duration.trim()) {
        return toast.error(`Medication ${i + 1}: Duration is required`);
      }

    }
    setLoading(true)
    try {
      if (allotmentData?.prescriptionId) {
        const data = { ...formData, prescriptionId: allotmentData?.prescriptionId }
        const result = await updateApiData('api/bed/prescription', data)
        if (result.success) {
          toast.success("Prescription updated ")
          navigate(-1)
        }
      } else {
        const result = await securePostData('api/bed/prescription', formData)
        if (result.success) {
          toast.success("Prescription Added ")
          navigate(-1)
        }
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }
  async function fetchPrescriptionData() {
    try {
      const res = await getSecureApiData(`api/bed/prescription-data/${allotmentData.prescriptionId}`)
      if (res.success) {
        setFormData(res.data)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    if (allotmentData && allotmentData.prescriptionId) {
      fetchPrescriptionData()
    }
  }, [allotmentData])



  return (
    <>
      {loading ? <Loader />
        : <div className="main-content flex-grow-1 p-3 overflow-auto">
          <div className="row ">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h3 className="innr-title mb-2">Add Prescriptions</h3>
                <div className="admin-breadcrumb">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb custom-breadcrumb">
                      <li className="breadcrumb-item">
                        <NavLink to="/" className="breadcrumb-link">
                          Dashboard
                        </NavLink>
                      </li>
                      <li className="breadcrumb-item">
                        <NavLink to="/appointment" className="breadcrumb-link">
                          Appointments
                        </NavLink>
                      </li>
                      <li className="breadcrumb-item">
                        <a href="#" className="breadcrumb-link">
                          Appointment Details
                        </a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Add Prescriptions
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
                <div className="col-lg-8 col-md-6 col-sm-12">
                  <div className="custom-frm-bx">
                    <label htmlFor="">Diagnosis</label>
                    <input
                      type="text"
                      className="form-control nw-frm-select"
                      placeholder="Enter Diagnosis"
                      value={formData.diagnosis}
                      name="diagnosis"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="custom-frm-bx">
                    <label>Status</label>
                    <div className="select-wrapper">
                      <select
                        className="form-select custom-select"
                        name="status"
                        required
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="">
                <h5 className="add-contact-title mb-3">Add Medications</h5>

                {formData.medications.map((med, index) => (
                  <div className="education-frm-bx mb-4" key={index}>
                    <div className="row">
                      <div className="col-lg-4">
                        <input
                          className="form-control"
                          placeholder="Medication Name"
                          name="name"
                          value={med.name}
                          onChange={(e) => handleMedicationChange(index, e)}
                        />
                      </div>

                      <div className="col-lg-4">
                        <div className="select-wrapper">
                          <select
                            name="frequency"
                            required
                            value={med.frequency}
                            onChange={(e) => handleMedicationChange(index, e)}
                            className="form-select"
                          >
                            <option value="">--Select--</option>
                            <option value="Once a day">Once a day</option>
                            <option value="Twice a day">Twice a day</option>
                            <option value="Three times a day">Three times a day</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-lg-2">
                        <input
                          className="form-control"
                          placeholder="Duration"
                          name="duration"
                          value={med.duration}
                          onChange={(e) => handleMedicationChange(index, e)}
                        />
                      </div>

                      <div className="col-lg-2">
                        <input
                          className="form-control"
                          placeholder="Refills"
                          name="refills"
                          value={med.refills}
                          onChange={(e) => handleMedicationChange(index, e)}
                        />
                      </div>

                      <div className="col-lg-12 mt-2">
                        <textarea
                          className="form-control"
                          placeholder="Instructions"
                          value={med.instructions}
                          name="instructions"
                          onChange={(e) => handleMedicationChange(index, e)}
                        />
                      </div>

                      {formData?.medications?.length > 1 && (
                        <button type="button" onClick={() => removeMedication(index)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}


                <button type="button" onClick={addMedication} className="add-employee-btn">
                  <FaPlusSquare /> Add More
                </button>

              </div>

              <div className="">
                <h5 className="add-contact-title">Other</h5>
                <div className="custom-frm-bx">
                  <label htmlFor="">Notes</label>
                  <textarea
                    className="form-control rounded-2"
                    placeholder="Enter notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>




              <div className="mt-5 d-flex align-items-center justify-content-between gap-3">
                <Link to={-1} className="nw-thm-btn outline" >
                  Go Back
                </Link>
                <button type="submit" className="nw-thm-btn " >Submit</button>
              </div>

            </form>

          </div>






        </div>}
    </>
  )
}

export default AddPrescriptions