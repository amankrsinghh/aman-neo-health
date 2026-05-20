// import { faDownload, faPrint } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { BsCapsule } from "react-icons/bs";
import { IoMdQrScanner } from "react-icons/io";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getSecureApiData, securePostData } from "../../Services/api";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import {
    BrowserMultiFormatReader,
    BarcodeFormat,
    DecodeHintType,
} from "@zxing/library";
import base_url from "../../baseUrl";
import Select from "react-select";
function PrescriptionDetails() {
    const params = useParams();
    const prescriptionId = params.id;
    const navigate = useNavigate()
    const userId = localStorage.getItem("userId");
    const [data, setData] = useState()
    const [scannerOpen, setScannerOpen] = useState(false)
    const [presMed, setPresMed] = useState([])
    const [medicineList, setMedicineList] = useState([])
    const closeScanner = () => setScannerOpen(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        patientId: null,
        doctorId: null,
        pharId: userId, deliveryType: 'Counter pickup', paymentMethod: "",
        prescriptionFile: null,
        note: "",
        paymentStatus: "Pending",
        products: [
            // { inventoryId: null,medicineName:"", quantity: 0, rate: 0,value:'' },
        ],
    })
    const [medicineData, setMedicneData] = useState([])
    async function fetchPrescriptionDetails() {
        try {
            const response = await getSecureApiData(`appointment/prescription-data/${prescriptionId}`);
            if (response.success) {
                setData(response.data)
            } else {
                toast.error("Failed to fetch sell details");
            }

        } catch (error) {
            console.error("Error fetching sell details:", error);
        }
    }
    const fetchInventoryList = async () => {
        try {
            setLoading(true)
            const response = await getSecureApiData(`pharmacy/inventory/${userId}?schedule=all&limit=10000&status=Approved&expiry=No`);
            if (response.success) {
                const data = response?.data?.map((item) => ({
                    value: item?._id,
                    label: item?.medicineName, // fixed typo
                    price: item?.salePrice || 0,
                    storageType: item?.storageType || [],
                    storage: item?.storage || [],
                    stocks: item?.quantity
                }));
                setMedicineList(data)
                setLoading(false)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    async function fetchInventory(id) {
        try {
            const response = await getSecureApiData(`pharmacy/inventory-data/${id}?expiry=No`);
            if (response.success) {
                setMedicineList(response.data)
                // setFormData(prev => {
                //     const exists = prev.products.some(
                //         p => p.inventoryId === id
                //     );

                //     if (exists) return prev;

                //     return {
                //         ...prev,
                //         products: [
                //             ...prev.products,
                //             {
                //                 inventoryId: id,
                //                 quantity: 1,
                //                 price: 0,
                //             },
                //         ],
                //     };
                // });
                // setMedicneData(prev => {
                //     const exists = prev.some(item => item.id === response.data.id);
                //     return exists ? prev : [...prev, response.data];
                // });
                toast.success("Medicine added successfully");
                setScannerOpen(false);

            } else {
                toast.error("Failed to fetch sell details");
            }

        } catch (error) {
            console.error("Error fetching sell details:", error);
        }
    }

    const validateProducts = () => {
        if (!formData.products || formData.products.length === 0) {
            toast.error("Please add at least one medicine");
            return false;
        }

        for (let i = 0; i < formData.products.length; i++) {
            const item = formData.products[i];

            if (!item.inventoryId) {
                toast.error(`Medicine ${i + 1}: Invalid product`);
                return false;
            }

            if (!item.quantity || item.quantity <= 0) {
                toast.error(`Medicine ${i + 1}: Quantity must be greater than 0`);
                return false;
            }

            if (!item.rate || item.rate < 0) {
                toast.error(`Medicine ${i + 1}: Invalid rate`);
                return false;
            }

            if (item.discountType === "Percentage" && item.discountValue > 100) {
                toast.error(`Medicine ${i + 1}: Discount % cannot exceed 100`);
                return false;
            }

            if (item.discountValue < 0) {
                toast.error(`Medicine ${i + 1}: Discount cannot be negative`);
                return false;
            }

            // 🔥 optional: value mismatch check
            const baseAmount = item.quantity * item.rate;

            let expected = baseAmount;

            if (item.discountType === "Percentage") {
                expected = baseAmount - (baseAmount * item.discountValue) / 100;
            } else if (item.discountType === "Fixed") {
                expected = baseAmount - item.discountValue;
            }
            console.log(item.totalAmount, expected, item?.discountValue)
            if (item.totalAmount !== Math.max(0, expected)) {
                toast.error(`Medicine ${i + 1}: Value mismatch`);
                return false;
            }
        }

        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateProducts()) return
        const form = new FormData();
        form.append("patientId", data?.patientId?._id)
        form.append("doctorId", data?.doctorId?._id)
        form.append("pharId", userId)
        form.append("note", formData.note)
        form.append("prescriptionId", prescriptionId)
        form.append("paymentStatus", formData.paymentStatus)
        form.append("products", JSON.stringify(formData.products))
        if (formData.paymentMethod) {
            form.append("paymentMethod", formData.paymentMethod)
        }
        if (formData.deliveryType) {
            form.append("deliveryType", formData.deliveryType)
        }
        // console.log(data)
        // return
        try {
            const response = await securePostData(`pharmacy/sell`, form);
            if (response.success) {
                toast.success(response.message)
                navigate("/sell")
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }
    const handleDetected = (id, error) => {
        if (error) {
            toast.error(error);
            return;
        }
        if (!id) return;
        fetchInventory(id);
    };
    useEffect(() => {
        fetchPrescriptionDetails();
    }, [prescriptionId])
    async function fetchPresMedicine() {
        let medicineNames = [];

        data?.medications?.forEach(item => {
            if (item?.name) {
                medicineNames.push(item.name);
            }
        });

        try {
            const res = await securePostData(
                'pharmacy/prescription-medicine',
                { medicineNames } // ✅ object me bhejna better hai
            );
            if (res.success) {
                setPresMed(res.data)
                const products = res.data.map(item => ({
                    inventoryId: item._id,
                    medicineName: item.medicineName,
                    rate: item.salePrice,
                    quantity: 1,
                    storageType: item?.storageType || [],
                    storage: item?.storage || [],
                    totalAmount: item?.salePrice,
                    stocks: item?.quantity,
                    discountType: null,   // 🆕
                    discountValue: 0
                }));
                setFormData({ ...formData, products })
            } else {
                toast.error(res.message)
            }

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }

    useEffect(() => {
        if (data?.medications?.length > 0) {
            fetchPresMedicine();
        }
    }, [data]);
    const handleQuantityChange = (index, value) => {
        const updatedProducts = [...formData.products];

        updatedProducts[index].quantity = Number(value);

        const { rate, discountType, discountValue } = updatedProducts[index];

        let total = updatedProducts[index].quantity * rate;

        if (discountType === "Percentage") {
            total = total - (total * discountValue) / 100;
        } else {
            total = total - discountValue;
        }

        updatedProducts[index].totalAmount = total > 0 ? total : 0;

        setFormData(prev => ({
            ...prev,
            products: updatedProducts
        }));
    };
    const addProduct = () => {
        setFormData(prev => ({
            ...prev,
            products: [
                ...prev.products,
                {
                    inventoryId: null,
                    medicineName: "",
                    quantity: 1,
                    rate: 0,
                    totalAmount: 0
                }
            ]
        }));
    };
    const handleDiscountChange = (index, field, val) => {
        const updated = [...formData.products];

        updated[index][field] = field === "discountValue" ? Number(val) : val;

        const { quantity, rate, discountType, discountValue } = updated[index];

        let total = quantity * rate;

        if (discountType === "Percentage") {
            total = total - (total * discountValue) / 100;
        } else {
            total = total - discountValue;
        }

        updated[index].totalAmount = total > 0 ? total : 0;

        setFormData(prev => ({
            ...prev,
            products: updated
        }));
    };
    const removeProduct = (index) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index)
        }));
    };
    useEffect(() => {
        if (userId) {
            fetchInventoryList()
        }
    }, [userId])
    const handleAddMedicine = () => {
        if (!selectedMedicine) {
            toast.error("Please select medicine");
            return;
        }

        setFormData(prev => {
            // duplicate avoid
            const exists = prev.products.some(
                p => p.inventoryId === selectedMedicine.value
            );

            if (exists) {
                toast.warning("Medicine already added");
                return prev;
            }

            return {
                ...prev,
                products: [
                    ...prev.products,
                    {
                        inventoryId: selectedMedicine.value,
                        medicineName: selectedMedicine.label,
                        quantity: 1,
                        rate: selectedMedicine.price || 0,
                        storageType: selectedMedicine?.storageType || [],
                        storage: selectedMedicine?.storage || [],
                        stocks: selectedMedicine?.stocks,
                        discountType: null,   // 🆕
                        discountValue: 0,
                        totalAmount: selectedMedicine.price || 0
                    }
                ]
            };
        });

        setSelectedMedicine(null);
    };
    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between mega-content-bx">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Pharmacy Details</h3>
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
                                            Pharmacy  Details
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>


                    </div>
                </div>


                <div className='new-mega-card'>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                            <div className="view-report-card">
                                <div className="">
                                    <div className="view-report-header d-flex align-items-center justify-content-between">
                                        <div>
                                            <h5>RX-{data?.customId}</h5>
                                            <h6>Date: {new Date(data?.createdAt)?.toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}</h6>
                                        </div>

                                        <div className="admin-table-bx">
                                            <div className="">
                                                <div className="admin-table-sub-details d-flex align-items-center gap-2">
                                                    <img src={data?.doctorId?.doctorId?.profileImage ?
                                                        `${base_url}/${data?.doctorId?.doctorId?.profileImage}` : "/doctor-avatr.png"} alt="" style={{ border: "5px solid #fff" }} />
                                                    <div className="">
                                                        <h6 className="fw-700 fz-14" style={{ color: "#00B4B5" }}>{data?.doctorId?.name}</h6>
                                                        <p>{data?.doctorId?.nh12}</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>



                                </div>

                                <div className="view-report-content">
                                    <div className="sub-content-title">
                                        <h4>RX.</h4>
                                        <h3><BsCapsule style={{ color: "#00B4B5" }} /> Medications</h3>
                                    </div>

                                    {data?.medications?.map((item, key) =>
                                        <div className="view-medications-bx mb-3" key={key}>
                                            <h5>{key + 1}. {item?.name}</h5>
                                            <ul className="viwe-medication-list">
                                                {/* <li className="viwe-medication-item">Dosage: 10mg </li> */}
                                                <li className="viwe-medication-item">Frequency: {item?.frequency} </li>
                                                <li className="viwe-medication-item">Duration: {item?.duration}</li>
                                                <li className="viwe-medication-item">Instructions: {item?.instructions}</li>

                                            </ul>
                                        </div>)}


                                    <div className="diagnosis-bx mb-3">
                                        <h5>Diagnosis</h5>
                                        <p>{data?.diagnosis}</p>
                                    </div>

                                    <div className="diagnosis-bx mb-3">
                                        <h5>Notes</h5>
                                        <p>{data?.notes}</p>
                                    </div>


                                </div>

                            </div>


                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                            {/* <div className="new-invoice-card">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div>
                                        <h5 className="first_para fw-700 fz-20 mb-0">Details</h5>
                                    </div>
                                    <div className="d-flex align-item-center gap-2">
                                        <button className="print-btn"> <FontAwesomeIcon icon={faDownload} /> Download Bill</button>
                                        <button className="print-btn"> <FontAwesomeIcon icon={faPrint} /> Print</button>
                                    </div>
                                </div>




                                <div className="laboratory-report-bx">
                                    <ul className="laboratory-report-list">
                                        <li className="laboratory-item border-0">Aserpin <span className="laboratory-title">$20</span></li>
                                        <li className="laboratory-item">Ibuprofen <span className="laboratory-title"></span></li>
                                    </ul>

                                    <div className="lab-amount-bx">
                                        <ul className="lab-amount-list">
                                            <li className="lab-amount-item">Total Amount :<span className="price-title">$40</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div> */}

                            <div className="">
                                <div className="generate-bill  mb-3">
                                    <div className="d-flex align-items-center justify-content-between mb-3 ">
                                        <div>
                                            <h5 className="first_para fw-700 fz-20 mb-0">Scan Medications</h5>
                                        </div>
                                        <div className="d-flex align-item-center gap-2">
                                            <button className="thm-btn rounded-2" data-bs-toggle="modal" data-bs-target="#custom-Medicine"  >
                                                <FontAwesomeIcon icon={faPlusCircle} className="fz-18 me-2" /> Add</button>

                                            <button className="thm-btn rounded-2" data-bs-toggle="modal"
                                                onClick={() => setScannerOpen(true)}> <IoMdQrScanner className="fz-18 me-2" /> Scan</button>

                                        </div>
                                    </div>
                                    {formData?.products?.map((item, index) => {
                                        return (
                                            <div className="medicine-card" key={index}>
                                                <div className="left-icon">
                                                    <BsCapsule style={{ color: "#00B4B5" }} />
                                                </div>
                                                <span className="med-name">
                                                    {item?.medicineName || "Unknown Medicine"}
                                                </span>

                                                <label className="check-container">
                                                    {item?.storageType?.map(item => item)} {item?.storage?.length > 0 && `(${item?.storage?.map(item => item).join(', ')})`}
                                                    {"  "}(Stocks {item?.stocks})
                                                    <button
                                                        disabled={formData?.products?.length == 1}
                                                        className="text-danger"
                                                        onClick={() => removeProduct(index)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </label>
                                            </div>
                                        );
                                    })}



                                    {/* <div className="medicine-card">
                                        <div className="left-icon">
                                            <BsCapsule style={{ color: "#00B4B5" }} />
                                        </div>

                                        <span className="med-name">Ibuprofen</span>

                                        <label className="check-container">
                                            <input type="checkbox" />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div> */}


                                </div>



                                <div className="generate-bill">
                                    <h5 className="add-contact-title mb-0 fz-22">Generate Bill </h5>

                                    <div className="text-center">
                                        <img src="/bill.svg" alt="" />

                                        <p className="py-2">Please Generate PrescriptionsBill </p>

                                        <button className="nw-thm-btn outline rounded-5"
                                            disabled={formData?.products?.length == 0}
                                            data-bs-toggle="modal" data-bs-target="#bill-Generate">Generate Bill</button>
                                    </div>
                                </div>


                                <div className="custom-frm-bx mt-3">
                                    <label htmlFor="">Note</label>
                                    <textarea name="" id="" value={formData?.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} className="form-control nw-frm-select"></textarea>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Delivery Type</label>
                                            <div className="select-wrapper">
                                                <select name="" id="" className="form-select custom-select" value={formData?.deliveryType} onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })} >
                                                    <option value="Counter pickup">Counter pickup</option>
                                                    <option value="Hospital delivery">Hospital delivery</option>
                                                    <option value="Home delivery">Home delivery</option>
                                                </select>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Payment Type</label>
                                            <div className="select-wrapper">
                                                <select name="" id="" className="form-select custom-select" value={formData?.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}  >
                                                    <option value="">----Select----</option>
                                                    <option value="CASH">CASH</option>
                                                    <option value="CARD">CARD</option>
                                                    <option value="ONLINE">ONLINE</option>
                                                </select>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="mt-3 text-end border-top pt-3">
                            <div className="permission-check-main-bx">

                                <div className="form-check custom-check d-inline-block">
                                    <input className="form-check-input" type="checkbox" value="" id="chats" />
                                    <label className="form-check-label" for="chats">
                                        Payment Done
                                    </label>
                                </div>

                            </div>

                            <div>
                                <button onClick={handleSubmit} className="nw-thm-btn disabled-thm-btn">Save & Continue</button>
                            </div>
                        </div>





                    </div>

                </div>
            </div>




            {/*Generate Bill Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#bill-Generate" */}
            <div className="modal step-modal" id="bill-Generate" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content rounded-5 ">
                        <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3">
                            <div>
                                <h6 className="lg_title mb-0">Generate Bill </h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body px-4 pb-5">
                            <form >
                                {formData?.products?.length > 0 && formData?.products?.map((item, index) => {

                                    return (
                                        <div className="row" key={index}>
                                            <div className="col-lg-2 col-md-4 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Medicine Name</label>
                                                    <input type="text" className="form-control nw-frm-select " value={item?.medicineName} readOnly placeholder="Enter Medicine Name" />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-4 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Quantity</label>
                                                    <input
                                                        type="number"
                                                        value={item?.quantity || ""}
                                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                        className="form-control nw-frm-select"
                                                        placeholder="Enter Quantity"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-md-4 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Rate(₹)</label>
                                                    <input type="text"
                                                        name="price"
                                                        readOnly
                                                        value={item?.rate}
                                                        className="form-control nw-frm-select " placeholder="Enter Amount" />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-4 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label>Discount Type</label>
                                                    <select
                                                        className="form-control nw-frm-select"
                                                        value={item?.discountType || ""}
                                                        onChange={(e) =>
                                                            handleDiscountChange(index, "discountType", e.target.value)
                                                        }
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="Fixed">Fixed</option>
                                                        <option value="Percentage">Percentage</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-md-4 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label>Discount</label>
                                                    <input
                                                        type="number"
                                                        value={item?.discountValue || 0}
                                                        onChange={(e) =>
                                                            handleDiscountChange(index, "discountValue", e.target.value)
                                                        }
                                                        className="form-control nw-frm-select"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-4 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Total Amount(₹)</label>
                                                    <input
                                                        type="text"
                                                        value={item?.totalAmount || 0}
                                                        className="form-control nw-frm-select"
                                                        placeholder="Enter Amount"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>)
                                }
                                )}

                                <div className="col-lg-12">
                                    <div className="text-center mt-4">
                                        <button type="button" className="nw-thm-btn rounded-2 w-75" data-bs-dismiss="modal">Submit</button>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Add Medicine Popup End */}
            {/* data-bs-toggle="modal" data-bs-target="#bill-Generate" */}
            <div className="modal step-modal" id="custom-Medicine" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content rounded-5 ">
                        <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3">
                            <div>
                                <h6 className="lg_title mb-0">Add Medicine </h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body px-4 pb-5">
                            <form >
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Medicine Name</label>
                                    <div class="select-wrapper">
                                        <Select
                                            options={medicineList}
                                            classNamePrefix="custom-select"
                                            placeholder="Select Product"
                                            value={selectedMedicine}
                                            onChange={(option) => setSelectedMedicine(option)}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="text-center mt-4">
                                        <button type="button" onClick={handleAddMedicine} className="nw-thm-btn rounded-2 w-75" data-bs-dismiss="modal">Submit</button>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Add Medicine Popup End */}
            {scannerOpen && <div className="modal fade show step-modal"
                id="scanner-Request"
                style={{ display: "block", background: "#00000080" }}
                data-bs-backdrop="static"
                data-bs-keyboard="false">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-5">
                        <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3">
                            <div>
                                <h6 className="lg_title mb-0 fz-20">Scan Medications </h6>
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
        </>
    )
}

export default PrescriptionDetails

function Scanner({ onDetected, open }) {
    const scannedRef = useRef(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const readerRef = useRef(null);

    const [result, setResult] = useState("");

    useEffect(() => {
        scannedRef.current = false;

        if (open) startScanner();
        else stopScanner();

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
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
            BarcodeFormat.QR_CODE,
            BarcodeFormat.CODE_128,
        ]);


        const reader = new BrowserMultiFormatReader(hints);
        readerRef.current = reader;

        reader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
            if (result && !scannedRef.current) {
                scannedRef.current = true;

                const text = result.getText();
                setResult(text);

                onDetected?.(text); // 🔥 ID parent ko bhej di

                stopScanner();
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