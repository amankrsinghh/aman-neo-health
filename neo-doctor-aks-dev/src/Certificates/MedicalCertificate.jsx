import { TbGridDots } from "react-icons/tb";
import { faDownload, faFilter, faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { data, Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


import { useSelector } from "react-redux";

import Loader from "../Loader/Loader";
import { getSecureApiData } from "../Services/api";
function MedicalCertificate() {
    // const { permissions, isOwner } = useSelector(state => state.user)
    const [staffList, setStaffList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [search, setSearch] = useState("");
    const [date, setDate] = useState();
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
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
            const res = await getSecureApiData(`api/certificate/medical?page=${page}&limit=${limit}&search=${search}&date=${date}`);

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
    }, [page, limit]);



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
            Patient: doc?.patientId?.name || "",
            Doctor: doc?.doctorId?.name || "-",
            Diagnosis: doc?.diagnosis || 0,
            Admit: new Date(doc?.admitDate)?.toLocaleDateString('en-GB') || 0,
            Discharge: new Date(doc?.dischargeDate)?.toLocaleDateString('en-GB') || 0,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "MedicalCertificate");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const fileData = new Blob([excelBuffer], {
            type: "application/octet-stream"
        });

        saveAs(fileData, "MedicalCertificate_List.xlsx");
    };
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row ">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Medical Certificates</h3>
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
                                    <NavLink to="/medical-form" className="add-nw-btn nw-thm-btn">
                                        <img src="/plus-icon.png" alt="" /> Generate Certificate
                                    </NavLink>
                                {/* )} */}
                            </div>
                        </div>
                    </div>
                    <div className='new-panel-card'>
                        <div className="row">
                            <div className="d-flex align-items-center justify-content-between mb-3 gap-2 nw-box mobile-hospital-box">
                                <div className="d-flex align-items-center gap-2 ">
                                    <div className="custom-frm-bx mb-0">
                                        <input
                                            type="text"
                                            className="form-control  search-table-frm pe-5"
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

                                    {/* <div>
                                        <button className="nw-filtr-btn"><FontAwesomeIcon icon={faFilter}/></button>
                                    </div> */}
                                    {/* <div>
                                        <button className="nw-filtr-btn" onClick={downloadDoctors}><FontAwesomeIcon icon={faDownload} /></button>
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
                                                    <th>Patient</th>
                                                    {/* <th>Doctor</th> */}
                                                    <th>Admit Date</th>
                                                    <th>Discharge Date</th>
                                                    <th>Diganosis</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {certList?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="8" className="text-center">
                                                            No medical certificate found
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
                                                                            <h6>{doc?.patientId?.name}</h6>
                                                                            <h6>{doc?.patientId?.nh12}</h6>
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
                                                            <td>{doc?.admitDate ? new Date(doc?.admitDate)?.toLocaleDateString('en-GB') : '-'}</td>
                                                            <td>{doc?.dischargeDate ? new Date(doc?.dischargeDate)?.toLocaleDateString('en-GB') : '-'}</td>
                                                            <td>{doc?.diagnosis}</td>
                                                            {/* <td>{doc?.professionalInfo?.experience ? `${doc?.professionalInfo?.experience} years` : "-"}</td> */}



                                                            <td>

                                                                <Link
                                                                    to={`/certificate/medical/${doc._id}`}
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

export default MedicalCertificate