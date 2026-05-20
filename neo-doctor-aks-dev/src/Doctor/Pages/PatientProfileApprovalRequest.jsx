import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faCheck, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons"
import { TbGridDots } from "react-icons/tb";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSecureApiData } from "../../Services/api";
import { formatDateTime } from "../../Services/globalFunction";
import base_url from "../../baseUrl";
import Loader from "../../Loader/Loader";

function PatientProfileApprovalRequest() {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    async function fetchPendingRequest() {
        setLoading(true)
        try {
            const result = await getSecureApiData(`doctor/patient?page=${currentPage}&name=${name}`)
            if (result.success) {
                setUsers(result.data)
                setTotalPage(result.pagination.totalPages)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchPendingRequest()
    }, [currentPage])
    return (
        <>
            {loading ? <Loader />
                :
                <div className="profile-right-card">
                    <div className="profile-tp-header">
                        <h5 className="heading-grad fz-24 mb-0">Patient  Profile Approval request</h5>
                    </div>
                    <div className="all-profile-data-bx">
                        <div className="row">
                            <div className="d-flex align-items-center justify-content-between mb-3 gap-2">
                                <div>
                                    <div className="d-flex align-items-center gap-2 nw-box">
                                        <div className="custom-frm-bx mb-0">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="form-control admin-table-search-frm  pe-5"
                                                id="email"
                                                placeholder="Search"
                                                required
                                            />
                                            <div className="adm-search-bx">
                                                <button onClick={() => fetchPendingRequest()} className="tp-search-btn text-secondary">
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </button>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>

                                {totalPage>1 && <div className="page-selector">
                                    <div className="filters">
                                        <select className="form-select custom-page-dropdown nw-custom-page "
                                            value={currentPage}
                                            onChange={(e) => setCurrentPage(e.target.value)}>
                                            {Array.from({ length: totalPage }, (_, i) => (
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
                                                    <th>Id</th>
                                                    <th>Patient Details</th>
                                                    <th>Create Date</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users?.length > 0 ?
                                                    users?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{(currentPage - 1) * 10 + key + 1}.</td>
                                                            <td> #{item?.userId?.nh12}</td>
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

                                                            <td>{formatDateTime(item?.createdAt)}</td>
                                                            <td>

                                                                {item?.status == "pending" && <span className="pending-data text-capitalize">{item?.status} </span>}
                                                                {item?.status == "approved" && <span className="complete-data text-capitalize">{item?.status} </span>}
                                                                {item?.status == "rejected" && <span className="cancel-data text-capitalize">{item?.status} </span>}
                                                            </td>
                                                            {/* <td>
                                                                        <a href="javascript:void(0)" className="grid-dots-btn"><TbGridDots /></a>
                                                                </td> */}

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
                                                                                <NavLink to={`/profile-approval/${item?.name}/${item?.userId?._id}`} className="prescription-nav" href="#" >
                                                                                    View Details
                                                                                </NavLink>
                                                                            </li>
                                                                            {/* <li className="prescription-item">
                                                                                            <NavLink to="/prescription-bar" className="prescription-nav" href="#" >
                                                                                                Chat Now
                                                                                            </NavLink>
                                                                                        </li>
                                                                                        <li className="prescription-item">
                                                                                            <NavLink to="/prescription-bar" className="prescription-nav" href="#" >
                                                                                                Video Call
                                                                                            </NavLink>
                                                                                        </li>
                                                                                        <li className="prescription-item">
                                                                                            <NavLink to="/prescription-bar" className="prescription-nav " href="#" >
                                                                                                <span className="accept-title "><FontAwesomeIcon icon={faCheck} /> Approve</span>
                                                                                            </NavLink>
                                                                                        </li>

                                                                                        <li className="prescription-item">
                                                                                            <a className=" prescription-nav" href="#">

                                                                                                <span className="danger-title">Reject</span>
                                                                                            </a>
                                                                                        </li> */}
                                                                        </ul>
                                                                    </div>

                                                                </div>
                                                            </td>
                                                        </tr>) : 'No patient found'}
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

export default PatientProfileApprovalRequest