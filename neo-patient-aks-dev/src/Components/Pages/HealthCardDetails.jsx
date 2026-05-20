import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { faCircleXmark, faCopy, faDroplet, faEdit, faEye, faMarsAndVenus, faPerson, faRulerVertical, faWeightScale } from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { fetchPatientDetail } from "../../Redux/features/patient"
import base_url from "../../baseUrl"
import { securePostData } from "../../Services/api"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
// import { useNavigate } from "react-router-dom"


function HealthCardDetails() {
    const dispatch = useDispatch()
    const userId = localStorage.getItem('userId')
    const [message, setMessage] = useState('')
    const { profiles, user, medicalHistory, demographic, labAppointment, kyc, prescription, isRequest, customId, allowEdit } = useSelector(state => state.patient)

    useEffect(() => {
        dispatch(fetchPatientDetail())
    }, [dispatch])
    // const navigate = useNavigate()
    const sendEditRequest = async () => {
        if (message == '') {
            toast.error("Please enter the reason")
            return
        }
        const data = { patientId: userId, message }
        try {
            const response = await securePostData(`patient/edit-request`, data);
            if (response.success) {
                setMessage('')
                dispatch(fetchPatientDetail())
                toast.success("You request was sent!")
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message)
        }
    }

    return (
        <>

            <div className="profile-right-card">
                <div className="profile-tp-header">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h5 className="heading-grad fz-24 mb-0">  My NeoHealthCard  Details</h5>
                        </div>
                        <div className="d-flex gap-3 flex-wrap align-items-center">
                            {allowEdit && <>
                                <div className="approve-title">
                                    <h5><span className="approve-right-check">
                                    </span> Edit Request Approved </h5>
                                </div>
                                <Link to={'/edit-profile'} className="nw-thm-btn outline"> <FontAwesomeIcon icon={faEdit} /> Edit</Link>
                            </>}
                            {isRequest == null &&
                                <button className="nw-thm-btn" data-bs-toggle="modal" data-bs-target="#edit-Request">Edit Request</button>
                            }
                        </div>
                    </div>
                </div>
                <div className="all-profile-data-bx">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="user-background">
                                {/* <div className="user-parent-bx">
                                                    <img src="/profile-bg.png" alt="" />
                                                </div> */}

                                <div className="user-bg-color">

                                </div>


                                <div className="nw-usr-profiles-card ">
                                    <div className="main-user-picture">
                                        <img src={profiles?.profileImage ?
                                            `${base_url}/${profiles?.profileImage}` : "/call-pic.jpg"} alt="" />
                                    </div>
                                    <div className="user-detail-bx">
                                        <h5>{profiles?.name}</h5>
                                        <p>ID: {user?.nh12}</p>
                                    </div>
                                </div>

                            </div>

                            <div className="new-item-list p-0">
                                <fieldset class="address-fieldset mb-4">
                                    <legend class="float-none w-auto px-3 field-title">
                                        Personal  Info
                                    </legend>
                                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                                        <ul className="patient-bio-list">
                                            <li className="patient-bio-item"><FontAwesomeIcon icon={faPerson} /> Age :<span className="patient-bio-title"> 18</span> </li>
                                            <li className="patient-bio-item"><FontAwesomeIcon icon={faMarsAndVenus} /> Gender :<span className="patient-bio-title"> {profiles?.gender}</span> </li>
                                            <li className="patient-bio-item"><FontAwesomeIcon icon={faRulerVertical} /> Height :<span className="patient-bio-title"> {demographic?.height} </span> </li>
                                            <li className="patient-bio-item"><FontAwesomeIcon icon={faWeightScale} /> Weight :<span className="patient-bio-title"> {demographic?.weight}</span> </li>
                                            <li className="patient-bio-item"><FontAwesomeIcon icon={faDroplet} /> Blood Group :<span className="patient-bio-title"> {demographic?.bloodGroup}</span> </li>
                                        </ul>
                                        <div>

                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset class="address-fieldset mb-4">
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

                                <fieldset class="address-fieldset mb-4">
                                    <legend class="float-none w-auto px-3 field-title">
                                        Family Medical History
                                    </legend>

                                    <div className="medical-history-content ">
                                        <div>
                                            <h4 className="fz-16 fw-700">Any family history of chronic disease?</h4>
                                            <h5 className="hearth-disese">{medicalHistory?.familyHistory?.chronicHistory}</h5>

                                        </div>

                                        <div className="mt-3">
                                            <h4 className="fz-16 fw-700">Chronic Diseases in Family</h4>
                                            <p> {medicalHistory?.familyHistory?.diseasesInFamily}</p>
                                        </div>

                                    </div>

                                </fieldset>

                                <fieldset class="address-fieldset mb-4">
                                    <legend class="float-none w-auto px-3 field-title">
                                        Prescriptions and Reports
                                    </legend>

                                    <div className="row">
                                        {prescription?.prescriptions?.length > 0 &&
                                            prescription?.prescriptions?.map((item, key) =>
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

                        </div>
                    </div>
                </div>
            </div>

            <div className="text-end mt-4">
                             <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                          </div>


            {/*Payment Status Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#edit-Request" */}
            <div className="modal step-modal fade" id="edit-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-0">
                        <div className="d-flex align-items-center justify-content-between border-bottom px-4 py-3">
                            <div>
                                <h6 className="heading-grad mb-0 fz-24">Edit Request from Admin</h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "rgba(239, 0, 0, 1)" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body px-5 pb-5">
                            <div className="row ">
                                <div className="col-lg-12">
                                    <div className="edit-request-bx text-center">
                                        <div className="float-left my-3">
                                            <img src="/edit-reqest.png" alt="" />
                                        </div>
                                        <div className="float-right">
                                            <p>You can edit your profile when you click on the request button. The edit option will appear after your request is approved. After making changes, click on save and you will have to wait for approval
                                            </p>
                                        </div>
                                    </div>

                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Note</label>
                                        <textarea name="" value={message} onChange={(e) => setMessage(e.target.value)} required id="" className="form-control"></textarea>

                                    </div>
                                    <div>
                                        {/* <button type="button" onClick={() => navigate("#")} data-bs-dismiss="modal" aria-label="Close" className="nw-thm-btn w-100" > Send Edit Request </button> */}

                                        <button type="button" onClick={sendEditRequest} className="nw-thm-btn w-100" data-bs-toggle="modal" data-bs-target="#approve-Request"> Send Edit Request </button>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Payment Status Popup End */}



            {/*Edit Profile Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#approve-Request" */}
            <div className="modal step-modal fade" id="approve-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content edit-modal-content rounded-0 p-5">
                        {/* <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close">
                                    <FontAwesomeIcon icon={faClose} />
                                </button>
                            </div>
                        </div> */}
                        <div className="modal-body p-0">
                            <div className="row justify-content-center">
                                <div className="col-lg-9">
                                    <div className="text-center your-document-mega-dv">
                                        <div className="submit-document-bx">
                                            <FontAwesomeIcon icon={faCopy} className="document-icon" />
                                            <div className="timr-bx">
                                                <img src="/timer.png" alt="" />
                                            </div>
                                        </div>

                                        <p className="mt-4">Your documents have been submitted for verification. This may take up to 48 hours. You’ll be notified once approved.</p>

                                        <div className="mt-5">
                                            <a href="javascript:void(0)" className="nw-thm-btn w-75" data-bs-dismiss="modal">OK</a>
                                        </div>


                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Edit Profile Popup End */}



        </>
    )
}

export default HealthCardDetails