import { TbGridDots } from "react-icons/tb";
import { faCircleXmark, faDownload, faFilter, faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { deleteApiData, getSecureApiData, securePostData, updateApiData } from "../../Service/api";
import { toast } from "react-toastify";
import Loader from "../Common/Loader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";
function MedicineRequest() {
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [status, setStatus] = useState('')
    const [name, setName] = useState('')
    const [totalPage, setTotalPage] = useState(1)
    const [medicineList, setMedicineList] = useState([])
    const [medicineRequest, setMedicineRequest] = useState([])
    const [search, setSearch] = useState('')
    const [schedule,setSchedule]=useState()
    const [formData, setFormData] = useState({
        hospitalId: userId,
        medicineId: null,
        quantity: null,
        message: '',
        schedule: 'H1',
        type: "hospital"
    })
    const fetchInventory = async () => {
        if(!schedule) return
        setLoading(true)
        try {
            const response = await getSecureApiData(`api/hospital/inventory/${userId}?schedule=${schedule?._id}&limit=10&status=${status}&type=hospital`);
            if (response.success) {
                setFormData({...formData,schedule:schedule?._id})
                setMedicineList(response.data)

            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }
   
    const fetchSchedules = async () => {
        setLoading(true)
        try {
            const response = await getSecureApiData(`admin/schedule-medicines?name=H1`);
            if (response.success) {
                setSchedule(response.data[0])

            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }
    const fetchMedicineRequest = async (rqStatus = status) => {
        try {
            const response = await getSecureApiData(`pharmacy/medicine-request/${userId}?page=${currentPage}&status=${rqStatus}&type=hospital&search=${search}`);
            if (response.success) {
                setMedicineRequest(response.data)
                setTotalPage(response.pagination?.totalPages)
                setLoading(false)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        } finally {
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchSchedules()
    },[])
    useEffect(() => {
        fetchInventory()
        fetchMedicineRequest()
    }, [userId,schedule])
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await securePostData('pharmacy/medicine-request', formData)
            if (response.success) {
                setFormData({
                    hospitalId: userId,
                    medicineId: null,
                    quantity: null,
                    message: ''
                })
                fetchMedicineRequest()
                toast.success("Medicine request sent to the admin")
            } else {
                toast.error(response.message)
            }
        } catch (error) {

        }
    }
    const downloadMedicineRequests = () => {

        if (!medicineRequest || medicineRequest.length === 0) {
            alert("No requests to download");
            return;
        }

        const data = medicineRequest.map((item, index) => ({
            "S.No": index + 1,
            "Medicine Name": item?.medicineName || "-",
            "Date": item?.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                })
                : "-",
            "Description": item?.message || "-",
            "Stock": item?.quantity || 0,
            "Status": item?.status || "-"
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Medicine Requests");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const fileData = new Blob([excelBuffer], {
            type: "application/octet-stream"
        });

        saveAs(fileData, "Medicine_Requests.xlsx");
    };
    useEffect(()=>{
        const quantity=medicineList.find(item=>item?._id==formData?.medicineId)?.quantity || 0
        setFormData({...formData,quantity})
    },[formData.medicineId])
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row ">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">H1 Medicine Request</h3>
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
                                                H1 Medicine Request
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>

                            <div className="add-nw-bx">
                                <a href="javascript:void(0)" className="add-nw-btn nw-thm-btn" data-bs-toggle="modal" data-bs-target="#add-Request">
                                    Send Request
                                </a>
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
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="form-control  search-table-frm pe-5"
                                                id="email"
                                                placeholder="Search"
                                                required
                                            />
                                            <div className="adm-search-bx">
                                                <button className="text-secondary" onClick={fetchMedicineRequest}>
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
                                                    <a href="#" className="fz-16 clear-btn" onClick={() => {
                                                        setStatus("")
                                                        fetchMedicineRequest("")
                                                    }}>Reset</a>
                                                </div>

                                                <div className="p-3">
                                                    <ul className="filtring-list mb-3" onClick={(e) => e.stopPropagation()}>
                                                        <h6>Status</h6>
                                                        {["Pending", "Approved", "Rejected"].map((item) => (
                                                            <li key={item}>
                                                                <div className="form-check new-custom-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="status"
                                                                        id={item}
                                                                        checked={status === item}
                                                                        onChange={(e) => setStatus(e.target.checked ?item:'')}
                                                                    />
                                                                    <label className="form-check-label" htmlFor={item}>
                                                                        {item}
                                                                    </label>
                                                                </div>
                                                            </li>
                                                        ))}

                                                    </ul>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-top">
                                                    <a href="javascript:void(0)" className="thm-btn thm-outline-btn rounded-4 px-4 py-2 outline"> Cancel</a>
                                                    <a href="javascript:void(0)" className="thm-btn rounded-4 px-4 py-2" onClick={fetchMedicineRequest}> Apply</a>
                                                </div>

                                            </div>
                                        </div>


                                        <div>
                                            <button className="nw-filtr-btn" onClick={downloadMedicineRequests}><FontAwesomeIcon icon={faDownload} /></button>
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
                                                    <th>S.no.</th>
                                                    <th>Medicine Name</th>
                                                    <th>Date</th>
                                                    <th>Description</th>
                                                    <th>Stock</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {medicineRequest?.length > 0 ?
                                                    medicineRequest?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{key + 1}</td>
                                                            <td>
                                                                {item?.medicineName}
                                                            </td>
                                                            <td>
                                                                {item?.createdAt ? new Date(item?.createdAt)?.toLocaleDateString('en-GB', {
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                }) : '-'}
                                                            </td>
                                                            <td>{item?.message}</td>
                                                            <td>
                                                                {item?.quantity}
                                                            </td>
                                                            <td>
                                                                {item?.status == "Approved" && <span className="paid-title"> Approved</span>}
                                                                {item?.status == "Pending" && <span className="pending-title">  Pending</span>}
                                                                {item?.status == "Rejected" && <span className="reject-title">  Rejected</span>}
                                                            </td>
                                                        </tr>) :
                                                    <span className="text-black">No request found</span>}


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


            {/*Add Medicine Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#medicine-Request" */}
            <div className="modal step-modal" id="add-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content rounded-5">
                        <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3">
                            <div>
                                <h6 className="lg_title mb-0">Send  H1 Medicine Request</h6>
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
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div class="custom-frm-bx">
                                            <label>Select Medicine </label>
                                            <div class="select-wrapper">
                                                <select class="form-select custom-select" name="medicineId"
                                                    value={formData?.medicineId}
                                                    onChange={handleChange}>
                                                    <option>Select Medicine </option>
                                                    {medicineList?.length > 0 &&
                                                        medicineList?.map((item, key) =>
                                                            <option value={item?._id}>{item?.medicineName} </option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Quantity</label>
                                            <input type="number"
                                                value={formData?.quantity} 
                                                readOnly
                                                
                                                name="quantity"
                                                className="form-control nw-frm-select " placeholder="Enter Quantity" />
                                        </div>
                                    </div>

                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Message</label>
                                            <textarea id=""
                                                value={formData?.message}
                                                onChange={handleChange}
                                                name="message"
                                                className="form-control nw-frm-select "></textarea>
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="text-center mt-4">
                                            <button type="submit"
                                                data-bs-dismiss="modal"
                                                className="nw-thm-btn rounded-2 w-75" >Send Request</button>
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

export default MedicineRequest