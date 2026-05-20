import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload, faPrint } from "@fortawesome/free-solid-svg-icons";
import { BsCapsule } from "react-icons/bs";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import base_url from "../../baseUrl";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";
import { getSecureApiData } from "../../Services/api";

function DoctorAppointmentBilling({aptId, pdfLoading,endLoading}) {
    // const params = useParams();
    // const aptId = params.id;
    const [appointmentData, setAppointmentData] = useState({});
    const { profiles, paymentInfo } = useSelector(state => state.doctor)
    
    const [ptData, setPtData] = useState()
    async function fetchAppointmentData() {
        try {
            const response = await getSecureApiData(`api/hospital/appointment-data/${aptId}`);
            if (response.success) {
                setAppointmentData(response.data)
                // ✅ SAFE: use response here
                if (response?.data?.invoiceId) {
                    const ptdata = await getSecureApiData(
                        `appointment/doctor/payment/${response.data.invoiceId}`
                    );

                    if (ptdata.success) {
                        setPtData(ptdata.data);
                    } else {
                        toast.error(ptdata.message || "Failed to fetch payment data");
                    }
                }
            } else {
                toast.error(response.message || "Failed to fetch appointment data");
            }

        } catch (error) {
            console.error("Error fetching appointment data:", error);
            toast.error(error?.response?.data?.message || "An error occurred while fetching appointment data");
        }
    }

    useEffect(() => {
        fetchAppointmentData();
    }, [aptId]);
    const invoiceRef = useRef()
    const handleDownload = () => {
        try {

            const element = invoiceRef.current;
            document.body.classList.add("hide-buttons");
            const opt = {
                margin: 0.5,
                filename: `invoice-${ptData?.customId}.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
            };

            html2pdf().from(element).set(opt).save().then(() => {
                document.body.classList.remove("hide-buttons");
            });
        } catch (error) {

        }finally {
            if (pdfLoading) endLoading();
            setReportMeta({});
        }
    };
      useEffect(() => {
        if (appointmentData && ptData && pdfLoading) {
            const timer = setTimeout(() => {
                handleDownload();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [appointmentData,ptData, pdfLoading]);


    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between mega-content-bx">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Appointment Billing Details</h3>
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
                                                <h5>{profiles?.name || 'World Pharmacy'}</h5>
                                                {/* <p><span className="laboratory-title">GSTIN : </span> {hospitalBasic?.gstNumber || '09897886454'}</p> */}
                                                <p><span className="laboratory-title">Bank : </span> {ptData?.paymentInfoId?.bankName}</p>
                                                <p><span className="laboratory-title">Account Number : </span> {ptData?.paymentInfoId?.accountNumber}</p>
                                                <p><span className="laboratory-invoice">Account Holder Name :</span> {ptData?.paymentInfoId?.accountHolderName}</p>
                                            </div>
                                            <div className="invoice-details">
                                                <p><span className="laboratory-invoice">Invoice :</span> {ptData?.customId}</p>
                                                <p><span className="laboratory-invoice">Date :</span> {new Date(ptData?.createdAt).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}</p>
                                                <p><span className="laboratory-invoice">IFSC :</span> {ptData?.paymentInfoId?.ifscCode}</p>
                                                <p><span className="laboratory-invoice">QR :</span> <img width={100} height={100} src={`${base_url}/${ptData?.paymentInfoId?.qr}`} alt="" srcset="" /></p>
                                            </div>
                                        </div>

                                        <div className="nw-laboratory-bill-crd">
                                            <div className="nw-laboratory-bill-bx">
                                                <h6>Bill To</h6>
                                                <h4>{appointmentData?.patientId?.name}</h4>
                                                <p><span className="laboratory-phne">Phone :</span> {appointmentData?.patientId?.patientId?.contactNumber}</p>
                                            </div>
                                            <div className="nw-laboratory-bill-bx">
                                                <h6>Order</h6>
                                                <h4>{appointmentData?.patientId?.name}</h4>
                                                <p><span className="laboratory-phne">Phone :</span> {appointmentData?.patientId?.patientId?.contactNumber}</p>
                                            </div>
                                        </div>

                                        <div className="laboratory-report-bx">
                                            <ul className="laboratory-report-list">
                                                <li className="laboratory-item"><span className="price-title">Doctor</span>
                                                    <span className="price-title">Doctor Id</span>
                                                    <span className="price-title">Fees</span>
                                                </li>

                                                <li className="laboratory-item border-0">
                                                    <span>{ptData?.doctorId?.name} </span><span>{ptData?.doctorId?.nh12}</span><span>{appointmentData?.fees}</span>
                                                </li>
                                            </ul>

                                            <div className="lab-amount-bx">
                                                <ul className="lab-amount-list">
                                                    <li className="lab-amount-item">Subtotal : <span className="price-title">₹ {ptData?.subTotal}</span></li>
                                                    {ptData?.discountValue > 0 && (
                                                        <li className="lab-amount-item lab-divider">Discount  :  <span className="price-title">{ptData?.discountValue} {ptData?.discountType == "Percentage" ? "%" : "₹"}</span></li>
                                                    )}
                                                    <li className="lab-amount-item">Total :  <span className="price-title">₹ {ptData?.totalAmount}</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>




        </>
    )
}

export default DoctorAppointmentBilling