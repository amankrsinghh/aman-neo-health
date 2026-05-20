import { TbGridDots } from "react-icons/tb";
import { faCircleXmark, faDownload, faFilter, faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { data, Link, NavLink, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";
import base_url from "../../baseUrl";
import Loader from "../Common/Loader";
import { useSelector } from "react-redux";
import { getSecureApiData } from "../../Service/api";

function TransferHistory() {
    const { id } = useParams()
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const fetchHistory = async () => {
        try {
            setLoading(true)
            const res = await getSecureApiData(`api/bed/department-transfer/${id}?page=${page}`);
            if (res.success) {
                setHistory(res.data)
                setTotalPages(res.totalPages)
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
    }, [page, id]);


    useEffect(() => {
        if (!id) {
            navigate('/bed-allotment-history')
        }
    }, [id])


    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row ">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Department Transfer History</h3>
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
                                                Department Transfer History
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
                                                    <th>From Bed</th>
                                                    <th>To Bed</th>
                                                    <th>From Department</th>
                                                    <th>To Department</th>
                                                    <th>From Doctor</th>
                                                    <th>To Doctor</th>
                                                    <th>Transfer Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
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
                                                            <td>
                                                                {item?.bedFrom?.bedName || '-'}
                                                            </td>

                                                            <td>{item?.bedTo?.bedName || "-"}</td>
                                                            <td>{item?.departmentFrom?.departmentName || "-"}</td>
                                                            <td>{item?.departmentTo?.departmentName || "-"}</td>
                                                            <td>{item?.doctorFrom?.name || "-"}</td>
                                                            <td>{item?.doctorTo?.name || "-"}</td>

                                                            <td>{item?.createdAt ? new Date(item?.createdAt)?.toLocaleString('en-GB') : '-'}
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
                    <div className="text-end mt-3">
                        <Link to={-1} className="nw-thm-btn outline" >
                            Go Back
                        </Link>
                    </div>
                </div>}

        </>
    )
}

export default TransferHistory