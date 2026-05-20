import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { getApiData, getSecureApiData, securePostData } from "../../Service/api";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import Loader from "../Common/Loader";
import base_url from "../../baseUrl";

const DischargeDownload = () => {
    const params = useParams();
    const allotmentId = params.id
    const [data, setData] = useState(null);
    const pdfRef = useRef();
    const hasDownloaded = useRef(false);
    const [testReport, setTestReport] = useState([])
    const [hospitalData,setHospitaData]=useState()
    const [allotmentData, setAllotmentData] = useState()
    const [prescriptionData, setPrescriptionData] = useState()
    const [patientData, setPatientData] = useState()
    const [dischargeData, setDischargeData] = useState()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
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
    })
    const fetchAllotmentData = async () => {
        try {
            setLoading(true)
            const response = await getApiData(`api/bed/discharge-scan/${allotmentId}`)
            if (response.success) {
                setAllotmentData(response.allotmentData)
                setPrescriptionData(response.prescriptionData)
                setPatientData(response.patientData)
                setHospitaData(response.hospitalData)
                const data = response.data;
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
                    doctorSignature: data?.doctorSignature || "",
                })
            } else {
                toast.error(response.message)
                navigate('/')
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
        if (allotmentData && allotmentData?.labAppointment) {
            fetchTestReportData()
        }
    }, [allotmentData])
    const [hideLabReports, setHideLabReports] = useState(false);
    const handleDownload = () => {
        if (!pdfRef.current) return;

        // Step 1: Lab Reports hide karo
        setHideLabReports(true);

        setTimeout(() => {
            const opt = {
                margin: 0.5,
                filename: `discharge-${allotmentId}.pdf`,
                image: { type: "jpeg", quality: 1 },
                html2canvas: { scale: 2, scrollY: 0 },
                jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
            };

            html2pdf()
                .from(pdfRef.current)
                .set(opt)
                .save()
                .finally(() => {
                    // Step 2: PDF save hone ke baad Lab Reports wapas dikhao
                    setHideLabReports(false);
                });
        }, 100); // chhota delay ensure kare DOM update ho jaye
    };
    return (
        <div className="mx-lg-5 m-3">
            <div className="d-flex justify-content-between">
                <img src="/logo.png" alt="" srcset="" width={100} height={60} />
                <button
                    onClick={handleDownload}
                    className="nw-thm-btn w-auto"
                    disabled={loading}
                >
                    {"Download PDF"}
                </button>
            </div>
            {loading ? <Loader />
                : <div ref={pdfRef} className="main-content flex-grow-1 p-3 pdf-container">
                    <div className="new-panel-card">

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
                                        <input
                                            type="text"
                                            name="name"
                                            value={patientData?.gender}
                                            placeholder="Gender"
                                            className="form-control"
                                        />
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
                                        <h5 className="add-contact-title">Hospital Details</h5>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label>Hospital id</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={hospitalData?.nh12}
                                            placeholder="Discharge Type"
                                            className="form-control"
                                        />

                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Hospital Name</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={hospitalData?.name}
                                            placeholder="Email Address"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">GST Number</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={hospitalData?.gstNumber}
                                            placeholder="Primary Doctor"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Contact Number</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={hospitalData?.contactNumber}
                                            placeholder="Bed"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Email</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={hospitalData?.email}
                                            placeholder="Bed"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Address</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={hospitalData?.fullAddress}
                                            placeholder="Bed"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="">
                                        <h5 className="add-contact-title">Admission Details</h5>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label>Discharge Type</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData?.dischargeType}
                                            placeholder="Discharge Type"
                                            className="form-control"
                                        />

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
                                {allotmentData?.labAppointment && !hideLabReports &&
                                    <div className="row mt-4 no-print">

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
                                        <input
                                            type="text"
                                            name="name"
                                            value={prescriptionData?.status}
                                            placeholder="Status"
                                            className="form-control"
                                        />
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

                                                    className="form-control"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label className='form-label'>Frequency</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={m?.frequency}
                                                    placeholder="Frequency"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label>Duration</label>
                                                <input
                                                    type="text"
                                                    readOnly={dischargeData}
                                                    value={m?.duration}

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

                                                    className="form-control"
                                                />
                                            </div>
                                        </div>


                                        <div className="col-lg-12">
                                            <div className="custom-frm-bx">
                                                <label>Instruction</label>
                                                <input
                                                    type="text"
                                                    readOnly={dischargeData}
                                                    value={m?.instructions}

                                                    className="form-control"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                )}

                                <div className="col-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Prescription Notes</label>
                                        <textarea
                                            type="text"
                                            readOnly={dischargeData}
                                            value={prescriptionData?.notes}

                                            placeholder="Notest"
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="">
                                        <h5 className="add-contact-title">Other</h5>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Final Dignosis</label>
                                        <div
                                            className="about-para"
                                            dangerouslySetInnerHTML={{ __html: formData?.finalDiagnosis }}
                                        />

                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Hospital course</label>
                                        {/* <textarea
                                            type="text"
                                            className="form-control"

                                            value={formData?.hospitalCourse}
                                            name='hospitalCourse'
                                        /> */}
                                        <div
                                            className="about-para"
                                            dangerouslySetInnerHTML={{ __html: formData?.hospitalCourse }}
                                        />

                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Condition at discharge</label>
                                        {/* <textarea
                                            type="text"

                                            className="form-control"
                                            value={formData?.conditionOfDischarge}
                                            name='conditionOfDischarge'
                                        /> */}
                                        <div
                                            className="about-para"
                                            dangerouslySetInnerHTML={{ __html: formData?.conditionOfDischarge }}
                                        />

                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Follow-up plan</label>
                                        {/* <textarea
                                            type="text"

                                            className="form-control"
                                            value={formData?.followUpPlan}
                                            name='followUpPlan'
                                        /> */}
                                        <div
                                            className="about-para"
                                            dangerouslySetInnerHTML={{ __html: formData?.followUpPlan }}
                                        />

                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Red flag signs</label>
                                        {/* <textarea
                                            type="text"
                                            className="form-control"
                                            value={formData?.redFlag}
                                            name='redFlag'
                                        /> */}
                                        <div
                                            className="about-para"
                                            dangerouslySetInnerHTML={{ __html: formData?.redFlag }}
                                        />

                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Discharge Note</label>
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            value={formData?.dischargeNote}
                                            name='dischargeNote'
                                        />

                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="">
                                        <h5 className="add-contact-title">Confirmation</h5>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12">
                                    <div className="form-check custom-check">
                                        <label className='form-check-label'>Final Diagnosis</label>
                                        <input
                                            type="checkbox"
                                            disabled
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

                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12">
                                    <div className="form-check custom-check">
                                        <label className='form-check-label'>Treatment summary</label>
                                        <input
                                            type="checkbox"
                                            disabled
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

                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12">
                                    <div className="form-check custom-check">
                                        <label className='form-check-label'>Medicines</label>
                                        <input
                                            type="checkbox"
                                            disabled
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

                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12">
                                    <div className="form-check custom-check">
                                        <label className='form-check-label'>Follow-up</label>
                                        <input
                                            type="checkbox"
                                            disabled
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

                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label className='form-label'>Doctor Signature</label>
                                        <input
                                            type="text"
                                            value={formData.doctorSignature}
                                            name='doctorSignature'

                                            className="form-control"
                                        />

                                    </div>
                                </div>

                            </div>

                        </form>

                    </div>
                </div>}
        </div>
    );
};

export default DischargeDownload;