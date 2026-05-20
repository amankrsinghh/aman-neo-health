import { faCircleXmark, faPen, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteApiData, getSecureApiData, securePostData, updateApiData } from "../../Services/api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "../Layouts/Loader";
import { Link, NavLink } from "react-router-dom";
function Supplier() {
    const userId = localStorage.getItem('userId')
    const [formData, setFormData] = useState({
        name: "",
        mobileNumber: "",
        email: "",
        address: "",
        city: "",
        pincode: "",
        score: 0,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Step 2: handleChange function
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Step 3: handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setSuccess("");

        try {
            if (formData?._id) {
                const payload = { ...formData, pharId: userId, supplierId: formData?._id };
                const response = await updateApiData("pharmacy/supplier", payload); // adjust API URL
                if (response.success) {
                    document.getElementById("editSupplier")?.click()
                    setSuccess("Supplier updated successfully!");
                    setFormData({
                        name: "",
                        mobileNumber: "",
                        email: "",
                        address: "",
                        city: "",
                        pincode: "",
                        score: 0,
                    });
                    fetchSupplier()
                } else {
                    toast.error(response.message)
                }
            } else {
                const payload = { ...formData, pharId: userId };

                const response = await securePostData("pharmacy/supplier", payload); // adjust API URL
                if (response.success) {
                    document.getElementById("addSupplier")?.click()
                    setSuccess("Supplier added successfully!");
                    setFormData({
                        name: "",
                        mobileNumber: "",
                        email: "",
                        address: "",
                        city: "",
                        pincode: "",
                        score: 0,
                    });
                    fetchSupplier()
                } else {
                    toast.error(response.message)
                }
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error("Name is required");
            return false;
        }

        if (!formData.mobileNumber) {
            toast.error("Mobile number is required");
            return false;
        }

        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(formData.mobileNumber)) {
            toast.error("Please enter a valid mobile number");
            return false;
        }

        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error("Please enter a valid email address");
                return false;
            }
        }

        if (!formData.address.trim()) {
            toast.error("Address is required");
            return false;
        }

        if (!formData.city) {
            toast.error("Please select a city");
            return false;
        }

        if (!formData.pincode) {
            toast.error("Pincode is required");
            return false;
        }

        const pincodeRegex = /^[1-9][0-9]{5}$/;
        if (!pincodeRegex.test(formData.pincode)) {
            toast.error("Please enter a valid pincode");
            return false;
        }

        return true;
    };
    const [suppliers, setSuppliers] = useState([])
    const [status, setStatus] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [name, setName] = useState('')
    const [totalPage, setTotalPage] = useState(1)
    const fetchSupplier = async () => {
        setLoading(true)
        try {
            const response = await getSecureApiData(`pharmacy/supplier/${userId}?page=${currentPage}&name=${name}&status=${status}`);
            if (response.success) {
                setSuppliers(response.data)
                setTotalPage(response.pagination.totalPages)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const deleteSupplier = async (id) => {
        try {
            const response = await deleteApiData(`pharmacy/supplier/${id}`);
            if (response.success) {
                toast.success('Supplier deleted')
                fetchSupplier()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    }
    useEffect(() => {
        fetchSupplier()
    }, [userId, currentPage, status])
    return (
        <>
            {loading ?
                <Loader /> : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row mb-3">
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Supplier List</h3>
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
                                                Supplier
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                            <div>
                                <button className="nw-thm-btn" onClick={() => setFormData({
                                    name: "",
                                    mobileNumber: "",
                                    email: "",
                                    address: "",
                                    city: "",
                                    pincode: "",
                                    score: 0,
                                })} data-bs-toggle="modal" data-bs-target="#add-Supplier">Add Supplier</button>
                            </div>
                        </div>
                    </div>
                    <div className='new-mega-card'>
                        <div className="row">
                            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2 pharmacy-mb-box">
                                <div className="custom-frm-bx mb-0">
                                    <input
                                        type="text"
                                        className="form-control admin-table-search-frm search-table-frm pe-5"
                                        id="email"
                                        value={name} onChange={(e) => setName(e.target.value)}
                                        placeholder="Search"
                                        required
                                    />
                                    <div className="adm-search-bx">
                                        <button onClick={() => fetchSupplier()} className="tp-search-btn">
                                            <FontAwesomeIcon icon={faSearch} />
                                        </button>
                                    </div>
                                </div>


                                {/* <div className="filters">
                                        <div className="field custom-frm-bx mb-0 custom-select admin-table-search-frm ">
                                            <label className="label">Short By :</label>
                                            <select className="">
                                                <option>Top score</option>
                                                <option>Test 1</option>
                                                <option>Test 2</option>
                                            </select>
                                        </div>
                                    </div> */}
                                {/* <div>
                                        <button className="nw-thm-btn">Filter</button>
                                    </div> */}

                                {totalPage && <div className="page-selector d-flex align-items-center mb-2 mb-md-0 pharmacy-page-selector">
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
                                                    <th>Supplier</th>
                                                    <th>Mobile Number </th>
                                                    <th>Address</th>
                                                    {/* <th>Score</th>
                                                    <th>On-time delivery</th> */}
                                                    {/* <th>Price</th> */}
                                                    <th>Quality</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {suppliers?.length > 0 &&
                                                    suppliers?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{(currentPage - 1) * 10 + key + 1}</td>
                                                            <td>
                                                                <div className="admin-table-bx">
                                                                    <div className="admin-table-sub-bx">

                                                                        <div className="admin-table-sub-details">
                                                                            <h6>{item?.name}</h6>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {item?.mobileNumber}
                                                            </td>
                                                            <td>
                                                                {item?.city}
                                                            </td>
                                                            {/* <td><span className="score-title"> <img src="/score.svg" alt="" /> 774</span></td>
                                                            <td>5</td> */}
                                                            {/* <td>456567</td> */}
                                                            <td>{item?.totalQuantity}</td>
                                                            <td>
                                                                <div className="d-flex align-items-centet gap-2">
                                                                    <div class="dropdown">
                                                                        <button
                                                                            onClick={() => setFormData(item)}
                                                                            class="text-secondary"
                                                                            id="acticonMenu1"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#edit-Supplier"
                                                                            aria-expanded="false"
                                                                        >
                                                                            <FontAwesomeIcon icon={faPen} />
                                                                        </button>
                                                                    </div>
                                                                    {/* <button onClick={() => deleteSupplier(item?._id)} className="text-secondary"><FontAwesomeIcon icon={faTrash} /></button> */}
                                                                </div>
                                                            </td>
                                                        </tr>)}
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
                                <button type="button" className="" data-bs-dismiss="modal" id="addSupplier" aria-label="Close">
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
                                                className="nw-thm-btn rounded-2 w-75"
                                                disabled={loading}
                                            >
                                                {loading ? "Saving..." : "Add Supplier"}
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


            {/*Edit Supplier Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#edit-Supplier" */}
            <div className="modal step-modal fade" id="edit-Supplier" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content rounded-5 ">
                        <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3">
                            <div>
                                <h6 className="lg_title mb-0">Edit Supplier</h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" id="editSupplier" aria-label="Close">
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
                                                className="nw-thm-btn rounded-2 w-75"
                                                disabled={loading}
                                            >
                                                {loading ? "Saving..." : "Update Supplier"}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Edit Supplier Popup End */}

        </>
    )
}

export default Supplier