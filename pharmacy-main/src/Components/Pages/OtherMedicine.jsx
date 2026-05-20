import { TbGridDots } from "react-icons/tb";
import { faCircleXmark, faDollar, faPen, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Scanner from "./Scanner";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { deleteApiData, getSecureApiData, securePostData, updateApiData } from "../../Services/api";
import { toast } from "react-toastify";
import Barcode from "react-barcode"

function OtherMedicine() {
    const handleDetected = (code) => {
        alert("Scanned barcode: " + code);
    };
    const userId = localStorage.getItem('userId')

    const [showBarcode, setShowBarcode] = useState(false);
    const [formData, setFormData] = useState({
        medicineName: "",
        schedule: "",
        batchNumber: "",
        mfgDate: "",
        expDate: "",
        quantity: "",
        purchasePrice: "",
        totalStockPrice: "",
        marginType: "",
        avgMargin: "",
        highMargin: "",
        lowMargin: "",
    });

    // input change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData?._id) {
                const data = { inventoryId: formData?._id, ...formData }

                const res = await updateApiData(
                    "pharmacy/inventory",
                    data
                );
                if (res.success) {
                    fetchInventory()
                    toast.success("Inventory Updated Successfully");
                }
            } else {
                const data = { pharId: userId, ...formData }

                const res = await securePostData(
                    "pharmacy/inventory",
                    data
                );
                if (res.success) {
                    fetchInventory()
                    toast.success("Inventory Added Successfully");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };
    const [currentPage, setCurrentPage] = useState(1)
    const [schedule, setSchedule] = useState('all')
    const [name, setName] = useState('')
    const [list, setList] = useState([])
    const [totalPage, setTotalPage] = useState(1)
    const fetchInventory = async () => {
        try {
            const response = await getSecureApiData(`pharmacy/inventory/${userId}?page=${currentPage}&search=${name}&schedule=Other`);
            if (response.success) {
                setList(response.data)
                setTotalPage(response.pagiantion.totalPages)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    }
    useEffect(() => {
        fetchInventory()
    }, [userId, currentPage])

    const deleteInventory = async (id) => {
        try {
            const response = await deleteApiData(`pharmacy/inventory/${id}`);
            if (response.success) {
                toast.success('Inventory  deleted')
                fetchInventory()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    }
    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Schedule Medicine</h3>
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
                                            Other
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>

                        {/* <div className="d-flex gap-2">
                            <button className="thm-btn rounded-3" data-bs-toggle="modal" data-bs-target="#scanner-Request" >Scan</button>
                            <button className="nw-thm-btn rounded-3" data-bs-toggle="modal" data-bs-target="#add-Inventory" aria-label="Close" >Add Manually</button>
                        </div> */}


                    </div>
                </div>

                <div className='new-mega-card'>
                    <div className="row">
                        <div className="d-flex align-items-center justify-content-between mb-3 nw-pharmacy-details pharmacy-mb-box">
                            <div className="d-flex align-items-center gap-2 nw-box">
                                <div className="custom-frm-bx mb-0">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-control admin-table-search-frm search-table-frm pe-5"
                                        id="email"
                                        placeholder="Search"
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
                                            <label className="label">Schedule :</label>
                                            <select className="" value={schedule} onChange={(e) => setSchedule(e.target.value)}>
                                                <option value='all'>All</option>
                                                <option value="H1">H1</option>
                                                <option value="H">H</option>
                                            </select>
                                        </div>
                                    </div> */}
                                <div>
                                    <button onClick={() => fetchInventory()} className="nw-thm-btn rounded-2">
                                        Filter
                                    </button>
                                </div>
                            </div>

                            {totalPage && <div className="page-selector d-flex align-items-center mb-2 mb-md-0 gap-2 pharmacy-page-selector">
                                <select
                                    value={currentPage}
                                    onChange={(e) => setCurrentPage(e.target.value)}
                                    className="form-select custom-page-dropdown nw-custom-page ">
                                    {Array.from({ length: totalPage }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
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
                                                <th>S.no.</th>
                                                <th>Medicine Name</th>
                                                <th>Batch Number</th>
                                                <th>Schedule</th>
                                                <th>MFG Date</th>
                                                <th>Exp Date</th>
                                                <th>Quantity/Stock</th>
                                                <th>Purchase Price</th>
                                                <th>Sale Price</th>
                                                <th>Margin</th>
                                                <th>Bar Code </th>
                                                <th>Action</th>

                                            </tr>
                                        </thead>
                                        <tbody>

                                            {list?.length > 0 ?
                                                list?.map((item, key) =>
                                                    <tr key={key}>
                                                        <td>{(currentPage - 1) * 10 + key + 1}</td>

                                                        <td>
                                                            {item?.medicineName}
                                                        </td>

                                                        <td>
                                                            {item?.batchNumber}
                                                        </td>

                                                        <td> {item?.schedule}</td>
                                                        <td>
                                                            {new Date(item?.mfgDate)?.toLocaleDateString('en-GB', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </td>
                                                        <td>
                                                            {new Date(item?.expDate) > new Date() ?
                                                                new Date(item?.expDate)?.toLocaleDateString('en-GB', {
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })
                                                                : <span className="reject-title">{new Date(item?.expDate)?.toLocaleDateString('en-GB', {
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}</span>
                                                            }
                                                        </td>

                                                        <td>
                                                            {item?.sellCount}/ <span className="stock-title">{item?.quantity}</span>
                                                        </td>
                                                        <td>
                                                            ${item?.purchasePrice}
                                                        </td>
                                                        <td>
                                                            {item?.salePrice}
                                                        </td>
                                                        <td>
                                                            {item?.margin} %
                                                        </td>
                                                        <td>
                                                            {/* <a href="javascript:void(0)" className="thm-btn rounded-3">Generate</a> */}
                                                            {showBarcode == key ?
                                                                <div className="inventory-barcd">

                                                                    <Barcode value={item?.customId} width={1.3} displayValue={false}
                                                                        height={80} />
                                                                </div>
                                                                :
                                                                <button
                                                                    className="thm-btn rounded-3"
                                                                    onClick={() => setShowBarcode(key)}
                                                                >
                                                                    Generate
                                                                </button>
                                                            }
                                                        </td>

                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div className="d-flex align-items-centet gap-2">
                                                                    <div className="dropdown">
                                                                        <a

                                                                            href="javascript:void(0)"
                                                                            className="text-secondary"
                                                                            id="acticonMenu1"
                                                                            onClick={() => {
                                                                                const mfgDate = new Date(item?.mfgDate).toISOString().split("T")[0]
                                                                                const expDate = new Date(item?.expDate).toISOString().split("T")[0]
                                                                                setFormData({ ...item, mfgDate: mfgDate, expDate: expDate })
                                                                            }

                                                                            } data-bs-toggle="modal" data-bs-target="#edit-Inventory"
                                                                        >
                                                                            <FontAwesomeIcon icon={faPen} />
                                                                        </a>
                                                                        
                                                                    </div>
                                                                </div>
                                                                {/* <button className="text-secondary" onClick={() => deleteInventory(item?._id)}><FontAwesomeIcon icon={faTrash} /></button> */}
                                                            </div>
                                                        </td>
                                                    </tr>)
                                                :

                                                <>

                                                    <tr>
                                                        <td colSpan={12}>
                                                            <span className="text-center">No data found</span>

                                                        </td>
                                                    </tr>

                                                </>


                                            }

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

            {/*Add Inventroy Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#add-Inventory" */}
            <div className="modal step-modal fade" id="add-Inventory" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content rounded-5">
                        <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3">
                            <div>
                                <h6 className="lg_title mb-0">Add Inventory</h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close">
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body px-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row">

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Medicine Name</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Medicine Name"
                                                name="medicineName"
                                                value={formData.medicineName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Schedule</label>
                                            <div className="select-wrapper">
                                                <select
                                                    className="form-select custom-select"
                                                    name="schedule"
                                                    value={formData.schedule}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="H1">H1</option>
                                                    <option value="H">H</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Batch Number</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Batch Number"
                                                name="batchNumber"
                                                value={formData.batchNumber}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>MFG Date</label>
                                            <input
                                                type="date"
                                                className="form-control nw-frm-select"

                                                name="mfgDate"
                                                value={formData.mfgDate}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>EXP Date</label>
                                            <input
                                                type="date"
                                                className="form-control nw-frm-select"

                                                name="expDate"
                                                value={formData.expDate}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Quantity</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Quantity"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Total Stock Price</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select pe-5"
                                                placeholder="Enter Total Stock Price"
                                                name="totalStockPrice"
                                                value={formData.totalStockPrice}
                                                onChange={handleChange}
                                            />
                                            <div className="stock-bx"></div>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Purchase Price</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Purchase Price"
                                                name="purchasePrice"
                                                value={formData.purchasePrice}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Margin Type</label>
                                            <div className="select-wrapper">
                                                <select
                                                    className="form-select custom-select"
                                                    name="marginType"
                                                    value={formData.marginType}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Margin Type</option>
                                                    <option value="percentage">Percentage</option>
                                                    <option value="fixed">Fixed</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>High Margin</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter High Margin"
                                                name="highMargin"
                                                value={formData.highMargin}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Low Margin</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Low Margin"
                                                name="lowMargin"
                                                value={formData.lowMargin}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Avg Margin</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Avg Margin"
                                                name="avgMargin"
                                                value={formData.avgMargin}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="text-center mt-3">
                                            <button className="nw-thm-btn rounded-2 w-75" type="submit" data-bs-dismiss="modal"
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
            {/*  Add Inventroy Popup End */}


            {/*Edit Inventroy Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#edit-Inventory" */}
            <div className="modal step-modal fade" id="edit-Inventory" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content rounded-5">
                        <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3">
                            <div>
                                <h6 className="lg_title mb-0">Edit Inventory</h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close">
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body px-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row">

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Medicine Name</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Medicine Name"
                                                name="medicineName"
                                                value={formData.medicineName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Schedule</label>
                                            <div className="select-wrapper">
                                                <select
                                                    className="form-select custom-select"
                                                    name="schedule"
                                                    value={formData.schedule}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="H1">H1</option>
                                                    <option value="H">H</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Batch Number</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Batch Number"
                                                name="batchNumber"
                                                value={formData.batchNumber}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>MFG Date</label>
                                            <input
                                                type="date"
                                                className="form-control nw-frm-select"

                                                name="mfgDate"
                                                value={formData.mfgDate}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>EXP Date</label>
                                            <input
                                                type="date"
                                                className="form-control nw-frm-select"
                                                name="expDate"
                                                value={formData.expDate}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Quantity</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Quantity"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Total Stock Price</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select pe-5"
                                                placeholder="Enter Total Stock Price"
                                                name="totalStockPrice"
                                                value={formData.totalStockPrice}
                                                onChange={handleChange}
                                            />
                                            <div className="stock-bx"></div>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Purchase Price</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Purchase Price"
                                                name="purchasePrice"
                                                value={formData.purchasePrice}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Sale Price</label>
                                            <input
                                                type="number"
                                                required

                                                className="form-control nw-frm-select"
                                                placeholder="Enter Sale Price"
                                                name="salePrice"
                                                value={formData.salePrice}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Margin</label>
                                            <input
                                                type="number"
                                                disabled
                                                className="form-control nw-frm-select"
                                                placeholder="Enter High Margin"
                                                name="margin"
                                                value={formData.margin}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="text-center mt-3">
                                            <button className="nw-thm-btn rounded-2 w-75" type="submit" data-bs-dismiss="modal"
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
            {/*  Edit Inventroy Popup End */}

            {/*Scan Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#scanner-Request" */}
            <div className="modal step-modal fade" id="scanner-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-5">
                        <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3">
                            <div>
                                <h6 className="lg_title mb-0 fz-20">Scan</h6>
                            </div>
                            <div>
                                <button type="button" className="fz-18" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body px-4">
                            <div className="row ">
                                <div className="col-lg-12">
                                    <Scanner onDetected={handleDetected} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Scan Popup End */}





        </>
    )
}

export default OtherMedicine