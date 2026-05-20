import { TbGridDots } from "react-icons/tb";
import { faDownload, faFilter, faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPlusCircle } from "react-icons/fa";
import { data, Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";
import Loader from "../Common/Loader";
import { deleteApiData, getSecureApiData } from "../../Service/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import base_url from "../../baseUrl";


function StaffManagement() {

    const [staffList, setStaffList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [totalPages, setTotalPages] = useState({});
    const [loading, setLoading] = useState(false)
    const [departments, setDepartments] = useState([])


    const fetchStaff = async (dept = department, empStatus = status) => {
        setLoading(true)
        try {
            const res = await getSecureApiData(`api/staff/list?page=${page}&limit=10&name=${search}&status${empStatus}`)

            if (res.success) {

                setStaffList(res.staffData);
                setTotalPages(res.pagination?.totalPages);
            } else {
                toast.error(res.data.message)
            }
        } catch (err) {
            toast.error("Failed to load staff");
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [page, limit,]);

    const deleteStaff = async (id) => {
        setLoading(true)
        try {
            const response = await deleteApiData(`api/hospital-staff/${id}`);
            if (response.success) {
                toast.success('Staff deleted')
                fetchStaff()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        } finally {
            setLoading(false)
        }
    }
    const fetchDepartments = async () => {
        try {
            const res = await getSecureApiData("api/department/list?limit=100");
            setDepartment(res.data);

        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchDepartments()
    }, [])
    const downloadStaffList = () => {

        if (!staffList || staffList.length === 0) {
            alert("No staff data to download");
            return;
        }

        const data = staffList.map((staff, index) => ({
            "S.No": index + 1,
            "Name": staff?.personalInfo?.name || "-",
            "Department": staff?.employmentInfo?.department?.departmentName || "-",
            "Role": staff?.employmentInfo?.role || "-",
            "Mobile Number": staff?.personalInfo?.mobile || "-",
            "Email": staff?.personalInfo?.email || "-",
            "Gender": staff?.personalInfo?.gender || "-",
            "Join Date": staff?.employmentInfo?.joinDate
                ? new Date(staff.employmentInfo.joinDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                })
                : "-",
            "Status": staff?.status || "Active"
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Staff");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const fileData = new Blob([excelBuffer], {
            type: "application/octet-stream"
        });

        saveAs(fileData, "Staff_List.xlsx");
    };
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row ">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Staff Management</h3>
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
                                                Staff Management
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>

                            <div>
                                <NavLink to="/new-staff" className="nw-thm-btn rounded-3"><FaPlusCircle />Add Staff</NavLink>

                                {/* <button className="nw-thm-btn rounded-3" data-bs-toggle="modal" data-bs-target="#add-Inventory"> <FaPlusCircle />  Add Staff</button> */}
                            </div>
                        </div>
                    </div>

                    <div className='new-panel-card'>
                        <div className="row">
                            <div className="d-flex align-items-center justify-content-between mb-3 gap-2 nw-box ">
                                <div>
                                    <div className="d-flex align-items-center gap-2 nw-box ">
                                        <div className="custom-frm-bx mb-0">
                                            <input
                                                type="text"
                                                className="form-control  search-table-frm pe-5"
                                                placeholder="Search"
                                                value={search}
                                                onChange={(e) => {
                                                    setPage(1);
                                                    setSearch(e.target.value);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key == "Enter") {
                                                        fetchStaff()
                                                    }
                                                }}
                                            />
                                            <div className="adm-search-bx">
                                                <button className="text-secondary" onClick={() => fetchStaff()}>
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            {/* <button className="nw-filtr-btn"><FontAwesomeIcon icon={faFilter}/></button> */}
                                            <div className="dropdown">
                                                <a href="#" className="nw-filtr-btn" id="acticonMenus" data-bs-toggle="dropdown"
                                                    aria-expanded="false">
                                                    <FontAwesomeIcon icon={faFilter} />
                                                </a>

                                                <div className="dropdown-menu dropdown-menu-end user-dropdown tble-action-menu"
                                                    aria-labelledby="acticonMenus">

                                                    <div
                                                        className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-bottom">
                                                        <h6 className="mb-0 fz-18">Filter</h6>
                                                        <a href="#" className="fz-16 clear-btn" onClick={() => {
                                                            setStatus('')
                                                            setDepartment('')
                                                            fetchStaff('', '')
                                                        }}>Reset</a>
                                                    </div>

                                                    <div className="p-3">


                                                        <ul className="filtring-list mb-3">
                                                            <h6>Status</h6>
                                                            <li>
                                                                <div className="form-check new-custom-check">
                                                                    <input className="form-check-input"
                                                                        type="radio"
                                                                        checked={status === "active"}
                                                                        onChange={() => {
                                                                            setPage(1);
                                                                            setStatus(status === "active" ? "" : "active");
                                                                        }} />
                                                                    <label className="form-check-label" for="cardiology">Active</label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="form-check new-custom-check">
                                                                    <input className="form-check-input" type="radio" id="inactive"
                                                                        checked={status === "inactive"}
                                                                        onChange={() => {
                                                                            setPage(1);
                                                                            setStatus(status === "inactive" ? "" : "inactive");
                                                                        }} />
                                                                    <label className="form-check-label" for="inactive">Inactive</label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="form-check new-custom-check">
                                                                    <input className="form-check-input" type="radio" id="leave"
                                                                        checked={status === "leave"}
                                                                        onChange={() => {
                                                                            setPage(1);
                                                                            setStatus(status === "leave" ? "" : "leave");
                                                                        }} />
                                                                    <label className="form-check-label" for="leave">On Leave</label>
                                                                </div>
                                                            </li>

                                                        </ul>
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-top">
                                                        <a href="javascript:void(0)" className="thm-btn thm-outline-btn rounded-4 px-4 py-2 outline"> Cancel</a>
                                                        <a href="javascript:void(0)" onClick={() => fetchStaff()} className="thm-btn rounded-4 px-4 py-2"> Apply</a>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                        <div>
                                            <button className="nw-filtr-btn" onClick={downloadStaffList}><FontAwesomeIcon icon={faDownload} /></button>
                                        </div>

                                    </div>
                                </div>

                                {totalPages > 1 && <div className="page-selector">
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
                        </div>


                        <div className="row">
                            {staffList?.length === 0 && (
                                <p className="text-center">No staff found</p>
                            )}
                            {staffList?.map((item) => (
                                <div className="col-lg-4 col-md-6 col-sm-12 mb-3" key={item._id}>
                                    <div className="employee-card">
                                        <div className="employee-tp-header d-flex align-items-center justify-content-between">
                                            <div className="admin-table-bx">
                                                <div className="admin-table-sub-bx">
                                                    <img src={
                                                        item?.userId?.staffId?.profileImage
                                                            ? `${base_url}/${item?.userId?.staffId?.profileImage}`
                                                            : "/profile.png"
                                                    } alt=""
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/profile.png";
                                                        }}
                                                    />
                                                    <div className="admin-table-sub-details">
                                                        <h6 className="text-black fz-16 fw-600">{item?.userId?.name}</h6>
                                                        {item?.department && <p>{item?.department?.departmentName}</p>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center gap-2">
                                                <span className={`approved rounded-5 py-1 ${item?.status === "leave"
                                                    ? "leaved"
                                                    : item?.status === "inactive"
                                                        ? "inactive"
                                                        : ""
                                                    }`}>{item?.status}</span>
                                                <div className="dropdown">
                                                    <a
                                                        href="javascript:void(0)"
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
                                                            <NavLink to={`/staff-info-view/${item?.userId?.nh12}`} className="prescription-nav"  >
                                                                View profile
                                                            </NavLink>
                                                        </li>
                                                        <li className="prescription-item">
                                                            <NavLink to={`/edit-staff?id=${item?.userId?.nh12}`} className="prescription-nav"  >
                                                                Edit
                                                            </NavLink>
                                                        </li>

                                                        {/* <li className="prescription-item">
                                                            <button className="d-inline-block w-100 text-start prescription-nav" onClick={() => deleteStaff(staff?._id)}>
                                                                Delete
                                                            </button>
                                                        </li> */}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="employee-user-details">
                                            <ul className="user-employee-list">
                                                <li className="user-employee-item">Role  :  <span className="user-employee-title">{item?.role}</span></li>
                                                <li className="user-employee-item">Mobile Number  : <span className="user-employee-title">{item?.userId?.contactNumber}</span></li>
                                                <li className="user-employee-item">Email : <span className="user-employee-title">{item?.userId?.email}</span></li>
                                                <li className="user-employee-item">Gender : <span className="user-employee-title">{item?.userId?.staffId?.gender}</span></li>
                                                <li className="user-employee-item">Joined :
                                                    <span className="user-employee-title">
                                                        {item?.joinDate
                                                            ? new Date(
                                                                item?.joinDate
                                                            ).toDateString()
                                                            : "-"}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>




                    </div>
                    <div className="text-end mt-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="nw-thm-btn outline"
                        >
                            Go Back
                        </button>
                    </div>
                </div>}






        </>
    )
}

export default StaffManagement