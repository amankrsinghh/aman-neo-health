import { FaPlusSquare } from "react-icons/fa";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";

function EditPrescriptions() {
    const { id } = useParams(); // prescription id
  const navigate = useNavigate();

  const [diagnosis, setDiagnosis] = useState("");
  const [status, setStatus] = useState("Active");
  const [notes, setNotes] = useState("");

  const [medications, setMedications] = useState([
    { name: "", frequency: "", duration: "", refills: "", instructions: "" }
  ]);

  /* ================= FETCH PRESCRIPTION ================= */
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await api.get(`/prescription/${id}`);
        const rx = res.data.data;

        setDiagnosis(rx.diagnosis);
        setStatus(rx.status);
        setNotes(rx.notes || "");
        setMedications(rx.medications);
      } catch {
        toast.error("Failed to load prescription");
      }
    };
    fetchPrescription();
  }, [id]);

  /* ================= MEDICATION HANDLERS ================= */
  const handleMedicationChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      { name: "", frequency: "", duration: "", refills: "", instructions: "" }
    ]);
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanMeds = medications.filter(
      m => m.name && m.frequency && m.duration
    );

    if (!diagnosis || !cleanMeds.length) {
      toast.error("Diagnosis & at least one medication required");
      return;
    }

    try {
      await api.put(`/prescription/${id}`, {
        diagnosis,
        medications: cleanMeds,
        notes,
        status
      });

      toast.success("Prescription updated successfully");
      navigate(-1);
    } catch {
      toast.error("Update failed");
    }
  };


  return (
      <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
      <h3 className="innr-title mb-3">Edit Prescriptions</h3>

      <div className="new-panel-card">
        <form onSubmit={handleSubmit}>
          {/* Diagnosis + Status */}
          <div className="row">
            <div className="col-lg-8">
              <label>Diagnosis</label>
              <input
                className="form-control"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </div>

            <div className="col-lg-4">
              <label>Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Medications */}
          <h5 className="mt-4">Medications</h5>

          {medications.map((m, index) => (
            <div className="education-frm-bx mb-3" key={index}>
              <div className="row">
                <div className="col-lg-4">
                  <input
                    className="form-control"
                    placeholder="Medication Name"
                    value={m.name}
                    onChange={(e) =>
                      handleMedicationChange(index, "name", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-4">
                  <input
                    className="form-control"
                    placeholder="Frequency"
                    value={m.frequency}
                    onChange={(e) =>
                      handleMedicationChange(index, "frequency", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-2">
                  <input
                    className="form-control"
                    placeholder="Duration"
                    value={m.duration}
                    onChange={(e) =>
                      handleMedicationChange(index, "duration", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-2">
                  <input
                    className="form-control"
                    placeholder="Refills"
                    value={m.refills}
                    onChange={(e) =>
                      handleMedicationChange(index, "refills", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-12 mt-2 d-flex gap-2">
                  <textarea
                    className="form-control"
                    placeholder="Instructions"
                    value={m.instructions}
                    onChange={(e) =>
                      handleMedicationChange(
                        index,
                        "instructions",
                        e.target.value
                      )
                    }
                  />
                  {medications.length > 1 && (
                    <button
                      type="button"
                      className="text-danger"
                      onClick={() => removeMedication(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="add-employee-btn mb-3"
            onClick={addMedication}
          >
            <FaPlusSquare /> Add More
          </button>

          {/* Notes */}
          <label>Notes</label>
          <textarea
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="text-end mt-4">
            <button type="submit" className="nw-thm-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
        </>
  )
}

export default EditPrescriptions