import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getSecureApiData, securePostData, updateApiData } from '../../Service/api'
import base_url from '../../baseUrl'
import JoditEditor from "jodit-react";
import { useRef } from "react";
import Loader from '../Common/Loader'
import { QRCodeCanvas } from "qrcode.react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCropAlt, faCross, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import DischargeSummary from '../../All Template file/Discharge summary'
import FollowUpPrescription from '../../All Template file/FollowUpPrescription/FollowUpPrescription'
function NewDischarge() {
    const params = useParams()
    const allotmentId = params.id
    const editorRef = useRef();
    const [allotmentData, setAllotmentData] = useState()
    const [patientData, setPatientData] = useState()
    const [prescriptionData, setPrescriptionData] = useState()
    const [isEdited, setIsEdited] = useState(false);
    const [testReport, setTestReport] = useState([])
    const [dischargeData, setDischargeData] = useState()
    const [loading, setLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [pdfLoading, setPdfLoading] = useState(false)
    const fetchAllotmentData = async () => {
        try {
            setLoading(true)
            const response = await getSecureApiData(`api/bed/allotment/${allotmentId}`)
            if (response.success) {
                setAllotmentData(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    const fetchPatientData = async () => {
        try {
            const response = await getSecureApiData(`patient/${allotmentData?.patientId?._id}`)
            if (response.success) {
                setPatientData(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            // setLoading(false)
        }
    }
    const fetchPrescriptionData = async () => {
        try {
            const response = await getSecureApiData(`appointment/prescription-data/${allotmentData?.prescriptionId}`)
            if (response.success) {
                setPrescriptionData(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const fetchDischargeData = async () => {
        if (!allotmentData?.dischargeId) return
        try {
            setLoading(true)
            const response = await getSecureApiData(`api/bed/discharge-patient/${allotmentId}`)
            if (response.success) {
                const data = response.data;
                setDischargeData(response.data)
                setFormData({
                    dischargeType: data?.dischargeType || "",
                    confirmation: {
                        finalDiagnosis: data?.confirmation?.finalDiagnosis || false,
                        treatmentSummary: data?.confirmation?.treatmentSummary || false,
                        medicines: data?.confirmation?.medicines || false,
                        followUp: data?.confirmation?.followUp || false
                    },
                    finalDiagnosis: data?.finalDiagnosis || "",
                    hospitalCourse: data?.hospitalCourse || "",
                    conditionOfDischarge: data?.conditionOfDischarge || "",
                    followUpPlan: data?.followUpPlan || "",
                    redFlag: data?.redFlag || "",
                    dischargeNote: data?.dischargeNote || "",
                    doctorSignature: data?.doctorSignature?.nh12 || "",
                    nurseSignature: data?.nurseSignature?.nh12 || ""
                })
                setVitals({ ...data?.vitals })
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    const fetchTestReportData = async () => {
        try {
            const testIds = allotmentData?.labAppointment?.testId || [];

            const promises = testIds.map((item) => {
                const data = {
                    appointmentId: allotmentData?.labAppointment?._id,
                    testId: item
                };
                return securePostData(`api/hospital/test-report-data`, data);
            });

            const responses = await Promise.all(promises);

            const successfulData = responses
                .filter(res => res.success)
                .map(res => res.data);

            setTestReport(successfulData);

            responses.forEach(res => {
                if (!res.success) {
                    // toast.error(res.message);
                }
            });

        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (allotmentId) {
            fetchAllotmentData()
        }
    }, [allotmentId])
    useEffect(() => {
        if (allotmentData && allotmentData?.patientId?._id) {
            fetchPatientData()
        }
        if (allotmentData && allotmentData?.prescriptionId) {
            fetchPrescriptionData()
        }
        if (allotmentData && allotmentData?.labAppointment) {
            fetchTestReportData()
        }
        if (allotmentData && allotmentData?.dischargeId) {
            fetchDischargeData()
        }
    }, [allotmentData])
    const [formData, setFormData] = useState({
        dischargeType: "",
        confirmation: {
            finalDiagnosis: false,
            treatmentSummary: false,
            medicines: false,
            followUp: false
        },
        finalDiagnosis: "",
        hospitalCourse: "",
        conditionOfDischarge: "",
        followUpPlan: "",
        redFlag: "",
        dischargeNote: "",
        doctorSignature: "",
        nurseSignature: "",
    })
    const [vitals, setVitals] = useState({
        height: "",
        weight: "",
        bloodPressure: "",
        pulse: "",
        temperature: "",
        respiratoryRate: "",
        oxygenSaturation: "",
        bloodSugar: "",
        bmi: "",
        painLevel: "",
        vision: "",
        hearing: "",
        other: "",
    })
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }
    const handleVitalChange = (e) => {
        const { name, value } = e.target
        setVitals({ ...vitals, [name]: value })
    }
    const handleMedicationChange = (index, field, value) => {
        const updatedMedications = [...prescriptionData.medications];
        updatedMedications[index][field] = value;

        setPrescriptionData({
            ...prescriptionData,
            medications: updatedMedications
        });
        setIsEdited(true)
    };

    const handleAddMedication = () => {
        if (prescriptionData?.medications) {
            setPrescriptionData({
                ...prescriptionData,
                medications: [
                    ...prescriptionData.medications,
                    {
                        name: "",
                        frequency: "",
                        duration: "",
                        refills: "",
                        instructions: ""
                    }
                ]
            });
        } else {
            setPrescriptionData({
                diagnosis: "",
                status: "", notes: "",
                medications: [
                    {
                        name: "",
                        frequency: "",
                        duration: "",
                        refills: "",
                        instructions: ""
                    }
                ]
            });
        }
    };

    const handleRemoveMedication = (index) => {
        const updatedMedications = prescriptionData.medications.filter((_, i) => i !== index);

        setPrescriptionData({
            ...prescriptionData,
            medications: updatedMedications
        });
    };
    const medicationSubmit = async () => {

        try {
            const { diagnosis, status, medications, notes } = prescriptionData;

            // Basic validation
            if (!diagnosis?.trim()) {
                toast.error("Diagnosis is required");
                return;
            }
            if (!notes?.trim()) {
                toast.error("Prescription notes is required");
                return;
            }

            if (!status) {
                toast.error("Status is required");
                return;
            }

            if (!medications || medications.length === 0) {
                toast.error("At least one medication is required");
                return;
            }

            for (let i = 0; i < medications.length; i++) {
                const m = medications[i];

                if (!m.name?.trim()) {
                    toast.error(`Medication ${i + 1}: Name is required`);
                    return;
                }

                if (!m.frequency?.trim()) {
                    toast.error(`Medication ${i + 1}: Frequency is required`);
                    return;
                }

                if (!m.duration?.trim()) {
                    toast.error(`Medication ${i + 1}: Duration is required`);
                    return;
                }

                // ❌ refills NOT required

                if (!m.instructions?.trim()) {
                    toast.error(`Medication ${i + 1}: Instruction is required`);
                    return;
                }
            }
            setIsSaving(true)
            if (allotmentData?.prescriptionId) {
                const data = { prescriptionId: prescriptionData?._id, ...prescriptionData }
                const res = await updateApiData('api/bed/prescription', data)
                if (res.success) {
                    toast.success("Medication was saved successfully")
                    fetchPrescriptionData()
                    setIsEdited(false)
                } else {
                    toast.error(res.message)
                }
            } else {
                const data = { allotmentId, ...prescriptionData, doctorId: allotmentData?.primaryDoctorId?._id, patientId: allotmentData?.patientId?._id }
                const res = await securePostData('api/bed/prescription', data)
                if (res.success) {
                    toast.success("Medication was saved successfully")
                    fetchAllotmentData()
                    setIsEdited(false)
                } else {
                    toast.error(res.message)
                }
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsSaving(false)
        }
    };
    const validateDischargeForm = (formData) => {
        const errors = {};

        // Required text fields
        if (!formData.dischargeType) {
            errors.dischargeType = "Discharge type is required";
        }

        if (!formData.finalDiagnosis.trim()) {
            errors.finalDiagnosis = "Final diagnosis is required";
        }

        if (!formData.hospitalCourse.trim()) {
            errors.hospitalCourse = "Hospital course is required";
        }

        if (!formData.conditionOfDischarge.trim()) {
            errors.conditionOfDischarge = "Condition at discharge is required";
        }

        if (!formData.followUpPlan.trim()) {
            errors.followUpPlan = "Follow-up plan is required";
        }

        if (!formData.redFlag.trim()) {
            errors.redFlag = "Red flag is required";
        }

        if (!formData.dischargeNote.trim()) {
            errors.dischargeNote = "Discharge note is required";
        }

        if (!formData.doctorSignature.trim()) {
            errors.doctorSignature = "Doctor signature is required";
        }
        if (!formData.nurseSignature.trim()) {
            errors.nurseSignature = "Nurse signature is required";
        }

        // Confirmation checkboxes
        const confirmation = formData.confirmation;

        if (!confirmation.finalDiagnosis) {
            errors.confirmationFinalDiagnosis = "Please confirm final diagnosis";
        }

        if (!confirmation.treatmentSummary) {
            errors.confirmationTreatmentSummary = "Please confirm treatment summary";
        }

        if (!confirmation.medicines) {
            errors.confirmationMedicines = "Please confirm medicines";
        }

        if (!confirmation.followUp) {
            errors.confirmationFollowUp = "Please confirm follow-up";
        }

        return errors;
    };
    const dischargeSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validateDischargeForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        const data = { allotmentId, ...formData, vitals: JSON.stringify(vitals) }
        try {
            setLoading(true)
            const res = await securePostData('api/bed/discharge-patient', data)
            if (res.success) {
                toast.success("Records saved successfully")
                fetchAllotmentData()
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
            setErrors({})
        }
    }

    const joditConfig = useMemo(() => (
        {
            height: 200,
            readonly: false,
            toolbarAdaptive: false,
            iframe: true,
            iframeStyle: `
      body { font-family: sans-serif; padding: 10px; }
      ul { list-style-type: disc !important; padding-left: 2rem !important; margin: 0.5rem 0 !important; }
      ol { list-style-type: decimal !important; padding-left: 2rem !important; margin: 0.5rem 0 !important; }
      li { display: list-item !important; }
    `,
            buttons: [
                "bold", "italic", "underline", "|",
                "ul", "ol", "|",
                "font", "fontsize", "|",
                "align", "|",
                "table", "|",
                "undo", "redo",
            ],
        }))
    return (
        <>
            {loading ? <Loader />
                :
                <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row ">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2">Discharge Patient</h3>
                                <div className="admin-breadcrumb">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb custom-breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="#" className="breadcrumb-link">Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="#" className="breadcrumb-link">Allotment</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page" >
                                                Discharge Patient
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="new-panel-card">

                        {dischargeData?.customId &&
                            <div className='d-flex justify-content-between align-items-center'>
                                <h6>Discharge QR</h6>
                                <div>
                                    <button className='nw-thm-btn' disabled={pdfLoading} onClick={() => setPdfLoading(true)}>{pdfLoading ? 'Downloading...' : 'Download'}</button>
                                </div>
                                {/* <div className="" style={{ width: '200px', height: '200px' }} >

                                    <QRCodeCanvas
                                        value={`http://hospitals.neohealthcard.com/download/discharge/${dischargeData?.customId}`}
                                        size={256}
                                        className="qr-code"
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    />
                                </div> */}
                            </div>}
                        <form>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="">
                                        <h5 className="add-contact-title">Patient Details</h5>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Patient Id</label>
                                        <input
                                            type="number"
                                            name="name"
                                            value={allotmentData?.patientId?.nh12}
                                            required
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Patient Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={patientData?.name}
                                            placeholder="Name"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                {patientData?.dob && <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Date of Birth </label>
                                        <input
                                            type="text"
                                            value={new Date(patientData?.dob)?.toLocaleDateString('en-GB')}
                                            name="dob"
                                            className="form-control"
                                            readOnly
                                        />
                                    </div>
                                </div>}
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label>Gender</label>
                                        <div className="select-wrapper">
                                            <select
                                                name="gender"
                                                value={patientData?.gender}
                                                readOnly
                                                className="form-select"
                                            >
                                                <option value="">Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Mobile Number</label>
                                        <input
                                            type="number"
                                            name="contactNumber"
                                            readOnly
                                            value={patientData?.contactNumber}
                                            placeholder="Mobile Number"
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={patientData?.email}
                                            placeholder="Email Address"
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Emergency Contact Name</label>
                                        <input
                                            type="text"
                                            value={patientData?.contact?.emergencyContactName}
                                            name="contact.emergencyContactName"
                                            placeholder="Emergency Contact Name"
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Emergency Contact Phone</label>
                                        <input
                                            type="number"
                                            value={patientData?.contact?.emergencyContactNumber}
                                            name="contact.emergencyContactNumber"
                                            placeholder="Emergency Contact Phone"
                                            className="form-control"
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Address</label>
                                        <textarea name="address" readOnly value={patientData?.address}
                                            placeholder="Address"
                                            className="form-control">
                                        </textarea>
                                    </div>
                                </div>
                            </div>


                        </form>
                        <form>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="">
                                        <h5 className="add-contact-title">Admission Details</h5>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label>Discharge Type</label>
                                        <div className="select-wrapper">
                                            <select
                                                name="dischargeType"
                                                value={formData?.dischargeType}
                                                className="form-select"
                                                onChange={handleChange}
                                            >
                                                <option value="">Select</option>
                                                <option value="NORMAL">Normal</option>
                                                <option value="LAMA/DAMA">LAMA/DAMA</option>
                                                <option value="TRANSFER">Transfer</option>
                                                <option value="PO">Post Operative</option>
                                                <option value="ICU">ICU</option>
                                                <option value="DEATH">Death</option>
                                            </select>
                                        </div>
                                        {errors?.dischargeType && <small className='text-danger'>{errors?.dischargeType}</small>}
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Admission Date</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={new Date(allotmentData?.createdAt).toLocaleDateString('en-GB')}
                                            placeholder="Email Address"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Attending Doctor</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={allotmentData?.primaryDoctorId?.name}
                                            placeholder="Primary Doctor"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Bed</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={allotmentData?.bedId?.bedName}
                                            placeholder="Bed"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Room</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={allotmentData?.bedId?.roomId?.roomName}
                                            placeholder="Email Address"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Department</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={allotmentData?.departmentId?.departmentName}
                                            placeholder="Email Address"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                {allotmentData?.labAppointment &&
                                    <div className="row mt-4">

                                        <div className="col-12">
                                            <div className="">
                                                <h5 className="add-contact-title">Lab Reports</h5>
                                            </div>
                                        </div>
                                        {testReport?.map((r, k) => {
                                            const fileUrl = `${base_url}/${r?.upload?.report}`;
                                            const fileName = r?.upload?.report || "";
                                            const isPdf = fileName.toLowerCase().endsWith(".pdf");

                                            return (
                                                <div className="col-lg-6 col-md-12 col-sm-12" key={k}>
                                                    <div className="custom-frm-bx d-flex justify-content-between">
                                                        <label className='form-label'>{r?.testId?.shortName}</label>

                                                        <a href={fileUrl} target='_blank' className='thm-btn'>View</a>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>}
                                <div className="col-12 mt-4">
                                    <div className="">
                                        <h5 className="add-contact-title">Medications</h5>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Dignosis Name</label>
                                        <input
                                            type="text"
                                            readOnly={dischargeData}
                                            value={prescriptionData?.diagnosis}
                                            onChange={(e) => {
                                                setIsEdited(true)
                                                setPrescriptionData({ ...prescriptionData, diagnosis: e.target.value })
                                            }}
                                            placeholder="Diagnosis"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Status</label>
                                        <div className="select-wrapper">
                                            <select
                                                className="form-select custom-select"
                                                name="status"
                                                readOnly={dischargeData}
                                                value={prescriptionData?.status}
                                                onChange={(e) => {
                                                    setIsEdited(true)
                                                    setPrescriptionData({ ...prescriptionData, status: e.target.value })
                                                }}
                                            >
                                                <option value="">Select</option>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {prescriptionData?.medications?.map((m, k) =>
                                    <div className="row mb-3" key={k}>

                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label>Name</label>
                                                <input
                                                    type="text"
                                                    value={m?.name}
                                                    readOnly={dischargeData}
                                                    onChange={(e) => handleMedicationChange(k, "name", e.target.value)}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label className='form-label'>Frequency</label>
                                                <div className="select-wrapper">
                                                    <select
                                                        name="frequency"
                                                        readOnly={dischargeData}
                                                        required
                                                        value={m?.frequency}
                                                        onChange={(e) => handleMedicationChange(k, "frequency", e.target.value)}
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

                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label>Duration</label>
                                                <input
                                                    type="text"
                                                    readOnly={dischargeData}
                                                    value={m?.duration}
                                                    onChange={(e) => handleMedicationChange(k, "duration", e.target.value)}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label>Refill</label>
                                                <input
                                                    type="text"
                                                    readOnly={dischargeData}
                                                    value={m?.refills}
                                                    onChange={(e) => handleMedicationChange(k, "refills", e.target.value)}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>

                                        {/* Delete Button */}
                                        {!dischargeData && <div className="col-lg-1 col-md-6 col-sm-12 pt-4 ">
                                            <button
                                                type="button"
                                                className="text-capitalize  text-capitalize approved inactive"
                                                onClick={() => handleRemoveMedication(k)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>}

                                        <div className="col-lg-12">
                                            <div className="custom-frm-bx">
                                                <label>Instruction</label>
                                                <input
                                                    type="text"
                                                    readOnly={dischargeData}
                                                    value={m?.instructions}
                                                    onChange={(e) => handleMedicationChange(k, "instructions", e.target.value)}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                )}
                                {!dischargeData && <div className="mb-5">
                                    <button
                                        type="button"
                                        className="text-capitalize  text-capitalize approved "
                                        onClick={handleAddMedication}
                                    >
                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More
                                    </button>
                                </div>}
                                <div className="col-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Prescription Notes</label>
                                        <textarea
                                            type="text"
                                            readOnly={dischargeData}
                                            value={prescriptionData?.notes}
                                            onChange={(e) => {
                                                setIsEdited(true)
                                                setPrescriptionData({ ...prescriptionData, notes: e.target.value })
                                            }}
                                            placeholder="Notest"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                {isEdited && <div className='text-end'>
                                    <button className='nw-thm-btn' type='button' disabled={isSaving} onClick={medicationSubmit}>{isSaving ? 'Saving...' : 'Save'}</button>
                                </div>}
                                <div className="col-12">
                                    <div className="">
                                        <h5 className="add-contact-title">Other</h5>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Final Dignosis</label>
                                        {/* <textarea
                                            type="text"
                                            className="form-control"
                                            value={formData?.finalDiagnosis}
                                            onChange={handleChange}
                                            name='finalDiagnosis'
                                        /> */}
                                        <JoditEditor
                                            name="finalDiagnosis"
                                            value={formData?.finalDiagnosis || ""}
                                            onBlur={(newContent) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    finalDiagnosis: newContent,
                                                }))
                                            }
                                            config={joditConfig}
                                        />
                                        {errors?.finalDiagnosis && <small className='text-danger'>{errors?.finalDiagnosis}</small>}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Hospital course</label>
                                        <JoditEditor
                                            value={formData?.hospitalCourse || ""}
                                            onBlur={(newContent) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    hospitalCourse: newContent,
                                                }))
                                            }
                                            config={joditConfig}
                                        />
                                        {errors?.hospitalCourse && <small className='text-danger'>{errors?.hospitalCourse}</small>}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Condition at discharge</label>
                                        <JoditEditor
                                            value={formData?.conditionOfDischarge || ""}
                                            onBlur={(newContent) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    conditionOfDischarge: newContent,
                                                }))
                                            }
                                            config={joditConfig}
                                        />
                                        {errors?.conditionOfDischarge && <small className='text-danger'>{errors?.conditionOfDischarge}</small>}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Follow-up plan</label>
                                        <JoditEditor
                                            value={formData?.followUpPlan || ""}
                                            onBlur={(newContent) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    followUpPlan: newContent,
                                                }))
                                            }
                                            config={joditConfig}
                                        />
                                        {errors?.followUpPlan && <small className='text-danger'>{errors?.followUpPlan}</small>}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Red flag signs</label>
                                        <JoditEditor
                                            value={formData?.redFlag || ""}
                                            onBlur={(newContent) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    redFlag: newContent,
                                                }))
                                            }
                                            config={joditConfig}
                                        />
                                        {errors?.redFlag && <small className='text-danger'>{errors?.redFlag}</small>}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Discharge Note</label>
                                        <textarea
                                            type="text"
                                            onChange={handleChange}
                                            className="form-control"
                                            value={formData?.dischargeNote}
                                            name='dischargeNote'
                                        />
                                        {errors?.dischargeNote && <small className='text-danger'>{errors?.dischargeNote}</small>}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="">
                                        <h5 className="add-contact-title">Confirmation</h5>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12">
                                    <div className="form-check custom-check">
                                        <label className='form-check-label' htmlFor='finalDiagnosis'>Final Diagnosis</label>
                                        <input
                                            type="checkbox"
                                            id="finalDiagnosis"
                                            checked={formData?.confirmation?.finalDiagnosis}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    confirmation: {
                                                        ...formData.confirmation,
                                                        finalDiagnosis: e.target.checked
                                                    }
                                                })
                                            }
                                            className="form-check-input"
                                        />
                                    </div>
                                    {errors?.confirmationFinalDiagnosis && <small className='text-danger'>{errors?.confirmationFinalDiagnosis}</small>}
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12">
                                    <div className="form-check custom-check">
                                        <label className='form-check-label' htmlFor='treatmentSummary'>Treatment summary</label>
                                        <input
                                            type="checkbox"
                                            id="treatmentSummary"
                                            checked={formData?.confirmation?.treatmentSummary}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    confirmation: {
                                                        ...formData.confirmation,
                                                        treatmentSummary: e.target.checked
                                                    }
                                                })
                                            }
                                            className="form-check-input"
                                        />
                                    </div>
                                    {errors?.confirmationTreatmentSummary && <small className='text-danger'>{errors?.confirmationTreatmentSummary}</small>}
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12">
                                    <div className="form-check custom-check">
                                        <label className='form-check-label' htmlFor='medicines'>Medicines</label>
                                        <input
                                            type="checkbox"
                                            id='medicines'
                                            checked={formData?.confirmation?.medicines}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    confirmation: {
                                                        ...formData.confirmation,
                                                        medicines: e.target.checked
                                                    }
                                                })
                                            }
                                            className="form-check-input"
                                        />
                                    </div>
                                    {errors?.confirmationMedicines && <small className='text-danger'>{errors?.confirmationMedicines}</small>}
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12">
                                    <div className="form-check custom-check">
                                        <label className='form-check-label'>Follow-up</label>
                                        <input
                                            type="checkbox"
                                            checked={formData?.confirmation?.followUp}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    confirmation: {
                                                        ...formData.confirmation,
                                                        followUp: e.target.checked
                                                    }
                                                })
                                            }
                                            className="form-check-input"
                                        />
                                    </div>
                                    {errors?.confirmationFollowUp && <small className='text-danger'>{errors?.confirmationFollowUp}</small>}
                                </div>
                                <div className="col-12">
                                    <div className="">
                                        <h5 className="add-contact-title">Vitals</h5>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="custom-frm-bx">
                                        <label className='form-label'>Height (cm)</label>
                                        <input
                                            type="text"
                                            value={vitals.height}
                                            name='height'
                                            onChange={handleVitalChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="custom-frm-bx">
                                        <label className='form-label'>Weigth (kg)</label>
                                        <input
                                            type="text"
                                            value={vitals.weight}
                                            name='weight'
                                            onChange={handleVitalChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="custom-frm-bx">
                                        <label className='form-label'>Pulse</label>
                                        <input
                                            type="text"
                                            value={vitals.pulse}
                                            name='pulse'
                                            onChange={handleVitalChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="custom-frm-bx">
                                        <label className='form-label'>S<sub>p</sub>O<sub>2</sub></label>
                                        <input
                                            type="text"
                                            value={vitals.oxygenSaturation}
                                            name='oxygenSaturation'
                                            onChange={handleVitalChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="custom-frm-bx">
                                        <label className='form-label'>Blood Pressure</label>
                                        <input
                                            type="text"
                                            value={vitals.bloodPressure}
                                            name='bloodPressure'
                                            onChange={handleVitalChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="custom-frm-bx">
                                        <label className='form-label'>Temperature (F)</label>
                                        <input
                                            type="text"
                                            value={vitals.temperature}
                                            name='temperature'
                                            onChange={handleVitalChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="row">

                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label className='form-label'>Doctor Signature</label>
                                            <input
                                                type="text"
                                                value={formData.doctorSignature}
                                                name='doctorSignature'
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                            {errors?.doctorSignature && <small className='text-danger'>{errors?.doctorSignature}</small>}
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label className='form-label'>Nurse Signature</label>
                                            <input
                                                type="text"
                                                value={formData.nurseSignature}
                                                name='nurseSignature'
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                            {errors?.nurseSignature && <small className='text-danger'>{errors?.nurseSignature}</small>}
                                        </div>
                                    </div>
                                </div>

                            </div>
                            {!allotmentData?.dischargeId && <div className="mt-5 d-flex align-items-center justify-content-end gap-3">
                                <button type="submit" className="nw-thm-btn rounded-3" onClick={dischargeSubmit}>Submit</button>
                            </div>}
                        </form>

                    </div>


                    <div className="text-end mt-4">
                        <Link
                            to={-1}
                            className="nw-thm-btn outline"
                        >
                            Go Back
                        </Link>
                    </div>
                    <div className='d-none'>
                        <DischargeSummary allotmentId={allotmentId} pdfLoading={pdfLoading} endLoading={() => setPdfLoading(true)} />
                        <FollowUpPrescription allotmentId={allotmentId} pdfLoading={pdfLoading} endLoading={() => setPdfLoading(false)} />

                    </div>



                </div>}
        </>
    )
}

export default NewDischarge
