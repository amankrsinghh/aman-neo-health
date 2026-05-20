import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import { getSecureApiData, securePostData } from "../../Services/api"
import base_url from "../../baseUrl"
import { calculateAge } from "../../Services/globalFunction"
import Loader from "../../Loader/Loader"
import { Link, NavLink } from "react-router-dom"
import { TbGridDots } from "react-icons/tb"
import { toast } from "react-toastify"

function PatientHistory() {
    const userId = localStorage.getItem('userId')
    const [appointmentRequest, setAppintmentRequest] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [search, setSearch] = useState('')
    const [patientData, setPatientData] = useState([])
    async function getPatientHistory() {
        setLoading(true)
        try {
            const result = await getSecureApiData(`doctor/patient-history/${userId}?page=${currentPage}&search=${search}`)
            if (result.success) {
                setPatientData(result.data)
                setTotalPages(result.totalPages)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userId) {
            getPatientHistory()
        }
    }, [userId, currentPage])
    async function sendReminder(patientId, appointmentId) {
        const data = { patientId, appointmentId, doctorId: userId }
        try {
            const result = await securePostData('doctor/send-reminder', data)
            if (result.success) {
                toast.success("Reminder send")
            } else {
                toast.info(result.message)
            }
        } catch (error) {

        }
    }
    return (
        <>
            {loading ? <Loader />
                :
                <div className="profile-right-card">
                    <div className="profile-tp-header">
                        <h5 className="heading-grad fz-24 mb-0">Patient history</h5>
                    </div>
                    <div className="all-profile-data-bx">
                        <div className="row">
                            <div className="d-flex align-items-center justify-content-between mb-3 gap-2">
                                <div>
                                    <div className="d-flex align-items-center gap-2 nw-box">
                                        <div className="custom-frm-bx mb-0">
                                            <input
                                                type="email"
                                                className="form-control admin-table-search-frm  pe-5"
                                                id="email"
                                                placeholder="Search"
                                                required
                                            />
                                            <div className="adm-search-bx">
                                                <button className="tp-search-btn text-secondary">
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {totalPages > 1 && <div className="page-selector">
                                    <div className="filters">
                                        <select className="form-select custom-page-dropdown nw-custom-page "
                                            value={currentPage}
                                            onChange={(e) => setCurrentPage(e.target.value)}>
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>}
                            </div>
                        </div>

                        <div className="row ">
                            <div className="col-lg-12">
                                <div className="table-section">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Patient Details</th>
                                                    <th>Gender</th>
                                                    <th>Age</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patientData?.length > 0 ?
                                                    patientData?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{(currentPage - 1) * 10 + key + 1}.</td>
                                                            <td>
                                                                <div className="admin-table-bx">
                                                                    <div className="admin-table-sub-details d-flex align-items-center gap-2">
                                                                        <img src={item?.profileImage ? `${base_url}/${item?.profileImage}`
                                                                            : "/profile.png"} alt="" />
                                                                        <div>
                                                                            <h6 className="">{item?.name}</h6>
                                                                            <p>{item?.userId?.nh12}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="text-capitalize">{item?.gender}</td>
                                                            <td>{calculateAge(item?.patientDemographic?.dob)} Years</td>
                                                            <td>
                                                                <div className="d-flex align-items-centet gap-2">
                                                                    <div className="dropdown">
                                                                        <a
                                                                            href="javascript:void(0)"
                                                                            className="grid-dots-btn"
                                                                            id="acticonMenu1"
                                                                            data-bs-toggle="dropdown"
                                                                            aria-expanded="false"
                                                                        >
                                                                            <TbGridDots />
                                                                        </a>
                                                                        <ul
                                                                            className="dropdown-menu dropdown-menu-end  tble-action-menu admin-dropdown-card"
                                                                            aria-labelledby="acticonMenu1"
                                                                        >
                                                                            
                                                                            <li className="prescription-item">
                                                                                <NavLink to={`/detail-view/${item?.name}/${item?.lastApt?._id}`} className="prescription-nav" href="#" >
                                                                                    View Details
                                                                                </NavLink>
                                                                            </li>
                                                                            <li className="prescription-item">
                                                                                <NavLink className="prescription-nav" onClick={() => sendReminder(item.userId._id, item?.lastApt?._id)} >
                                                                                    Send Reminder
                                                                                </NavLink>
                                                                            </li>

                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                {/* <div>
                                                                                <Link to={`/detail-view/${item?.name}/${item?.lastApt?._id}`} className="nw-thm-btn">View History</Link>
                                                                            </div> */}
                                                            </td>
                                                        </tr>) : (
                                                        <tr>
                                                            <td colSpan="5" className="text-center py-4 fw-600">
                                                                No patient found
                                                            </td>
                                                        </tr>
                                                    )}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <div className="text-end mt-4">
                 <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
            </div>



        </>
    )
}

export default PatientHistory