import { faCircleXmark, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaPlusCircle, FaPlusSquare } from "react-icons/fa";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getSecureApiData, securePostData, updateApiData } from "../../Services/api";
import { use, useEffect, useState } from "react";
import Select from "react-select";
import Loader from "../Layouts/Loader";
import base_url from "../../baseUrl";

function CustomerReturn() {
    const { id } = useParams()
    const navigate = useNavigate()
    const userId = localStorage.getItem("userId")
    const [patientId, setPatientId] = useState("")
    const [doctorId, setDoctorId] = useState("")
    const [dtData, setDtData] = useState({})
    const [ptData, setPtData] = useState({})
    const [medicineList, setMedicineList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [haveReturns, setHaveReturns] = useState(false)
    const [formData, setFormData] = useState({
        patientId: null,
        doctorId: null,
        pharId: userId,
        ptMob: null,
        ptName: '',
        dtMob: null,
        dtName: '',
        prescriptionFile: null, deliveryType: 'Counter pickup', paymentMethod: "",
        paymentStatus: "Pending",
        products: [
            { inventoryId: null, quantity: 1, medicineName: '', amount: 0, discountType: null, discountValue: 0, totalAmount: 0, rate: 0 },
        ],
        returnProducts: [],
        refundMode: '',
        refundStatus: '',
        returnDate: null,
    })
    const fetchPatient = async () => {
        setIsLoading(true)
        try {
            const response = await getSecureApiData(`patient/${patientId}`);
            if (response.success) {
                setFormData({
                    ...formData, patientId: response.data._id, ptMob: response.data.contactNumber,
                    ptName: response.data.name
                })
                setPtData(response.data)
                setIsLoading(false)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }
    const fetchInventory = async () => {
        try {
            const response = await getSecureApiData(`pharmacy/inventory/${userId}?schedule=all&limit=10000&status=Approved&expiry=No`);
            if (response.success) {
                const data = response?.data?.map((item) => ({
                    value: item?._id,
                    label: item?.medicineName, // fixed typo
                    price: item?.salePrice || 0,
                }));
                setMedicineList(data)
                setIsLoading(false)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        if (patientId?.length > 3 && !id) {
            fetchPatient()
        }
    }, [patientId])
    useEffect(() => {
        fetchInventory()
    }, [userId])


    const handleSubmit = async (e) => {
        e.preventDefault();
        let data = {};

        data.sellId = id;
        data.returnProducts = formData.returnProducts;
        data.refundMode = formData.refundMode;
        data.refundStatus = formData.refundStatus;
        data.returnDate = formData.returnDate;
        setIsLoading(true)
        try {
            const response = await securePostData(`pharmacy/customer-return`, data);
            if (response.success) {
                toast.success(response.message)
                navigate("/sell?type=return")
            } else {
                toast.error(response.message)
            }

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }
    async function fetchSellDetails() {
        setIsLoading(true)
        try {
            const response = await getSecureApiData(`pharmacy/sell-data/${id}`);
            if (response.success) {
                const data = response.sell
                const products = data.products.map(prod => ({
                    inventoryId: prod.inventoryId?._id || prod.inventoryId,
                    quantity: prod.quantity,
                    amount: prod.amount,
                    discountType: prod.discountType || null,
                    discountValue: prod.discountValue || 0,
                    totalAmount: prod.totalAmount || 0,
                    rate: prod.inventoryId?.salePrice || 0,
                }));
                const returnProducts = data.returnProducts.map(prod => ({
                    inventoryId: prod.inventoryId?._id || prod.inventoryId,
                    quantity: prod.quantity,
                    reason: prod.reason || '',
                    condition: prod.condition || '',
                    refundAmount: prod.refundAmount || null,
                }));
                if (returnProducts?.length > 0) {
                    setHaveReturns(true)
                }
                setFormData({
                    ...formData,
                    patientId: data?.patientId?._id,
                    ptName: data?.patientId?.name,
                    ptMob: data?.patientId?.patientId?.contactNumber,
                    doctorId: data.doctorId?._id,
                    dtName: data?.doctorId?.name,
                    dtMob: data?.doctorId?.doctorId?.contactNumber,
                    prescriptionFile: data?.prescriptionFile,
                    products: products,
                    paymentStatus: data?.paymentStatus,
                    paymentMethod: data?.paymentMethod,
                    refundMode: data?.refundMode || '',
                    refundStatus: data?.refundStatus || '',
                    returnDate: data?.returnDate
                        ? new Date(data.returnDate).toISOString().split("T")[0]
                        : '',
                    returnProducts

                })

                setPatientId(data?.patientId?.nh12)
                setDoctorId(data?.doctorId?.nh12)
            } else {
                toast.error("Failed to fetch sell details");
            }

        } catch (error) {
            console.error("Error fetching sell details:", error);
        } finally {
            setIsLoading(false)
        }
    }
    const handleAddReturn = () => {
        setFormData({
            ...formData,
            returnProducts: [...(formData.returnProducts || []), {
                inventoryId: null, quantity: 1,
                reason: '',
                condition: '',
                refundAmount: null,
            }]
        })
    }
    useEffect(() => {
        if (id) {
            fetchSellDetails()
        }
    }, [id])
    // When selecting a return medicine
    const handleReturnSelectChange = (index, option) => {
        const updated = [...formData.returnProducts];
        updated[index].inventoryId = option?.value;
        setFormData({ ...formData, returnProducts: updated });
    };

    // When changing quantity of a return medicine
    const handleReturnQuantityChange = (index, e) => {
        const value = Number(e.target.value);
        const updated = [...formData.returnProducts];

        // Validate that return quantity does not exceed sold quantity
        const original = formData.products.find(
            p => p.inventoryId === updated[index].inventoryId
        );
        if (original && value > original.quantity) {
            toast.error("Return quantity cannot exceed sold quantity");
            return;
        }

        updated[index].quantity = value;
        setFormData({ ...formData, returnProducts: updated });
    };

    // Remove a return product
    const handleRemoveReturn = (index) => {
        const updated = formData.returnProducts.filter((_, i) => i !== index);
        setFormData({ ...formData, returnProducts: updated });
    };

    const handleReturnChange = (index, e) => {
        const { name, value } = e.target;

        const updated = [...formData.returnProducts];

        updated[index] = {
            ...updated[index],
            [name]: value
        };

        setFormData({
            ...formData,
            returnProducts: updated
        });
    };
    return (
        <>
            {isLoading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row mb-2">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Return</h3>
                                <div className="admin-breadcrumb">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb custom-breadcrumb">
                                            <li className="breadcrumb-item">
                                                <NavLink to="/dashboard" className="breadcrumb-link">
                                                    Dashboard
                                                </NavLink>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <NavLink to="/sell" className="breadcrumb-link">
                                                    Sell
                                                </NavLink>
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page"
                                            >
                                                Customer Return
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='dashboard-main-card '>
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-2">
                                <div className="">
                                    <h5 className="add-contact-title text-black fz-24">Details</h5>
                                </div>
                                {/* <div className="col-lg-4 col-md-4 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Patient Id</label>
                                        <input type="number" disabled={id} value={patientId} onChange={(e) => setPatientId(e.target.value)} className="form-control nw-frm-select " placeholder="Enter Patient Id" />
                                    </div>
                                </div> */}

                                {/* <div className="col-lg-6 col-md-6 col-sm-12">
                                    <div className="d-flex align-items-center gap-3 ">
                                        <label htmlFor="">Patient</label>
                                        <h6>{formData?.ptName}</h6>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 ">
                                        <label htmlFor="">Patient Mobile Number</label>
                                        <h6>{formData?.ptMob}</h6>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12">
                                    <div className="d-flex align-items-center gap-3 ">
                                        <label htmlFor="">Delivery Type</label>
                                        <h6>{formData?.deliveryType}</h6>
                                    </div>
                                    {formData?.paymentMethod && <div className="d-flex align-items-center gap-3 ">
                                        <label htmlFor="">Payment Method</label>
                                        <h6>{formData?.paymentMethod}</h6>
                                    </div>}
                                </div> */}

                                <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
                                    <div className="return-sell-content">
                                        <h5 className="mb-0">Patient:-</h5>
                                        <h6 className="mb-0">{formData?.ptName}</h6>
                                    </div>

                                </div>

                                <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
                                    <div className="return-sell-content">
                                        <h5 className="mb-0">Patient Mobile Number:-</h5>
                                        <h6 className="mb-0">{formData?.ptMob}</h6>
                                    </div>

                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
                                    <div className="return-sell-content">
                                        <h5 className="mb-0">Delivery Type:-</h5>
                                        <h6 className="text-black mb-0">{formData?.deliveryType}</h6>
                                    </div>

                                </div>

                                <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
                                    {formData?.paymentMethod && <div className="return-sell-content">
                                        <h5 className="mb-0">Payment Method:-</h5>
                                        <h6 className="text-black mb-0">{formData?.paymentMethod}</h6>
                                    </div>}
                                </div>

                            </div>

                            <div className="row">
                                <div className="">
                                    <h5 className="add-contact-title">Medications</h5>
                                </div>
                                {formData.products.map((product, index) => (
                                    <div className="row mb-2" key={index}>
                                        <div className="col-lg-4 col-md-4 col-sm-12">
                                            <div class="custom-frm-bx">
                                                <label>Medication</label>
                                                <div class="select-wrapper">
                                                    <Select
                                                        options={medicineList.filter(
                                                            item =>
                                                                !formData.products.some(
                                                                    (p, i) => p.inventoryId === item.value && i !== index
                                                                )
                                                        )}
                                                        readOnly={haveReturns}
                                                        classNamePrefix="custom-select"
                                                        value={medicineList.find(item => item.value === product.inventoryId) || null}
                                                        placeholder="Select Product"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Quantity</label>
                                                <input type="number"
                                                    value={product?.quantity}
                                                    disabled={id}
                                                    name="quantity"
                                                    className="form-control nw-frm-select " placeholder="Enter Quantity" />
                                            </div>
                                        </div>
                                        {/* <div className="col-lg-2 col-md-4 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Amount</label>
                                                <input type="number"
                                                    value={product?.amount}
                                                    name="amount"
                                                    className="form-control nw-frm-select " placeholder="Enter Amount" />
                                            </div>
                                        </div> */}
                                        {/* <div className="col-lg-2 col-md-4 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Discount Type</label>
                                                <select className="form-control nw-frm-select "
                                                    value={product?.discountType}
                                                    disabled={id}>
                                                    <option value="">Select</option>
                                                    <option value="Percentage">Percentage</option>
                                                    <option value="Fixed">Fixed</option>
                                                </select>

                                            </div>
                                        </div> */}
                                        {/* <div className="col-lg-2 col-md-4 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Discount</label>
                                                <input type="number"
                                                    value={product?.discountValue}
                                                    disabled={id}
                                                    name="discountValue"
                                                    className="form-control nw-frm-select " placeholder="Enter Discount" />
                                            </div>
                                        </div> */}
                                        <div className="col-lg-4 col-md-4 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label htmlFor=""> Amount</label>
                                                <input type="number"
                                                    value={product?.totalAmount}
                                                    name="totalAmount"
                                                    className="form-control nw-frm-select " placeholder="Enter Total Amount" />
                                            </div>
                                        </div>

                                    </div>))}

                                <div className="d-flex align-items-center justify-content-between">
                                    <h5 className="add-contact-title">Return Medicines</h5>
                                    {formData?.products?.length > formData?.returnProducts?.length &&
                                        <button className="text-end" type="button" disabled={haveReturns} onClick={() => handleAddReturn()}>
                                            <FontAwesomeIcon className="reprting-name" icon={faPlusCircle} /></button>}

                                </div>
                                {formData.returnProducts?.map((product, index) => (
                                    <div className="row mb-2" key={index} >
                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                            <div class="custom-frm-bx">
                                                <label>Medication</label>
                                                <div class="select-wrapper">
                                                    <Select
                                                        options={formData.products
                                                            .filter(p => !formData.returnProducts.some(r => r.inventoryId === p.inventoryId))
                                                            .map(item => ({
                                                                value: item.inventoryId,
                                                                label: medicineList.find(m => m.value === item.inventoryId)?.label
                                                            }))
                                                        }
                                                        classNamePrefix="custom-select"
                                                        value={medicineList.find(item => item.value === product.inventoryId) || null}
                                                        onChange={(option) => handleReturnSelectChange(index, option)}
                                                        placeholder="Select Product"
                                                        disabled={haveReturns}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-md-6 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Quantity</label>
                                                <input type="number"
                                                    value={product?.quantity}
                                                    name="quantity"
                                                    disabled={haveReturns}
                                                    onChange={(e) => handleReturnQuantityChange(index, e)}
                                                    className="form-control nw-frm-select " placeholder="Enter Quantity" />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-4 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Reason</label>
                                                <input type="text"
                                                    value={product?.reason}
                                                    name="reason"
                                                    disabled={haveReturns}
                                                    onChange={(e) => handleReturnChange(index, e)}
                                                    className="form-control nw-frm-select " placeholder="Enter Reason" />
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-4 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Condition</label>
                                                <input type="text"
                                                    value={product?.condition}
                                                    name="condition"
                                                    disabled={haveReturns}
                                                    onChange={(e) => handleReturnChange(index, e)}
                                                    className="form-control nw-frm-select " placeholder="Enter Condition" />
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-4 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Refund Amount</label>
                                                <input type="number"
                                                    value={product?.refundAmount}
                                                    name="refundAmount"
                                                    disabled={haveReturns}
                                                    onChange={(e) => handleReturnChange(index, e)}
                                                    className="form-control nw-frm-select " placeholder="Enter Refund Amount" />
                                            </div>
                                        </div>
                                        {!haveReturns &&<div className="col-lg-1 col-md-4 col-sm-12 d-flex align-items-center justify-content-center">
                                            <button className="text-danger" disabled={haveReturns} type="button" onClick={() => handleRemoveReturn(index)}><FontAwesomeIcon icon={faTrash} /></button>

                                        </div>}
                                    </div>))}
                                <div className="row">
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Refund Status</label>
                                            <div className="select-wrapper">
                                                <select name="" id="" disabled={haveReturns} required className="form-select custom-select" value={formData?.refundStatus} onChange={(e) => setFormData({ ...formData, refundStatus: e.target.value })} >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="REFUNDED">REFUNDED</option>
                                                    <option value="PARTIAL">PARTIAL</option>
                                                    <option value="REJECTED">REJECTED</option>
                                                </select>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Refund Mode</label>
                                            <div className="select-wrapper">
                                                <select name="" id="" disabled={haveReturns} required className="form-select custom-select" value={formData?.refundMode} onChange={(e) => setFormData({ ...formData, refundMode: e.target.value })}  >
                                                    <option value="">----Select----</option>
                                                    <option value="CASH">CASH</option>
                                                    <option value="CARD">CARD</option>
                                                    <option value="ONLINE">ONLINE</option>
                                                </select>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Return Date</label>
                                            <input type="date" disabled={haveReturns} value={formData.returnDate} required max={new Date().toISOString().split("T")[0]} 
                                            className="form-control nw-frm-select " name="returnDate" 
                                            onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}  id="" />

                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 text-end">
                                    <div className="d-flex justify-content-between">
                                        <Link className="nw-thm-btn  outline" to={`/sell?type=return`}  >Go Back</Link>
                                        {!haveReturns && <button className="nw-thm-btn rounded-3" type="submit" aria-label="Close" >Submit</button>}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>}

        </>
    )
}

export default CustomerReturn