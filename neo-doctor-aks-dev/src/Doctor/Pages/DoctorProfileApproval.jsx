import { faChevronLeft, faChevronRight, faDroplet, faEye, faMarsAndVenus, faPerson, faRulerVertical, faWeightScale, } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSecureApiData, securePostData } from "../../Services/api";
import base_url from "../../baseUrl";
import { calculateAge } from "../../Services/globalFunction";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";

function DoctorProfileApproval() {
    const params = useParams()
    const patientId = params.id
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const doctorId = localStorage.getItem('userId')
    const [medicalHistory, setMedicalHisotry] = useState()
    const [prescription, setPrescription] = useState([])
    const [patientData, setPatientData] = useState()
    const [demographic, setDemographic] = useState()
    const [customId, setCustomId] = useState()
    const [note, setNote] = useState('')
    async function fetchPatientProfile() {
        setLoading(true)
        try {
            const result = await getSecureApiData(`patient/profile-detail/${patientId}`)
            if (result.success) {
                setDemographic(result?.demographic)
                setMedicalHisotry(result.medicalHistory)
                setPrescription(result?.prescription?.prescriptions)
                setPatientData(result?.user)
                setCustomId(result.customId)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (patientId) {
            fetchPatientProfile()
        }
    }, [patientId])
    const handleAction = async (status) => {
        const data = { status, note, patientId, doctorId }
        setLoading(true)
        try {
            const response = await securePostData('patient/profile-action', data)
            if (response.success) {
                toast.success('Profile updated')
                navigate(`/patient-details/${patientId}`)
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
                        <h5 className="heading-grad fz-24 mb-0">View Details</h5>
                    </div>

                    <div className="">
                        <div className="employee-tabs">
                            <ul className="nav nav-tabs gap-3 px-3" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link active"
                                        id="home-tab"
                                        data-bs-toggle="tab"
                                        href="#home"
                                        role="tab"
                                    >
                                        Personal  Info
                                    </a>
                                </li>

                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link"
                                        id="profile-tab"
                                        data-bs-toggle="tab"
                                        href="#profile"
                                        role="tab"
                                    >
                                        Medical History
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
                                        Family Medical History
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link"
                                        id="upload-tab"
                                        data-bs-toggle="tab"
                                        href="#upload"
                                        role="tab"
                                    >
                                        Prescriptions and Reports
                                    </a>
                                </li>

                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link"
                                        id="notes-tab"
                                        data-bs-toggle="tab"
                                        href="#notes"
                                        role="tab"
                                    >
                                        Note & Approve
                                    </a>
                                </li>

                            </ul>

                            <div className="">
                                <div className="employee-tabs">
                                    <div className="tab-content" id="myTabContent">
                                        <div
                                            className="tab-pane fade show active"
                                            id="home"
                                            role="tabpanel"
                                        >

                                            <div className="all-profile-data-bx">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div>
                                                            {/* <div class="d-flex align-items-center justify-content-start gap-3 mb-3">
                                                                            <div class="form-check uniquee">
                                                                                <input class="form-check-input" type="checkbox" id="approve" checked />
                                                                                <label class="form-check-label" for="approve">
                                                                                    Approve
                                                                                </label>
                                                                            </div>

                                                                            <div class="form-check uniquee">
                                                                                <input class="form-check-input" type="checkbox" id="reject" />
                                                                                <label class="form-check-label" for="reject">
                                                                                    Reject
                                                                                </label>
                                                                            </div>

                                                                        </div> */}

                                                            <fieldset class="address-fieldset">
                                                                <legend class="float-none w-auto px-3 legend-heading">
                                                                    Personal  Info
                                                                </legend>
                                                                <div className=" patient-details-bx mb-3">
                                                                    <div className="admin-table-sub-bx patient-avartr-bx gap-3">
                                                                        <img src={patientData?.profileImage ? `${base_url}/${patientData?.profileImage}`
                                                                            : "/profile.png"} alt="" />
                                                                        <div className="patient-bio-content">
                                                                            <h6>{patientData?.name}</h6>
                                                                            <p>ID: {customId}</p>
                                                                        </div>
                                                                    </div>


                                                                </div>
                                                                <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                                    <ul className="patient-bio-list">
                                                                        <li className="patient-bio-item"><FontAwesomeIcon icon={faPerson} /> Age :<span className="patient-bio-title"> {calculateAge(demographic?.dob)}</span> </li>
                                                                        <li className="patient-bio-item"><FontAwesomeIcon icon={faMarsAndVenus} /> Gender :<span className="patient-bio-title"> {patientData?.gender}</span> </li>
                                                                        <li className="patient-bio-item"><FontAwesomeIcon icon={faRulerVertical} /> Height :<span className="patient-bio-title"> {demographic?.height} </span> </li>
                                                                        <li className="patient-bio-item"><FontAwesomeIcon icon={faWeightScale} /> Weight :<span className="patient-bio-title"> {demographic?.weight}</span> </li>
                                                                        <li className="patient-bio-item"><FontAwesomeIcon icon={faDroplet} /> Blood Group :<span className="patient-bio-title"> {demographic?.bloodGroup}</span> </li>
                                                                    </ul>
                                                                    <div>
                                                                        <NavLink to="/patient-view" className="option-rep-add-btn">View More</NavLink>
                                                                    </div>
                                                                </div>

                                                            </fieldset>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="profile-btm-footer">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex gap-3">
                                                        <button className="nw-prev-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </button>
                                                        <button type="button" className="nw-next-btn"
                                                            onClick={() => {
                                                                const triggerEl = document.querySelector('#profile-tab');
                                                                const tab = new window.bootstrap.Tab(triggerEl);
                                                                tab.show();
                                                            }}> <FontAwesomeIcon icon={faChevronRight} /> </button>
                                                    </div>
                                                    <div className="">
                                                        <button type="button" onClick={() => {
                                                            const triggerEl = document.querySelector('#profile-tab');
                                                            const tab = new window.bootstrap.Tab(triggerEl);
                                                            tab.show();
                                                        }} className="thm-btn">Next & submit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tab-pane fade" id="profile" role="tabpanel">
                                            <form action="">
                                                <div className="all-profile-data-bx">
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div>
                                                                {/* <div class="d-flex align-items-center justify-content-start gap-3 mb-3">
                                                                                <div class="form-check uniquee">
                                                                                    <input class="form-check-input" type="checkbox" id="approve" checked />
                                                                                    <label class="form-check-label" for="approve">
                                                                                        Approve
                                                                                    </label>
                                                                                </div>

                                                                                <div class="form-check uniquee">
                                                                                    <input class="form-check-input" type="checkbox" id="reject" />
                                                                                    <label class="form-check-label" for="reject">
                                                                                        Reject
                                                                                    </label>
                                                                                </div>

                                                                            </div> */}

                                                                <fieldset class="address-fieldset">
                                                                    <legend class="float-none w-auto px-3 field-title">
                                                                        Medical History
                                                                    </legend>

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

                                                                </fieldset>
                                                            </div>
                                                        </div>

                                                    </div>



                                                </div>


                                                <div className="profile-btm-footer">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div className="d-flex gap-3">
                                                            <button type="button" className="nw-next-btn"
                                                            > <FontAwesomeIcon icon={faChevronLeft} /> </button>
                                                            <button type="button" className="nw-next-btn"
                                                                onClick={() => {
                                                                    const triggerEl = document.querySelector('#contact-tab');
                                                                    const tab = new window.bootstrap.Tab(triggerEl);
                                                                    tab.show();
                                                                }}> <FontAwesomeIcon icon={faChevronRight} /> </button>
                                                        </div>
                                                        <div className="">
                                                            <button type="button"
                                                                onClick={() => {
                                                                    const triggerEl = document.querySelector('#contact-tab');
                                                                    const tab = new window.bootstrap.Tab(triggerEl);
                                                                    tab.show();
                                                                }} className="thm-btn">Next & submit</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                        <div className="tab-pane fade" id="contact" role="tabpanel">

                                            <div className="all-profile-data-bx">
                                                <div>
                                                    {/* <div class="d-flex align-items-center justify-content-start gap-3 mb-3">
                                                                    <div class="form-check uniquee">
                                                                        <input class="form-check-input" type="checkbox" id="approve" checked />
                                                                        <label class="form-check-label" for="approve">
                                                                            Approve
                                                                        </label>
                                                                    </div>

                                                                    <div class="form-check uniquee">
                                                                        <input class="form-check-input" type="checkbox" id="reject" />
                                                                        <label class="form-check-label" for="reject">
                                                                            Reject
                                                                        </label>
                                                                    </div>
                                                                </div> */}

                                                    <fieldset class="address-fieldset">
                                                        <legend class="float-none w-auto px-3 field-title">
                                                            Family Medical History
                                                        </legend>

                                                        <div className="medical-history-content">
                                                            <div>
                                                                <h4 className="fz-16 fw-700">Any family history of chronic disease?</h4>
                                                                <h5 className="hearth-disese">{medicalHistory?.familyHistory?.chronicHistory}</h5>
                                                            </div>
                                                        </div>

                                                        <div className="medical-history-content my-3">
                                                            <div>
                                                                <h4 className="fz-16 fw-700">Chronic Diseases in Family</h4>
                                                                <p> {medicalHistory?.familyHistory?.diseasesInFamily}</p>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>

                                            </div>




                                            <div className="profile-btm-footer">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex gap-3">
                                                        <button type="button" className="nw-next-btn"
                                                            onClick={() => {
                                                                const triggerEl = document.querySelector('#profile-tab');
                                                                const tab = new window.bootstrap.Tab(triggerEl);
                                                                tab.show();
                                                            }}> <FontAwesomeIcon icon={faChevronLeft} /> </button>
                                                        <button type="button" className="nw-next-btn"
                                                            onClick={() => {
                                                                const triggerEl = document.querySelector('#upload-tab');
                                                                const tab = new window.bootstrap.Tab(triggerEl);
                                                                tab.show();
                                                            }}> <FontAwesomeIcon icon={faChevronRight} /> </button>
                                                    </div>
                                                    <div className="">
                                                        <button type="button"
                                                            onClick={() => {
                                                                const triggerEl = document.querySelector('#upload-tab');
                                                                const tab = new window.bootstrap.Tab(triggerEl);
                                                                tab.show();
                                                            }} className="thm-btn">Next & submit</button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="tab-pane fade" id="upload" role="tabpanel">
                                            <div className="all-profile-data-bx">
                                                <fieldset class="address-fieldset">
                                                    <legend class="float-none w-auto px-3 field-title">
                                                        Prescriptions and reports
                                                    </legend>
                                                    <div className="row">
                                                        {prescription?.length > 0 &&
                                                            prescription?.map((item, key) =>
                                                                <div className="col-lg-6 col-sm-12 mb-3" key={key}>
                                                                    <div className="prescription-patients-card">
                                                                        <div className="prescription-patients-picture">
                                                                            <img src={item?.fileUrl ?
                                                                                `${base_url}/${item?.fileUrl}` : "/patient-card-one.png"} alt="" />
                                                                        </div>
                                                                        <div className="card-details-bx">
                                                                            <div className="card-info-title">
                                                                                <h3>{item?.name}</h3>
                                                                                {/* <p>8/21/2025</p> */}
                                                                            </div>
                                                                            <div className="">
                                                                                <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faEye} /></button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>)}



                                                    </div>



                                                </fieldset>
                                            </div>
                                            <div className="profile-btm-footer">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex gap-3">
                                                        <button type="button" className="nw-next-btn"
                                                            onClick={() => {
                                                                const triggerEl = document.querySelector('#contact-tab');
                                                                const tab = new window.bootstrap.Tab(triggerEl);
                                                                tab.show();
                                                            }}> <FontAwesomeIcon icon={faChevronLeft} /> </button>
                                                        <button type="button" className="nw-next-btn"
                                                            onClick={() => {
                                                                const triggerEl = document.querySelector('#notes-tab');
                                                                const tab = new window.bootstrap.Tab(triggerEl);
                                                                tab.show();
                                                            }}> <FontAwesomeIcon icon={faChevronRight} /> </button>
                                                    </div>
                                                    <div className="">
                                                        <button type="button"
                                                            onClick={() => {
                                                                const triggerEl = document.querySelector('#notes-tab');
                                                                const tab = new window.bootstrap.Tab(triggerEl);
                                                                tab.show();
                                                            }} className="thm-btn">Next & submit</button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>


                                        <div className="tab-pane fade" id="notes" role="tabpanel">
                                            <div className="all-profile-data-bx">
                                                <form action="">
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Note</label>
                                                                <textarea value={note} onChange={(e) => setNote(e.target.value)} name="" id="" className="form-control nw-frm-select nw-text-filed"></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>


                                            </div>
                                            <div className="profile-btm-footer">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex gap-3">
                                                        <button
                                                            onClick={() => {
                                                                const triggerEl = document.querySelector('#upload-tab');
                                                                const tab = new window.bootstrap.Tab(triggerEl);
                                                                tab.show();
                                                            }} type="button" className="nw-next-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </button>
                                                        <button className="nw-prev-btn"> <FontAwesomeIcon icon={faChevronRight} /> </button>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <button type="button"
                                                            className="nw-danger-thm-btn" onClick={() => handleAction('rejected')}>Reject</button>
                                                        <button type="button" className="thm-btn" onClick={() => handleAction('approved')}>Approve</button>
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
            }
        </>
    )
}

export default DoctorProfileApproval