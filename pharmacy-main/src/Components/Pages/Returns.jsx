import { TbGridDots } from "react-icons/tb";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { deleteApiData, getSecureApiData } from "../../Services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Layouts/Loader";

function Returns() {
    const userId = localStorage.getItem('userId')
    const navigate = useNavigate()
    const [returnData, setReturnData] = useState([])
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [name, setName] = useState('')
    const [totalPage, setTotalPage] = useState(1)
    const fetchReturns = async () => {
        setLoading(true)
        try {
            const response = await getSecureApiData(`pharmacy/return/${userId}?page=${currentPage}&search=${name}&status=${status}`);

            if (response.success) {
                setReturnData(response.data)
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
    useEffect(() => {
        if (userId) {

            fetchReturns()
        }
    }, [userId, currentPage])
    const deleteReturn = async (id) => {
        try {
            const response = await deleteApiData(`pharmacy/return/${id}`);
            if (response.success) {
                toast.success('Return deleted')
                fetchReturns()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    }
    return (
        <>
            {loading ?
                <Loader /> : <>
                    <div className="main-content flex-grow-1 p-3 overflow-auto">
                        <div className="row mb-2">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h3 className="innr-title mb-2 gradient-text">Returns</h3>
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
                                                    Returns
                                                </li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button onClick={() => navigate("/add-return")} data-bs-dismiss="modal" aria-label="Close" className="nw-thm-btn rounded-3" >Add Return</button>
                                </div>


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
                                                className="form-control search-table-frm pe-5 admin-table-search-frm"
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
                                                <label className="label">Status :</label>
                                                <select className="" value={status} onChange={(e) => setStatus(e.target.value)}>
                                                    <option value=''>All</option>
                                                    <option value='Pending'>Pending</option>
                                                    <option value='Complete'>Complete</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <button className="nw-thm-btn" onClick={fetchReturns}>Filter</button>
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
                                                        <th>Supplier</th>
                                                        <th>Supplier Mobile Number</th>
                                                        <th>Add Date</th>
                                                        <th>Product Name</th>
                                                        <th>Reason</th>
                                                        <th>Status</th>
                                                        <th>Action</th>

                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {returnData?.length > 0 &&
                                                        returnData?.map((item, key) =>
                                                            <tr key={key}>
                                                                <td>{(currentPage - 1) * 10 + key + 1}</td>
                                                                <td>
                                                                    <div className="admin-table-bx">
                                                                        <div className="admin-table-sub-bx">
                                                                            <div className="admin-table-sub-details">
                                                                                <h6>{item?.supplierId?.name}</h6>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    {item?.supplierId?.mobileNumber}
                                                                </td>

                                                                <td>
                                                                    {new Date(item?.deliveryDate)?.toLocaleDateString('en-GB', {
                                                                        day: '2-digit',
                                                                        month: '2-digit',
                                                                        year: 'numeric'
                                                                    })}
                                                                </td>

                                                                <td>
                                                                    <ul className="admin-appointment-list">
                                                                        {
                                                                            item?.products?.map((p, k) =>
                                                                                <>
                                                                                    <li className="admin-appoint-item"><span className="admin-appoint-id">{p?.medicineName}</span></li>
                                                                                    <li className="admin-appoint-item">Qty.:{p?.quantity}</li>
                                                                                </>)}

                                                                    </ul>
                                                                </td>
                                                                <td>
                                                                    {item?.reason}
                                                                </td>

                                                                <td>
                                                                    {item?.status == 'Pending' ? <span className="pending-title"> Pending</span> :
                                                                        <span className="paid-title"> Completed</span>
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
                                                                                    <NavLink to="/edit-return" onClick={() => sessionStorage.setItem('returnData', JSON.stringify(item))} className="prescription-nav" >
                                                                                        View
                                                                                    </NavLink>
                                                                                </li>
                                                                                {/* <li className="prescription-item">
                                                                                    <button className=" prescription-nav" onClick={() => deleteReturn(item?._id)}>

                                                                                        Delete
                                                                                    </button>
                                                                                </li> */}
                                                                            </ul>
                                                                        </div>

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
                    </div>

                    {/*Add Supplier Popup Start  */}
                    {/* data-bs-toggle="modal" data-bs-target="#add-Request" */}
                    <div className="modal step-modal fade" id="add-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                        aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content rounded-5 p-4">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <h6 className="lg_title mb-0">Send  H1 Medicine Request</h6>
                                    </div>
                                    <div>
                                        <button type="button" className="" data-bs-dismiss="modal" aria-label="Close">
                                            <FontAwesomeIcon icon={faClose} />
                                        </button>
                                    </div>
                                </div>
                                <div className="modal-body p-0">
                                    <form action="">
                                        <div className="row mt-3">
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label>Select Medicine </label>
                                                    <div className="select-wrapper">
                                                        <select className="form-select custom-select">
                                                            <option>Select Medicine </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Quantity</label>
                                                    <input type="text" className="form-control nw-frm-select " placeholder="Enter Quantity" />
                                                </div>
                                            </div>

                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Message</label>
                                                    <textarea name="" id="" className="form-control nw-frm-select "></textarea>

                                                </div>
                                            </div>

                                            <div className="col-lg-12">
                                                <div className="text-center mt-4">
                                                    <button className="nw-thm-btn rounded-2 w-75" >Send Request</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*  Add Supplier Popup End */}

                </>}
        </>
    )
}

export default Returns