import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { FiPlusSquare } from "react-icons/fi";
import { faCalendar, faClock, faClose, faDoorOpen, faKitMedical, faPerson, faStar } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSecureApiData, securePostData, updateApiData } from "../../Services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";

function DoctorAddPrescriptions() {
    const params = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [appointmentData, setAppointmentData] = useState()
    const [formData, setFormData] = useState({
        doctorId: "",
        patientId: "",
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
        status: "",
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
        setLoading(true)
        try {
            if (appointmentData?.prescriptionId) {
                const data = { ...formData, prescriptionId: appointmentData?.prescriptionId?._id }
                const result = await updateApiData('appointment/prescription', data)
                if (result.success) {
                    toast.success("Prescription updated ")
                    navigate(-1)
                } else {
                    toast.error(result.message)
                }
            } else {
                const result = await securePostData('appointment/prescription', formData)
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
            {loading ? <Loader />
                :

                <div className="profile-right-card">
                    <div className="profile-tp-header">
                        <h5 className="heading-grad fz-24 mb-0">{appointmentData?.prescriptionId ? 'Edit' : 'Add'} Prescriptions</h5>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="all-profile-data-bx">
                            <div className="row">
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Diagnosis</label>
                                        <input type="text" required
                                            name="diagnosis"
                                            value={formData.diagnosis}
                                            onChange={handleChange}
                                            className="form-control new-control-frm px-5" placeholder="Enter  Diagnosis" />
                                        <div className="contact-add-icon">
                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faPerson} /> </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label>Status</label>
                                        <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faStar} /> </span>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                required
                                                className="nw-select"
                                            >
                                                <option value="">--Select Status--</option>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Revisit (in days)</label>
                                        <input type="text"
                                            name="reVisit"
                                            value={formData.reVisit}
                                            onChange={handleChange}
                                            className="form-control new-control-frm px-5" placeholder="7" />
                                        <div className="contact-add-icon">
                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faDoorOpen} /> </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <h5 className="fz-20 fw-700 text-black">Add Medications </h5>
                                {formData.medications.map((med, index) => (
                                    <div className="pres-report-bx position-relative mb-4" key={index}>
                                        <div className="row">
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Medications Name</label>
                                                    <input type="text" required
                                                        name="name"
                                                        value={med.name}
                                                        onChange={(e) => handleMedicationChange(index, e)} className="form-control new-control-frm px-5" placeholder="Enter Medications Name" />
                                                    <div className="contact-add-icon">
                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faKitMedical} /> </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label>Frequency</label>
                                                    <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faClock} /> </span>
                                                        <select
                                                            name="frequency"
                                                            required
                                                            value={med.frequency}
                                                            onChange={(e) => handleMedicationChange(index, e)}
                                                            className="nw-select"
                                                        >
                                                            <option value="">--Select--</option>
                                                            <option value="Once a day">Once a day</option>
                                                            <option value="Twice a day">Twice a day</option>
                                                            {/* <option value="Twice a day">Twice a day</option> */}
                                                            <option value="Three times a day">Three times a day</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Duration</label>
                                                    <input type="text" required
                                                        name="duration"
                                                        value={med.duration}
                                                        onChange={(e) => handleMedicationChange(index, e)} className="form-control new-control-frm ps-5" placeholder="Enter Duration" />
                                                    <div className="contact-add-icon">
                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faCalendar} /> </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Refills</label>
                                                    <input type="text" required
                                                        name="refills"
                                                        value={med.refills}
                                                        onChange={(e) => handleMedicationChange(index, e)} className="form-control new-control-frm ps-5" placeholder="Enter Refills" />
                                                    <div className="contact-add-icon">
                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faCalendar} /> </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Instructions</label>
                                                    <textarea name="instructions" required
                                                        value={med.instructions}
                                                        onChange={(e) => handleMedicationChange(index, e)} id="" className="form-control new-control-frm"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        {formData.medications.length > 1 && (
                                            <div className="remv-medication-bx">
                                                <button onClick={() => removeMedication(index)} className="remv-pic-btn"> <FontAwesomeIcon icon={faClose} /> </button>
                                            </div>)}

                                    </div>))}
                            </div>
                            <div className="add-more-bx d-flex justify-content-end">
                                <button onClick={addMedication} className="nw-thm-btn outline d-flex align-items-center justify-content-center gap-2 nw-dashed-brd"> <FiPlusSquare />  Add More Medications</button>
                            </div>

                            <div className="custom-frm-bx">
                                <label htmlFor="">Notes</label>
                                <textarea name="notes" required
                                    value={formData.notes} onChange={handleChange} id="" className="form-control new-control-frm"></textarea>
                            </div>
                            <div className="d-flex align-items-center justify-content-between pt-3  border-top">
                                 <div className="text-end ">
                                     <Link to={-1} className="nw-thm-btn outline">Go Back</Link> 
                                     </div>

                                <button type="submit" className="nw-thm-btn">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            }
        </>
    )
}

export default DoctorAddPrescriptions