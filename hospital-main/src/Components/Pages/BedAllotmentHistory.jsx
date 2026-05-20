import { TbGridDots } from "react-icons/tb";
import { faCircleXmark, faDownload, faFilter, faSearch, faTrash, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";
import { FaPlusSquare } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getSecureApiData } from "../../Service/api";
import { calculatePaymentDetails } from "../../Service/globalFunction";
import AllotmentPayment from "./AllotmentPayment";
import DischargePatient from "./DischargePatient";
import Loader from "../Common/Loader";
import { useDispatch, useSelector } from "react-redux";
import DailyIPDNotes from "./DailyIPDNotes";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { fetchEmpDetail } from "../../redux/features/userSlice";
import { Hospital } from "lucide-react";
import HospitalTransfer from "./HospitalTransfer";
import BedInvoice from "../../All Template file/Bed invoice";
function BedAllotmentHistory() {
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [allotments, setAllotments] = useState([])
    const [selected, setSelected] = useState()
    const [loading, setLoading] = useState(false)
    const { staffUser } = useSelector(state => state.user)
    const [doctorId, setDoctorId] = useState('')
    const [filters, setFilters] = useState({ bedStatus: '', paymentStatus: '', floor: [], search: '' })
    const [myFloors, setMyFloors] = useState([])
    const [pdfLoading, setPdfLoading] = useState(false)
    async function fetchAllotments(filter = filters) {
        setLoading(true);
        try {
            const { bedStatus, paymentStatus, floor, search } = filter;
            // Build query params dynamically
            let query = `api/bed/allotment/history/${userId}?page=${currentPage}&limit=10`;
            if (doctorId) query += `&doctorId=${doctorId}`;
            if (search) query += `&search=${search}`;
            if (bedStatus) query += `&bedStatus=${bedStatus}`;
            if (paymentStatus) query += `&paymentStatus=${paymentStatus}`;
            if (floor?.length > 0) query += `&floor=${floor.join(",")}`;

            const result = await getSecureApiData(query);

            if (result.success) {
                setAllotments(result.data);
                setCurrentPage(result.pagination.currentPage);
                setTotalPages(result.pagination.totalPages);
            } else {
                toast.error(result.message || "Failed to fetch allotment history");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    const fetchFloor = async () => {
        try {
            const res = await getSecureApiData("api/bed/floor/list");
            if (res.success) {
                setMyFloors(res.data);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load bed management");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAllotments()
    }, [currentPage, doctorId])
    useEffect(() => {
        dispatch(fetchEmpDetail(localStorage.getItem("staffId")))
        fetchFloor()
    }, [])
    useEffect(() => {
        if (staffUser?.role == "doctor" || staffUser?.role == "staff") {
            setDoctorId(staffUser?._id)
        }
    }, [staffUser])
    const downloadAllotments = () => {
        if (!allotments || allotments.length === 0) return;

        // Map data for export
        const data = allotments.map((item, index) => ({
            No: index + 1,
            Patient_Name: item?.patientId?.name || "-",
            Patient_ID: item?.patientId?.nh12 || "-",
            Bed_Number: item?.bedId.bedName || "-",
            Floor: item?.bedId?.floorId?.floorName || "-",
            Bed_Status: item?.status || "-",
            Payment_Status: item?.paymentStatus || "-",
            Doctor: item?.primaryDoctorId?.name || "-"
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Create workbook and append sheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bed_Allotments");

        // Convert to blob and save
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, "Bed_Allotments_List.xlsx");
    };
    const handlePaymentModal = (item) => {
        setSelected(item);

        setTimeout(() => {
            const modal = new window.bootstrap.Modal(
                document.getElementById('add-Payment')
            );
            modal.show();
        }, 0);
    };
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row ">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Bed Allotment History</h3>
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
                                                Bed Allotment History
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='new-panel-card'>
                        <div className="row">
                            <div className="d-flex align-items-center justify-content-between mb-3 gap-2 nw-box ">
                                <div>
                                    <div className="d-flex align-items-center gap-2 ">
                                        <div className="custom-frm-bx mb-0">
                                            <input
                                                type="email"
                                                className="form-control  search-table-frm pe-5"
                                                id="email"
                                                value={filters?.search}
                                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                                placeholder="Enter patient name,email,id"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        fetchAllotments();
                                                    }
                                                }}

                                            />
                                            <div className="adm-search-bx">
                                                <button className="text-secondary" onClick={() => fetchAllotments()}>
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </button>
                                            </div>
                                        </div>
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
                                                    <button type="button" className="fz-16 clear-btn" onClick={(e) => {
                                                        e.preventDefault();
                                                        setFilters({ bedStatus: '', paymentStatus: '', floor: [] });
                                                        fetchAllotments({ bedStatus: '', paymentStatus: '', floor: [] }); // fetch all without filters
                                                    }}>Reset</button>
                                                </div>

                                                <div className="p-3">
                                                    <ul className="filtring-list mb-3" onClick={(e) => e.stopPropagation()}>
                                                        <h6>Status</h6>
                                                        <li>
                                                            <div className="form-check new-custom-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"       // use radio since only one bedStatus can be selected
                                                                    id="booked"
                                                                    name="bedStatus"
                                                                    checked={filters.bedStatus === "Active"}
                                                                    onChange={() => setFilters(prev => ({ ...prev, bedStatus: "Active" }))}
                                                                />
                                                                <label className="form-check-label" htmlFor="booked">Booked</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="form-check new-custom-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    id="discharged"
                                                                    name="bedStatus"
                                                                    checked={filters.bedStatus === "Discharged"}
                                                                    onChange={() => setFilters(prev => ({ ...prev, bedStatus: "Discharged" }))}
                                                                />
                                                                <label className="form-check-label" htmlFor="discharged">Discharged</label>
                                                            </div>
                                                        </li>
                                                    </ul>

                                                    <ul className="filtring-list mb-3">
                                                        <h6>Payment Status</h6>
                                                        <li>
                                                            <div className="form-check new-custom-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    id="pending"
                                                                    name="paymentStatus"
                                                                    checked={filters.paymentStatus === "Pending"}
                                                                    onChange={() => setFilters(prev => ({ ...prev, paymentStatus: "Pending" }))}
                                                                />
                                                                <label className="form-check-label" htmlFor="pending">Pending</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="form-check new-custom-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    id="payment"
                                                                    name="paymentStatus"
                                                                    checked={filters.paymentStatus === "Complete"}
                                                                    onChange={() => setFilters(prev => ({ ...prev, paymentStatus: "Complete" }))}
                                                                />
                                                                <label className="form-check-label" htmlFor="payment">Payment Complete</label>
                                                            </div>
                                                        </li>
                                                    </ul>



                                                    <ul className="filtring-list mb-3">
                                                        <h6>Floor</h6>
                                                        {myFloors?.map((item, key) => (
                                                            <li key={key}>
                                                                <div className="form-check new-custom-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={`f-${key}`}
                                                                        checked={filters.floor.includes(item._id)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setFilters(prev => ({ ...prev, floor: [...prev.floor, item._id] }));
                                                                            } else {
                                                                                setFilters(prev => ({
                                                                                    ...prev,
                                                                                    floor: prev.floor.filter(f => f !== item._id)
                                                                                }));
                                                                            }
                                                                        }}
                                                                    />
                                                                    <label className="form-check-label" htmlFor={`f-${key}`}>{item.floorName}</label>
                                                                </div>
                                                            </li>
                                                        ))}

                                                    </ul>


                                                </div>
                                                <div className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-top">
                                                    <a href="javascript:void(0)" className="thm-btn thm-outline-btn rounded-4 px-4 py-2 outline"> Cancel</a>
                                                    <a href="javascript:void(0)" onClick={(e) => {
                                                        e.preventDefault();
                                                        fetchAllotments(filters);
                                                    }} className="thm-btn rounded-4 px-4 py-2"> Apply</a>
                                                </div>

                                            </div>
                                        </div>


                                        <div>
                                            <button className="nw-filtr-btn" onClick={downloadAllotments}><FontAwesomeIcon icon={faDownload} /></button>
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
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="table-section new-custom-table">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Patient Information</th>
                                                    <th>Doctor</th>
                                                    <th>Bed Information</th>
                                                    <th>Date</th>
                                                    <th>Payment</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allotments?.length > 0 ? allotments?.map((item, key) => {
                                                    const payment = calculatePaymentDetails(item);
                                                    return (<tr key={key}>
                                                        <td>{key + 1}.</td>
                                                        <td>
                                                            <div className="admin-table-bx">
                                                                <div className="admin-table-sub-details doctor-title">
                                                                    <h6>{item?.patientId?.name}</h6>
                                                                    <p>{item?.patientId?.nh12 || item?.patientId?.nh12}</p>
                                                                    <div className="admin-table-bx">
                                                                        <ul className="ad-info-list">
                                                                            <li className="ad-info-item"> {item?.patientId?.email}</li>
                                                                            <li className="ad-info-item"> {item?.patientId?.patientId?.contactNumber}</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="admin-table-bx">
                                                                <div className="admin-table-sub-details doctor-title">
                                                                    <h6>{item?.primaryDoctorId?.name} </h6>
                                                                    <p>{item?.primaryDoctorId?.nh12 || item?.primaryDoctorId?.nh12}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="admin-table-bx">
                                                                <ul className="ad-info-list">
                                                                    <li className="ad-info-item"> Room Number :<span className="add-info-title">{item?.bedId?.roomId?.roomName}</span></li>
                                                                    <li className="ad-info-item"> <b>Floor :</b><span className="add-info-title"> {item?.bedId?.floorId?.floorName}</span></li>
                                                                    <li className="ad-info-item"> <b>Bed :</b><span className="add-info-title"> {item?.bedId?.bedName}</span></li>
                                                                    <li className="ad-info-item"> Daily Rate :<span className="add-info-title"> ₹ {item?.bedId?.pricePerDay}</span></li>
                                                                    <li className="ad-info-item"> Department :<span className="add-info-title"> {item?.departmentId?.departmentName}</span></li>
                                                                    {/* <li className="ad-info-item"> Day:<span className="add-info-title"> 5</span></li> */}

                                                                </ul>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="admin-table-bx">
                                                                <ul className="ad-info-list">
                                                                    <li className="ad-info-item"> <b>Allotment Date :</b><span className="add-info-title"> {new Date(item?.allotmentDate)?.toLocaleDateString('en-GB',
                                                                        { day: "numeric", month: "long", year: "numeric" })}</span></li>
                                                                    <li className="ad-info-item"> <b>Expected Discharge Date :</b><span className="add-info-title"> {item?.expectedDischargeDate ? new Date(item?.expectedDischargeDate)?.toLocaleDateString('en-GB',
                                                                        { day: "numeric", month: "long", year: "numeric" }) : '-'}</span></li>
                                                                    <li className="ad-info-item"> <b>Actual Discharge :</b>
                                                                        <span className="add-info-title not-discharge">
                                                                            {item?.status == 'Active' ? 'Not discharged yet' : new Date(item?.dischargeId?.createdAt)?.toLocaleDateString('en-GB',
                                                                                { day: "numeric", month: "long", year: "numeric" })}</span></li>
                                                                </ul>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {item?.paymentId ? <div className="admin-table-bx">
                                                                <ul className="ad-info-list">
                                                                    <li className="ad-info-item"> Total Payment :
                                                                        <span className="add-info-title"> ₹ {item?.paymentId?.totalAmount}</span></li>
                                                                    <li className="ad-info-item"> pending Payment :<span className="add-info-title">
                                                                        ₹ {item?.paymentId?.finalAmount - item?.paymentId?.payments?.reduce(
                                                                            (sum, p) => sum + (p.amount || 0),
                                                                            0
                                                                        )}</span></li>
                                                                    <li className="ad-info-item"> <b>Payment Status :</b><span className="add-info-title active-status"> {item?.paymentId?.status}</span></li>

                                                                </ul>
                                                            </div> : '-'}
                                                        </td>
                                                        <td >{item?.status == 'Active' ? <span className="approved approved-active">Booked</span> :
                                                            <span className="approved approved-active discharge">Discharged</span>
                                                        }</td>
                                                        <td>
                                                            <div className="dropdown position-static">
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
                                                                        <NavLink to={`/allotment-details/${item?._id}`} className="prescription-nav" >
                                                                            View Details
                                                                        </NavLink>
                                                                    </li>
                                                                    <li className="prescription-item">
                                                                        <NavLink to={`/transfer-history/${item?._id}`} className="prescription-nav" >
                                                                            Transfer History
                                                                        </NavLink>
                                                                    </li>
                                                                    {item?.dischargeId && <li className="prescription-item">
                                                                        <Link to={`/discharge/${item?._id}`} className="prescription-nav" >
                                                                            Discharge History
                                                                        </Link>
                                                                    </li>}
                                                                    {/* <li className="prescription-item">
                                                                        <Link className="prescription-nav" to={`/daily-ipd-history?allotment=${item?._id}&patient=${item?.patientId?._id}`}  >

                                                                            Notes History
                                                                        </Link>
                                                                    </li> */}
                                                                    <li className="prescription-item">
                                                                        <a className="prescription-nav" onClick={() => handlePaymentModal(item)}>
                                                                            Add Payment
                                                                        </a>
                                                                    </li>
                                                                    {item?.status == "Discharged" && !item?.transferId && <li className="prescription-item">
                                                                        <a
                                                                            href="#"
                                                                            className="prescription-nav"
                                                                            data-bs-toggle="modal"
                                                                            onClick={() => setSelected(item)}
                                                                            data-bs-target="#hospital-Transfer"
                                                                        >
                                                                            Hospital Transfer
                                                                        </a>
                                                                    </li>}
                                                                    {item?.transferId &&
                                                                        <li className="prescription-item">
                                                                            <NavLink to={`/patient-transfer/${item?.transferId}`} className="prescription-nav">
                                                                                See Transfer
                                                                            </NavLink>
                                                                        </li>}
                                                                    {item?.status == "Active" && <>
                                                                        <li className="prescription-item">
                                                                            <NavLink to={`/edit-allotment/${item?._id}`} className="prescription-nav">
                                                                                Edit Allotment
                                                                            </NavLink>
                                                                        </li>

                                                                        <li className="prescription-item">
                                                                            <Link className=" prescription-nav" to={`/discharge/${item?._id}`} >

                                                                                Discharge Patient
                                                                            </Link>
                                                                        </li>
                                                                    </>}
                                                                    <li className="prescription-item">
                                                                        <button className=" prescription-nav" disabled={pdfLoading} onClick={() => {
                                                                            setSelected(item)
                                                                            setPdfLoading(true)
                                                                        }}>

                                                                            {pdfLoading ? 'Printing...' : 'Print'} Details
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>

                                                        </td>
                                                    </tr>)
                                                }) : 'No allotments'}

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

            {/* <!-- Payment Add Popup Start --> */}
            {/* <!--  data-bs-toggle="modal" data-bs-target="#add-Payment" --> */}
            <AllotmentPayment allotmentId={selected?._id} getData={fetchAllotments} />
            {/* <!-- Payment Add Popup End --> */}

            <div className="d-none" >
                <BedInvoice allotmentId={selected?._id} pdfLoading={pdfLoading} endLoading={() => setPdfLoading(false)} />
            </div>
            {/* <!-- Discharge Patient Popup Start --> */}
            {/* <!--  data-bs-toggle="modal" data-bs-target="#discharge-Patient" --> */}
            <DischargePatient allotmentId={selected?._id} fetchData={() => fetchAllotments()} />
            {/* <!-- Discharge Patient Popup End --> */}
            <HospitalTransfer data={selected} getData={fetchAllotments} />

        </>
    )
}

export default BedAllotmentHistory