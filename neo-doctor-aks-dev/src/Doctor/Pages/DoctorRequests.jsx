import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faCheck, faClose, faSearch } from "@fortawesome/free-solid-svg-icons"

import { useEffect, useState } from "react"
import { getSecureApiData, updateApiData } from "../../Services/api"
import Loader from "../../Loader/Loader"
import base_url from "../../baseUrl"
import { formatDateTime } from "../../Services/globalFunction"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"


function DoctorRequests() {
    const userId = localStorage.getItem('userId')
    const [appointmentRequest, setAppintmentRequest] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    async function getDashboardData() {
        setLoading(true)
        try {
            const result = await getSecureApiData(`appointment/doctor/${userId}?status=pending&limit=10`)
            if (result.success) {
                setAppintmentRequest(result.data)
                setTotalPages(result.pagination.totalPages)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userId) {
            getDashboardData()
        }
    }, [userId])

    const appointmentAction = async (id, status) => {
        const data = { doctorId: userId, appointmentId: id, status }
        setLoading(true)
        try {
            const response = await updateApiData(`appointment/doctor-action`, data);
            if (response.success) {
                // setCurrentPage(response.pagination.page)
                // setTotalPage(response.pagination.totalPages)
                getDashboardData()
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
                        <h5 className="heading-grad fz-24 mb-0">Requests</h5>
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
                                        <table className="table mb-0 ">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Appointment  Id</th>
                                                    <th>Patient Details</th>
                                                    <th>Appointment  Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {appointmentRequest?.length > 0 ?
                                                    appointmentRequest?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{(currentPage - 1) * 10 + key + 1}.</td>
                                                            <td> #{item?.customId}</td>
                                                            <td>
                                                                <div className="admin-table-bx">
                                                                    <div className="admin-table-sub-details d-flex align-items-center gap-2">
                                                                        <img src={item?.patientId?.patientId?.profileImage ?
                                                                            `${base_url}/${item?.patientId?.patientId?.profileImage}` : 
                                                                            "/profile.png"} alt="" />
                                                                        <div>
                                                                            <h6 className="">{item?.patientId?.name}</h6>
                                                                            <p>{item?.patientId?.nh12}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td>{formatDateTime(item?.date)}</td>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <button onClick={() => appointmentAction(item?._id, 'approved')} className="accept-title fw-700 fz-14 pe-2" style={{ borderRight: "1px solid #4D667E33" }}> <FontAwesomeIcon icon={faCheck} /> Accept</button>
                                                                    <button onClick={() => appointmentAction(item?._id, 'reject')} className="otp-timing fw-700 fz-14"> <FontAwesomeIcon icon={faClose} /> Reject</button>
                                                                </div>

                                                            </td>
                                                        </tr>) : (
                                                        <tr>
                                                            <td colSpan="5" className="text-center py-4 fw-600">
                                                                No appointment request
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

            <div className="text-end mt-4"> <Link to={-1} className="nw-thm-btn outline">Go Back</Link> </div>

        </>
    )
}

export default DoctorRequests