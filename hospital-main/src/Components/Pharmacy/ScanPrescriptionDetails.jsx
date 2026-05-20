import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload, faPrint } from "@fortawesome/free-solid-svg-icons";
import { BsCapsule } from "react-icons/bs";
import { toast } from "react-toastify";
import { getSecureApiData } from "../../Service/api";
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import base_url from "../../baseUrl";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import API from "../../api/api";

function ScanPrescriptionDetails() {
    const params = useParams();
    const sellId = params.id;
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    const [loading,setLoading]=useState(false)
    const [prescriptionData, setPrescriptionData] = useState()
    const [sellData, setSellData] = useState({});
    const [note, setNote] = useState('')
    const [hospitalBasic, setHospitalBasic] = useState()
    async function fetchSellDetails() {
        try {
            const response = await getSecureApiData(`pharmacy/sell-data/${sellId}`);
            if (response.success) {
                setSellData(response.sell)
                setNote(response.sell.note)
            } else {
                toast.error("Failed to fetch sell details");
            }

        } catch (error) {
            console.error("Error fetching sell details:", error);
        }
    }
async function fetchPrescriptionDetails(id) {
        setLoading(true)
        try {
            const response = await getSecureApiData(`appointment/prescription-data/${id}`);
            if (response.success) {
                setPrescriptionData(response.data)
            } else {
                toast.error(response?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (sellData && sellData?.prescriptionId) {
            fetchPrescriptionDetails(sellData?.prescriptionId)
        }
    }, [sellData])
    useEffect(() => {
        fetchSellDetails();
        loadProfile()
    }, [sellId]);
    const invoiceRef = useRef()
    const handleDownload = () => {
        const element = invoiceRef.current;
        document.body.classList.add("hide-buttons");
        const opt = {
            margin: 0.5,
            filename: "invoice.pdf",
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
        };

        html2pdf().from(element).set(opt).save().then(() => {
            document.body.classList.remove("hide-buttons");
        });
    };
    const subtotal = sellData?.products
        ?.reduce((acc, item) => acc + Number(item?.totalAmount || 0), 0) || 0;
    const gst = subtotal * 0.05;
    const total = subtotal;

    async function loadProfile() {
        try {
            const res = await API.get("/hospital/get-hospital-profile");
            setHospitalBasic(res.data.profile?.basic);
        } catch (err) {
            console.log("Profile Load Error:", err);
        }
    }
    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between mega-content-bx">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Prescription Details</h3>
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
                                            Prescription Details
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>


                    </div>
                </div>


                <div className='new-panel-card'>
                    <div className="row">
                        {(sellData?.prescriptionFile || sellData?.prescriptionId) &&<div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                                {sellData?.prescriptionFile &&
                                    <div className="view-report-card ">
                                        <img src={`${base_url}/${sellData?.prescriptionFile}`} className="w-100 rounded-3" />
                                    </div>}
                                    {sellData?.prescriptionId && 
                                    <div className="view-report-card">
                                        <div className="">
                                            <div className="view-report-header d-flex align-items-center justify-content-between">
                                                <div>
                                                    <h5>RX-{prescriptionData?.customId}</h5>
                                                    <h6>Date: {new Date(prescriptionData?.createdAt)?.toLocaleDateString('en-GB')}</h6>
                                                </div>

                                                <div className="admin-table-bx">
                                                    <div className="">
                                                        <div className="admin-table-sub-details d-flex align-items-center gap-2">
                                                            <img src={prescriptionData?.doctorId?.doctorId?.profileImage ?
                                                                `${base_url}/${prescriptionData?.doctorId?.doctorId?.profileImage}` : "/doctor-avatr.png"} alt="" style={{ border: "5px solid #fff" }} />
                                                            <div className="">
                                                                <h6 className="fw-700 fz-14" style={{ color: "#00B4B5" }}>{prescriptionData?.doctorId?.name} </h6>
                                                                <p>{prescriptionData?.doctorId?.nh12}</p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>



                                        </div>

                                        <div className="view-report-content">
                                            <div className="sub-content-title">
                                                <h4>RX.</h4>
                                                <h3><BsCapsule style={{ color: "#00B4B5" }} /> Medications</h3>
                                            </div>

                                            {prescriptionData?.medications?.map((item, key) =>
                                                <div className="view-medications-bx mb-3" key={key}>
                                                    <h5>{key + 1}. {item?.name}</h5>
                                                    <ul className="viwe-medication-list">
                                                        <li className="viwe-medication-item">Refills: {item?.refills} </li>
                                                        <li className="viwe-medication-item">Frequency: {item?.frequency} </li>
                                                        <li className="viwe-medication-item">Duration: {item?.duration}</li>
                                                        <li className="viwe-medication-item">Instructions: {item?.instructions}</li>

                                                    </ul>
                                                </div>)}



                                            <div className="diagnosis-bx mb-3">
                                                <h5>Diagnosis</h5>
                                                <p>{prescriptionData?.diagnosis}</p>
                                            </div>

                                            {prescriptionData?.note && <div className="diagnosis-bx mb-3">
                                                <h5>Note</h5>
                                                <p>{prescriptionData?.note}</p>
                                            </div>}


                                        </div>

                                    </div>}


                            </div>}

                        <div className="col-lg-6">
                            <div className="" ref={invoiceRef}>
                                <div className="">
                                    <div className="new-invoice-card">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div>
                                                <h5 className="no-print first_para fw-700 fz-20 mb-0">Generate Bill</h5>
                                            </div>
                                            <div className="d-flex align-items-center gap-2 flex-wrap">

                                                <button className="no-print print-btn " onClick={handleDownload}> <FontAwesomeIcon icon={faDownload} /> Download Bill</button>
                                                {/* <button className="no-print print-btn"> <FontAwesomeIcon icon={faPrint} /> Print</button> */}
                                            </div>
                                        </div>

                                        <div className="laboratory-header mb-4">
                                            <div className="laboratory-name">
                                                <h5>{user?.name || 'World Pharmacy'}</h5>
                                                <p><span className="laboratory-title">GSTIN : </span> {hospitalBasic?.gstNumber || '09897886454'}</p>
                                                <p><span className="laboratory-title">Bank : </span> {sellData?.paymentInfoId?.bankName }</p>
                                                    <p><span className="laboratory-title">Account Number : </span> {sellData?.paymentInfoId?.accountNumber }</p>
                                                    <p><span className="laboratory-invoice">Account Holder Name :</span> {sellData?.paymentInfoId?.accountHolderName}</p>
                                            </div>
                                            <div className="invoice-details">
                                                <p><span className="laboratory-invoice">Invoice :</span> {sellData?._id?.slice(-10)}</p>
                                                <p><span className="laboratory-invoice">Date :</span> {new Date().toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}</p>
                                                <p><span className="laboratory-invoice">IFSC :</span> {sellData?.paymentInfoId?.ifscCode}</p>
                                                    <p><span className="laboratory-invoice">QR :</span> <img width={100} height={100} src={`${base_url}/${sellData?.paymentInfoId?.qr}`} alt="" srcset="" /></p>
                                            </div>
                                        </div>

                                        <div className="nw-laboratory-bill-crd">
                                            <div className="nw-laboratory-bill-bx">
                                                <h6>Bill To</h6>
                                                <h4>{sellData?.patientId?.name}</h4>
                                                <p><span className="laboratory-phne">Phone :</span> {sellData?.patientId?.patientId?.contactNumber}</p>
                                            </div>
                                            <div className="nw-laboratory-bill-bx">
                                                <h6>Order</h6>
                                                <h4>{sellData?.patientId?.name}</h4>
                                                <p><span className="laboratory-phne">Phone :</span> {sellData?.patientId?.patientId?.contactNumber}</p>
                                            </div>
                                        </div>

                                        <div className="laboratory-report-bx">
                                            <ul className="laboratory-report-list">
                                                    <li className="laboratory-item"><span className="price-title">Medicine</span>
                                                        <span className="price-title">Quantity</span> <span className="price-title">Rate</span>
                                                        <span className="price-title">Discount</span><span className="price-title">Value</span></li>
                                                    {sellData?.products?.map((item, index) =>
                                                        <li className="laboratory-item border-0">
                                                            <span>{item?.medicineName}</span><span>{item?.quantity}</span><span className="price-title">₹ {item?.rate}</span>
                                                            <span>{item?.discountType ? `${item?.discountType} ${item?.discountValue}` : '-'}</span> <span className="price-title">₹ {item?.totalAmount}</span></li>)}
                                                </ul>

                                            <div className="lab-amount-bx">
                                                <ul className="lab-amount-list">
                                                    {/* <li className="lab-amount-item">Subtotal : <span className="price-title">{subtotal?.toFixed(2)}</span></li>
                                                    <li className="lab-amount-item lab-divider">GST (5%) :  <span className="price-title">{gst?.toFixed(2)}</span></li> */}
                                                    <li className="lab-amount-item">Total :  <span className="price-title">₹ {total?.toFixed(2)}</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="custom-frm-bx mt-3">
                                <label htmlFor="">Note</label>
                                <textarea name="" value={note} onChange={(e) => setNote(e.target.value)} id="" className="form-control nw-frm-select"></textarea>
                            </div> */}
                        </div>


                        {/* <div className="mt-3 text-end border-top pt-3">
                            <div>
                                <button className="nw-thm-btn rounded-3">Submit</button>
                            </div>
                        </div> */}
                    </div>

                </div>
                <div className="text-end">
                    <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                </div>
            </div>




        </>
    )
}

export default ScanPrescriptionDetails