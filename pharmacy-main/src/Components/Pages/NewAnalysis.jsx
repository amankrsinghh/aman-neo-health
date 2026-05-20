import { faCircleXmark, faPen, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { deleteApiData, getSecureApiData, updateApiData } from "../../Services/api"
import { toast } from "react-toastify"
import Loader from "../Layouts/Loader"
import { Link, NavLink } from "react-router-dom"



function NewAnalysis() {
    const userId = localStorage.getItem('userId')
    const [currentPage, setCurrentPage] = useState(1)
    const [schedule, setSchedule] = useState('all')
    const [name, setName] = useState('')
    const [list, setList] = useState([])
    const [totalPage, setTotalPage] = useState(1)
    const [totalStock, setTotalStock] = useState(0)
    const [loading, setLoading] = useState(true)
    const [medicineList, setMedicineList] = useState([])
    const [medicineName, setMedicineName] = useState('')
    const [totalSales, setTotalSales] = useState(0)
    const [inventoryValue, setInventoryValue] = useState(0)
    const [expiryCount, setExpiryCount] = useState(0)
    const fetchInventory = async () => {
        try {
            const response = await getSecureApiData(`pharmacy/inventory/${userId}?schedule=all&limit=10000`);
            if (response.success) {
                setList(response.data)
                setLoading(false)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    }
    const fetchMedicineData = async () => {
        if (!medicineName) return
        setLoading(true)
        try {
            const response = await getSecureApiData(`pharmacy/medicine-data/${medicineName}/${userId}`);
            if (response.success) {
                setInventoryValue(response.inventoryValue)
                setMedicineList(response.data)
                setTotalStock(response.totalStock)
                setTotalSales(response.totalSales)
                setExpiryCount(response.expiringSoonCount)
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
        fetchInventory()
    }, [userId, currentPage])
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
                    fetchMedicineData()
                    toast.success("Inventory Updated Successfully");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };
    const deleteInventory = async (id) => {
        try {
            const response = await deleteApiData(`pharmacy/inventory/${id}`);
            if (response.success) {
                toast.success('Inventory  deleted')
                fetchMedicineData()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    }
    return (
        <>
            {loading ? <Loader /> : <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between ">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Analysis</h3>
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
                                            Analysis
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='new-mega-card'>
                    <form action="">
                        <div className="row">
                            <div className="col-lg-10 col-md-10 col-sm-12">
                                <div class="custom-frm-bx">
                                    <label>Select Medicine </label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select" value={medicineName} onChange={(e) => setMedicineName(e.target.value)}>
                                            <option>Select Medicine </option>
                                            {list?.map((item, key) =>
                                                <option value={item?.medicineName}>{item?.medicineName} Batch- {item?.batchNumber}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-sm-12 mt-auto">
                                <div className="custom-frm-bx">
                                    <button type="button" onClick={() => fetchMedicineData()} className="nw-thm-btn sub-nw-brd-tbn ">Search</button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {medicineList?.length > 0 && <>
                        <div className="row">
                            <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                                <div className="new-mega-card h-100 pharmacy-cards">
                                    <div className="inventory-content">
                                        <div className="inventory-parent-bx">
                                            <div className="inventory-bx">
                                                <img src="/box.svg" alt="" />
                                            </div>
                                            <h4>{inventoryValue}</h4>
                                        </div>
                                        <p className="mt-2">Total Inventory Value</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                                <div className="new-mega-card h-100 pharmacy-cards">
                                    <div className="inventory-content">
                                        <div className="inventory-parent-bx">
                                            <div className="inventory-bx">
                                                <img src="/cash.svg" alt="" />
                                            </div>
                                            <h4>{totalSales}</h4>
                                        </div>
                                        <p className="mt-2">Total Sales</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                                <div className="new-mega-card h-100 pharmacy-cards">
                                    <div className="inventory-content">
                                        <div className="inventory-parent-bx ">
                                            <div className="inventory-bx alert-inventory-bx">
                                                <img src="/alert.svg" alt="" />
                                            </div>
                                            <h4>{expiryCount}</h4>
                                        </div>
                                        <p className="mt-2">Expiring Soon (30 days)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                                <div className="new-mega-card h-100 pharmacy-cards">
                                    <div className="inventory-content">
                                        <div className="inventory-parent-bx">
                                            <div className="inventory-bx">
                                                <img src="/chart.svg" alt="" />
                                            </div>
                                            <h4>{totalStock}</h4>
                                        </div>
                                        <p className="mt-2">Total Stock</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="row">
                            <div className="d-flex align-items-center justify-content-between mb-3 nw-pharmacy-details">
                                <div>
                                    <div className="d-flex align-items-center gap-2 nw-box">
                                        <div className="custom-frm-bx mb-0">
                                            <input
                                                type="email"
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
                                        <div className="filters">
                                            <div className="field custom-frm-bx mb-0 custom-select admin-table-search-frm ">
                                                <label className="label">Medicine :</label>
                                                <select className="">
                                                    <option>All</option>
                                                    <option>Test 1</option>
                                                    <option>Test 2</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <a href="#" className="nw-thm-btn rounded-2">
                                                Filter
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="page-selector d-flex align-items-center mb-2 mb-md-0 gap-2">
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
                                </div>
                            </div>
                        </div> */}
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="table-section">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>S.no.</th>
                                                    <th>Medicine Name</th>
                                                    <th>Schedule</th>
                                                    <th>Batch No</th>
                                                    <th>MFG Date</th>
                                                    <th>Exp Date</th>
                                                    <th>Quantity/Stock</th>
                                                    <th>Purchase Price</th>
                                                    <th>Avg Margin</th>
                                                    <th>Low Margin</th>
                                                    <th>High Margin</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {medicineList?.length > 0 &&
                                                    medicineList?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{(currentPage - 1) * 10 + key + 1}</td>
                                                            <td>
                                                                {item?.medicineName}
                                                            </td>
                                                            <td> {item?.schedule}</td>
                                                            <td>
                                                                {item?.batchNumber}
                                                            </td>
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
                                                                {item?.avgMargin} {item?.marginType == 'Percentage' && '%'}
                                                            </td>
                                                            <td>
                                                                {item?.lowMargin} {item?.marginType == 'Percentage' && '%'}
                                                            </td>
                                                            <td>
                                                                {item?.highMargin} {item?.marginType == 'Percentage' && '%'}
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <a href="javascript:void(0)" className="text-secondary" onClick={() => {
                                                                        const mfgDate = new Date(item?.mfgDate).toISOString().split("T")[0]
                                                                        const expDate = new Date(item?.expDate).toISOString().split("T")[0]
                                                                        setFormData({ ...item, mfgDate: mfgDate, expDate: expDate })
                                                                    }
                                                                    } data-bs-toggle="modal" data-bs-target="#edit-Inventory"><FontAwesomeIcon icon={faPen} /></a>
                                                                    <button onClick={() => deleteInventory(item?._id)} className="text-secondary"><FontAwesomeIcon icon={faTrash} /></button>
                                                                </div>
                                                            </td>
                                                        </tr>)}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>}
                </div>
                <div className="text-end mt-4">
                    <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                </div>
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
                                                        <option value="X">X</option>
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
            </div>}
        </>
    )
}

export default NewAnalysis