import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faCheckCircle, faCircleXmark, faEdit } from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from "react-redux"
import { fetchDoctorDetail } from "../../Redux/features/doctor"
import { useEffect, useState } from "react"
import base_url from "../../baseUrl"
import { toast } from "react-toastify"
import { securePostData } from "../../Services/api"
import { Modal } from "bootstrap"
import Loader from "../../Loader/Loader"
import { Link } from "react-router-dom"
import { QRCodeCanvas } from "qrcode.react"
import { BriefcaseMedical } from "lucide-react"

function DoctorProfileEditRequest() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const userId = localStorage.getItem('userId')
    const [message, setMessage] = useState('')
    const { profiles, kyc, medicalLicense, allowEdit, aboutDoctor, educationWork, customId, isRequest, clinicData, user } = useSelector(state => state.doctor)
    useEffect(() => {
        dispatch(fetchDoctorDetail())
    }, [dispatch])
    const sendEditRequest = async () => {
        if (message == '') {
            toast.error("Please enter the reason")
            return
        }
        setLoading(true)
        const data = { doctorId: userId, message }
        try {
            const response = await securePostData(`doctor/edit-request`, data);
            if (response.success) {
                document.getElementById("editClose").click()
                setMessage('')
                dispatch(fetchDoctorDetail())
                toast.success("You request was sent!")
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message)
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
                        <div className="d-flex align-items-center justify-content-between flex-wrap ">
                            <div>
                                <h5 className="heading-grad fz-24 mb-0">Profile</h5>
                            </div>

                            {!isRequest &&
                                <div>
                                    <a href="javascript:void(0)" className="nw-thm-btn outline" data-bs-toggle="modal" data-bs-target="#edit-Request"> <FontAwesomeIcon icon={faEdit} /> Send Edit Request </a>
                                </div>}
                            {allowEdit &&
                                <div className="d-flex align-items-center gap-2">
                                    <div className="approve-title">
                                        <h5><span className="approve-right-check">
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                        </span> Accept Edit Request </h5>
                                    </div>

                                    <Link to='/edit-profile' className="nw-thm-btn outline" > <FontAwesomeIcon icon={faEdit} /> Edit now</Link>
                                </div>}

                        </div>
                    </div>
                    <div className="all-profile-data-bx">
                        <div>
                            <div className="doctor-information-card mb-4">
                                <div className="doctor-main-profile-card">
                                    <div className="doctor-profile-pic">
                                        <img src={profiles?.profileImage ?
                                            `${base_url}/${profiles?.profileImage}` : "/call-pic.jpg"} alt="" />
                                    </div>
                                    <div className="doctor-content-details">
                                        <div className="doctor-info-heading">
                                            <h4>Dr. {profiles?.name} </h4>
                                            <p>{customId}</p>
                                        </div>

                                        <div className="doctor-info-list">
                                            <div className="doctor-info-item">
                                                <h6>Mobile Number</h6>
                                                <p>{profiles?.contactNumber}</p>
                                            </div>

                                            <div className="doctor-info-item">
                                                <h6>Gender</h6>
                                                <p className="text-capitalize">{profiles?.gender}</p>
                                            </div>

                                            <div className="doctor-info-item">
                                                <h6>Email</h6>
                                                <p>{profiles?.email}</p>
                                            </div>

                                            <div className="doctor-info-item">
                                                <h6>Date of Birth</h6>
                                                <p>{new Date(profiles?.dob)?.toLocaleDateString()}</p>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>

                            <fieldset class="address-fieldset mb-4">
                                <legend class="float-none w-auto px-3 field-title">
                                    Address & About You
                                </legend>
                                <div className="doctor-hospital-info">
                                    <div className="doctor-hospital-pic mb-2" >
                                        <img src="/hospital.svg" alt="" />
                                        <h5>{aboutDoctor?.hospitalName}</h5>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className=" mb-3">
                                            <div className="row">


                                                <div className="col-lg-6 doctor-info-item mb-3">
                                                    <h6>Country</h6>
                                                    <p>{aboutDoctor?.countryId?.name}</p>
                                                </div>

                                                <div className="col-lg-6 doctor-info-item mb-3">
                                                    <h6>State</h6>
                                                    <p>{aboutDoctor?.stateId?.name}</p>
                                                </div>

                                                <div className="col-lg-6 doctor-info-item mb-3">
                                                    <h6>City</h6>
                                                    <p>{aboutDoctor?.cityId?.name}</p>
                                                </div>

                                                <div className="col-lg-6 doctor-info-item mb-3">
                                                    <h6>Pin code</h6>
                                                    <p>{aboutDoctor?.pinCode}</p>
                                                </div>
                                                <div className="col-lg-6 doctor-info-item mb-3">
                                                    <h6>Full Address</h6>
                                                    <p>{aboutDoctor?.fullAddress} </p>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="  mb-3">
                                            <div className="add-patients-clients premium-crd-details" >
                                                <div className="nw-chip-card">
                                                    {/* <BriefcaseMedical color="#fff" size={50} /> */}
                                                </div>
                                                <img src="/NeoCard.png" alt="" />
                                                <div className="patient-card-details">
                                                    <h4 className="text-white">{profiles?.name?.length > 17 ? profiles?.name?.slice(0, 14) + '...' :
                                                        profiles?.name}</h4>
                                                    {/* <p className="text-white">Doctor ID</p> */}
                                                    <h6 className="text-white">{user?.nh12}</h6>
                                                </div>
                                                <div className="qr-code-generate">
                                                    <QRCodeCanvas
                                                        value={`https://neohealthcard.com/user/${user?.nh12}`}
                                                        size={256}
                                                        bgColor="transparent"
                                                        fgColor="#ffffff"
                                                        className="qr-code"
                                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="doctor-info-list mb-3">
                                        <div className="doctor-info-item">
                                            <h6>Specialty</h6>
                                            <p>{aboutDoctor?.specialty?.name}</p>
                                        </div>

                                        <div className="doctor-info-item">
                                            <h6>Treatment Areas</h6>
                                            <p>{aboutDoctor?.treatmentAreas?.map(i => i?.name).join(', ')}</p>
                                        </div>
                                    </div>

                                    <div className="doctor-info-list mb-3">
                                        <div className="doctor-info-item">
                                            <h6>Fees</h6>
                                            <p>₹ {aboutDoctor?.fees}</p>
                                        </div>

                                        <div className="doctor-info-item">
                                            <h6>Languages</h6>
                                            <p>{aboutDoctor?.language?.map(i => i).join(', ')}</p>
                                        </div>



                                    </div>

                                    <div className="doctor-info-list mb-3">
                                        <div className="doctor-info-item">
                                            <h6>About</h6>
                                            <p>{aboutDoctor?.aboutYou}</p>
                                        </div>
                                    </div>

                                </div>
                            </fieldset>
                        </div>
                        {clinicData &&
                            <div>

                                <fieldset class="address-fieldset mb-4">
                                    <legend class="float-none w-auto px-3 field-title">
                                        Clinic Details
                                    </legend>
                                    <div className="doctor-hospital-info">
                                        <div className="doctor-hospital-pic mb-2" >
                                            <img src="/clinic.png" alt="" width={61} height={61} />
                                            <h5>{clinicData?.clinicName}</h5>
                                        </div>

                                        <div className="doctor-info-list mb-3">
                                            <div className="doctor-info-item">
                                                <h6>License Number</h6>
                                                <p>{clinicData?.licenseNumber} </p>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center gap-4">
                                            <div className="doctor-info-list mb-3">
                                                <div className="doctor-info-item">
                                                    <h6>License Image</h6>
                                                    <img width={150} src={`${base_url}/${clinicData?.licenseImage}`} alt="License" className="img-fluid" />
                                                </div>
                                            </div>
                                            <div className="doctor-info-list mb-3">
                                                <div className="doctor-info-item">
                                                    <h6>Clinic Image</h6>
                                                    <img width={150} src={`${base_url}/${clinicData?.clinicImage}`} alt="Clinic" className="img-fluid" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>}
                        <div>

                            <fieldset class="address-fieldset mb-4">
                                <legend class="float-none w-auto px-3 field-title">
                                    Education
                                </legend>

                                {educationWork?.education?.map((item, key) =>
                                    <div className="doctor-hospital-info" key={key}>
                                        <div className="doctor-hospital-pic align-items-start">
                                            <img src="/chevron-one.svg" alt="" />
                                            <div>
                                                <h5>{item?.university}</h5>
                                                <p>{item?.degree}</p>
                                            </div>

                                            <div className="ms-auto">
                                                <p>{item?.startYear} to {item?.endYear}</p>
                                            </div>

                                        </div>
                                    </div>)}
                            </fieldset>
                        </div>


                        <div>



                            <fieldset class="address-fieldset mb-4">
                                <legend class="float-none w-auto px-3 field-title">
                                    Work & Experience
                                </legend>

                                {educationWork?.work?.map((item, key) =>
                                    <div className="doctor-hospital-info" key={key}>
                                        <div className="doctor-hospital-pic align-items-start">
                                            <img src="/chevron-two.svg" alt="" />
                                            <div>
                                                <h5>{item?.organization}</h5>
                                                <p>{item?.totalYear} Years {item?.month} months</p>
                                            </div>

                                            {item?.present && <div className="ms-auto">
                                                <p><span style={{ color: "#34A853" }}><FontAwesomeIcon icon={faCheckCircle} /></span> Present</p>
                                            </div>}


                                        </div>
                                    </div>)}
                            </fieldset>
                        </div>

                        <div>


                            <fieldset class="address-fieldset mb-4">
                                <legend class="float-none w-auto px-3 field-title">
                                    Medical License
                                </legend>

                                {medicalLicense?.medicalLicense?.map((item, key) =>
                                    <div className="doctor-hospital-info mb-3" key={key}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="doctor-hospital-pic align-items-start">
                                                <img src="/chevron-three.svg" alt="" />
                                                <h5>{item?.certName}</h5>
                                            </div>


                                        </div>

                                        <div className="doctor-license-upload">
                                            <div className="doctor-license-pic">
                                                <img src={item?.certFile ?
                                                    `${base_url}/${item?.certFile}` : "/doctor-license.png"} alt="" />
                                            </div>
                                        </div>

                                    </div>)}


                            </fieldset>

                        </div>

                    </div>
                </div>
            }

            {/*Payment Status Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#edit-Request" */}
            <div className="modal step-modal fade" id="edit-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-5">
                        <div className="d-flex align-items-center justify-content-between border-bottom p-4">
                            <div>
                                <h6 className="heading-grad mb-0 fz-24"> Edit Request from Admin</h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" id="editClose" aria-label="Close" style={{ color: "#EF0000" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body p-4">
                            <div className="row justify-content-center">
                                <div className="col-lg-12">
                                    <div className="edit-request-bx mb-3">
                                        <div className="float-left">
                                            <img src="/edit-reqest.png" alt="" />
                                            <div className="float-right">
                                                <p>The user has requested to update their profile details.This includes modifying personal information such as name, photo, contact details, and other relevant fields.</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-lg-10">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Note</label>
                                        <textarea name="" value={message} onChange={(e) => setMessage(e.target.value)} id="" className="form-control new-control-frm" placeholder=""></textarea>

                                    </div>

                                    <div>
                                        <button onClick={sendEditRequest} className="nw-thm-btn w-100" >Send Edit Request </button>
                                    </div>

                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="text-end mt-4">
                <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
            </div>



            {/*  Payment Status Popup End */}

        </>
    )
}

export default DoctorProfileEditRequest