import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react";
import { FaPlusSquare } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getSecureApiData, securePostData, updateApiData } from "../../Services/api";
import { toast } from "react-toastify";
import Select from "react-select";

function EditReturn() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId')
    const [inventoryList, setInventoryList] = useState([])
    const [suppliers, setSuppliers] = useState([])
    const [formData, setFormData] = useState({
        supplierId: "",
        deliveryDate: "",
        status: "",
        reason: "",
        pharId: userId,
        products: [
            { inventoryId: "", quantity: "" },
        ],
    });

    // handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // handle product change
    const handleProductSelectChange = (index, selectedOption) => {
        const products = [...formData.products];
        products[index].inventoryId = selectedOption.value;
        setFormData({ ...formData, products });
    };

    // Quantity/input change
    const handleProductQuantityChange = (index, e) => {
        const { name, value } = e.target;
        const products = [...formData.products];
        products[index][name] = value;
        setFormData({ ...formData, products });
    };
    // add new product row
    const addProduct = () => {
        setFormData({
            ...formData,
            products: [...formData.products, { inventoryId: "", quantity: "" }],
        });
    };

    // remove product row
    const removeProduct = (index) => {
        const products = [...formData.products];
        products.splice(index, 1);
        setFormData({ ...formData, products });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const returnData = JSON.parse(sessionStorage.getItem('returnData'))
        const data = { returnId: returnData?._id, ...formData }
        try {
            const response = await updateApiData('pharmacy/return', data)
            if (response.success) {
                toast.success('Return updated')
            } else {
                toast.error(response.message)
            }
        } catch (error) {

        }
    };
    const fetchSupplier = async () => {
        try {
            const response = await getSecureApiData(`pharmacy/supplier/${userId}`);

            if (response.success) {
                setSuppliers(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    }
    const fetchInventory = async () => {
        try {
            const response = await getSecureApiData(`pharmacy/inventory/${userId}?schedule=all`);

            if (response.success) {
                const data = response?.data?.map((item) => ({
                    value: item?._id,
                    label: item?.medicineName, // fixed typo
                }));
                setInventoryList(data)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    }
    useEffect(() => {
        fetchSupplier()
        fetchInventory()
    }, [userId])

    useEffect(() => {
        const returnData = sessionStorage.getItem("returnData");
        if (returnData) {
            const data = JSON.parse(returnData);

            // Map products if they exist
            const mappedProducts = data.products?.map((p) => ({
                inventoryId: p.inventoryId || "",
                quantity: p.quantity || "",
            })) || [{ inventoryId: "", quantity: "" }];
            const formattedDeliveryDate = data.deliveryDate
                ? new Date(data.deliveryDate).toISOString().split("T")[0]
                : "";

            setFormData({
                supplierId: data.supplierId?._id || data.supplierId || "",
                deliveryDate: formattedDeliveryDate,
                status: data.status || "",
                reason: data.reason || "",
                pharId: userId,
                products: mappedProducts,
            });
        } else {
            navigate(-1);
        }
    }, []);

    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-2">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">View Return</h3>
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
                                            View Return
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='dashboard-main-card '>
                    <form onSubmit={handleSubmit}>
                        <div className="row">

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label>Select Supplier</label>
                                    <div className="select-wrapper">
                                        <select
                                            className="form-select custom-select"
                                            name="supplierId"
                                            value={formData.supplierId}
                                            readOnly
                                        >
                                            <option value="">Select Supplier</option>
                                            {suppliers?.map((item, key) =>
                                                <option value={item?._id}>{item?.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label>Delivery Date</label>
                                    <input
                                        type="date"
                                        className="form-control nw-frm-select"
                                        name="deliveryDate"
                                        value={formData.deliveryDate}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label>Status</label>
                                    <select
                                        className="form-select custom-select"
                                        name="status"
                                        required
                                        value={formData.status}
                                        onChange={handleChange}
                                        
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>

                                    </select>
                                </div>
                            </div>

                        </div>

                        <div className="">
                            <h5 className="add-contact-title mb-3">Product</h5>
                        </div>

                        {formData.products.map((product, index) => (
                            <div className="sub-tab-brd rounded-2 mb-3" key={index}>
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Product Name</label>
                                            <div className="select-wrapper">
                                            <Select
                                                options={inventoryList.filter(
                                                    item =>
                                                        !formData.products.some(
                                                            (p, i) => p.inventoryId === item.value && i !== index
                                                        )
                                                )}
                                                classNamePrefix="custom-select"
                                                value={inventoryList.find(opt => opt.value === product.inventoryId) || null}
                                                readOnly
                                                placeholder="Select Product"
                                            />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="return-box d-flex align-items-center">
                                            <div className="custom-frm-bx flex-grow-1">
                                                <label>Quantity</label>
                                                <input
                                                    type="number"
                                                    className="form-control nw-frm-select"
                                                    placeholder="Enter Quantity"
                                                    name="quantity"
                                                    value={product.quantity}
                                                    readOnly
                                                />
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="row mt-3">
                            <div className="col-lg-12">
                                <div className="custom-frm-bx">
                                    <label>Reason</label>
                                    <textarea
                                        className="form-control nw-frm-select"
                                        name="reason"
                                        value={formData.reason}
                                        readOnly
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 d-flex justify-content-between">
                            <Link to={-1} className="nw-thm-btn rounded-3 outline" >
                                Go Back
                            </Link>
                            <button className="nw-thm-btn rounded-3" type="submit">
                                Submit
                            </button>
                        </div>
                    </form>

                </div>
            </div>

        </>
    )
}

export default EditReturn