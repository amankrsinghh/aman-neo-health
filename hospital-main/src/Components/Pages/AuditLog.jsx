import { TbGridDots } from "react-icons/tb";
import { faCircleXmark, faDownload, faFilter, faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { data, Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";
import base_url from "../../baseUrl";
import Loader from "../Common/Loader";
import { useSelector } from "react-redux";
import { getSecureApiData } from "../../Service/api";

function AuditLog() {
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0)
    const [activeHistory, setActiveHistory] = useState()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const fetchHistory = async () => {
        try {
            setLoading(true)
            const res = await getSecureApiData(`api/hospital/audit-log?page=${page}`);
            if (res.success) {
                console.log(res.data)
                setHistory(res.data)
                setTotalPages(res.pagination.totalPages)
            } else {
                toast.error(res.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message);
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        fetchHistory();
    }, [page]);

    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row ">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Audit Log History</h3>
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
                                                Audit Log History
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                            {totalPages > 1 && <div className="row">
                                <div className="d-flex align-items-center justify-content-between mb-3 gap-2 nw-box ">

                                    {<div className="page-selector">
                                        <div className="filters">
                                            <select className="form-select custom-page-dropdown nw-custom-page "
                                                value={page}
                                                onChange={(e) => setPage(e.target.value)}>
                                                {Array.from({ length: totalPages }, (_, i) => (
                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>}
                                </div>
                            </div>}

                        </div>
                    </div>

                    <div className='new-panel-card'>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="table-section">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>User Name</th>
                                                    <th>Type</th>
                                                    <th>Note</th>
                                                    {/* <th>Experience</th> */}
                                                    <th>Date & Time</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>{console.log(history)}
                                                {history?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="8" className="text-center">
                                                            No history found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    history?.map((item, index) => (
                                                        <tr key={item._id}>
                                                            <td>{(page - 1) * limit + index + 1}.</td>
                                                            <td>{item?.actionUser?.name || "Self"}</td>
                                                            <td>{item?.actionUser?.role || "-"}</td>
                                                            {/* <td>{item?.professionalInfo?.experience ? `${item?.professionalInfo?.experience} years` : "-"}</td> */}
                                                            <td>{item?.note}</td>
                                                            <td>{new Date(item?.createdAt)?.toLocaleString('en-GB')}
                                                            </td>
                                                            <td>
                                                                {item?.actionUser ? <Link to={item?.actionUser?.role === "doctor" ?
                                                                    `/doctor-view/${item?.actionUser?._id}` :
                                                                    `/staff-info-view/${item?.actionUser?._id}`} className="nw-thm-btn">View</Link>
                                                                    : <span className="text-muted">N/A</span>}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

        </>
    )
}

export default AuditLog