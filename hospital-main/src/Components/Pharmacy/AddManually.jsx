import { faCircleXmark, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaPlusCircle } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSecureApiData, securePostData } from "../../Service/api";
import Select from 'react-select'
import { toast } from "react-toastify";
import base_url from "../../baseUrl";
// import { useNavigate } from "react-router-dom";

function AddManually() {
    const { id } = useParams()
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    const [patientId, setPatientId] = useState("")
    const [doctorId, setDoctorId] = useState("")
    const [dtData, setDtData] = useState({})
    const [ptData, setPtData] = useState({})
    const [medicineList, setMedicineList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [formData, setFormData] = useState({
        patientId: null,
        doctorId: null,
        hospitalId: userId,
        ptMob: null,
        ptName: '',
        dtMob: null,
        dtName: '',
        prescriptionFile: null,deliveryType:'Counter pickup',paymentMethod:"",
        paymentStatus: "Pending",
         products: [
            { inventoryId: null, quantity: 1,medicineName:'', amount: 0, discountType: null, discountValue: 0, totalAmount: 0, rate: 0 },
        ],
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
            toast.error(err?.response?.data?.message || "Something went wrong");;
        } finally {
            setIsLoading(false)
        }
    }
    const fetchDoctor = async () => {
        setIsLoading(true)
        try {
            const response = await getSecureApiData(`doctor/${doctorId}`);
            if (response.success) {
                setFormData({
                    ...formData, doctorId: response.data._id, dtMob: response.data.contactNumber,
                    dtName: response.data.name
                })
                setDtData({ name: response.data.name, contactNumber: response.data.contactNumber })
                setIsLoading(false)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        } finally {
            setIsLoading(false)
        }
    }
    const fetchInventory = async () => {
        try {
            const response = await getSecureApiData(`api/hospital/inventory/${userId}?schedule=all&limit=10000&status=Approved&expiry=No`);
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
            toast.error(err?.response?.data?.message || "Something went wrong");;
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
        if (doctorId?.length > 3) {
            fetchDoctor()
        }
    }, [doctorId])
    useEffect(() => {
        fetchInventory()
    }, [userId])
    const handleProductSelectChange = (index, option) => {
        const updatedProducts = [...formData.products];
        const price = option?.price || 0;
        const quantity = updatedProducts[index].quantity || 1;

        updatedProducts[index] = {
            ...updatedProducts[index],
            rate: price,
            inventoryId: option.value,
            medicineName:option.label,
            amount: price * quantity,
            totalAmount: price * quantity,
        };

        setFormData({ ...formData, products: updatedProducts });
    };



    const handleProductPriceChange = (index, e) => {
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
        if (!patientId && !formData.ptMob) {
            toast.error("Please fill all required fields")
            return
        }
        // if (!formData.prescriptionFile) {
        //     toast.error("Please upload prescription file")
        //     return
        // }
        const data = new FormData();
        if (formData.patientId) {
            data.append("patientId", formData.patientId)
        }
        if(!formData.ptName?.trim()){
            return toast.error("Please enter a patient name")
        }
        if (!formData.patientId && formData.ptMob) {
            data.append("ptMob", formData.ptMob)
            data.append("ptName", formData.ptName)
        }
        if (formData.paymentMethod) {
            data.append("paymentMethod", formData.paymentMethod)
        }
        if (formData.deliveryType) {
            data.append("deliveryType", formData.deliveryType)
        }
        if (formData.doctorId) {
            data.append("doctorId", formData.doctorId)
        }
        if (!formData.doctorId && formData?.dtMob) {
            data.append("dtMob", formData.dtMob)
            data.append("dtName", formData?.dtName)
        }
        data.append("hospitalId", formData.hospitalId)
        if (formData.prescriptionFile instanceof File) {
            data.append("prescriptionFile", formData.prescriptionFile)
        }
        data.append("paymentStatus", formData.paymentStatus)
        data.append("products", JSON.stringify(formData.products))
        // data.appent("total",total)
        try {
            const response = await securePostData(`api/hospital/sell-medicine`, data);
            if (response.success) {
                toast.success(response.message)
                navigate("/sell")
            } else {
                toast.error(response.message)
            }
        } catch (error) {

        }
    }
    const handleTypeSelectChange = (index, option) => {
        const updatedProducts = [...formData.products];

        const price = option?.price || 0;
        const quantity = updatedProducts[index].quantity || 1;

        updatedProducts[index] = {
            ...updatedProducts[index],
            inventoryId: option.value,
            rate: price,
            amount: price * quantity,
            totalAmount: price * quantity,
        };

        setFormData({ ...formData, products: updatedProducts });
    };
    const handleProductQuantityChange = (index, e) => {
        const quantity = Number(e.target.value);
        const updatedProducts = [...formData.products];

        const rate = updatedProducts[index].rate || 0;
        const amount = rate * quantity;

        updatedProducts[index] = {
            ...updatedProducts[index],
            quantity,
            amount,
            totalAmount: calculateTotal(
                amount,
                updatedProducts[index].discountType,
                updatedProducts[index].discountValue
            ),
        };
        setFormData({ ...formData, products: updatedProducts });
    };
    const handleDiscountTypeChange = (index, e) => {
        const updatedProducts = [...formData.products];
        updatedProducts[index].discountType = e.target.value;

        updatedProducts[index].totalAmount = calculateTotal(
            updatedProducts[index].amount,
            updatedProducts[index].discountType,
            updatedProducts[index].discountValue
        );

        setFormData({ ...formData, products: updatedProducts });
    };

    const handleDiscountChange = (index, e) => {
        const discountValue = Number(e.target.value);
        const updatedProducts = [...formData.products];

        updatedProducts[index].discountValue = discountValue;
        updatedProducts[index].totalAmount = calculateTotal(
            updatedProducts[index].amount,
            updatedProducts[index].discountType,
            discountValue
        );

        setFormData({ ...formData, products: updatedProducts });
    };
    const calculateTotal = (amount, discountType, discountValue) => {
        if (!discountValue) return amount;

        if (discountType === "Percentage") {
            return amount - (amount * discountValue) / 100;
        }

        if (discountType === "Fixed") {
            return amount - discountValue;
        }

        return amount;
    };
    async function fetchSellDetails() {
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
                    paymentStatus: data?.paymentStatus
                })
                setPatientId(data?.patientId?.nh12)
                setDoctorId(data?.doctorId?.nh12)
            } else {
                toast.error("Failed to fetch sell details");
            }

        } catch (error) {
            console.error("Error fetching sell details:", error);
        }
    }

    useEffect(() => {
        if (id) {
            fetchSellDetails()
        }
    }, [id])
    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Add Manually</h3>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="#" className="breadcrumb-link">
                                                Dashboard
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <a href="#" className="breadcrumb-link">
                                                Sell
                                            </a>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Add Manually
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
                            <div className="mb-3">
                                <h5 className="add-contact-title text-black fz-24">Manually Details</h5>
                            </div>
                            {/* <div className="col-lg-4 col-md-4 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Patient Id</label>
                                    <input type="number" disabled={id} value={patientId} onChange={(e) => setPatientId(e.target.value)} className="form-control nw-frm-select " placeholder="Enter Patient Id" />
                                </div>
                            </div> */}

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Patient Name</label>
                                    <input type="text" disabled={id} value={formData?.ptName} onChange={(e) => setFormData({ ...formData, ptName: e.target.value })} className="form-control nw-frm-select " placeholder="Enter Patient name" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Patient Mobile Number</label>
                                    <input type="number" disabled={id} value={formData?.ptMob} onChange={(e) => setFormData({ ...formData, ptMob: e.target.value })} className="form-control nw-frm-select " placeholder="Enter Patient Mobile Number" />
                                </div>
                            </div>

                            {/* <div className="col-lg-4 col-md-4 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Doctor Id</label>
                                    <input type="text" disabled={id} value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="form-control nw-frm-select " placeholder="Enter Doctor Id" />
                                </div>
                            </div> */}

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Doctor  Name</label>
                                    <input type="text" disabled={id} value={formData?.dtName} onChange={(e) => setFormData({ ...formData, dtName: e.target.value })} className="form-control nw-frm-select " placeholder="Enter Doctor name" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Doctor Mobile Number</label>
                                    <input type="number" disabled={id} value={formData?.dtMob} onChange={(e) => setFormData({ ...formData, dtMob: e.target.value })} className="form-control nw-frm-select " placeholder="Enter Doctor Mobile Number" />
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-4 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Prescription  Upload</label>
                                    <div className="upload-box  p-3">
                                        <div className="upload-icon mb-2">
                                            <IoCloudUploadOutline />
                                        </div>

                                        <div>
                                            <p className="fw-semibold mb-1">
                                                <label htmlFor="fileInput1" className="file-label file-select-label">
                                                    Choose a file or drag & drop here
                                                </label>
                                            </p>

                                            <small className="format-title">JPEG Format</small>


                                            <div className="mt-3">
                                                <label htmlFor="fileInput1" className="browse-btn">
                                                    Browse File
                                                </label>
                                            </div>

                                            <input
                                                type="file"
                                                className="d-none"
                                                id="fileInput1"
                                                disabled={id}
                                                onChange={(e) => setFormData({ ...formData, prescriptionFile: e.target.files[0] })}
                                                accept=".png,.jpg,.jpeg"
                                            />

                                            {formData.prescriptionFile instanceof File && (
                                                <div id="filePreviewWrapper" className=" mt-3">
                                                    <img src={URL.createObjectURL(formData.prescriptionFile)} alt="Preview" className="img-thumbnail" />
                                                </div>
                                            )}
                                            {formData?.prescriptionFile?.startsWith('uploads') && (
                                                <div id="filePreviewWrapper" className=" mt-3">
                                                    <img src={`${base_url}/${formData?.prescriptionFile}`} alt="Preview" className="img-thumbnail" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="row">
                            <div className="mb-3">
                                <h5 className="add-contact-title">Manually Add Medications</h5>
                            </div>
                            {formData.products.map((product, index) => (
                                <div className="row mb-2" key={index}>
                                    <div className="col-lg-2 col-md-4 col-sm-12">
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
                                                    classNamePrefix="custom-select"
                                                    value={medicineList.find(item => item.value === product.inventoryId) || null}
                                                    onChange={(option) => handleProductSelectChange(index, option)}
                                                    placeholder="Select Product"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-md-4 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Quantity</label>
                                            <input type="number"
                                                value={product?.quantity}
                                                name="quantity"
                                                onChange={(e) => handleProductQuantityChange(index, e)}
                                                className="form-control nw-frm-select " placeholder="Enter Quantity" />
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-md-4 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Amount</label>
                                            <input type="number"
                                                value={product?.amount}
                                                name="amount"
                                                className="form-control nw-frm-select " placeholder="Enter Amount" />
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-md-4 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Discount Type</label>
                                            <select className="form-control nw-frm-select "
                                                value={product?.discountType}
                                                onChange={(e) => handleDiscountTypeChange(index, e)}>
                                                <option value="">Select</option>
                                                <option value="Percentage">Percentage</option>
                                                <option value="Fixed">Fixed</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-md-4 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Discount</label>
                                            <input type="number"
                                                value={product?.discountValue}
                                                name="discountValue"
                                                onChange={(e) => handleDiscountChange(index, e)}
                                                className="form-control nw-frm-select " placeholder="Enter Discount" />
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-md-4 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Total Amount</label>
                                            <input type="number"
                                                value={product?.totalAmount}
                                                name="totalAmount"
                                                className="form-control nw-frm-select " placeholder="Enter Total Amount" />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-12 d-flex align-items-center">
                                        <div className="custom-frm-bx mb-0">
                                            <button className="text-danger" disabled={formData.products.length === 1}
                                                onClick={() => removeProduct(index)}
                                            ><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                    </div>
                                </div>))}
                                        <div className="text-end">
                                            <button
                                                type="button"
                                                className="reprting-name"
                                                onClick={addProduct}
                                            >
                                                <FaPlusCircle />
                                            </button>
                                        </div>
                            {/* <div className="col-lg-12 col-md-12 col-sm-12 mt-2">
                                <div className="generate-bill">
                                    <h5 className="add-contact-title mb-0 fz-22">Generate Bill </h5>
                                    <div className="text-center">
                                        <img src="/bill.svg" alt="" />
                                        <p className="py-2">Please Generate Prescriptions Bill </p>
                                        <button
                                            // disabled={formData?.products[0].inventoryId == null}
                                            disabled
                                            type="button"
                                            className="nw-thm-btn outline rounded-5" data-bs-toggle="modal"
                                            data-bs-target="#bill-Generate">Generate Bill</button>
                                    </div>
                                </div>
                            </div> */}
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

                            <div className="mt-3 text-end">
                                <div className="permission-check-main-bx">
                                    <div className="form-check custom-check d-inline-block">
                                        <input className="form-check-input" type="checkbox"
                                            checked={formData?.paymentStatus === "Completed"}
                                            onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.checked ? "Completed" : "Pending" })}
                                            id="chat" />
                                        <label className="form-check-label" for="chat">
                                            Payment Done
                                        </label>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                                    <button className="nw-thm-btn rounded-3" type="submit" data-bs-dismiss="modal" aria-label="Close" >Submit</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>


            {/*Generate Bill Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#bill-Generate" */}
            <div className="modal step-modal" id="bill-Generate" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content rounded-5">
                        <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3">
                            <div>
                                <h6 className="lg_title mb-0">Generate Bill </h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close">
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body px-4 pb-5">
                            <form >
                                {formData?.products?.map((product, index) =>
                                    <div className="row" key={index}>
                                        <div className="col-lg-6 col-md-4 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Medicine Name</label>
                                                <div class="select-wrapper">
                                                    <Select
                                                        options={medicineList.filter(
                                                            item =>
                                                                !formData.products.some(
                                                                    (p, i) => p.inventoryId === item.value && i !== index
                                                                )
                                                        )}
                                                        classNamePrefix="custom-select"
                                                        disabled
                                                        value={medicineList.find(item => item.value === product.inventoryId) || null}
                                                        onChange={(option) => handleProductSelectChange(index, option)}
                                                        placeholder="Select Product"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-4 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Quantity</label>
                                                <input type="number"
                                                    value={product?.quantity}
                                                    disabled
                                                    className="form-control nw-frm-select " placeholder="Enter  Quantity" />
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-4 col-sm-12">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Amount($)</label>
                                                <input type="text"
                                                    name="price"
                                                    value={product?.price}
                                                    onChange={(e) => handleProductPriceChange(index, e)}
                                                    className="form-control nw-frm-select " placeholder="Enter Amount" />
                                            </div>
                                        </div>
                                    </div>)}

                                <div className="col-lg-12">
                                    <div className="text-center mt-4">
                                        
                                        <button className="nw-thm-btn rounded-2 w-75" type="button" data-bs-dismiss="modal">Submit</button>
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

export default AddManually