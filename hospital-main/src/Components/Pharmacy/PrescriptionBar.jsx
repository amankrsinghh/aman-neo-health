import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faDroplet, faEnvelope, faEye, faLocationDot, faPerson, faPhone, faPrint } from "@fortawesome/free-solid-svg-icons";
import { TbGridDots, TbHelpHexagon } from "react-icons/tb";
import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSecureApiData } from "../../Service/api";
import { toast } from "react-toastify";
import base_url from "../../baseUrl";
import Barcode from "react-barcode";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { BsCapsule } from "react-icons/bs";

function PrescriptionsBar() {
    const params = useParams()
    const patientId = params.id;
    const [ptData, setPtData] = useState()
    const [medicalHistory, setMedicalHistory] = useState()
    const [demographicData, setDemographicData] = useState()
    const [prescriptionData, setPrescriptionData] = useState([])
    const [presData,setPresData]=useState()
    const [patientPrescription, setPatientPrescription] = useState([])
    const [currentPage,setCurrentPage]=useState(1)
    const [totalPage,setTotalPage]=useState()
    async function fetchPrescriptionDetails() {
        try {
            const response = await getSecureApiData(`pharmacy/patient-prescription/${patientId}?page=${currentPage}`);
            if (response.success) {
                setPtData(response.user)
                setMedicalHistory(response.medicalHistory)
                setDemographicData(response.demographic)
                setPrescriptionData(response.prescription)
                setTotalPage(response.pagination.totalPages)
                setPatientPrescription(response.patientPrescription.prescriptions)
            } else {
                toast.error("Failed to fetch sell details");
            }

        } catch (error) {
            console.error("Error fetching sell details:", error);
        }
    }
    useEffect(() => {
        fetchPrescriptionDetails();
    }, [patientId,currentPage]);
    const calculateAge = (dob) => {
        if (!dob) return "";

        const birthDate = new Date(dob);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--; // haven't had birthday yet this year
        }
        return age;
    };
    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2">Prescriptions  </h3>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="#" className="breadcrumb-link">
                                                Dashboard
                                            </a>
                                        </li>

                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Prescriptions
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>


                    </div>
                </div>



                <div className="view-employee-bx patient-view-bx">
                    <div className="row">
                        <div className="col-lg-3 col-md-12 col-sm-12 mb-3">
                            <div className="view-employee-bx patients-personal-info-card">
                                <div>
                                    <div className="view-avatr-bio-bx text-center">
                                        <img src={ptData?.profileImage ? `${base_url}/${ptData?.profileImage}` : "/profile.png"} alt="" />
                                        <h4>{ptData?.name}</h4>
                                        <p><span className="vw-id">ID:</span> {ptData?.nh12}</p>
                                        <h6 className="vw-activ text-capitalize">{ptData?.status}</h6>

                                    </div>

                                    <div>
                                        <ul className="vw-info-list">
                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faPerson} /></span>
                                                <div>
                                                    <p className="vw-info-title">Age</p>
                                                    <p className="vw-info-value">{calculateAge(demographicData?.dob)} Year</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faCalendar} /></span>
                                                <div>
                                                    <p className="vw-info-title">Gender </p>
                                                    <p className="vw-info-value text-capitalize">{ptData?.gender}</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faDroplet} /></span>
                                                <div>
                                                    <p className="vw-info-title">Blood  Group </p>
                                                    <p className="vw-info-value">{demographicData?.bloodGroup}</p>
                                                </div>
                                            </li>
                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faEnvelope} /></span>
                                                <div>
                                                    <p className="vw-info-title">Email </p>
                                                    <p className="vw-info-value ">{ptData?.name} {ptData?.email}</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faPhone} /></span>
                                                <div>
                                                    <p className="vw-info-title">Phone </p>
                                                    <p className="vw-info-value">{ptData?.contactNumber}</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faPhone} /></span>
                                                <div>
                                                    <p className="vw-info-title">Emergency Contact Name </p>
                                                    <p className="vw-info-value"><span className="fw-700">({demographicData?.contact?.emergencyContactName}) </span> {demographicData?.contact?.emergencyContactNumber}</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faLocationDot} /></span>
                                                <div>
                                                    <p className="vw-info-title">Address</p>
                                                    <p className="vw-info-value">{demographicData?.address}</p>
                                                </div>
                                            </li>

                                        </ul>

                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="col-lg-9 col-md-12 col-sm-12">
                            <div className="view-employee-bx">
                                <div className="employee-tabs">
                                    <ul className="nav nav-tabs gap-3 ps-2" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <a
                                                className="nav-link active"
                                                id="home-tab"
                                                data-bs-toggle="tab"
                                                href="#home"
                                                role="tab"
                                            >
                                                Prescriptions
                                            </a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a
                                                className="nav-link"
                                                id="contact-tab"
                                                data-bs-toggle="tab"
                                                href="#contact"
                                                role="tab"
                                            >
                                                Medical Records
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="">
                                    <div className="patient-bio-tab px-0">
                                        <div className="tab-content" id="myTabContent">
                                            <div
                                                className="tab-pane fade show active"
                                                id="home"
                                                role="tabpanel"
                                            >
                                                <div className="row">
                                                    {prescriptionData?.length > 0 &&
                                                        prescriptionData?.map((item, key) =>
                                                            <div className="col-lg-12 mb-3" key={key}>
                                                                <div className="new-pharmacy-detail-card">
                                                                    <div className="admin-table-bx w-100 d-flex align-items-center justify-content-between new-prescription-bars">
                                                                        <div className="">
                                                                            <div className="admin-table-sub-details d-flex align-items-center gap-2">
                                                                                <img src={item?.status!=='Inactive' ? "/prescriptions.png" : "/in-active.png"} alt="" />
                                                                                <div>
                                                                                    <h6 className="fs-16 fw-600 text-black">Prescriptions</h6>
                                                                                    <p className="fs-14 fw-500">{new Date(item?.createdAt).toLocaleDateString('en-GB', {
                                                                                        day: '2-digit',
                                                                                        month: 'short',
                                                                                        year: 'numeric'
                                                                                    })}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="admin-table-bx">
                                                                            <div className="">
                                                                                <div className="admin-table-sub-details d-flex align-items-center gap-2 doctor-title ">
                                                                                    <img src={item?.doctorId?.doctorId?.profileImage ?
                                                                                        `${base_url}/${item?.doctorId?.doctorId?.profileImage}` : "/doctor-avatr.png"} alt="" />
                                                                                    <div>
                                                                                        <h6>{item?.doctorId?.name} </h6>
                                                                                        <p className="fs-14 fw-500">{item?.doctorId?.nh12}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex align-items gap-2">
                                                                            <div>
                                                                                <span className={`approved rounded-5 py-1 ${item?.status=='Inactive'&&'in-active'}`}>{item?.status!=='Inactive' ? 'Active' : 'Inactive'}</span>
                                                                            </div>
                                                                            <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faPrint} /></button>
                                                                            <button type="button" className="card-sw-btn" data-bs-toggle="modal" data-bs-target="#prescription-Data" onClick={()=>setPresData(item)}><FontAwesomeIcon icon={faEye} /></button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="prescription-check-bx w-100">
                                                                        <div className="mt-3 flex-grow-1 
                                                                        ">
                                                                            <div className="barcd-scannr barcde-scnnr-card ms-0">
                                                                                <div className="barcd-content">
                                                                                    <h4>{item?.customId}</h4>

                                                                                    <Barcode value={item?.customId} width={2} displayValue={false}
                                                                                        height={80} className="dynamic-barcode"/>
                                                                                </div>
                                                                                <div className="barcode-id-details">
                                                                                    <div>
                                                                                        <h6>Patient Id </h6>
                                                                                        <p>{ptData?.nh12}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h6>Appointment ID </h6>
                                                                                        <p>{item?.appointmentId?.customId}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {item?.status!=='Inactive' && <NavLink to={`/prescriptions-detail/${item?._id}`} className="text-decoration-none">
                                                                            <div className="form-check custom-check nw-thm-btn ps-5">
                                                                                <input className="form-check-input bg-transparent" type="checkbox" value="" id="addTests" />
                                                                                <label className="form-check-label text-white fw-700" for="addTests" >
                                                                                    Select
                                                                                </label>
                                                                            </div>
                                                                        </NavLink>}
                                                                    </div>
                                                                </div>
                                                            </div>)}
                                                </div>
                                            </div>
                                            <div className="tab-pane fade" id="contact" role="tabpanel">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="">
                                                            <div className="ovrview-bx mb-3">
                                                                <h4 className="new_title">Medical History</h4>
                                                                {/* <p className="">Robert Davis is a board-certified cardiologist with over 8 years of experience in diagnosing and treating heart conditions. She specializes in preventive cardiology and heart failure management.</p> */}
                                                            </div>
                                                            <div className="medical-history-content">
                                                                <div>
                                                                    <h4 className="fz-16 fw-700">Do you have any chronic conditions?</h4>
                                                                    <h5 className="hearth-disese">{medicalHistory?.chronicCondition}</h5>
                                                                </div>
                                                                <div className="mt-3">
                                                                    <h4 className="fz-16 fw-700">Are you currently on any medications?</h4>
                                                                    <h5 className="hearth-disese">{medicalHistory?.onMedication ? 'Yes' : 'No'}</h5>
                                                                </div>
                                                            </div>
                                                            <div className="medical-history-content my-3">
                                                                <div>
                                                                    <h4 className="fz-16 fw-700">Medication Details</h4>
                                                                    <p>{medicalHistory?.medicationDetail}</p>
                                                                </div>
                                                                <div className="mt-3">
                                                                    <h4 className="fz-16 fw-700">Allergies</h4>
                                                                    <p>{medicalHistory?.allergies}</p>
                                                                </div>
                                                            </div>

                                                            <div className="ovrview-bx mb-3">
                                                                <h4 className="new_title">Family Medical History</h4>
                                                            </div>
                                                            <div className="medical-history-content my-3">
                                                                <div>
                                                                    <h4 className="fz-16 fw-700">Any family history of chronic disease?</h4>
                                                                    <h5 className="hearth-disese">{medicalHistory?.familyHistory?.chronicHistory}</h5>

                                                                </div>

                                                                <div className="mt-3">
                                                                    <h4 className="fz-16 fw-700">Chronic Diseases in Family</h4>
                                                                    <p> {medicalHistory?.familyHistory?.diseasesInFamiy}</p>
                                                                    {/* <p>Mother: Osteoarthritis</p>
                                                                    <p>Maternal Grandfather: Heart Disease</p>
                                                                    <p>Paternal Grandmother: Stroke</p> */}
                                                                </div>

                                                            </div>

                                                            <div className="ovrview-bx mb-3">
                                                                <h4 className="new_title">Prescriptions and Reports</h4>
                                                            </div>

                                                            <div className="row">
                                                                {patientPrescription?.length > 0 &&
                                                                    patientPrescription?.map((item, key) =>
                                                                        <div className="col-lg-6 mb-3" key={key}>
                                                                            <div className="prescription-patients-card">
                                                                                <div className="prescription-patients-picture">
                                                                                    <img src={item?.fileUrl ?
                                                                                        `${base_url}/${item?.fileUrl}` : '/patient-card-two.png'} alt=""
                                                                                        style={{ width: '600px', height: '200px', objectFit: 'cover' }} />
                                                                                </div>
                                                                                <div className="card-details-bx">
                                                                                    <div className="card-info-title">
                                                                                        <h3>{item?.diagnosticName}</h3>
                                                                                        <p>{item?.name}</p>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faEye} /></button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        </div>)}
                                                                {/* 
                                                                <div className="col-lg-6">
                                                                    <div className="prescription-patients-card">
                                                                        <div className="prescription-patients-picture">
                                                                            <img src="/patient-card-two.png" alt="" />
                                                                        </div>
                                                                        <div className="card-details-bx">
                                                                            <div className="card-info-title">
                                                                                <h3>Prescriptions 8/21/2025</h3>
                                                                                <p>8/21/2025</p>
                                                                            </div>

                                                                            <div className="">
                                                                                <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faEye} /></button>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade step-modal" style={{ zIndex: "9999" }} id="prescription-Data" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                    aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content rounded-5" >
                            <div className="d-flex align-items-center justify-content-between border-bottom p-4">
                                <div>
                                    <h6 className="heading-grad mb-0 fz-24"> Prescription</h6>
                                </div>
                                <div>
                                    <button type="button" onClick={() => setPresData(null)} className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                                        <FontAwesomeIcon icon={faCircleXmark} />
                                    </button>
                                </div>
                            </div>
                            <div className="modal-body p-4" >
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="view-report-card">
                                            <div className="view-report-header">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div>
                                                        <span className="active-barcode">{presData?.status}</span>
                                                        <h5>{presData?.customId}</h5>
                                                        <h6>Date: {new Date(presData?.createdAt).toLocaleDateString("en-GB", {
                                                            day: "2-digit",
                                                            month: "long",
                                                            year: "numeric",
                                                        })
                                                        } </h6>
                                                    </div>

                                                    {/* <div className="d-flex gap-2">
                                                        <button className="fz-18 no-print" onClick={handleDownload}><FontAwesomeIcon icon={faDownload} /> </button>
                                                        <button className="fz-18 no-print"><FontAwesomeIcon icon={faPrint} /> </button>
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div className="view-report-content">
                                                <div className="sub-content-title">
                                                    <h4>RX.</h4>
                                                    <h3><BsCapsule style={{ color: "#00B4B5" }} /> Medications</h3>
                                                </div>
                                                {presData?.medications?.map((item, key) =>
                                                    <div className="view-medications-bx mb-3" key={key}>
                                                        <h5>{key + 1}. {item?.name}</h5>
                                                        <ul className="viwe-medication-list">
                                                            <li className="viwe-medication-item">Frequency: {item?.frequency} </li>
                                                            <li className="viwe-medication-item">Duration: {item?.duration}</li>
                                                            <li className="viwe-medication-item">Instructions: {item?.instructions}</li>
                                                            <li className="viwe-medication-item">Refills: {item?.refills} </li>

                                                        </ul>
                                                    </div>)}
                                                <div className="diagnosis-bx mb-3">
                                                    <h5>Diagnosis</h5>
                                                    <p>{presData?.diagnosis}</p>
                                                </div>

                                                {presData?.note && <div className="diagnosis-bx mb-3">
                                                    <h5>Note</h5>
                                                    <p>{presData?.note }</p>
                                                </div>}
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default PrescriptionsBar