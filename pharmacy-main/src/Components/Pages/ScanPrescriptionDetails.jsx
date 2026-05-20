import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload, faPrint } from "@fortawesome/free-solid-svg-icons";
import { BsCapsule } from "react-icons/bs";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getSecureApiData } from "../../Services/api";
import base_url from "../../baseUrl";
import html2canvas from "html2canvas"
import html2pdf from "html2pdf.js";
import Loader from "../Layouts/Loader";

function ScanPrescriptionDetails() {
    const params = useParams();
    const sellId = params.id;
    const [sellData, setSellData] = useState({});
    const [prescriptionData, setPrescriptionData] = useState()
    const [loading, setLoading] = useState(false)
    const navigate=useNavigate()
    const { profiles, pharPerson, pharAddress, pharImg,
        rating, avgRating, pharLicense, isRequest } = useSelector(state => state.user)
    async function fetchSellDetails() {
        setLoading(true)
        try {
            const response = await getSecureApiData(`pharmacy/sell-data/${sellId}`);
            if (response.success) {
                setSellData(response.sell)
            } else {
                toast.error(response.message);
                if(response.message=="Permission denied"){
                    navigate(-1)
                }
            }

        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false)
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
    }, [sellId]);
    const invoiceRef = useRef()
    
    const handleDownload = () => {
        const element = invoiceRef.current;
        document.body.classList.add("hide-buttons");

        const opt = {
            margin: 0.5,
            filename: "invoice.pdf",
            html2canvas: { scale: 2 , useCORS: true },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
        };

        html2pdf().from(element).set(opt).save().then(() => {
            document.body.classList.remove("hide-buttons");
        });
    };

    const subtotal = sellData?.products
        ?.reduce((acc, item) => acc + Number(item?.totalAmount || 0), 0) || 0;
    const gst = subtotal * 0.05;
    const total = subtotal ;


    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row mb-2">
                        <div className="d-flex align-items-center justify-content-between mega-content-bx">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Prescription Details</h3>
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
                                                Prescription Details
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>


                        </div>
                    </div>


                    <div className='new-mega-card'>
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
                            <div className="col-lg-6 col-md-12 col-sm-12">                                
                                <div  ref={invoiceRef}>
                                    <div className="new-invoice-card mobile-prescription">
                                            <div className="d-flex align-items-center justify-content-between mb-3 pharmacy-bill">
                                                <div className="mobile-title">
                                                    <h5 className="no-print first_para fw-700 fz-20 mb-0">Generate Bill</h5>
                                                </div>
                                                <div className="d-flex align-items-center gap-2 flex-wrap mobile-print">
                                                    <button className="no-print print-btn " onClick={handleDownload}> <FontAwesomeIcon icon={faDownload} /> Download Bill</button>
                                                    {/* <button className="no-print print-btn"> <FontAwesomeIcon icon={faPrint} /> Print</button> */}
                                                </div>
                                            </div>

                                            <div className="laboratory-header align-items-start mb-3">
                                                <div className="laboratory-name">
                                                    <h5>{profiles?.name || 'World Pharmacy'}</h5>
                                                    <p><span className="laboratory-title">GSTIN : </span> {profiles?.gstNumber}</p>
                                                    <p><span className="laboratory-title">Bank : </span> {sellData?.paymentInfoId?.bankName }</p>
                                                    <p><span className="laboratory-title">Account Number : </span> {sellData?.paymentInfoId?.accountNumber }</p>
                                                    <p><span className="laboratory-invoice laboratory-title">Account Holder Name :</span> {sellData?.paymentInfoId?.accountHolderName}</p>
                                                </div>
                                                <div className="invoice-details">
                                                    <p><span className="laboratory-invoice">Invoice :</span> {sellData?._id?.slice(-10)}</p>
                                                    <p><span className="laboratory-invoice">Date :</span> {new Date().toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}</p>
                                                    <p><span className="laboratory-invoice">IFSC :</span> {sellData?.paymentInfoId?.ifscCode}</p>
                                                    <p className="mb-0"><span className="laboratory-invoice">QR :</span> <img width={100} height={100} src={`${base_url}/${sellData?.paymentInfoId?.qr}`} alt="" srcset="" crossOrigin="anonymous"/></p>
                                                </div>
                                            </div>

                                            <div className="nw-laboratory-bill-crd">
                                                <div className="nw-laboratory-bill-bx h-100">
                                                    <h6>Bill To</h6>
                                                    <h4>{sellData?.patientId?.name}</h4>
                                                    <p><span className="laboratory-phne">Phone :</span> {sellData?.patientId?.patientId?.contactNumber}</p>
                                                </div>
                                                <div className="nw-laboratory-bill-bx h-100">
                                                    <h6>Order</h6>
                                                    <h4>{sellData?.patientId?.name}</h4>
                                                    <p><span className="laboratory-phne">Phone :</span> {sellData?.patientId?.patientId?.contactNumber}</p>
                                                </div>
                                            </div>

                                            <div className="laboratory-report-bx mb-0">
                                                <ul className="laboratory-report-list mb-0">
                                                    <li className="laboratory-item pb-3">
                                                        <span className="price-title">Medicine</span>
                                                        <span className="price-title">Quantity</span>
                                                         <span className="price-title">Rate</span>
                                                        <span className="price-title">Discount</span>
                                                        <span className="price-title">Value</span></li>
                                                    {sellData?.products?.map((item, index) =>
                                                        <li className="laboratory-item pt-3 border-0">
                                                            <span>{item?.medicineName}</span>
                                                            <span>{item?.quantity}</span>
                                                            <span className="">₹ {item?.rate}</span>
                                                            <span>{item?.discountType ? `${item?.discountType} ${item?.discountValue}` : '-'}</span> 
                                                            <span className="">₹ {item?.totalAmount}</span>
                                                            </li>
                                                        )}
                                                </ul>

                                                <div className="lab-amount-bx mt-0">
                                                    <ul className="lab-amount-list mb-0">
                                                        {/* <li className="lab-amount-item">Subtotal : <span className="price-title">{subtotal?.toFixed(2)}</span></li>
                                                        <li className="lab-amount-item lab-divider">GST (5%) :  <span className="price-title">{gst?.toFixed(2)}</span></li> */}
                                                        <li className="lab-amount-item">Total :  <span className="price-title fw-700">₹ {total?.toFixed(2)}</span></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                                {/* <div className="custom-frm-bx mt-3">
                                <label htmlFor="">Note</label>
                                <textarea name="" id="" className="form-control nw-frm-select"></textarea>
                            </div> */}
                            </div>


                            {/* <div className="mt-3 text-end border-top pt-3">
                            <div>
                                <button className="nw-thm-btn rounded-3">Submit</button>
                            </div>
                        </div> */}





                        </div>

                    </div>
                    <div className="text-end mt-4"> <Link to={-1} className="nw-thm-btn outline">Go Back</Link> </div>
                </div>}




        </>
    )
}

export default ScanPrescriptionDetails