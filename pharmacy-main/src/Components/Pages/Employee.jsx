import { TbGridDots } from "react-icons/tb";
import { faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteApiData, getSecureApiData, securePostData } from "../../Services/api";
import { useEffect, useState } from "react";
import base_url from "../../baseUrl";
import { useSelector } from "react-redux";
import Loader from "../Layouts/Loader";


function Employee() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId')
    const { isOwner } = useSelector(state => state.user)
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [name, setName] = useState('')
    const [totalPage, setTotalPage] = useState(1)
    const fetchPharStaff = async () => {
        try {
            const response = await getSecureApiData(`api/staff/list?page=${currentPage}&name=${name}&status=${status}`);

            if (response.success) {
                setEmployees(response.staffData)
                setTotalPage(response.pagination.totalPages)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    }
    useEffect(() => {
        fetchPharStaff()
    }, [userId, currentPage])
    const staffAction = async (e, id, status) => {
        e.preventDefault()
        const data = { empId: id, status }
        try {
            const response = await securePostData(`api/staff/status`, data);
            if (response.success) {
                toast.success('Status updated')
                fetchPharStaff()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    }
    const deleteStaff = async (id) => {
        setLoading(true)
        try {
            const response = await deleteApiData(`pharmacy/staff/${id}`);
            if (response.success) {
                toast.success('Staff deleted')
                fetchPharStaff()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!isOwner) {
            navigate('/')
            toast.error('You do not have permission to see employee ')
            return
        }
    }, [isOwner])
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Employee</h3>
                                <div className="admin-breadcrumb">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb custom-breadcrumb">
                                            <li className="breadcrumb-item">
                                                <NavLink to="/dashboard" className="breadcrumb-link">
                                                    Dashboard
                                                </NavLink>
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page"
                                            >
                                                Employee
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                            <div>
                                <button className="thm-btn rounded-3" onClick={() => navigate("/add-employee")} data-bs-dismiss="modal" aria-label="Close" >Add</button>
                            </div>
                        </div>
                    </div>
                    <div className='new-mega-card'>
                        <div className="row">
                            <div className="d-flex align-items-center justify-content-between mb-3 nw-box gap-2 pharmacy-mb-box">
                                <div className="d-flex align-items-center gap-2 nw-box">
                                    <div className="custom-frm-bx mb-0">
                                        <input
                                            type="text"
                                            className="form-control admin-table-search-frm search-table-frm pe-5"
                                            id="email"
                                            placeholder="Search"
                                            value={name} onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                        <div className="adm-search-bx">
                                            <button className="tp-search-btn text-secondary">
                                                <FontAwesomeIcon icon={faSearch} />
                                            </button>
                                        </div>
                                    </div>
                                    {/* <div className="filters">
                                        <div className="field custom-frm-bx mb-0 custom-select admin-table-search-frm ">
                                            <label className="label">Status :</label>
                                            <select className="" value={status} onChange={(e) => setStatus(e.target.value)}>
                                                <option value=''>All</option>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">In Active</option>
                                                <option value="Onleave">On Leave</option>
                                            </select>
                                        </div>
                                    </div> */}
                                    <div>
                                        <button onClick={() => fetchPharStaff()} className="nw-thm-btn rounded-2">
                                            Filter
                                        </button>
                                    </div>
                                </div>
                                {totalPage > 1 && <div className="page-selector d-flex align-items-center mb-2 mb-md-0 gap-2">
                                    <div>
                                        <select
                                            value={currentPage}
                                            onChange={(e) => setCurrentPage(e.target.value)}
                                            className="form-select custom-page-dropdown nw-custom-page ">
                                            {Array.from({ length: totalPage }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>}
                            </div>
                        </div>
                        <div className="row">
                            {employees?.length > 0 ?
                                employees?.map((item, key) =>
                                    <div className="col-lg-4 col-md-6 col-sm-12 mb-3" key={key}>
                                        <div className="employee-card h-100">
                                            <div className="employee-tp-header d-flex align-items-center justify-content-between">
                                                <div className="admin-table-bx">
                                                    <div className="admin-table-sub-bx">
                                                        <img src={item?.userId?.staffId?.profileImage ? `${base_url}/${item?.userId?.staffId?.profileImage}` : "/view-avatr.png"} alt="" />
                                                        <div className="admin-table-sub-details">
                                                            <h6 className="text-black fz-16 fw-600">{item?.userId?.name?.slice(0, 10)}</h6>
                                                            <p className="text-capitalzie">{item?.role}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center gap-2">
                                                    {
                                                        item?.status === "active" ? (
                                                            <span className="approved rounded-5 py-1">Active</span>
                                                        ) : item?.status === "inactive" ? (
                                                            <span className="approved inactive rounded-5 py-1">Inactive</span>
                                                        ) : (
                                                            <span className="approved leaved rounded-5 py-1">On Leave</span>
                                                        )
                                                    }

                                                    <div className="dropdown">
                                                        <a
                                                            href="#"
                                                            className="text-black"
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
                                                                <NavLink to={`/view-employee/${item?.userId?.name}/${item?.userId?.nh12}`} className="prescription-nav" >
                                                                    View profile
                                                                </NavLink>
                                                            </li>
                                                            <li className="prescription-item">
                                                                <NavLink to={`/employee-data?id=${item?.userId?.nh12}`} className="prescription-nav" href="#" >
                                                                    Edit
                                                                </NavLink>
                                                            </li>

                                                            {/* <li className="prescription-item">
                                                                <button className=" prescription-nav" type="button" onClick={() => deleteStaff(item?._id)}>

                                                                    Delete
                                                                </button>
                                                            </li> */}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="employee-user-details">
                                                <ul className="user-employee-list mb-0">
                                                    <li className="user-employee-item">Role  :  <span className="user-employee-title">{item?.role}</span></li>
                                                    <li className="user-employee-item">Mobile Number  : <span className="user-employee-title">{item?.userId?.contactNumber}</span></li>
                                                    <li className="user-employee-item">Email : <span className="user-employee-title">{item?.userId?.email}</span></li>
                                                    {/* <li className="user-employee-item">Gender : <span className="user-employee-title text-capitalize">{item?.gender}</span></li> */}
                                                    <li className="user-employee-item">Joined : <span className="user-employee-title">{new Date(item?.joinDate)?.toLocaleDateString()}</span></li>
                                                </ul>
                                            </div>

                                        </div>
                                    </div>)
                                : 'No Data'}
                        </div>
                        <div className="text-end mt-4">
                            <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default Employee