import { faEye, faMessage, faPhone } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { getSecureApiData } from "../../Service/api"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import base_url from "../../baseUrl"

function PatientDetails() {
    const navigate = useNavigate()
    const { id } = useParams()
    const user=JSON.parse(localStorage.getItem('user'))
    const userId = user._id
    const [appointments, setAppointments] = useState([])
    const [patientData, setPatientData] = useState({});
    const [demoData, setDemoData] = useState({});
    const [isLoading, setIsLoading] = useState(true)
    const [customId, setCustomId] = useState('')
    
   
    const fetchPtDemoData = async () => {
        if (!id) {
            return
        }
        try {
            const response = await getSecureApiData(`patient/demographic/${id}`)
            if (response.success) {
                setDemoData(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (error) {

        }
    }
    const fetchPtData = async () => {
        if (!id) {
            return
        }
        try {
            const response = await getSecureApiData(`patient/${id}`)
            if (response.success) {
                setCustomId(response.customId)
                setPatientData(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchPtDemoData()
        fetchPtData()
    }, [id])
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
    const startChatWithUser = async (user) => {
        // create or get conversation
        sessionStorage.setItem('chatUser', JSON.stringify(user))
        navigate('/chat')
    };
    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Patient Details</h3>
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
                                                Test  Request
                                            </a>
                                        </li>

                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Patient Details
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="new-panel-card mb-3">
                            <h5>Patient Information</h5>
                            <div className="d-flex align-items-center justify-content-between my-3">
                                <div className="admin-table-bx">
                                    <div className="admin-table-sub-bx">
                                        <img src={patientData?.profileImage?
                                        `${base_url}/${patientData?.profileImage}`:"/admin-tb-logo.png"} alt="" />
                                        <div className="admin-table-sub-details doctor-title">
                                            <h6>{patientData?.name}</h6>
                                            <p>{customId}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="neo-health-contact-bx">
                                    <button className="neo-health-contact-btn" onClick={()=>startChatWithUser(patientData)}><FontAwesomeIcon icon={faMessage} /></button>
                                    <button className="neo-health-contact-btn"><FontAwesomeIcon icon={faPhone} /></button>
                                </div>
                            </div>

                            <div className="neo-health-user-information my-3">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div>
                                        <h6>Age</h6>
                                        <p>{calculateAge(demoData?.dob)} Years</p>
                                    </div>
                                    <div>
                                        <h6>Gender</h6>
                                        <p>{patientData?.gender}</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <h6>Address</h6>
                                        <p>{demoData?.address}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Link to={`/patient-view/${id}`} className="view-patient-btn text-center" ><FontAwesomeIcon icon={faEye} /> View Patient Record</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default PatientDetails