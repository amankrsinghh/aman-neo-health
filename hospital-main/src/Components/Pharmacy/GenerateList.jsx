import { TbGridDots } from "react-icons/tb";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { deleteApiData, getSecureApiData } from "../../Service/api";
import Loader from "../Common/Loader";

function GenerateList() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage?.getItem('user'))
    const userId=user.id
    const [list, setList] = useState([])
    const [status, setStatus] = useState()
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [name, setName] = useState('')
    const [totalPage, setTotalPage] = useState(1)
    const fetchPo = async () => {
        setLoading(true)
        try {
            const response = await getSecureApiData(`pharmacy/purchase-order/${userId}?page=${currentPage}&search=${name}&status=${status}`);
            if (response.success) {
                setList(response.data)
                setTotalPage(response.pagination.totalPages)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            console.error("Error creating lab:", err);
        } finally { setLoading(false) }
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPo()
        }, 800)

        return () => clearTimeout(timer)
    }, [userId, currentPage, status, name])

    const deletePo = async (id) => {
        try {
            const response = await deleteApiData(`pharmacy/purchase-order/${id}`);
            if (response.success) {
                toast.success('Purchase order  deleted')
                fetchPo()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            console.error("Error creating lab:", err);
        }
    }
    return (
        <>

            {loading ?
                <Loader /> : <>
                    <div className="main-content flex-grow-1 p-3 overflow-auto">
                        <div className="row mb-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h3 className="innr-title mb-2 gradient-text">Generate PO List</h3>
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
                                                    Purchase Order
                                                </li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="nw-thm-btn rounded-3 nw-upload-bx " onClick={() => navigate("/generate-purchase-order")} data-bs-dismiss="modal" aria-label="Close"  >Generate PO</button>
                                </div>


                            </div>
                        </div>

                        <div className='new-mega-card'>
                            <div className="row">
                                <div className="d-flex align-items-center justify-content-between mb-3 pharmacy-mb-box">
                                    <div className="d-flex align-items-center gap-2 nw-box">
                                        <div className="custom-frm-bx mb-0">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="form-control search-table-frm pe-5 "
                                                id="email"
                                                placeholder="Search"
                                                required
                                            />
                                            <div className="adm-search-bx">
                                                <button className="text-secondary">
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </button>
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
                                                        <th>Supplier</th>
                                                        <th>Supplier Mobile Number</th>
                                                        <th>Date</th>
                                                        <th>Product Name</th>
                                                        <th>Note</th>
                                                        <th>Action</th>

                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {list?.length > 0 &&
                                                        list?.map((item, key) =>
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
                                                                    {item?.deliveryDate ? new Date(item?.deliveryDate)?.toLocaleDateString() : '-'}
                                                                </td>

                                                                <td>
                                                                    <ul className="admin-appointment-list">
                                                                        {item?.products?.map((p, i) => <>
                                                                            <li className="admin-appoint-item"><span className="admin-appoint-id">{p?.productName}</span></li>
                                                                            <li className="admin-appoint-item">Qty.: <span className="admin-appoint-id">{p?.quantity}</span></li>
                                                                            <li className="admin-appoint-item">Batch Number:  <span className="admin-appoint-id">{p?.batchNumber}</span></li>
                                                                            <li className="admin-appoint-item">Schedule: <span className="admin-appoint-id">{p?.schedule}</span></li>
                                                                            <li className="admin-appoint-item">Expert Date: <span className="admin-appoint-id">{new Date(p?.expDate)?.toLocaleDateString('en-US', {
                                                                                day: '2-digit',
                                                                                month: 'short', // short month name like Jan, Feb
                                                                                year: 'numeric'
                                                                            })}</span></li>
                                                                        </>)}
                                                                        {/* <li className="admin-appoint-item"><span className="admin-appoint-id">Salbetol -2 (Salbutamol Tablets IP 2 mg)</span></li>
                                                        <li className="admin-appoint-item">Qty.: <span className="admin-appoint-id">80</span></li>
                                                        <li className="admin-appoint-item">Batch Number:  <span className="admin-appoint-id">2324423</span></li>
                                                        <li className="admin-appoint-item">Schedule: <span className="admin-appoint-id">H1</span></li>
                                                        <li className="admin-appoint-item">Expert Date: <span className="admin-appoint-id">20 Jun 2026</span></li> */}

                                                                    </ul>
                                                                </td>
                                                                <td>
                                                                    {item?.note || '--'}
                                                                </td>

                                                                <td>
                                                                    <div className="d-flex align-items-centet gap-2">
                                                                        <div className="dropdown">
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
                                                                                    <NavLink to="/edit-purchase-order"
                                                                                        onClick={() => sessionStorage.setItem('poData', JSON.stringify(item))}
                                                                                        className="prescription-nav" href="#" >
                                                                                        View/Edit
                                                                                    </NavLink>
                                                                                </li>
                                                                                {/* <li className="prescription-item">
                                                                                    <button className=" prescription-nav" onClick={() => deletePo(item?._id)}>

                                                                                        Delete
                                                                                    </button>
                                                                                </li> */}
                                                                            </ul>
                                                                        </div>

                                                                    </div>
                                                                </td>
                                                            </tr>)}


                                                    {/* <tr>
                                                <td>
                                                    <div className="admin-table-bx">
                                                        <div className="admin-table-sub-bx">
                                                            <img src="/admin-tb-logo.png" alt="" />
                                                            <div className="admin-table-sub-details">
                                                                <h6>Eleanor Pena</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    9876543210
                                                </td>

                                                <td>
                                                    20 July 2025
                                                </td>

                                                <td>
                                                    <ul className="admin-appointment-list">
                                                        <li className="admin-appoint-item"><span className="admin-appoint-id">Salbetol -2 (Salbutamol Tablets IP 2 mg)</span></li>
                                                        <li className="admin-appoint-item">Qty.: <span className="admin-appoint-id">80</span></li>
                                                        <li className="admin-appoint-item">Batch Number:  <span className="admin-appoint-id">2324423</span></li>
                                                        <li className="admin-appoint-item">Schedule: <span className="admin-appoint-id">H1</span></li>
                                                        <li className="admin-appoint-item">Expert Date: <span className="admin-appoint-id">20 Jun 2026</span></li>
                                                        <li className="admin-appoint-item"><span className="admin-appoint-id">Salbetol -2 (Salbutamol Tablets IP 2 mg)</span></li>
                                                        <li className="admin-appoint-item">Qty.: <span className="admin-appoint-id">80</span></li>
                                                        <li className="admin-appoint-item">Batch Number:  <span className="admin-appoint-id">2324423</span></li>
                                                        <li className="admin-appoint-item">Schedule: <span className="admin-appoint-id">H1</span></li>
                                                        <li className="admin-appoint-item">Expert Date: <span className="admin-appoint-id">20 Jun 2026</span></li>

                                                    </ul>
                                                </td>
                                                <td>
                                                    --
                                                </td>

                                                <td>
                                                    <div className="d-flex align-items-centet gap-2">
                                                        <div className="dropdown">
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
                                                                    <a className="prescription-nav" href="#" >
                                                                        View/Edit
                                                                    </a>
                                                                </li>
                                                                <li className="prescription-item">
                                                                    <a className=" prescription-nav" href="#">

                                                                        Delete
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>

                                                    </div>
                                                </td>
                                            </tr> */}




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
                    <div className="modal step-modal" id="add-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
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

export default GenerateList