import { faCircleXmark, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FaPlusSquare } from "react-icons/fa";
import { getSecureApiData, securePostData, updateApiData } from "../../Service/api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Loader from "../Common/Loader";
function EditGeneratePo() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage?.getItem('user'))
    const userId=user.id
    const [suppliers, setSuppliers] = useState([])
    const [loading, setLoading] = useState(false)
    const fetchSupplier = async () => {
        setLoading(true)
        try {
            const response = await getSecureApiData(`api/hospital/supplier/${userId}?type=hospital&limit=500`);
            if (response.success) {
                setSuppliers(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            console.error("Error creating lab:", err);
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchSupplier()
    }, [])
    const [formData, setFormData] = useState({
        name: "",
        mobileNumber: "",
        email: "",
        address: "",
        cityId: "",
        pincode: "",
        score: 0,
    });
    useEffect(() => {
        const storedData = sessionStorage.getItem('poData');
        if (storedData) {
            const data = JSON.parse(storedData);
            const deliveryDate = data?.deliveryDate ? new Date(data.deliveryDate).toISOString().split('T')[0] : null;
            setPurchaseData({
                ...data,
                supplierId: data?.supplierId?._id || '',
                deliveryDate: deliveryDate,
            });

        } else {
            navigate(-1);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const payload = { ...formData, hospitalId: userId };
            const response = await securePostData("api/hospital/supplier", payload); // adjust API URL
            if (response.success) {
                navigate('/purchase-order')
                setPurchaseData({ ...purchaseData, supplierId: response.supplier?._id })
                setFormData({
                    name: "",
                    mobileNumber: "",
                    email: "",
                    address: "",
                    cityId: "",
                    pincode: "",
                    score: 0,
                });
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const [purchaseData, setPurchaseData] = useState({
        supplierId: "",
        deliveryDate: null,
        note: "",
        status: "pending",
        products: [
            {
                productName: "",
                schedule: "",
                quantity: 0,
                batchNumber: "",
                expDate: "",
            },
        ],
    });
    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setPurchaseData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        setPurchaseData((prev) => {
            const products = [...prev.products];
            products[index] = {
                ...products[index],
                [name]: name === "quantity" ? Number(value) : value,
            };
            return { ...prev, products };
        });
    };
    const addProduct = () => {
        setPurchaseData((prev) => ({
            ...prev,
            products: [
                ...prev.products,
                { productName: "", schedule: "", quantity: 0, batchNumber: "", expDate: "" },
            ],
        }));
    };
    const removeProduct = (index) => {
        setPurchaseData((prev) => {
            const products = prev.products.filter((_, i) => i !== index);
            return { ...prev, products };
        });
    };
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...purchaseData, hospitalId: userId };
            const response = await updateApiData(`pharmacy/purchase-order/${purchaseData?._id}`, payload);
            if (response.success) {
                toast.success("Purchase order updated successfully ")
                navigate('/purchase-order')
                setPurchaseData({
                    supplierId: "",
                    deliveryDate: null,
                    note: "",
                    status: "pending",
                    products: [
                        { productName: "", schedule: "", quantity: 0, batchNumber: "", expDate: "" },
                    ],
                });
            } else {
            }
        } catch (err) {
        }
    };
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row mb-2">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Edit Purchase Order</h3>
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
                                                Edit Purchase Order
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='dashboard-main-card '>
                        <form onSubmit={handleProductSubmit}>
                            <div className="row">
                                {/* Supplier Select */}
                                <div className="col-lg-4 col-md-4 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label>Select Supplier</label>
                                        <div className="select-wrapper">
                                            <select
                                                className="form-select custom-select"
                                                name="supplierId"
                                                value={purchaseData.supplierId}
                                                onChange={handleProductChange}
                                                required
                                            >
                                                <option value="">Select Supplier</option>
                                                {suppliers?.map((item) => (
                                                    <option key={item._id} value={item._id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Date */}
                                <div className="col-lg-4 col-md-4 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label>Delivery Date</label>
                                        <input
                                            type="date"
                                            className="form-control nw-frm-select"
                                            name="deliveryDate"
                                            value={purchaseData.deliveryDate}
                                            onChange={handleProductChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12 d-flex align-items-center mb-2">
                                    <div className="">
                                        <a href="#" className="nw-thm-btn outline rounded-5 d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#add-Supplier"> <img src="/add-supplier.svg" alt="" /> Add Supplier</a>
                                    </div>
                                </div>
                            </div>

                            {/* Products */}
                            <h5 className="add-contact-title mb-3">Product</h5>

                            {purchaseData.products.map((product, index) => (
                                <div className="sub-tab-brd rounded-2 mb-3" key={index}>
                                    <div className="row">
                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label>Product Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control nw-frm-select"
                                                    placeholder="Enter Product Name"
                                                    name="productName"
                                                    value={product.productName}
                                                    onChange={(e) => handleItemChange(index, e)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label>Schedule</label>
                                                <select
                                                    className="form-select custom-select"
                                                    name="schedule"
                                                    value={product.schedule}
                                                    onChange={(e) => handleItemChange(index, e)}
                                                    required
                                                >
                                                    <option value="">Select </option>
                                                    <option value="H1">H1</option>
                                                    <option value="H">H</option>
                                                    <option value="X">X </option>

                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label>Quantity</label>
                                                <input
                                                    type="number"
                                                    className="form-control nw-frm-select"
                                                    placeholder="Enter Quantity"
                                                    name="quantity"
                                                    value={product.quantity}
                                                    onChange={(e) => handleItemChange(index, e)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-2 col-md-6 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label>Batch Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control nw-frm-select"
                                                    placeholder="Enter Batch Number"
                                                    name="batchNumber"
                                                    value={product.batchNumber}
                                                    onChange={(e) => handleItemChange(index, e)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-6 col-sm-12 d-flex align-items-center">
                                            <div className="custom-frm-bx flex-grow-1">
                                                <label>Exp Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control nw-frm-select"
                                                    name="expDate"
                                                    value={product.expDate}
                                                    onChange={(e) => handleItemChange(index, e)}
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="text-black ms-2"
                                                onClick={() => removeProduct(index)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-3 text-end">
                                <button type="button" className="add-employee-btn" onClick={addProduct}>
                                    <FaPlusSquare /> Add More
                                </button>
                            </div>

                            {/* Note */}
                            <div className="row mt-3">
                                <div className="col-lg-12">
                                    <div className="custom-frm-bx">
                                        <label>Note</label>
                                        <textarea
                                            className="form-control nw-frm-select"
                                            name="note"
                                            value={purchaseData.note}
                                            onChange={handleProductChange}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="mt-3 d-flex justify-content-between">
                                <Link to={-1} className="nw-thm-btn rounded-3 outline" >
                                    Go Back
                                </Link>
                                <button type="submit" className="nw-thm-btn rounded-3" >
                                    Generate
                                </button>
                            </div>

                        </form>

                    </div>
                </div>}

            {/*Add Supplier Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#add-Supplier" */}
            <div className="modal step-modal fade" id="add-Supplier" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content rounded-5">
                        <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3">
                            <div>
                                <h6 className="lg_title mb-0">Add Supplier</h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close">
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body px-4 pb-5">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Supplier Name</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Supplier Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Supplier Mobile Number</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Mobile Number"
                                                name="mobileNumber"
                                                value={formData.mobileNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Supplier Email Address</label>
                                            <input
                                                type="email"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Email Address"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Full Address</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>City</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter City"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Pin code</label>
                                            <input
                                                type="text"
                                                className="form-control nw-frm-select"
                                                placeholder="Enter Pin code"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-12">

                                        <div className="text-center mt-4">
                                            <button
                                                type="submit"
                                                data-bs-dismiss="modal"
                                                className="nw-thm-btn rounded-2 w-75"

                                            >
                                                Add Supplier
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Add Supplier Popup End */}

        </>
    )
}

export default EditGeneratePo