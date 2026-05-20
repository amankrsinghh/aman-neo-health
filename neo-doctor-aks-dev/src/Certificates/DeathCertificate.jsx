import { TbGridDots } from "react-icons/tb";
import { faCalendar, faDownload, faFilter, faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { data, Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";


import Loader from "../Loader/Loader";
import { useSelector } from "react-redux";
import { getSecureApiData } from "../Services/api";
function DeathCertificate() {
    // const { permissions, isOwner } = useSelector(state => state.user)
    const [staffList, setStaffList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("")
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false)
    const [departments, setDepartments] = useState([])
    const [deptList, setDeptList] = useState([])
    const [doctorStatus, setDoctorStatus] = useState([])
    const [certList, setCertList] = useState([])
    const navigate = useNavigate()

    const fetchStaff = async () => {
        setLoading(true)
        try {
            const res = await getSecureApiData(`api/certificate/death?page=${page}&limit=${limit}&search=${search}&date=${date}`);

            if (res.success) {
                setCertList(res.data);
                setPagination(res.pagination);
            } else {
                toast.error(res.message)
            }
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [page, limit,date]);




    const handleDeleteDoctor = async (doctorId) => {
        if (!window.confirm("Are you sure you want to delete this doctor?")) {
            return;
        }

        try {
            const res = await api.delete(`/hospital-doctor/${doctorId}`);
            if (res.data.success) {

                toast.success("Doctor deleted successfully");
                // list refresh
                fetchStaff();
            } else {
                toast.error(res.data.message)
            }

        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to delete doctor"
            );
        }
    };
    const downloadDoctors = () => {

        const data = certList.map((doc, index) => ({
            No: (page - 1) * limit + index + 1,
            Name: doc?.fullName || "",
            Doctor: doc?.doctorId?.name || "-",
            Date: doc?.dateOfDeath || 0,
            Time: doc?.timeOfDeath || "",
            Cause: doc?.causeOfDeath || "",
            Manner: doc?.mannerOfDeath || "",
        }));
        console.log(data)

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "DeathCert");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const fileData = new Blob([excelBuffer], {
            type: "application/octet-stream"
        });

        saveAs(fileData, "DeathCert_List.xlsx");
    };
    const dateRef=useRef()
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row ">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Death Certificates</h3>
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
                                                Certificates
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                            <div className="add-nw-bx">
                                {/* {(isOwner || permissions?.doctors?.add) && ( */}
                                    <NavLink to="/death-form" className="add-nw-btn nw-thm-btn">
                                        <img src="/plus-icon.png" alt="" /> Generate Certificate
                                    </NavLink>
                                {/* )} */}
                            </div>
                        </div>
                    </div>
                    <div className='new-panel-card'>
                        <div className="row">
                            <div className="d-flex align-items-center justify-content-between mb-3 gap-2 nw-box mobile-hospital-box">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="custom-frm-bx mb-0">
                                        <input
                                            type="text"
                                            className="form-control search-table-frm pe-5"
                                            placeholder="Enter certificate id"
                                            value={search}
                                            onChange={(e) => {
                                                setPage(1);
                                                setSearch(e.target.value);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    fetchStaff();
                                                }
                                            }}
                                        />
                                        <div className="adm-search-bx">
                                            <button className="text-secondary" onClick={fetchStaff}>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* 📅 Date Picker */}
                                    <div>
                                        <input
                                            type="date"
                                            value={date}
                                            ref={dateRef}
                                            max={new Date().toISOString().split("T")[0]}
                                            style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
                                            onChange={(e) => {
                                                setDate(e.target.value)
                                            }}
                                        />

                                        <button
                                            className="nw-filtr-btn"
                                            onClick={() => dateRef.current.showPicker()}
                                        >
                                            <FontAwesomeIcon icon={faCalendar} />
                                        </button>
                                    </div>

                                    {/* ⬇ Download */}
                                    {/* <div>
                                        <button className="nw-filtr-btn" onClick={downloadDoctors}>
                                            <FontAwesomeIcon icon={faDownload} />
                                        </button>
                                    </div> */}
                                </div>
                                {pagination?.totalPages > 1 && <div className="page-selector">
                                    <div className="filters p-0">
                                        <select className="form-select custom-page-dropdown nw-custom-page "
                                            value={page}
                                            onChange={(e) => setPage(e.target.value)}>
                                            {Array.from({ length: pagination?.totalPages }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="table-section">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Name</th>
                                                    {/* <th>Doctor</th> */}
                                                    <th>Date of Death</th>
                                                    <th>Cause of Death</th>
                                                    <th>Gender</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {certList?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="8" className="text-center">
                                                            No death certificate found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    certList?.map((doc, index) => (
                                                        <tr key={doc._id}>
                                                            <td>{(page - 1) * limit + index + 1}.</td>

                                                            <td>
                                                                <div className="admin-table-bx">
                                                                    <div className="admin-table-sub-bx">

                                                                        <div className="admin-table-sub-details">
                                                                            <h6>{doc?.fullName}</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* <td>
                                                                <div className="admin-table-bx">
                                                                    <div className="admin-table-sub-bx">

                                                                        <div className="admin-table-sub-details">
                                                                            <h6>{doc?.doctorId?.name}</h6>
                                                                            <h6>{doc?.doctorId?.nh12}</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td> */}
                                                            <td>{new Date(doc?.dateOfDeath)?.toLocaleDateString('en-GB')}</td>
                                                            <td>{doc?.causeOfDeath}</td>
                                                            <td>{doc?.gender}</td>
                                                            {/* <td>{doc?.professionalInfo?.experience ? `${doc?.professionalInfo?.experience} years` : "-"}</td> */}



                                                            <td>

                                                                <Link
                                                                    to={`/certificate/death/${doc._id}`}
                                                                    className=" nw-thm-btn"
                                                                >
                                                                    View
                                                                </Link>


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

export default DeathCertificate