import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { faArrowLeft, faCalendar, faCircleXmark, faFilePdf, faLocationDot, faMessage, faPhone, } from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"
import { getApiData, getSecureApiData, securePostData } from "../../Services/api"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { formatDateTime } from "../../Services/globalFunction"
import Loader from "../../Loader/Loader"
import base_url from "../../baseUrl"
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { Modal } from "bootstrap";
import { useSelector } from "react-redux"

function LabTestDetailsUpcoming() {
    const navigate = useNavigate()
    const params = useParams()
    const userId = localStorage.getItem('userId')
    const [isFull, setIsFull] = useState(false)
    const [loading, setLoading] = useState(false)
    const [appointmentData, setAppointmentData] = useState()
    const [cancelMessage, setCancelMessage] = useState('')
    const [labAddress, setLabAddress] = useState()
    const [star, setStar] = useState(4)
    const [message, setMessage] = useState('')
    const [myRating, setMyRating] = useState([])
    const [labReports, setLabReports] = useState([])
    const {profiles}=useSelector(state=>state.patient)
    async function fetchAppointmentData() {
        setLoading(true)
        try {
            const result = await getSecureApiData(`api/neo/patient-lab-apt-data/${params.id}`)
            if (result.success) {
                setAppointmentData(result.data)
                setLabAddress(result.labAddress)
                setLabReports(result.labReports)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    async function fetchRatingData() {
        try {
            const result = await getSecureApiData(`patient/my-rating/${userId}?type=lab`)
            if (result.success) {
                setMyRating(result.data)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    async function cancelAppointment() {
        if (cancelMessage?.length < 30) {
            toast.error("Please write a valid reason with 30 length")
            return
        }
        setLoading(true)
        const data = { cancelMessage, patientId: userId, appointmentId: params.id }
        try {
            const result = await securePostData(`appointment/lab-cancel`, data)
            if (result.success) {
                document.getElementById('cancelAp')?.click()
                fetchAppointmentData()
                toast.success("Appointment cancel")

            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    async function rateLab() {
        if (message?.length < 20) {
            toast.error("Please write a message with 20 length")
            return
        }
        setLoading(true)
        const data = { labId: appointmentData?.labId?._id, patientId: userId, star, message }
        try {
            const result = await securePostData(`appointment/rating`, data)
            if (result.success) {
                fetchRatingData()
                toast.success("Rating give successfully")
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointmentData()
    }, [params])
    useEffect(() => {
        if (userId) {
            fetchRatingData()
        }
    }, [userId])
    const startChatWithUser = async (user) => {
        // create or get conversation
        sessionStorage.setItem('chatUser', JSON.stringify(user))
        navigate('/chat')
    };

    return (
        <>
            {loading ? <Loader />
                :
                <div className="profile-right-card">
                    <div className="profile-tp-header">
                        <h5 className="heading-grad fz-24 mb-0"> <Link to={`/my-appointment?activeTab=lab`} className="text-black fz-18"><FontAwesomeIcon icon={faArrowLeft} /></Link> Appointment Details </h5>                                    </div>
                    <div className="all-profile-data-bx">
                        <div className="row">
                            <div className="col-lg-12 mb-3">
                                <div className="my-appointment-info-card ">
                                    <div className="my-appointment-tp-bx">
                                        <div className="appoint-left-title-bx">
                                            <h5 className="fz-16 fw-700 mb-0 text-black"> <span className="cal-icon"><FontAwesomeIcon icon={faCalendar} /></span> {formatDateTime(appointmentData?.date)} </h5>
                                        </div>
                                        {(appointmentData?.status == 'pending' && appointmentData?.status == 'approved' && new Date() < new Date(appointmentData?.date)) &&
                                            <div className="appoint-right-title-bx">
                                                <span className="nw-result-bx">Upcoming</span>
                                            </div>}
                                        {appointmentData?.status == 'cancel' && <div className="appoint-right-title-bx">
                                            <span className="nw-result-bx canceled-title">Canceled</span>
                                        </div>}
                                        {appointmentData?.status == 'pending-report' &&
                                            <div className="appoint-right-title-bx">
                                                <span className="nw-result-bx pending-bx">Pending Report</span>
                                            </div>}
                                        {appointmentData?.status == 'deliver-report' &&
                                            <div className="appoint-right-title-bx">
                                                <span className="nw-result-bx completed-title">Completed</span>
                                            </div>
                                        }
                                        {appointmentData?.status == 'rejected' && <div className="not-accpent-bx">
                                            <h6 className="not-accept-title">Not Accept</h6>
                                        </div>}
                                        {appointmentData?.status == 'approved' && <div className="not-accpent-bx">
                                            <h6 className="not-accept-title accept-title">Accept Request</h6>
                                        </div>}

                                    </div>
                                    <div className="appointment-info-parent-bx">
                                        <div className="appointment-info-sub-bx">
                                            <img src={appointmentData?.labId?.labId?.logo ?
                                                `${base_url}/${appointmentData?.labId?.labId?.logo}` : "/lab-pic.png"} alt="" />
                                            <div className="appointment-info-details">
                                                <h4 className="">{appointmentData?.labId?.name}</h4>
                                                <p className=""><FontAwesomeIcon icon={faLocationDot} /> {labAddress?.fullAddress}</p>
                                                <p>Tests Name: <span className="cbc-report-title">{appointmentData?.tests?.map(t => t.subCat?.map(sub=>sub?.subCatId?.subCategory)).join(", ")}</span></p>

                                            </div>
                                        </div>
                                        <div className="appointment-info-mega-bx">
                                            <div className="not-accpent-bx">

                                            </div>

                                            <div>
                                                <ul className="doctor-social-list">
                                                    <li className="doctor-social-item"><button onClick={() => startChatWithUser(appointmentData?.labId)} className="doctor-social-btn" > <FontAwesomeIcon icon={faMessage} /> </button></li>
                                                    <li className="doctor-social-item"><button onClick={() => startChatWithUser(appointmentData?.labId)} className="doctor-social-btn" > <FontAwesomeIcon icon={faPhone} /> </button></li>

                                                </ul>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12 mb-3">
                                <div className="lab-report-tp-bx">
                                    <div className="booking-details-tp-title">
                                        <h5>Lab Report</h5>
                                    </div>
                                    {appointmentData?.status == 'deliver-report' ?
                                        <div className="row">
                                            {labReports?.length > 0 &&
                                                labReports?.map((item, key) =>
                                                    <div className="col-lg-6 col-md-8 col-sm-12" key={key}>
                                                        <div className="appointment-listing-bx py-3">
                                                            <div className="prescriptin-bx ">
                                                                <div className="prescriptin-content">
                                                                    <div className="prescriptin-picture lab-test-bx">
                                                                        <img src="/lab-tube.svg" alt="" style={{ width: "50px", height: "50px" }} />
                                                                        <div>
                                                                            <h6 className="fz-18 fw-700 mb-0">{item?.subCatId?.subCategory} Report</h6>
                                                                            <p>{new Date(item?.createdAt)?.toLocaleDateString("en-GB", {
                                                                                day: "2-digit",
                                                                                month: "short",
                                                                                year: "numeric",
                                                                            })}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <a href={`${base_url}/${item?.upload?.report}`} target="_blank" className="thm-btn thm-outline-btn rounded-2">
                                                                            <FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} /> Download</a>
                                                                    </div>
                                                                </div>

                                                                <div className="cbc-result-bx mt-2">
                                                                    <p>Result {item?.subCatId?.subCategory} Report</p>
                                                                    <h5>{item?.upload?.comment}</h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>)}
                                        </div> : <div className="appointment-listing-bx py-5 text-center">
                                            <div className="report-content">
                                                <img src="/ad-labs.png" alt="" />
                                                <p className="pt-2">Please Wait for lab report update</p>
                                            </div>
                                        </div>}

                                </div>
                            </div>



                            <div className="col-lg-6 mb-3">
                                <div className="appointment-booking-detail-bx">
                                    <div className="booking-details-tp-title">
                                        <h5>Booking Details</h5>
                                    </div>
                                    <div className="appointment-listing-bx">
                                        <ul className="appoint-booking-list">
                                            <li className="booking-item">Appointment ID<span className="booking-title">#{appointmentData?.customId}</span></li>
                                            <li className="booking-item">Booking Date<span className="booking-title">{formatDateTime(appointmentData?.date)}</span></li>
                                            {appointmentData?.testData?.map(t=><li className="booking-item">{t?.name} Report<span className="booking-title">₹ {t?.fees} </span></li>)}
                                            <li className="booking-item">Total Amount<span className="booking-title">₹ {appointmentData?.fees} </span></li>
                                            <li className="booking-item">Payment<span className="booking-title paid-title text-capitalize">{appointmentData?.paymentStatus}</span></li>
                                        </ul>
                                    </div>

                                </div>
                            </div>

                            <div className="col-lg-6 mb-3">
                                <div className="appointment-booking-detail-bx">
                                    <div className="booking-details-tp-title">
                                        <h5>Patient info</h5>
                                    </div>
                                    <div className="appointment-listing-bx">
                                        <ul className="appoint-booking-list">
                                            <li className="booking-item">Name<span className="booking-title">{profiles?.name}</span></li>
                                            <li className="booking-item">Email<span className="booking-title">{profiles?.email}</span></li>
                                            <li className="booking-item">Mobile Number<span className="booking-title">{profiles?.contactNumber}</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {appointmentData?.status == 'cancel' && <div className="col-lg-12">
                                <div className="lab-report-tp-bx">
                                    <div className="booking-details-tp-title">
                                        <h5 >Reason of cancellation</h5>
                                    </div>
                                    <div className="appointment-listing-bx pb-5">
                                        <h6 className="appoint-cancel fw-700">Cancel Date :{formatDateTime(appointmentData?.updatedAt)}</h6>
                                        <p>{appointmentData?.cancelMessage}</p>
                                    </div>

                                </div>
                            </div>}
                            {appointmentData?.status == 'rejected' && <div className="col-lg-12">
                                <div className="lab-report-tp-bx">
                                    <div className="appointment-listing-bx pb-5">
                                        <h6 className="appoint-cancel fw-700">Reject Date :{formatDateTime(appointmentData?.updatedAt)}</h6>

                                    </div>

                                </div>
                            </div>}

                            {appointmentData?.status == 'pending' && <div className="text-end">
                                <button className="nw-danger-outline-btn me-3" data-bs-toggle="modal" data-bs-target="#prescription-Modal">Cancel</button>
                                <Link onClick={()=>{sessionStorage.setItem('aptData',JSON.stringify(appointmentData))
                                    }}
                                 to={`/test-detail/${appointmentData?.labId?.name}/${appointmentData?.labId?._id}`} className="nw-thm-btn">Reschedule</Link>
                            </div>}
                            {appointmentData?.status == 'deliver-report' &&
                                <div className=" mt-3 text-end d-flex align-items-center justify-content-end gap-2">
                                    {!myRating.find(r => r?.labId == appointmentData?.labId?._id) && <button className="nw-warning-outline-btn" data-bs-toggle="modal" data-bs-target="#rating-Modal">Add Rating</button>}
                                    <Link to={`/lab-detail/${appointmentData?.labId?.name}/${appointmentData?.labId?._id}`} className="nw-thm-btn">Re -Appointment </Link>
                                </div>}

                        </div>
                    </div>

                </div>
            }

              <div className="text-end mt-4">
                 <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
              </div>


            {/*prescription-Modal Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#prescription-Modal" */}
            <div className="modal step-modal fade" id="prescription-Modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-0 ">
                        <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                            <div>
                                <h6 className="heading-grad mb-0 fz-24">Cancel Appointment</h6>
                            </div>
                            <div>
                                <button type="button" className="" id="cancelAp" data-bs-dismiss="modal" aria-label="Close" style={{ color: "rgba(239, 0, 0, 1)" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body pb-5 px-4">
                            <div className="row justify-content-center">
                                <div className="col-lg-10">
                                    <div className="rating-modal-bx">
                                        <div>
                                            <h5>Are you sure you want to cancel this Appointment  </h5>
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Reason of cancellation</label>
                                                <textarea name=""
                                                    value={cancelMessage} onChange={(e) => setCancelMessage(e.target.value)} id="" className="form-control nw-text-filed"></textarea>
                                            </div>
                                            <div>
                                                <button className="nw-thm-btn w-100" onClick={cancelAppointment}>Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal step-modal fade" id="rating-Modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-0 ">
                        <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                            <div>
                                <h6 className="heading-grad mb-0 fz-24">Rating </h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "rgba(239, 0, 0, 1)" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body pb-4 px-4">
                            <div className="row justify-content-center">
                                <div className="col-lg-10">
                                    <div className="rating-modal-bx lab-view-bx">
                                        <img src={appointmentData?.labId?.labId?.logo ?
                                                `${base_url}/${appointmentData?.labId?.labId?.logo}`:"/lab-avtar.png"} alt="" />
                                    </div>

                                    <div className="rating-modal-content text-center">
                                        <h5>How was your experience <br /> with <span className="dcotr-name">{appointmentData?.labId?.labId?.name}</span> </h5>
                                        <ul className="doctr-rating-list my-2">
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <li key={value} className="doctr-rating-item">
                                                    <button
                                                        type="button"
                                                        className="nw-rating-nav"
                                                        onClick={() => setStar(value)}
                                                        style={{ background: "none", border: "none" }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={value <= star ? solidStar : regularStar}
                                                        />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Write your Review</label>
                                            <textarea name="" value={message} onChange={(e) => setMessage(e.target.value)} id="" className="form-control nw-text-filed"></textarea>
                                        </div>
                                    </div>

                                    <div>
                                        <button className="nw-thm-btn w-100" onClick={rateLab} data-bs-dismiss="modal">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  prescription-Modal Popup End */}
        </>
    )
}

export default LabTestDetailsUpcoming