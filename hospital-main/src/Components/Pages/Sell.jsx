import { TbGridDots } from "react-icons/tb";
import { faCircleXmark, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteApiData, getSecureApiData } from "../../Service/api";
import { useEffect, useState } from "react";
// import Scanner from "./Scanner";

function Sell() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    const [currentPage, setCurrentPage] = useState(1)
    const [schedule, setSchedule] = useState('all')
    const [name, setName] = useState('')
    const [sort, setSort] = useState('newest')
    const [scannerOpen, setScannerOpen] = useState(false)
    const [list, setList] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [totalPage, setTotalPage] = useState(1)
     const [eodData,setEodData]=useState()
    const openScanner = () => setScannerOpen(true);
    const closeScanner = () => setScannerOpen(false);
    const fetchSellData = async () => {
        try {
            const response = await getSecureApiData(`pharmacy/sell/${userId}?page=${currentPage}&search=${name}&schedule=${schedule}&startDate=${startDate}&endDate=${endDate}&sort=${sort}`);
            if (response.success) {
                setList(response.data)
                setTotalPage(response.totalPages)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        }
    }
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
            toast.error(err?.response?.data?.message || "Something went wrong");;
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
            console.error("Error creating lab:", err);
        }
    }
    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Sell</h3>
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
                                            Sell
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button className="thm-btn rounded-3" data-bs-toggle="modal" data-bs-target="#scanner-Request" >Scan</button>
                            <button className="nw-thm-btn rounded-3" onClick={() => navigate("/add-manually")} data-bs-dismiss="modal" aria-label="Close" >Add Manually</button>
                            <button className="nw-danger-thm-btn rounded-3" onClick={fetchEodData} data-bs-toggle="modal" data-bs-target="#EOD-Sale">EOD Sale</button>
                        </div>

                    </div>
                </div>

                <div className='new-panel-card'>
                    <div className="row">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="custom-frm-bx mb-0">
                                        <input
                                            type="text"
                                            className="form-control  pe-5"
                                            id="email"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Search"
                                            required
                                        />
                                        <div className="adm-search-bx">
                                            <button className="text-secondary" onClick={() => fetchSellData()}>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </button>
                                        </div>
                                    </div>

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
                        <div className="col-lg-12">
                            <div className="table-section">
                                <div className="table table-responsive mb-0">
                                    <table className="table mb-0">
                                        <thead>
                                            <tr>
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
                                                        <td>{new Date(item?.createdAt).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}</td>
                                                        <td>{item?.patient?.name}</td>
                                                        <td>{item?.doctor?.name}</td>

                                                        <td>
                                                            <ul className="admin-appointment-list">
                                                                {item?.products?.map((product, index) => (
                                                                    <>
                                                                        <li className="admin-appoint-item"><span className="admin-appoint-id">{product?.inventoryDetail?.medicineName}</span></li>
                                                                        <li className="admin-appoint-item">Qty.: <span className="admin-appoint-id">{product?.quantity}</span></li>
                                                                        <li className="admin-appoint-item">Batch Number:  <span className="admin-appoint-id">{product?.inventoryDetail?.batchNumber}</span></li>
                                                                        <li className="admin-appoint-item mb-2">Schedule: <span className="admin-appoint-id">{product?.inventoryDetail?.schedule}</span></li>
                                                                    </>))}


                                                            </ul>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-centet gap-2">
                                                                <div className="dropdown">
                                                                    <Link
                                                                        to={`/scan-prescription-detail/${item?._id}`}
                                                                        className="admin-sub-dropdown"
                                                                    >
                                                                        View
                                                                    </Link>
                                                                    <ul
                                                                        className="dropdown-menu dropdown-menu-end  tble-action-menu admin-dropdown-card"
                                                                        aria-labelledby="acticonMenu1"
                                                                    >
                                                                        <li className="prescription-item">
                                                                            <NavLink to={`/scan-prescription-detail/${item?._id}`} className="prescription-nav" href="#" >
                                                                                View
                                                                            </NavLink>
                                                                        </li>
                                                                        <li className="prescription-item">
                                                                            <NavLink to={`/prescriptions-detail/${item?._id}`} className="prescription-nav" href="#" >
                                                                                Edit
                                                                            </NavLink>
                                                                        </li>

                                                                        {/* <li className="prescription-item">
                                                                            <button className=" prescription-nav" onClick={() => deleteSellRecord(item?._id)}>

                                                                                Delete
                                                                            </button>
                                                                        </li> */}
                                                                    </ul>
                                                                </div>

                                                            </div>
                                                        </td>


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
                                                                            <NavLink to={`/edit-sell/${item?._id}`} className="prescription-nav" href="#" >
                                                                                View/Edit
                                                                            </NavLink>
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
                                                <span className="text-black">No sales found</span>}

                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-end mt-4">
                    <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                </div>
            </div>


            {/*Payment Status Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#scanner-Request" */}
            <div className="modal step-modal" id="scanner-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-5">
                        <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3">
                            <div>
                                <h6 className="lg_title mb-0 fz-20">Scan NeoHealthCard / Prescription </h6>
                            </div>
                            <div>
                                <button type="button" className="fz-18" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body px-4">
                            <div className="row">
                                <div className="col-lg-12">
                                    {/* <Scanner onDetected={handleDetected}/> */}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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