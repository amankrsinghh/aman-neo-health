import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { FiPlusSquare } from "react-icons/fi";
import { faCalendar, faClock, faClose, faKitMedical, faPerson, faStar } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Common/Loader";
import { getSecureApiData, securePostData, updateApiData } from "../../Service/api";
import { FaPlusSquare } from "react-icons/fa";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
function AppointmentPrescriptions() {
    const params = useParams()
    const user=JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [appointmentData, setAppointmentData] = useState()
    const [formData, setFormData] = useState({
        doctorId: "",
        patientId: "",
        hospitalId:user.id,
        appointmentId: "",
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
        status: "Active",
    });
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

    async function fetchAppointmentData() {
        setLoading(true)
        try {
            const result = await getSecureApiData(`doctor/appointment-data/${params.id}`)
            if (result.success) {
                const data = result.data
                setAppointmentData(data)
                if (data?.prescriptionId) {
                    setFormData({
                        doctorId: data?.doctorId?._id, patientId: data?.patientId?._id, appointmentId: params.id,
                        medications: data?.prescriptionId?.medications, notes: data?.prescriptionId?.notes, diagnosis: data?.prescriptionId?.diagnosis,
                        status: data?.prescriptionId?.status, reVisit: data?.prescriptionId?.reVisit
                    })

                } else {

                    setFormData({ ...formData, doctorId: data?.doctorId?._id, patientId: data?.patientId?._id, appointmentId: params.id })
                }
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchAppointmentData()
    }, [params])

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
            if (appointmentData?.prescriptionId) {
                const data = { ...formData, prescriptionId: appointmentData?.prescriptionId?._id }
                const result = await updateApiData('appointment/hospital/prescription', data)
                if (result.success) {
                    toast.success("Prescription updated ")
                    navigate(-1)
                } else {
                    toast.error(result.message)
                }
            } else {
                const result = await securePostData('appointment/hospital/prescription', formData)
                if (result.success) {
                    toast.success("Prescription Added ")
                    navigate(-1)
                } else {
                    toast.error(result.message)
                }
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }


    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row ">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2">Prescriptions</h3>
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
                                                Appointments
                                            </a>
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
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label>Diagnosis</label>
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
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label>Revisit (in days)</label>
                                    <input
                                        type="number"
                                        name="reVisit"
                                        className="form-control nw-frm-select"
                                        placeholder="7"
                                        value={formData.reVisit}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <h5 className="add-contact-title mb-3">Add Medications</h5>

                        {formData.medications.map((med, index) => (
                            <div className="education-frm-bx mb-4" key={index}>
                                <div className="row">
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Medications Name</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Medications Name"
                                                name="name"
                                                value={med.name}
                                                onChange={(e) => handleMedicationChange(index, e)}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Frequency</label>
                                            {/* <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Frequency"
                                                name="frequency"
                                                value={med.frequency}
                                                onChange={(e) => handleMedicationChange(index, e)}
                                            /> */}
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
                                    </div>

                                    <div className="col-lg-2 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Duration</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Duration"
                                                name="duration"
                                                value={med.duration}
                                                onChange={(e) => handleMedicationChange(index, e)}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-2 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Refills</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Refills"
                                                name="refills"
                                                value={med.refills}
                                                onChange={(e) => handleMedicationChange(index, e)}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="return-box">
                                            <div className="custom-frm-bx flex-column flex-grow-1">
                                                <label>Instructions</label>
                                                <textarea
                                                    name="instructions"
                                                    className="form-control nw-frm-select"
                                                    placeholder="Enter Instructions"
                                                    value={med.instructions}
                                                    onChange={(e) => handleMedicationChange(index, e)}
                                                />
                                            </div>

                                            {formData.medications.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="text-black"
                                                    onClick={() => removeMedication(index)}
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
                                onClick={addMedication}
                            >
                                <FaPlusSquare /> Add More
                            </button>
                        </div>

                        <h5 className="add-contact-title mt-4">Other</h5>
                        <div className="custom-frm-bx">
                            <label>Notes</label>
                            <textarea
                                name="notes"
                                className="form-control rounded-2"
                                value={formData.notes}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-5 d-flex justify-content-between gap-3">
                            <Link to={-1} className="nw-thm-btn outline" >
                                Go Back
                            </Link>
                            <button type="submit" className="nw-thm-btn">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AppointmentPrescriptions