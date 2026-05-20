import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faCheck, faCircleXmark, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons"
import { TbGridDots } from "react-icons/tb";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getSecureApiData, securePostData, updateApiData } from "../../Services/api";
import { useEffect, useState } from "react";
import { formatDateTime } from "../../Services/globalFunction";
import base_url from "../../baseUrl";
import Loader from "../../Loader/Loader";
import { toast } from "react-toastify";
import DoctorAppointmentBilling from "./DoctorAppointmentBilling";
import { useSelector } from "react-redux";
import DoctorAptBookingReceipt from "./BookingReceipt";

function DoctorAppointmentsList() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId')
    const [appointmentRequest, setAppintmentRequest] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState([])
    const [activeApt, setActiveApt] = useState(null)
    const [pdfLoading, setPdfLoading] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const { paymentInfo, profiles } = useSelector((state) => state.doctor)

    async function getAppointmentData() {
        setLoading(true)
        try {
            const result = await getSecureApiData(`appointment/doctor/${userId}?page=${currentPage}&search=${search}&startDate=${startDate}&endDate=${endDate}&statuses=${status}&limit=10`)
            if (result.success) {
                setAppintmentRequest(result.data)
                setTotalPages(result.pagination.totalPages)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userId) {
            getAppointmentData()
        }
    }, [userId, currentPage])
    const handleStatusChange = (value) => {
        setStatus((prev) =>
            prev.includes(value)
                ? prev.filter((s) => s !== value)
                : [...prev, value]
        );
    };
    const handleReset = () => {
        setStatus['']
        setStartDate(null)
        setEndDate(null)
        getAppointmentData()
    }
    const appointmentAction = async (id, status) => {
        const data = { doctorId: userId, appointmentId: id, status }
        setLoading(true)
        try {
            const response = await updateApiData(`appointment/doctor-action`, data);
            if (response.success) {
                getAppointmentData()
                // setCurrentPage(response.pagination.page)
                // setTotalPage(response.pagination.totalPages)
                getDashboardData()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }
    const startChatWithUser = async (user) => {
        // create or get conversation
        sessionStorage.setItem('chatUser', JSON.stringify(user))
        navigate('/chat')
    };
    const startCallWithUser = async (user) => {
        // create or get conversation
        sessionStorage.setItem('videoCall', "true")
        sessionStorage.setItem('chatUser', JSON.stringify(user))
        navigate('/chat')
    };
    const [aptPaymentForm, setAptPaymentForm] = useState({
        appointmentId: "", discountType: "", discountValue: "",
        totalAmount: 0, subTotal: 0, paymentType: ""
    })
    const [isDiscount, setIsDiscount] = useState(false)
    const [discountType, setDiscountType] = useState("")
    const [discountValue, setDiscountValue] = useState(0)
    const totalAmount = aptPaymentForm.totalAmount

    let finalAmount = totalAmount

    if (isDiscount && discountValue) {
        if (discountType === "Fixed") {
            finalAmount = totalAmount - discountValue
        } else if (discountType === "Percentage") {
            finalAmount = totalAmount - (totalAmount * discountValue) / 100
        }
    }
    const paymentSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            ...aptPaymentForm,
            discountType: isDiscount ? discountType : "",
            discountValue: isDiscount ? discountValue : 0,
            totalAmount: finalAmount
        }
        setIsSaving(true)
        try {
            const res = await securePostData('doctor/appointment-payment', payload)
            if (res.success) {
                toast.success(res.message)
                document.getElementById("closeModal").click()
                setAptPaymentForm({
                    appointmentId: "",
                    discountType: "",
                    discountValue: "",
                    totalAmount: 0,
                    subTotal: 0,
                    paymentMethod: ""
                })
                setDiscountType("")
                setDiscountValue(0)
                setIsDiscount(false)
                getAppointmentData()
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            setIsSaving(false)
        }
    }
    const [vitalsData, setVitalsData] = useState({
        height: "", weight: "", bloodPressure: "", pulse: "",
        temperature: "", respiratoryRate: "", oxygenSaturation: "", bloodSugar: "",
        bmi: "", painLevel: "", vision: "", hearing: "", other: "",
    })
    const vitalChange = (e) => {
        setVitalsData({ ...vitalsData, [e.target.name]: e.target.value })
    }
    const vitalSubmit = async (e) => {
        e.preventDefault()
        const data = { ...vitalsData, appointmentId: activeApt?._id }
        setLoading(true)
        try {
            const res = await securePostData('doctor/add-patient-vitals', data)
            if (res.success) {
                toast.success(res.message)
                setVitalsData(null)
                getAppointmentData()
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            
            setLoading(false)
        }
    }

    return (
        <>
            {loading ? <Loader />
                :
                <div className="profile-right-card">
                    <div className="profile-tp-header">
                        <h5 className="heading-grad fz-24 mb-0">Appointments</h5>
                    </div>
                    <div className="all-profile-data-bx">
                        <div className="row">
                            <div className="d-flex align-items-center justify-content-between mb-3 gap-2 ">
                                <div className="d-flex align-items-center gap-2 doctor-mobile">
                                    <div className="custom-frm-bx mb-0">
                                        <input
                                            type="email"
                                            className="form-control admin-table-search-frm  pe-5"
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
                                    <div className="dropdown">
                                        <a href="#" className="nw-filtr-btn" id="acticonMenus" data-bs-toggle="dropdown"
                                            aria-expanded="false">
                                            <FontAwesomeIcon icon={faFilter} />
                                        </a>

                                        <div className="dropdown-menu dropdown-menu-end user-dropdown nw-drop-action-menu"
                                            aria-labelledby="acticonMenus">

                                            <div
                                                className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-bottom">
                                                <h6 className="mb-0 fz-18">Filter</h6>
                                                <button onClick={handleReset} className="fz-16 clear-btn">Reset</button>
                                            </div>

                                            <div className="p-3">
                                                <ul className="filtring-list">
                                                    <h6>Status</h6>

                                                    {["pending", "completed", "canceled"].map((item) => (
                                                        <li key={item}>
                                                            <div className="accordion-body-concet">
                                                                <input
                                                                    className="form-check-input mt-0"
                                                                    type="checkbox"
                                                                    id={item}
                                                                    checked={status.includes(item)}
                                                                    onChange={() => handleStatusChange(item)}
                                                                />
                                                                <label htmlFor={item} onClick={(e) => e.stopPropagation()}>
                                                                    {item.charAt(0).toUpperCase() + item.slice(1)}

                                                                </label>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <div className="mt-3 filtring-list">
                                                    <div className="row">
                                                        <h6>Date Range</h6>
                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <input
                                                                    type="date"
                                                                    className="form-control admin-table-search-frm"
                                                                    value={startDate || ""}
                                                                    onChange={(e) => setStartDate(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <input
                                                                    type="date"
                                                                    className="form-control admin-table-search-frm"
                                                                    value={endDate || ""}
                                                                    onChange={(e) => setEndDate(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-top">
                                                <button className="thm-btn thm-outline-btn rounded-4 px-4 py-2 outline"> Cancel</button>
                                                <button onClick={() => getAppointmentData()} className="thm-btn rounded-4 px-4 py-2"> Apply</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {totalPages > 1 && <div className="page-selector">
                                    <div className="filters">
                                        <select className="form-select custom-page-dropdown nw-custom-page "
                                            value={currentPage}
                                            onChange={(e) => setCurrentPage(e.target.value)}>
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>}
                            </div>
                        </div>

                        <div className="row ">
                            <div className="col-lg-12">
                                <div className="table-section">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0 ">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Appointment  Id</th>
                                                    <th>Patient Details</th>
                                                    <th>Appointment  Date</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {appointmentRequest?.length > 0 ?
                                                    appointmentRequest?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{(currentPage - 1) * 10 + key + 1}.</td>
                                                            <td> #{item?.customId}</td>
                                                            <td>
                                                                <div className="admin-table-bx">
                                                                    <div className="admin-table-sub-details d-flex align-items-center gap-2">
                                                                        <img src={item?.patientId?.patientId?.profileImage ?
                                                                            `${base_url}/${item?.patientId?.patientId?.profileImage}` : "/profile.png"} alt="" />
                                                                        <div>
                                                                            <h6 className="">{item?.patientId?.name}</h6>
                                                                            <p>{item?.patientId?.nh12}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>{formatDateTime(item?.date)}</td>
                                                            <td>
                                                                {item?.status == "pending" && <span className="pending-data">Pending </span>}
                                                                {item?.status == "cancel" &&
                                                                    <span className="danger-title">Cancel appointment</span>
                                                                }
                                                                {item?.status == "rejected" &&
                                                                    <span className="danger-title">Rejected appointment</span>
                                                                }
                                                                {item?.status == 'completed' && <span className="complete-data">Completed </span>}
                                                                {(item?.status !== 'completed' && item?.status !== "rejected" && item?.status !== "cancel" && item?.status !== "pending")
                                                                    && <span className="complete-data text-capitalize">{item?.status} </span>}
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
                                                                                <NavLink to={`/detail-view/${item?.patientId?.name}/${item?._id}`} className="prescription-nav" href="#" >
                                                                                    View Details
                                                                                </NavLink>
                                                                            </li>
                                                                            <li className="prescription-item">
                                                                                <NavLink onClick={() => startChatWithUser(item)} className="prescription-nav" >
                                                                                    Chat Now
                                                                                </NavLink>
                                                                            </li>
                                                                            <li className="prescription-item">
                                                                                <NavLink onClick={() => startCallWithUser(item)} className="prescription-nav" href="#" >
                                                                                    Video Call
                                                                                </NavLink>
                                                                            </li>
                                                                            {(item?.status !== 'completed' && item?.status !== 'cancel') && <li className="prescription-item">
                                                                                <button className="prescription-nav" onClick={() => appointmentAction(item?._id, 'completed')} >
                                                                                    <span className="accept-title "><FontAwesomeIcon icon={faCheck} />  Mark as in Complete</span>
                                                                                </button>
                                                                            </li>}
                                                                            {item?.status == 'pending' && <li className="prescription-item">
                                                                                <button className="prescription-nav" onClick={() => appointmentAction(item?._id, 'rejected')} >
                                                                                    <span className="danger-title">Cancel appointment</span>
                                                                                </button>
                                                                            </li>}
                                                                            {item?.status == 'approved' && <li className="prescription-item">
                                                                                <button className="prescription-nav w-100" onClick={() => {
                                                                                    setActiveApt(item)
                                                                                    if (item?.vitals && Object.keys(item?.vitals)?.length > 0) {
                                                                                        setVitalsData(item?.vitals)
                                                                                    }
                                                                                }}
                                                                                    data-bs-toggle="modal"
                                                                                    data-bs-target="#apt-Vitals" >
                                                                                    Vitals
                                                                                </button>
                                                                            </li>}
                                                                            {(item?.status == "approved" || item?.status == "completed") && !item?.invoiceId && <li className="prescription-item">
                                                                                <button className=" prescription-nav w-100"
                                                                                    onClick={() => {
                                                                                        setActiveApt(item)

                                                                                        setAptPaymentForm(prev => ({
                                                                                            ...prev,
                                                                                            appointmentId: item?._id,
                                                                                            totalAmount: item?.fees,
                                                                                            subTotal: item?.fees
                                                                                        }))
                                                                                    }}
                                                                                    data-bs-toggle="modal"
                                                                                    data-bs-target="#apt-Payment">
                                                                                    Payment
                                                                                </button>
                                                                            </li>}
                                                                            {item?.invoiceId &&
                                                                                <li className="prescription-item">
                                                                                    <button className=" prescription-nav w-100"
                                                                                        onClick={() => {
                                                                                            // navigate(`/doctor-billing/${item?._id}`)
                                                                                            setActiveApt(item)
                                                                                            setPdfLoading(true)
                                                                                        }}>
                                                                                        Download Invoice
                                                                                    </button>
                                                                                </li>}
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>) : (
                                                        <tr>
                                                            <td colSpan="5" className="text-center py-4 fw-600">
                                                                No appointment request
                                                            </td>
                                                        </tr>
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal step-modal fade" id="apt-Payment" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                            aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-md">
                                <div className="modal-content rounded-0">
                                    <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                                        <div>
                                            <h6 className="heading-grad fz-24">Payment Add</h6>
                                        </div>
                                        <div>

                                            <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                                                <FontAwesomeIcon icon={faCircleXmark} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="modal-body pb-5 px-4 pb-5">
                                        <form onSubmit={paymentSubmit} className="row justify-content-center">
                                            {/* <div className="col-lg-12">
                                                <div className="laboratory-report-bx">
                                                    <ul className="laboratory-report-list">
                                                        {paymentInfo && <>
                                                            <li className="laboratory-item border-0">Bank Name  <span className="laboratory-title">{paymentInfo?.bankName}</span></li>
                                                            <li className="laboratory-item border-0">Account Number  <span className="laboratory-title">{paymentInfo?.accountNumber}</span></li>
                                                            <li className="laboratory-item border-0">Account Holder Name  <span className="laboratory-title">{paymentInfo?.accountHolderName}</span></li>
                                                            <li className="laboratory-item border-0">Branch Name  <span className="laboratory-title">{paymentInfo?.branch}</span></li>
                                                            <li className="laboratory-item border-0">IFSC Code <span className="laboratory-title">{paymentInfo?.ifscCode}</span></li>
                                                            {paymentInfo?.qr && <li className="laboratory-item border-0">Qr  <span className="laboratory-title"><img src={`${base_url}/${paymentInfo?.qr}`} alt="" srcset="" /></span></li>}
                                                        </>}
                                                    </ul>
                                                </div>
                                            </div> */}
                                            <div className="my-3">
                                                <h5 className="add-contact-title text-black mb-3">Appointment Payment</h5>


                                                <div className="education-frm-bx mb-3 py-2 bg-transparent" >
                                                    <div action="">
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                                <div className="custom-frm-bx">
                                                                    <label htmlFor="">Doctor Name</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control nw-frm-select"
                                                                        placeholder="Enter Service name"
                                                                        value={profiles?.name}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                                <div className="return-box">
                                                                    <div className="custom-frm-bx flex-column flex-grow-1">
                                                                        <label htmlFor="">Doctor Fees</label>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control nw-frm-select"
                                                                            placeholder="Enter amount"
                                                                            value={activeApt?.fees}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>




                                            <div className="col-lg-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Payment Method</label>
                                                    <div class="select-wrapper">
                                                        <select value={aptPaymentForm?.paymentMethod} onChange={(e) => setAptPaymentForm({ ...aptPaymentForm, paymentMethod: e.target.value })} class="form-select custom-select" required>
                                                            <option value={''}> Select</option>
                                                            <option value={'CASH'}> Cash</option>
                                                            <option value={'CARD'}>Card</option>
                                                            <option value={'ONLINE'}>Online</option>
                                                        </select>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-between'>
                                                <label htmlFor="">Discount</label>
                                                <div className="switch">
                                                    <input
                                                        type="checkbox"
                                                        id="toggle8"
                                                        checked={isDiscount}
                                                        onChange={() => setIsDiscount(prev => !prev)}
                                                    />
                                                    <label htmlFor="toggle8">
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="laboratory-report-bx">
                                                <ul className="laboratory-report-list">
                                                    <li className="laboratory-item border-0">Sub Total <span className="laboratory-title">₹ {totalAmount}</span></li>
                                                    {isDiscount &&
                                                        <>
                                                            <li className="laboratory-item border-0">Discount Type <span className="laboratory-title">
                                                                <div className="custom-frm-bx">

                                                                    <select className='form-select' value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                                                                        <option value="" selected>Select</option>
                                                                        <option value="Fixed">Fixed</option>
                                                                        <option value="Percentage">Percentage</option>
                                                                    </select>
                                                                </div>
                                                            </span></li>
                                                            <li className="laboratory-item border-0">Discount Value <span className="laboratory-title">
                                                                <div className="custom-frm-bx">

                                                                    <input type='number' value={discountValue} className='form-control' onChange={(e) => setDiscountValue(e.target.value)} />
                                                                </div>
                                                            </span></li>
                                                        </>}
                                                    <li className="laboratory-item border-0">Total Amount <span className="laboratory-title">₹ {finalAmount}</span></li>
                                                </ul>
                                            </div>

                                            <div className="d-flex gap-3 justify-content-end">
                                                <button className="nw-thm-btn outline" type='button' id='closeModal' data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                                                <button className="nw-thm-btn w-auto" type='submit' disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'} Payment</button>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-none">
                            {activeApt && <DoctorAptBookingReceipt paymentId={activeApt?.invoiceId}
                                endLoading={() => setPdfLoading(false)}
                                pdfLoading={pdfLoading} />}
                        </div>
                        <div className="modal step-modal fade" id="apt-Vitals" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                            aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content rounded-0">
                                    <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                                        <div>
                                            <h6 className="heading-grad fz-24">Vitals</h6>
                                        </div>
                                        <div>

                                            <button type="button" className="" id="closeVital" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                                                <FontAwesomeIcon icon={faCircleXmark} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="modal-body pb-5 px-4 pb-5">
                                        <form onSubmit={vitalSubmit} className="row justify-content-center">

                                            <div className="my-3">
                                                <div className="row">

                                                    <div className="col-lg-4">
                                                        <label>Height (cm)</label>
                                                        <input type="number" name="height" value={vitalsData?.height} onChange={vitalChange} className="form-control" />
                                                    </div>

                                                    <div className="col-lg-4">
                                                        <label>Weight (kg)</label>
                                                        <input type="number" name="weight" value={vitalsData?.weight} onChange={vitalChange} className="form-control" />
                                                    </div>

                                                    <div className="col-lg-4">
                                                        <label>Blood Pressure</label>
                                                        <input type="text" name="bloodPressure" value={vitalsData?.bloodPressure} onChange={vitalChange} className="form-control" />
                                                    </div>

                                                    <div className="col-lg-4 mt-2">
                                                        <label>Pulse</label>
                                                        <input type="number" name="pulse" value={vitalsData?.pulse} onChange={vitalChange} className="form-control" />
                                                    </div>

                                                    <div className="col-lg-4 mt-2">
                                                        <label>Temperature (°F)</label>
                                                        <input type="number" name="temperature" value={vitalsData?.temperature} onChange={vitalChange} className="form-control" />
                                                    </div>

                                                    <div className="col-lg-4 mt-2">
                                                        <label>Respiratory Rate</label>
                                                        <input type="number" name="respiratoryRate" value={vitalsData?.respiratoryRate} onChange={vitalChange} className="form-control" />
                                                    </div>

                                                    <div className="col-lg-4 mt-2">
                                                        <label>Oxygen Saturation (%)</label>
                                                        <input type="number" name="oxygenSaturation" value={vitalsData?.oxygenSaturation} onChange={vitalChange} className="form-control" />
                                                    </div>

                                                    <div className="col-lg-4 mt-2">
                                                        <label>Blood Sugar</label>
                                                        <input type="number" name="bloodSugar" value={vitalsData?.bloodSugar} onChange={vitalChange} className="form-control" />
                                                    </div>

                                                    <div className="col-lg-4 mt-2">
                                                        <label>BMI</label>
                                                        <input type="number" name="bmi" value={vitalsData?.bmi} onChange={vitalChange} className="form-control" />
                                                    </div>

                                                    <div className="col-lg-4 mt-2">
                                                        <label>Pain Level (1-10)</label>
                                                        <input type="number" name="painLevel" value={vitalsData?.painLevel} onChange={vitalChange} className="form-control" />
                                                    </div>

                                                    <div className="col-lg-4 mt-2">
                                                        <label>Vision</label>
                                                        <input type="text" name="vision" value={vitalsData?.vision} onChange={vitalChange} className="form-control" />
                                                    </div>

                                                    <div className="col-lg-4 mt-2">
                                                        <label>Hearing</label>
                                                        <input type="text" name="hearing" value={vitalsData?.hearing} onChange={vitalChange} className="form-control" />
                                                    </div>

                                                    <div className="col-lg-12 mt-2">
                                                        <label>Other Notes</label>
                                                        <textarea name="other" value={vitalsData?.other} onChange={vitalChange} className="form-control" />
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="d-flex gap-3 justify-content-end">
                                                <button className="nw-thm-btn outline" type='button' id='closeModal' data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                                                {Object.keys(activeApt?.vitals || {}).length === 0 && (
                                                    <button
                                                        className="nw-thm-btn w-auto"
                                                        type='submit'
                                                        data-bs-dismiss="modal"
                                                        disabled={isSaving}
                                                    >
                                                        {isSaving ? 'Saving...' : 'Save'}
                                                    </button>
                                                )}
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <div className="text-end mt-4">
                <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
            </div>

        </>
    )
}

export default DoctorAppointmentsList