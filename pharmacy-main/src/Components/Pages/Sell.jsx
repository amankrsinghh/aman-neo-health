import { TbGridDots } from "react-icons/tb";

import { faCircleXmark, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { deleteApiData, getSecureApiData } from "../../Services/api";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import {
    BrowserMultiFormatReader,
    BarcodeFormat,
    DecodeHintType,
} from "@zxing/library";
import Loader from "../Layouts/Loader";
import PharmacyInvoice from "../Templates/PharmacyInvoice";
import PharmacyReturnPdf from "../Templates/PharmacyReturnPdf";



function Sell() {
    const navigate = useNavigate()
    const userId = localStorage.getItem("userId")
    const [currentPage, setCurrentPage] = useState(1)
    const [schedule, setSchedule] = useState('all')
    const [name, setName] = useState('')
    const [sort, setSort] = useState('newest')
    const [scannerOpen, setScannerOpen] = useState(false)
    const [list, setList] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [totalPage, setTotalPage] = useState(1)
    const [currentReturnPage, setCurrentReturnPage] = useState(1)
    const [totalReturnPage, setTotalReturnPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [tableView, setTableView] = useState("sell")
    const [eodData, setEodData] = useState()
    const [returnList, setReturnList] = useState([])
    const openScanner = () => setScannerOpen(true);
    const closeScanner = () => setScannerOpen(false);
    const [pdfLoading, setPdfLoading] = useState(false)
    const [selectedId, setSelectedId] = useState()
    const [searchParams, setSearchParams] = useSearchParams()
    const [returnLoading, setReturnLoading] = useState()
    const fetchSellData = async () => {
        setLoading(true)
        try {
            const response = await getSecureApiData(`pharmacy/sell/${userId}?page=${currentPage}&search=${name}&schedule=${schedule}&startDate=${startDate}&endDate=${endDate}&sort=${sort}`);
            if (response.success) {
                setList(response.data)
                setTotalPage(response.totalPages)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    const fetchReturnData = async () => {
        // if(tableView!=="return") returnList
        setLoading(true)
        try {
            const response = await getSecureApiData(`pharmacy/customer-return/${userId}?page=${currentReturnPage}&search=${name}&schedule=${schedule}&startDate=${startDate}&endDate=${endDate}&sort=${sort}`);
            if (response.success) {
                setReturnList(response.data)
                setTotalReturnPage(response.totalPages)
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
        fetchReturnData()
    }, [userId, currentReturnPage])
    useEffect(() => {
        fetchSellData()
    }, [userId, currentPage])
    const handleDetected = (code, err) => {
        if (err) {
            alert(err);
            setScannerOpen(false);   // close modal
            return;
        }
        setScannerOpen(false);
    };
    const deleteSellRecord = async (id) => {
        try {
            const response = await deleteApiData(`pharmacy/sell/${id}`);
            if (response.success) {
                toast.success("Sell record deleted successfully")
                fetchSellData()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    }
    const fetchEodData = async (id) => {
        try {
            const response = await getSecureApiData(`pharmacy/eod-sell`);
            if (response.success) {
                setEodData(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    }
    useEffect(() => {
        if (searchParams.get('type') == "return") {
            setTableView("return")
            setSearchParams()
        }
    }, [searchParams])
    return (
        <>
            {loading ? <Loader /> : <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Sell</h3>
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
                                            Sell
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button className="thm-btn rounded-3" onClick={() => setScannerOpen(true)} >Scan</button>
                            <button className="nw-thm-btn rounded-3" onClick={() => navigate("/add-manually")} data-bs-dismiss="modal" aria-label="Close" >Add Manually</button>
                            <button className="nw-danger-thm-btn rounded-3" onClick={fetchEodData} data-bs-toggle="modal" data-bs-target="#EOD-Sale">EOD Sale</button>
                        </div>
                    </div>
                </div>
                <div className='new-mega-card'>
                    <div className="row">
                        <div className="d-flex align-items-center justify-content-between mb-3 nw-pharmacy-details flex-wrap pharmacy-mb-box gap-2">
                            <div className="d-flex align-items-center gap-2 nw-box flex-wrap">
                                <div className="custom-frm-bx mb-0">
                                    <input
                                        type="text"
                                        className="form-control search-table-frm pe-5 admin-table-search-frm"
                                        id="email"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Search"
                                        required
                                    />
                                    <div className="adm-search-bx">
                                        <button className="tp-search-btn text-secondary">
                                            <FontAwesomeIcon icon={faSearch} />
                                        </button>
                                    </div>
                                </div>
                                <div className="filters">
                                    <div className="field custom-frm-bx mb-0 custom-select admin-table-search-frm ">
                                        <label className="label">Sort By :</label>
                                        <select className="" value={sort} onChange={(e) => setSort(e.target.value)}>
                                            <option value="newest" >Newest</option>
                                            <option value="oldest">Oldest</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="filters">
                                    <div className="field custom-frm-bx mb-0 custom-select admin-table-search-frm date-range-wrapper">
                                        <div className="date-range-box">
                                            <label className="label">Date Range:</label>
                                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="date-input" />

                                        </div>

                                        <div className="date-range-box new-date-rage">

                                            <span className="label">To</span>

                                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="date-input" />

                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <button className="nw-thm-btn" onClick={() => fetchSellData()}>Filter</button>
                                </div>
                            </div>
                            <div className="filters">
                                <div className="field custom-frm-bx mb-0 custom-select admin-table-search-frm ">
                                    <label className="label">View  :</label>
                                    <select className="" value={tableView} onChange={(e) => setTableView(e.target.value)}>
                                        <option value="sell" >Sell</option>
                                        <option value="return">Return</option>
                                    </select>
                                </div>
                            </div>

                            <>
                                {tableView == "sell" && totalPage > 1 && <div className="page-selector d-flex align-items-center mb-2 mb-md-0 gap-2">
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
                                {tableView == "return" && totalReturnPage > 1 && <div className="page-selector d-flex align-items-center mb-2 mb-md-0 gap-2">
                                    <div>
                                        <select
                                            value={currentReturnPage}
                                            onChange={(e) => setCurrentReturnPage(e.target.value)}
                                            className="form-select custom-page-dropdown nw-custom-page ">
                                            {Array.from({ length: totalReturnPage }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>


                                </div>}
                            </>                        </div>
                    </div>



                    {tableView == "sell" ? <div className="row">
                        <div className="col-lg-12">
                            <div className="table-section">
                                <div className="table table-responsive mb-0">
                                    <table className="table mb-0">
                                        <thead>
                                            <tr>
                                                <th>S.no.</th>
                                                <th>Date</th>
                                                <th>Patient Name</th>
                                                <th>Prescriber Name</th>
                                                <th>Medicine Name</th>
                                                <th>Prescription</th>
                                                <th>Action</th>

                                            </tr>
                                        </thead>
                                        <tbody>

                                            {list?.length > 0 ?
                                                list?.map((item, key) =>
                                                    <tr key={key}>
                                                        <td>{(currentPage - 1) * 10 + key + 1}</td>
                                                        <td>{new Date(item?.createdAt).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}</td>
                                                        <td>
                                                            <div className="d-flex flex-column gap-2"><span>{item?.patient?.name} </span>
                                                                <span className="">{item?.patient?.nh12} </span>
                                                            </div></td>
                                                        <td>
                                                            <div className="d-flex flex-column gap-2"><span>{item?.doctor?.name} </span>
                                                                <span className="">{item?.doctor?.nh12} </span>
                                                            </div></td>

                                                        <td>
                                                            <ul className="admin-appointment-list">
                                                                {item?.products?.map((product, index) => (
                                                                    <>
                                                                        <li className="admin-appoint-item"><span className="admin-appoint-id">{product?.inventoryDetail?.medicineName}</span></li>
                                                                        <li className="admin-appoint-item">Qty.: <span className="admin-appoint-id">{product?.quantity}</span></li>
                                                                        <li className="admin-appoint-item">Batch Number:  <span className="admin-appoint-id">{product?.inventoryDetail?.batchNumber}</span></li>
                                                                        {/* <li className="admin-appoint-item mb-2">Schedule: <span className="admin-appoint-id">{product?.inventoryDetail?.schedule}</span></li> */}
                                                                    </>))}


                                                            </ul>
                                                        </td>




                                                        <td>
                                                            <div className="d-flex align-items-centet gap-2">
                                                                <div className="dropdown">
                                                                    <Link
                                                                        to={`/scan-prescriptions-detail/${item?._id}`}
                                                                        className="admin-sub-dropdown"
                                                                    >
                                                                        View
                                                                    </Link>
                                                                    <ul
                                                                        className="dropdown-menu dropdown-menu-end  tble-action-menu admin-dropdown-card"
                                                                        aria-labelledby="acticonMenu1"
                                                                    >
                                                                        <li className="prescription-item">
                                                                            <NavLink to={`/scan-prescriptions-detail/${item?._id}`} className="prescription-nav" href="#" >
                                                                                View
                                                                            </NavLink>
                                                                        </li>

                                                                        <li className="prescription-item">
                                                                            <NavLink to={`/prescriptions-detail/${item?._id}`} className="prescription-nav" href="#" >
                                                                                Edit
                                                                            </NavLink>
                                                                        </li>

                                                                        <li className="prescription-item">
                                                                            <button className=" prescription-nav" onClick={() => deleteSellRecord(item?._id)}>

                                                                                Delete
                                                                            </button>
                                                                        </li>
                                                                    </ul>
                                                                </div>

                                                            </div>
                                                        </td>


                                                        <td>
                                                            <div className="d-flex align-items-centet gap-2">
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
                                                                            <NavLink to={`/edit-sell/${item?._id}`} className="prescription-nav" href="#" >
                                                                                View/Edit
                                                                            </NavLink>
                                                                        </li>
                                                                        <li className="prescription-item">
                                                                            <NavLink to={`/customer-return/${item?._id}`} className="prescription-nav" href="#" >
                                                                                Return
                                                                            </NavLink>
                                                                        </li>
                                                                        <li className="prescription-item">
                                                                            <button className="prescription-nav" onClick={() => {
                                                                                setSelectedId(item?._id)
                                                                                setPdfLoading(true)
                                                                            }} >
                                                                                {(pdfLoading && item?._id === selectedId) ? 'Downloading' : 'Download'} Invoice
                                                                            </button>
                                                                        </li>
                                                                        {/* <li className="prescription-item">
                                                                            <a className=" prescription-nav" href="#">

                                                                                Delete
                                                                            </a>
                                                                        </li> */}
                                                                    </ul>
                                                                </div>

                                                            </div>
                                                        </td>
                                                    </tr>) :

                                                <tr>
                                                    <td colSpan="6" className="text-center py-4">
                                                        No sells found
                                                    </td>
                                                </tr>}




                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div> :
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="table-section">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>S.no.</th>
                                                    <th>Date</th>
                                                    <th>Patient Name</th>
                                                    <th>Medicine Name</th>
                                                    <th>Action</th>

                                                </tr>
                                            </thead>
                                            <tbody>

                                                {returnList?.length > 0 ?
                                                    returnList?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{(currentPage - 1) * 10 + key + 1}</td>
                                                            <td>{new Date(item?.updatedAt).toLocaleDateString('en-GB', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}</td>
                                                            <td>
                                                                <div className="d-flex flex-column gap-2"><span>{item?.patientId?.name} </span>
                                                                    <span className="">{item?.patientId?.nh12} </span>
                                                                </div></td>

                                                            <td>
                                                                <ul className="admin-appointment-list">
                                                                    {item?.returnProducts?.map((product, index) => (
                                                                        <>
                                                                            <li className="admin-appoint-item"><span className="admin-appoint-id">{product?.inventoryId?.medicineName}</span></li>
                                                                            <li className="admin-appoint-item">Qty.: <span className="admin-appoint-id">{product?.quantity}</span></li>
                                                                            <li className="admin-appoint-item">Batch Number:  <span className="admin-appoint-id">{product?.inventoryId?.batchNumber}</span></li>
                                                                        </>))}


                                                                </ul>
                                                            </td>


                                                            <td>
                                                                <div className="d-flex align-items-centet gap-2">
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
                                                                                <NavLink to={`/customer-return/${item?._id}`} className="prescription-nav" href="#" >
                                                                                    View/Edit
                                                                                </NavLink>
                                                                            </li>
                                                                            <li className="prescription-item">
                                                                                <button disabled={returnLoading} onClick={() => setReturnLoading(item?._id)} className="prescription-nav" href="#" >
                                                                                    {returnLoading == item?._id ? 'Downloading...' : 'Download'} Return
                                                                                </button>
                                                                            </li>
                                                                            {/* <li className="prescription-item">
                                                                            <NavLink to={`/customer-return/${item?._id}`} className="prescription-nav" href="#" >
                                                                                Return
                                                                            </NavLink>
                                                                        </li> */}
                                                                            {/* <li className="prescription-item">
                                                                            <a className=" prescription-nav" href="#">

                                                                                Delete
                                                                            </a>
                                                                        </li> */}
                                                                        </ul>
                                                                    </div>

                                                                </div>
                                                            </td>
                                                        </tr>) :

                                                    <tr>
                                                        <td colSpan="6" className="text-center py-4">
                                                            No return found
                                                        </td>
                                                    </tr>}




                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                        </div>}



                </div>
                <div className="text-end mt-4">
                    <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                </div>
                <div className="d-none">
                    <PharmacyInvoice sellId={selectedId} pdfLoading={pdfLoading} endLoading={() => setPdfLoading(false)} />
                    <PharmacyReturnPdf sellId={returnLoading} pdfLoading={returnLoading} endLoading={() => setReturnLoading()} />
                </div>




            </div>}


            {/*Payment Status Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#scanner-Request" */}
            {scannerOpen && <div className="modal fade show step-modal"
                id="scanner-Request"
                style={{ display: "block", background: "#00000080" }}
                data-bs-backdrop="static"
                data-bs-keyboard="false">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-5">
                        <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3">
                            <div>
                                <h6 className="lg_title mb-0 fz-20">Scan NeoHealthCard / Prescription </h6>
                            </div>
                            <div>
                                <button type="button" onClick={closeScanner}
                                    className="fz-18" style={{ color: "#00000040" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body px-4">
                            <div className="row ">
                                <div className="col-lg-12">
                                    <Scanner open={scannerOpen} onDetected={handleDetected} />



                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {/*  Payment Status Popup End */}

            {/* data-bs-toggle="modal" data-bs-target="#add-Inventory" */}
            <div className="modal step-modal fade" id="EOD-Sale" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content rounded-5">
                        <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3">
                            <div>
                                <h6 className="lg_title mb-0">End Of Day Sale Data</h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close">
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body px-4">
                            <form>
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Total Sales</label>
                                            <input
                                                type="text"
                                                readOnly
                                                className="form-control nw-frm-select"
                                                name="medicineName"
                                                value={eodData?.totalSales}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Cash Sales</label>
                                            <input
                                                type="text"
                                                readOnly
                                                className="form-control nw-frm-select"
                                                name="medicineName"
                                                value={eodData?.cashSales}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Card Sales</label>
                                            <input
                                                type="text"
                                                readOnly
                                                className="form-control nw-frm-select"
                                                name="medicineName"
                                                value={eodData?.cardSales}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Online Sales</label>
                                            <input
                                                type="text"
                                                readOnly
                                                className="form-control nw-frm-select"
                                                name="medicineName"
                                                value={eodData?.onlineSales}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Pending Amount</label>
                                            <input
                                                type="text"
                                                readOnly
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Batch Number"
                                                value={eodData?.pendingAmount}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="text-center mt-3">
                                            <button className="nw-thm-btn rounded-2 w-75" type="button" data-bs-dismiss="modal"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Add EOD Sale Popup End */}


        </>
    )
}

export default Sell

function Scanner({ onDetected, open }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const readerRef = useRef(null);

    const [result, setResult] = useState("");

    useEffect(() => {
        if (open) {
            startScanner();
        } else {
            stopScanner();
        }

        return () => stopScanner();
    }, [open]);

    const startScanner = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false,
            });

            streamRef.current = stream;
            videoRef.current.srcObject = stream;

            await videoRef.current.play();
            startDecoding();
        } catch (err) {
            stopScanner();

            // Notify parent about error
            onDetected?.(null, "Camera not available or permission denied");
            console.error("Camera Start Error:", err);
        }
    };

    const startDecoding = () => {
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);

        const reader = new BrowserMultiFormatReader(hints);
        readerRef.current = reader;

        reader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
            if (result) {
                const text = result.getText();
                setResult(text);
                onDetected?.(text);

                stopScanner();

                setTimeout(() => {
                    if (text?.length < 24) {
                        window.location.href = `https://neopha.divanex.in/prescriptions-bar/${text}`;
                    } else {
                        window.location.href = `https://neopha.divanex.in/prescriptions-detail/${text}`;

                    }
                }, 300);
            }
        });
    };

    const stopScanner = () => {
        try {
            readerRef.current?.reset();
            streamRef.current?.getTracks().forEach((t) => t.stop());
        } catch (err) { }
    };

    return (
        <>
            {open && (
                <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
                    <div
                        style={{
                            position: "relative",
                            height: 320,
                            overflow: "hidden",
                            borderRadius: 12,
                        }}
                    >
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>

                    {result && <p>Scanned: {result}</p>}
                </div>
            )}
        </>
    );
}

