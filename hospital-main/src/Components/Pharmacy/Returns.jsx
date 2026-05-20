import { TbGridDots } from "react-icons/tb";
import { faDownload, faFilter, faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { deleteApiData, getSecureApiData } from "../../Service/api";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Loader from "../Common/Loader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
function Returns() {
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    const navigate = useNavigate()
    const [returnData, setReturnData] = useState([])
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [name, setName] = useState()
    const [totalPage, setTotalPage] = useState(1)
    const fetchReturns = async (rtStatus = status) => {
        if (!userId) return;
        try {
            const params = new URLSearchParams()
            params.append("page", currentPage);
            params.append("type", "hospital");

            if (rtStatus) params.append("status", rtStatus);
            if (name) params.append("search", name);
            const response = await getSecureApiData(`pharmacy/return/${userId}?${params}`);

            if (response.success) {
                setReturnData(response.data)
                setTotalPage(response.pagination.totalPages)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchReturns()
    }, [userId, currentPage])
    const deleteReturn = async (id) => {
        setLoading(true)
        try {
            const response = await deleteApiData(`pharmacy/return/${id}`);
            if (response.success) {
                toast.success('Return deleted')
                fetchReturns()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        } finally {
            setLoading(false)
        }
    }
    const downloadReturns = () => {

        if (!returnData || returnData.length === 0) {
            alert("No return data to download");
            return;
        }

        const data = returnData.map((item, index) => {

            const products = item?.products
                ?.map(p => `${p?.medicineName} (Qty: ${p?.quantity})`)
                .join(", ");

            return {
                "S.No": index + 1,
                "Supplier Name": item?.supplierId?.name || "-",
                "Supplier Mobile": item?.supplierId?.mobileNumber || "-",
                "Add Date": item?.deliveryDate
                    ? new Date(item.deliveryDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    })
                    : "-",
                "Products": products || "-",
                "Reason": item?.reason || "-",
                "Status": item?.status || "-"
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Returns");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const fileData = new Blob([excelBuffer], {
            type: "application/octet-stream"
        });

        saveAs(fileData, "Return_Products_List.xlsx");
    };
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row ">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Returns</h3>
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
                                                Returns
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                            <div className="add-nw-bx">
                                <Link to="/add-returns" className="add-nw-btn nw-thm-btn">
                                    Add Return
                                </Link>
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
                                                placeholder="Enter supplier name"
                                                required
                                            />
                                            <div className="adm-search-bx">
                                                <button className="text-secondary" onClick={() => fetchReturns()}>
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
                                                    <button onClick={() => {
                                                        setStatus('')
                                                        fetchReturns('')
                                                    }} className="fz-16 clear-btn">Reset</button>
                                                </div>
                                                <div className="p-3">
                                                    <ul className="filtring-list mb-3">
                                                        <h6>Status</h6>
                                                        <li>
                                                            <div className="form-check new-custom-check">
                                                                <input className="form-check-input" type="radio" name="status" value='Pending'
                                                                    checked={status === 'Pending'}
                                                                    onChange={(e) => setStatus(e.target.value)} id="active" />
                                                                <label className="form-check-label" for="cardiology">Pending</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="form-check new-custom-check">
                                                                <input className="form-check-input" type="radio" name="status" value={'Completed'}
                                                                    checked={status === 'Completed'}
                                                                    onChange={(e) => setStatus(e.target.value)} id="inactive" />
                                                                <label className="form-check-label" for="inactive">Completed</label>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-top">
                                                    <a href="javascript:void(0)" className="thm-btn thm-outline-btn rounded-4 px-4 py-2 outline"> Cancel</a>
                                                    <button onClick={() => fetchReturns()} className="thm-btn rounded-4 px-4 py-2"> Apply</button>
                                                </div>

                                            </div>
                                        </div>
                                        <div>
                                            <button className="nw-filtr-btn" onClick={downloadReturns}><FontAwesomeIcon icon={faDownload} /></button>
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
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="table-section">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
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
                                                {returnData?.length > 0 ?
                                                    returnData?.map((item, key) =>
                                                        <tr key={key}>
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
                                                                {item?.reason?.length > 20 ? item?.reason?.slice(0, 17).join('...') : item?.reason}
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
                                                                                <NavLink to="/edit-returns" onClick={() => sessionStorage.setItem('returnData', JSON.stringify(item))} className="prescription-nav" >
                                                                                    View/Edit
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
                                                        </tr>)
                                                    : <span className="text-black">No return found</span>}
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
                </div>}
        </>
    )
}

export default Returns