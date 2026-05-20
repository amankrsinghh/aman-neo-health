import { TbGridDots } from "react-icons/tb";
import { faCircleXmark, faDollar, faDownload, faFilter, faPen, faPlusCircle, faPrint, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Scanner from "./Scanner";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteApiData, getApiData, getSecureApiData, securePostData, updateApiData } from "../../Service/api";
import { toast } from "react-toastify";
import Barcode from "react-barcode"
import Loader from "../Common/Loader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { QRCodeCanvas } from "qrcode.react";
function Inventory() {
    const [loading, setLoading] = useState(false)
    const handleDetected = (code) => {
        alert("Scanned barcode: " + code);
    };
    const qrRefs = useRef({});
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    const navigate = useNavigate()

    const [showBarcode, setShowBarcode] = useState(false);
    const [formData, setFormData] = useState({
        medicineName: "",
        schedule: "",
        batchNumber: "",
        mfgDate: "",
        expDate: "",
        quantity: "",
        purchasePrice: null, storageType: [],
        totalStockPrice: "",
        margin: "", storage: [''],
        salePrice: null
    });

    // input change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const validateFormData = (data) => {
        const errors = {};

        // ✅ Medicine Name
        if (!data.medicineName?.trim()) {
            errors.medicineName = "Medicine name is required";
        }

        // ✅ Schedule
        if (!data.schedule?.trim()) {
            errors.schedule = "Schedule is required";
        }

        // ✅ Batch Number
        if (!data.batchNumber?.trim()) {
            errors.batchNumber = "Batch number is required";
        }

        // ✅ MFG Date
        if (!data.mfgDate) {
            errors.mfgDate = "Manufacture date is required";
        } else if (new Date(data.mfgDate) > new Date()) {
            errors.mfgDate = "Manufacture date cannot be in the future";
        }

        // ✅ EXP Date
        if (!data.expDate) {
            errors.expDate = "Expiry date is required";
        } else if (data.mfgDate && new Date(data.expDate) <= new Date(data.mfgDate)) {
            errors.expDate = "Expiry date must be after manufacture date";
        }

        // ✅ Quantity
        if (!data.quantity || isNaN(data.quantity) || Number(data.quantity) <= 0) {
            errors.quantity = "Quantity must be a number greater than 0";
        }

        // ✅ Purchase Price
        if (data.purchasePrice == null || isNaN(data.purchasePrice) || Number(data.purchasePrice) < 0) {
            errors.purchasePrice = "Purchase price must be a number ≥ 0";
        }

        // ✅ Total Stock Price
        if (!data.totalStockPrice || isNaN(data.totalStockPrice) || Number(data.totalStockPrice) < 0) {
            errors.totalStockPrice = "Total stock price must be a number ≥ 0";
        }


        // ✅ Margin Value
        if (!data.margin || isNaN(data.margin) || Number(data.margin) < 0) {
            errors.margin = "Margin must be a number ≥ 0";
        }

        // ✅ Storage Type
        if (!data.storageType || !Array.isArray(data.storageType) || data.storageType.length === 0) {
            errors.storageType = "At least one storage type must be selected";
        }

        // ✅ Sale Price
        if (data.salePrice == null || isNaN(data.salePrice) || Number(data.salePrice) < 0) {
            errors.salePrice = "Sale price must be a number ≥ 0";
        }

        return errors;
    };

    // submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateFormData(formData);
        if (Object.keys(errors).length > 0) {
            // Show first error or toast all errors
            Object.values(errors).forEach(err => toast.error(err));
            return;
        }
        setLoading(true)
        try {
            if (formData?._id) {
                const data = { inventoryId: formData?._id, ...formData }

                const res = await updateApiData(
                    "api/hospital/inventory",
                    data
                );
                if (res.success) {
                    fetchInventory()
                    toast.success("Inventory Updated Successfully");
                } else {
                    toast.error(res.message);
                }
            } else {
                const data = { pharId: userId, ...formData }

                const res = await securePostData(
                    "api/hospital/inventory",
                    data
                );
                if (res.success) {
                    fetchInventory()
                    toast.success("Inventory Added Successfully");
                } else {
                    toast.error(res.message);
                }
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false)
        }
    };
    const [currentPage, setCurrentPage] = useState(1)
    const [schedule, setSchedule] = useState('all')
    const [name, setName] = useState('')
    const [scheduleList, setScheduleList] = useState([])
    const [list, setList] = useState([])
    const [totalPage, setTotalPage] = useState(1)
    const [status, setStatus] = useState()
    const fetchInventory = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams();

            params.append("page", currentPage);
            params.append("type", "hospital");

            if (status) params.append("status", status);
            if (name) params.append("search", name);
            if (schedule) params.append("schedule", schedule);

            const response = await getSecureApiData(
                `api/hospital/inventory/${userId}?${params.toString()}`
            );

            if (response.success) {
                setList(response.data);
                setTotalPage(response.pagiantion.totalPages);
            } else {
                toast.error(response.message);
            }
        } catch (err) {
            console.error("Error fetching inventory:", err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchInventory()
    }, [userId, currentPage])
    const fetchSchedules = async () => {
        try {
            const response = await getApiData(`admin/schedule-medicines`);
            if (response.success) {
                setScheduleList(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    }
    useEffect(() => {
        fetchSchedules()
    }, [])

    const deleteInventory = async (id) => {
        try {
            const response = await deleteApiData(`api/hospital/inventory/${id}`);
            if (response.success) {
                toast.success('Inventory  deleted')
                fetchInventory()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        }
    }

    useEffect(() => {
        const purchase = parseFloat(formData.purchasePrice);
        const sale = parseFloat(formData.salePrice);

        if (!isNaN(purchase) && !isNaN(sale) && purchase > 0) {
            const margin = (((sale - purchase) / purchase) * 100).toFixed(2);
            setFormData(prev => ({
                ...prev,
                margin
            }));
        }
    }, [formData.purchasePrice, formData.salePrice]);
    const downloadInventory = () => {
        if (!list || list.length === 0) {
            alert("No inventory to download");
            return;
        }

        const data = list.map((item, index) => ({
            "S.No": index + 1,
            "Medicine Name": item?.medicineName || "-",
            "Batch Number": item?.batchNumber || "-",
            "Schedule": item?.schedule || "-",
            "MFG Date": item?.mfgDate
                ? new Date(item?.mfgDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
                : "-",
            "Exp Date": item?.expDate
                ? new Date(item?.expDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
                : "-",
            "Sold Quantity": item?.sellCount || 0,
            "Stock Quantity": item?.quantity || 0,
            "Purchase Price": item?.purchasePrice || 0,
            "Sale Price": item?.salePrice || 0,
            "Storage": item?.storage || 0,
            "Margin (%)": item?.margin || 0,
            "Bar Code": item?.customId || "-"
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const fileData = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });

        saveAs(fileData, "Inventory_List.xlsx");
    };
    const handleStorageChange = (index, value) => {
        const updatedStorage = [...formData.storage];
        updatedStorage[index] = value;

        setFormData({
            ...formData,
            storage: updatedStorage
        });
    };
    const removeStorage = (index) => {
        const updatedStorage = formData.storage.filter((_, i) => i !== index);

        setFormData({
            ...formData,
            storage: updatedStorage
        });
    };
    const handleDownloadQR = (key) => {
        const canvas = qrRefs.current[key];
        if (!canvas) return;

        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = `qr-${key}.png`;
        link.click();
    };
    const handlePrintQR = (key, item) => {
        const canvas = qrRefs.current[key];
        if (!canvas) return;

        const dataUrl = canvas.toDataURL("image/png");

        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";

        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;

        doc.open();
        doc.write(`
<html>
<head>
    <style>
        @page {
            size: 80mm 100mm;
            margin: 5mm;
        }

        body {
            margin: 0;
            font-family: Arial, sans-serif;
        }

        .box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #000;
            border-radius: 6px;
            padding: 10px;
        }

        .text {
            width: 60%;
            font-size: 12px;
        }

        .title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 6px;
        }

        .info {
            margin: 3px 0;
        }

        .qr {
            width: 40%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .qr img {
            width: 100px;
            height: 100px;
        }
    </style>
</head>
<body>
    <div class="box">
        
        <div class="text">
            <div class="title">${item?.medicineName || ""}</div>

            <div class="info">MFG: ${item?.mfgDate ? new Date(item.mfgDate).toLocaleDateString('en-GB') : ""}</div>
            <div class="info">EXP: ${item?.expDate ? new Date(item.expDate).toLocaleDateString('en-GB') : ""}</div>
            <div class="info">Batch: ${item?.batchNumber || ""}</div>
        </div>

        <div class="qr">
            <img src="${dataUrl}" />
        </div>

    </div>
</body>
</html>
`);
        doc.close();

        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            document.body.removeChild(iframe);
        }, 300);
    };
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Inventory</h3>
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
                                                Inventory
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>

                            <div className="d-flex gap-3">
                                <button className="nw-thm-btn rounded-3" data-bs-toggle="modal" data-bs-target="#scanner-Request">Scan</button>
                                <button className="nw-thm-btn rounded-3"
                                    onClick={() => setFormData({
                                        medicineName: "",
                                        schedule: "",
                                        batchNumber: "",
                                        mfgDate: "",
                                        expDate: "",
                                        quantity: "",
                                        purchasePrice: "",
                                        totalStockPrice: "",
                                        salePrice: null,
                                        storage: [''],
                                        margin: "",
                                    })} data-bs-toggle="modal"
                                    data-bs-target="#add-Inventory" aria-label="Close" >Add Manually</button>
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
                                                type="text"
                                                className="form-control  search-table-frm pe-5"
                                                id="email"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Search"
                                                onKeyDown={(e) => {
                                                    if (e.key == "Enter") {
                                                        fetchInventory()
                                                    }
                                                }}
                                                required
                                            />
                                            <div className="adm-search-bx">
                                                <button className="text-secondary" onClick={fetchInventory}>
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
                                                    <button className="fz-16 clear-btn" onClick={() => {
                                                        setSchedule('all')
                                                        setTimeout(() => {

                                                            fetchInventory()
                                                        }, 200)
                                                    }}>Reset</button>
                                                </div>

                                                <div className="p-3">
                                                    <ul className="filtring-list mb-3">
                                                        <h6>Category</h6>

                                                        {scheduleList?.map((item) =>
                                                            <li key={item}>
                                                                <div className="form-check new-custom-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="status"
                                                                        id="Pending"
                                                                        value="Pending"
                                                                        checked={schedule === item?._id}
                                                                        onChange={(e) => setSchedule(item?._id)}
                                                                    />
                                                                    <label className="form-check-label" htmlFor="pending">
                                                                        {item?.name}
                                                                    </label>
                                                                </div>
                                                            </li>)}

                                                    </ul>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-top">
                                                    <a href="javascript:void(0)" className="thm-btn thm-outline-btn rounded-4 px-4 py-2 outline"> Cancel</a>
                                                    <button onClick={fetchInventory} className="thm-btn rounded-4 px-4 py-2"> Apply</button>
                                                </div>

                                            </div>
                                        </div>


                                        <div>
                                            <button className="nw-filtr-btn" onClick={downloadInventory}><FontAwesomeIcon icon={faDownload} /></button>
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
                                                    <th>Storage</th>
                                                    <th>Bar Code </th>
                                                    <th>Action</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {list?.length > 0 ?
                                                    list?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{key + 1}</td>

                                                            <td>
                                                                {item?.medicineName}
                                                            </td>

                                                            <td>
                                                                {item?.batchNumber}
                                                            </td>

                                                            <td> {item?.schedule?.name}</td>
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
                                                                ₹ {item?.purchasePrice}
                                                            </td>
                                                            <td>
                                                                {item?.salePrice}
                                                            </td>
                                                            <td>
                                                                {item?.margin} %
                                                            </td>
                                                            <td> {item?.storageType?.map(item=>item)}<br/> {item?.storage?.map(item=>item)}</td>
                                                            <td>
                                                                {/* <a href="javascript:void(0)" className="thm-btn rounded-3">Generate</a> */}
                                                                {showBarcode == key ?
                                                                    <div className="inventory-barcd">

                                                                        {/* <Barcode value={item?.customId} width={1.3} displayValue={false}
                                                                            height={80} /> */}
                                                                        <QRCodeCanvas color="#000" value={item?.batchNumber} ref={(el) => (qrRefs.current[key] = el)} />
                                                                        {showBarcode == key &&
                                                                            <button className="prescription-nav w-100" onClick={() => handlePrintQR(key, item)}>
                                                                                Print QR
                                                                            </button>
                                                                        }
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
                                                                                <button
                                                                                    className="prescription-nav w-100"
                                                                                    id="acticonMenu1"
                                                                                    onClick={() => {
                                                                                        const mfgDate = new Date(item?.mfgDate).toISOString().split("T")[0]
                                                                                        const expDate = new Date(item?.expDate).toISOString().split("T")[0]
                                                                                        setFormData({
                                                                                            ...item,
                                                                                            mfgDate,
                                                                                            expDate,
                                                                                            schedule: item?.schedule?._id,
                                                                                            storage: Array.isArray(item?.storage)
                                                                                                ? item.storage
                                                                                                : item?.storage
                                                                                                    ? [item.storage]
                                                                                                    : []
                                                                                        });
                                                                                    }

                                                                                    } data-bs-toggle="modal" data-bs-target="#edit-Inventory"
                                                                                >
                                                                                    Edit
                                                                                </button>
                                                                            </li>
                                                                            {showBarcode == key && <>

                                                                                <li className="prescription-item">
                                                                                    <button className="prescription-nav w-100" onClick={() => handleDownloadQR(key)}>
                                                                                        Download QR
                                                                                    </button>
                                                                                </li>
                                                                            </>}

                                                                        </ul>
                                                                    </div>

                                                                </div>

                                                            </td>
                                                        </tr>) :
                                                    <tr>
                                                        <td colSpan="12" className="text-center text-black">
                                                            No inventory found
                                                        </td>
                                                    </tr>}

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
                </div >}

            {/*Add Inventroy Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#add-Inventory" */}
            <div className="modal step-modal" id="add-Inventory" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
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
                                                    {scheduleList?.map(s =>
                                                        <option value={s?._id}>{s?.name}</option>)}
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
                                                min={new Date().toISOString().split("T")[0]}
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
                                                type="number"
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
                                                type="number"
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
                                                type="number"
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
                                                name="margin"
                                                value={formData.margin}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="custom-frm-bx">
                                            <label>Storage Type</label>
                                            <div className="d-flex justify-content-between gap-3">
                                                <div className="form-check custom-check">
                                                    <label className="form-check-label">Rack</label>
                                                    <input type="checkbox" name="storageType" id="Rack"
                                                        checked={formData?.storageType?.includes("Rack")}
                                                        onChange={(e) => {
                                                            const { checked, id } = e.target;

                                                            let updatedTypes = [...formData.storageType || []];

                                                            if (checked) {
                                                                updatedTypes.push(id);
                                                            } else {
                                                                updatedTypes = updatedTypes.filter(type => type !== id);
                                                            }

                                                            setFormData({
                                                                ...formData,
                                                                storageType: updatedTypes
                                                            });
                                                        }} className="form-check-input" />
                                                </div>
                                                <div className="form-check custom-check">
                                                    <label className="form-check-label">Fridge</label>
                                                    <input type="checkbox" name="storageType" className="form-check-input" id="Fridge" checked={formData?.storageType?.includes("Fridge")}
                                                        onChange={(e) => {
                                                            const { checked, id } = e.target;

                                                            let updatedTypes = [...formData.storageType || []];

                                                            if (checked) {
                                                                updatedTypes.push(id);
                                                            } else {
                                                                updatedTypes = updatedTypes.filter(type => type !== id);
                                                            }

                                                            setFormData({
                                                                ...formData,
                                                                storageType: updatedTypes
                                                            });
                                                        }} />
                                                </div>
                                                <div className="form-check custom-check">
                                                    <label className="form-check-label">Controlled Drug Locker</label>
                                                    <input type="checkbox" name="storageType" className="form-check-input" id="ControlledDrugLocker" checked={formData?.storageType?.includes("ControlledDrugLocker")}
                                                        onChange={(e) => {
                                                            const { checked, id } = e.target;

                                                            let updatedTypes = [...formData.storageType || []];

                                                            if (checked) {
                                                                updatedTypes.push(id);
                                                            } else {
                                                                updatedTypes = updatedTypes.filter(type => type !== id);
                                                            }

                                                            setFormData({
                                                                ...formData,
                                                                storageType: updatedTypes
                                                            });
                                                        }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {formData?.storageType?.length > 0 && <div className="row">
                                        {formData?.storage?.map((item, index) => (
                                            <div className="col-lg-6 col-md-6 col-sm-12" key={index}>
                                                <div className="d-flex align-items-center gap-4">

                                                    <div className="custom-frm-bx">
                                                        <label>
                                                            Detail {index + 1}
                                                        </label>

                                                        <input
                                                            type="text"
                                                            className="form-control nw-frm-select pe-5"
                                                            value={item}
                                                            onChange={(e) =>
                                                                handleStorageChange(index, e.target.value)
                                                            }
                                                        />
                                                    </div>

                                                    <button type="button" onClick={() => removeStorage(index)}>
                                                        <FontAwesomeIcon className="text-danger" icon={faTrash} />
                                                    </button>

                                                </div>
                                            </div>
                                        ))}
                                    </div>}

                                    {formData?.storageType?.length > 0 && <button
                                        type="button"
                                        className="text-end"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                storage: [
                                                    ...formData.storage,
                                                    ''
                                                ],
                                            })
                                        }
                                    >
                                        <FontAwesomeIcon className="nw-thm-btn" icon={faPlusCircle} />
                                    </button>}


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
            <div className="modal step-modal" id="edit-Inventory" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
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
                                                    {scheduleList?.map(s =>
                                                        <option value={s?._id}>{s?.name}</option>)}
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
                                                type="number"
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
                                                type="number"
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
                                                type="number"
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
                                                name="margin"
                                                value={formData.margin}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="custom-frm-bx">
                                            <label>Storage Type</label>
                                            <div className="d-flex justify-content-between gap-3">
                                                <div className="form-check custom-check">
                                                    <label className="form-check-label">Rack</label>
                                                    <input type="checkbox" name="storageType" id="Rack" checked={formData?.storageType?.includes("Rack")}
                                                        onChange={(e) => {
                                                            const { checked, id } = e.target;

                                                            let updatedTypes = [...formData.storageType || []];

                                                            if (checked) {
                                                                updatedTypes.push(id);
                                                            } else {
                                                                updatedTypes = updatedTypes.filter(type => type !== id);
                                                            }

                                                            setFormData({
                                                                ...formData,
                                                                storageType: updatedTypes
                                                            });
                                                        }} className="form-check-input" />
                                                </div>
                                                <div className="form-check custom-check">
                                                    <label className="form-check-label">Fridge</label>
                                                    <input type="checkbox" name="storageType" className="form-check-input" id="Fridge" checked={formData?.storageType?.includes("Fridge")}
                                                        onChange={(e) => {
                                                            const { checked, id } = e.target;

                                                            let updatedTypes = [...formData.storageType || []];

                                                            if (checked) {
                                                                updatedTypes.push(id);
                                                            } else {
                                                                updatedTypes = updatedTypes.filter(type => type !== id);
                                                            }

                                                            setFormData({
                                                                ...formData,
                                                                storageType: updatedTypes
                                                            });
                                                        }} />
                                                </div>
                                                <div className="form-check custom-check">
                                                    <label className="form-check-label">Controlled Drug Locker</label>
                                                    <input type="checkbox" name="storageType" className="form-check-input" id="ControlledDrugLocker" checked={formData?.storageType?.includes("ControlledDrugLocker")}
                                                        onChange={(e) => {
                                                            const { checked, id } = e.target;

                                                            let updatedTypes = [...formData.storageType || []];

                                                            if (checked) {
                                                                updatedTypes.push(id);
                                                            } else {
                                                                updatedTypes = updatedTypes.filter(type => type !== id);
                                                            }

                                                            setFormData({
                                                                ...formData,
                                                                storageType: updatedTypes
                                                            });
                                                        }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {formData?.storageType?.length > 0 && <div className="row">
                                        {formData?.storage?.map((item, index) => (
                                            <div className="col-lg-6 col-md-6 col-sm-12" key={index}>
                                                <div className="d-flex align-items-center gap-4">

                                                    <div className="custom-frm-bx">
                                                        <label>
                                                            Detail {index + 1}
                                                        </label>

                                                        <input
                                                            type="text"
                                                            className="form-control nw-frm-select pe-5"
                                                            value={item}
                                                            onChange={(e) =>
                                                                handleStorageChange(index, e.target.value)
                                                            }
                                                        />
                                                    </div>

                                                    <button type="button" onClick={() => removeStorage(index)}>
                                                        <FontAwesomeIcon className="text-danger" icon={faTrash} />
                                                    </button>

                                                </div>
                                            </div>
                                        ))}
                                    </div>}

                                    {formData?.storageType?.length > 0 && <button
                                        type="button"
                                        className="text-end"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                storage: [
                                                    ...formData.storage,
                                                    ''
                                                ],
                                            })
                                        }
                                    >
                                        <FontAwesomeIcon className="nw-thm-btn" icon={faPlusCircle} />
                                    </button>}





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
            <div className="modal step-modal" id="scanner-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-5">
                        <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3 border-bottom">
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
                                    {/* <Scanner onDetected={handleDetected}/> */}
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

export default Inventory