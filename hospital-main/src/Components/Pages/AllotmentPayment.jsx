import { faCircleXmark, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useMemo, useState } from 'react'
import { FaPlusSquare } from 'react-icons/fa';
import { getSecureApiData, securePostData } from '../../Service/api';
import { toast } from 'react-toastify';
import API from '../../api/api';
import Loader from '../Common/Loader';
import { useSelector } from 'react-redux';
import base_url from '../../baseUrl';
import BedPaymentTemplate from './BedPaymentTemplate';
import BedInvoice from '../../All Template file/Bed invoice';
import HospitalBill from '../../All Template file/Hospital bill';
function AllotmentPayment({ allotmentId, getData }) {
    const user = JSON.parse(localStorage.getItem('user'))
    const [feesData, setFeesData] = useState([])
    const [allotmentData, setAllotmentData] = useState()
    const [loading, setLoading] = useState(false)
    const { paymentInfo } = useSelector(state => state.user)
    const [totalAmount, setTotalAmount] = useState(0)
    const [finalAmount, setFinalAmount] = useState(0)
    const [pdfLoading, setPdfLoading] = useState(null)
    const [isDiscount, setIsDiscount] = useState(false)
    const [discountValue, setDiscountValue] = useState(null)
    const [havePayment, setHavePayment] = useState(false)
    const [discountType, setDiscountType] = useState('')
    const userId = user?.id
    const [showDownload, setShowDownload] = useState(false);
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        services: [{ name: "", amount: "" }],
        ipdPayment: [],
        payments: [{ date: "", type: "Cash", amount: "", paymentInfoId: paymentInfo?._id || null }],
        status: "Pending"
    });
    const handleServiceChange = (index, field, value) => {
        const services = [...formData.services];
        services[index][field] = value;

        const updatedForm = { ...formData, services };

        // calculate new total
        const newServiceTotal = services.reduce(
            (sum, s) => sum + Number(s.amount || 0),
            0
        );

        const ipdTotal = formData.ipdPayment.reduce(
            (sum, s) => sum + Number(s.fees || 0),
            0
        );

        let newTotal = newServiceTotal + ipdTotal;

        let newFinal = newTotal;

        if (discountValue && discountType) {
            if (discountType === "Fixed") {
                newFinal = newTotal - discountValue;
            } else if (discountType === "Percentage") {
                newFinal = newTotal - (newTotal * discountValue) / 100;
            }
        }

        if (newFinal < 0) newFinal = 0;

        // 🚨 VALIDATION
        if (paidAmount > newFinal) {
            toast.error("You already received more payment than updated total. Cannot reduce service amount.");
            return;
        }

        setFormData(updatedForm);
    };

    const handlePaymentChange = (index, field, value) => {
        const payments = [...formData.payments];
        payments[index][field] = value;
        setFormData({ ...formData, payments });
    };

    const addService = () => {
        setFormData({
            ...formData,
            services: [...formData.services, { name: "", amount: "" }]
        });
    };

    const removeService = (index) => {
        const updatedServices = formData.services.filter((_, i) => i !== index);

        const newServiceTotal = updatedServices.reduce(
            (sum, s) => sum + Number(s.amount || 0),
            0
        );

        const ipdTotal = formData.ipdPayment.reduce(
            (sum, s) => sum + Number(s.fees || 0),
            0
        );

        let newTotal = newServiceTotal + ipdTotal;
        let newFinal = newTotal;

        if (discountValue && discountType) {
            if (discountType === "Fixed") {
                newFinal = newTotal - discountValue;
            } else if (discountType === "Percentage") {
                newFinal = newTotal - (newTotal * discountValue) / 100;
            }
        }

        if (newFinal < 0) newFinal = 0;

        // 🚨 VALIDATION
        if (paidAmount > newFinal) {
            toast.error("Cannot delete service. Payment already exceeds updated total.");
            return;
        }

        setFormData({
            ...formData,
            services: updatedServices
        });
    };


    const addPayment = () => {
        setFormData({
            ...formData,
            payments: [
                ...formData.payments,
                { date: "", type: "Cash", amount: "", paymentInfoId: paymentInfo?._id || null }
            ]
        });
    };

    const removePayment = (index) => {
        setFormData({
            ...formData,
            payments: formData.payments.filter((_, i) => i !== index)
        });
    };
    async function fetchAllotmentPayment() {
        try {
            const res = await getSecureApiData(`api/bed/allotment-payment/${allotmentId}`)
            if (res.success) {
                setHavePayment(true)
                const formattedData = {
                    ...res.data,
                    payments: res.data.payments?.map(p => ({
                        ...p,
                        date: p.date
                            ? new Date(p.date).toISOString().split("T")[0]
                            : ""
                    })),
                };
                setDiscountType(formattedData?.discountType)
                setDiscountValue(formattedData?.discountValue)
                setIsDiscount(formattedData?.discountValue ? true : false)
                setFormData(formattedData);
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        if (allotmentId) {
            Promise.all([fetchAllotmentPayment(), fetchDetails()])
        }
    }, [allotmentId])
    const validateAmounts = () => {
        if (paidAmount > finalAmount) {
            toast.error("Paid amount cannot be greater than final amount. Please adjust services or payments.");
            return false;
        }
        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🚨 FINAL CHECK
        if (!validateAmounts()) return;

        try {
            setIsSaving(true)
            let data = {
                hospitalId: userId,
                allotmentId,
                patientId: allotmentData?.patientId?._id,
                services: formData.services,
                payments: formData.payments,
                status: formData.status,
                totalAmount,
                finalAmount
            };

            if (isDiscount && !discountType) {
                return toast.error("Please select a discount type");
            }

            if (isDiscount) {
                data.discountType = discountType;
                data.discountValue = discountValue;
            }

            if (formData?._id) {
                data.paymentId = formData._id;
            }

            const result = await securePostData('api/bed/allotment/payment', data);

            if (result.success) {
                toast.success("Payment data inserted");
                getData();
            } else {
                toast.error(result.messsage);
            }

            document.getElementById('closeModal')?.click();
        } catch (error) {
            toast.error(error?.response?.data?.messsage || "Something went wrong");
        } finally {
            setIsSaving(false)
        }
    };

    const totalAm = useMemo(() => {
        const serviceTotal = formData.services.reduce(
            (sum, s) => sum + Number(s.amount || 0),
            0
        );

        const ipdTotal = formData.ipdPayment.reduce(
            (sum, s) => sum + Number(s.fees || 0),
            0
        );
        const bedTotal = formData?.bedCharges?.reduce(
            (sum, s) => sum + Number(s.amount || 0),
            0
        );

        return serviceTotal + ipdTotal + bedTotal;
    }, [formData.services, formData.ipdPayment, formData?.bedCharges]);
    useEffect(() => {
        setTotalAmount(totalAm)
        setFinalAmount(totalAm)
    }, [totalAm])
    const paidAmount = useMemo(
        () =>
            formData.payments.reduce(
                (sum, p) => sum + Number(p.amount || 0),
                0
            ),
        [formData.payments]
    );

    const pendingAmount = useMemo(() => finalAmount - paidAmount, [finalAmount, paidAmount]);

    const fetchDetails = async () => {
        if (!allotmentId) {
            return
        }
        // setLoading(true)
        try {
            const res = await API.get(`/bed/allotment/${allotmentId}`);
            if (res.data.success) {

                const data = res.data.data
                setAllotmentData(data);

            }
        } catch (err) {
            console.error(err);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        let final = totalAm;

        if (discountValue && discountType) {
            if (discountType === "Fixed") {
                final = totalAm - discountValue;
            } else if (discountType === "Percentage") {
                final = totalAm - (totalAm * discountValue) / 100;
            }
        }

        if (final < 0) final = 0;

        // 🚨 VALIDATION
        if (paidAmount > final) {
            toast.error("Discount makes final amount less than paid amount.");
            return;
        }

        setTotalAmount(totalAm);
        setFinalAmount(final);
    }, [totalAm, discountValue, discountType]);
    const handleReportDownload = () => {
        setPdfLoading(true)
        // setSelectedReport({ appointmentId });
        setShowDownload(true);
    };
    const handleCloseModal = () => {
        const modal = document.getElementById("add-Payment");

        if (modal) {
            modal.classList.remove("show");
            modal.style.display = "none";
        }

        // remove backdrop
        const backdrops = document.getElementsByClassName("modal-backdrop");
        while (backdrops.length > 0) {
            backdrops[0].parentNode.removeChild(backdrops[0]);
        }

        // remove body class
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
    };
    return (
        <>
            {loading ? <Loader />
                : <div className="modal step-modal fade" id="add-Payment" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                    aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                        <div className="modal-content rounded-0">
                            <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                                <div>
                                    <h6 className="lg_title mb-0">Payment Add</h6>
                                </div>
                                <div>
                                    {havePayment && <button className="print-btn no-print" onClick={() => setPdfLoading(true)}>
                                        <FontAwesomeIcon icon={faDownload} /> {pdfLoading ? 'Downloading...' : 'Download'} PDF</button>}

                                    {/* <button type="button" className="" onClick={handleCloseModal} aria-label="Close" style={{ color: "#00000040" }}>
                                        <FontAwesomeIcon icon={faCircleXmark} />
                                    </button> */}
                                </div>
                            </div>
                            <div className="modal-body pb-5 px-4 pb-5">
                                <form onSubmit={handleSubmit} className="row justify-content-center">
                                    <div className="col-lg-12">
                                        <div className="laboratory-report-bx">
                                            <ul className="laboratory-report-list">

                                                <li className="laboratory-item border-0">Payment Add <span className="laboratory-title">₹{paidAmount}</span></li>
                                                <li className="laboratory-item border-0">Pending Payment  <span className="laboratory-title">₹{pendingAmount}</span></li>
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
                                    </div>
                                    {formData?.ipdPayment?.length > 0 && <div className="my-3">
                                        <h5 className="add-contact-title text-black mb-3">IPD Payment</h5>


                                        {formData?.ipdPayment?.map((item, key) =>
                                            <div className="education-frm-bx mb-3 py-2 bg-transparent" key={key}>
                                                <div action="">
                                                    {item?.role == "doctor" ? <div className="row">
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Doctor Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control nw-frm-select"
                                                                    placeholder="Enter Service name"
                                                                    value={item?.userId?.name}
                                                                    onChange={(e) =>
                                                                        handleServiceChange(key, "name", e.target.value)
                                                                    }
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
                                                                        value={item?.fees}
                                                                        onChange={(e) =>
                                                                            handleServiceChange(key, "amount", e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        : <div className="row">
                                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                                <div className="custom-frm-bx">
                                                                    <label htmlFor="">Staff Name</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control nw-frm-select"
                                                                        placeholder="Enter Service name"
                                                                        value={item?.userId?.name}
                                                                        onChange={(e) =>
                                                                            handleServiceChange(key, "name", e.target.value)
                                                                        }
                                                                    />

                                                                </div>
                                                            </div>

                                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                                <div className="return-box">
                                                                    <div className="custom-frm-bx flex-column flex-grow-1">
                                                                        <label htmlFor="">Staff Fees</label>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control nw-frm-select"
                                                                            placeholder="Enter amount"
                                                                            value={item?.fees}
                                                                            onChange={(e) =>
                                                                                handleServiceChange(key, "amount", e.target.value)
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>}
                                                </div>
                                            </div>)}

                                    </div>}
                                    {formData?.bedCharges?.length > 0 && <div className="my-3">
                                        <h5 className="add-contact-title text-black mb-3">Bed Charges</h5>

                                        {formData?.bedCharges?.map((item, key) =>
                                            <div className="education-frm-bx mb-3 py-2 bg-transparent" key={key}>

                                                <div action="">
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Bed</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control nw-frm-select"
                                                                    placeholder="Enter Service name"
                                                                    value={item?.bedId?.bedName}
                                                                />

                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="return-box">
                                                                <div className="custom-frm-bx flex-column flex-grow-1">
                                                                    <label htmlFor="">Amount(₹)</label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control nw-frm-select"
                                                                        placeholder="Enter amount"
                                                                        value={item?.amount}
                                                                    />

                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>)}
                                    </div>}

                                    <div className="my-3">
                                        <h5 className="add-contact-title text-black mb-3">Services</h5>


                                        {formData?.services?.map((item, key) =>
                                            <div className="education-frm-bx mb-3 py-2 bg-transparent" key={key}>
                                                <div action="">
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Service</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control nw-frm-select"
                                                                    placeholder="Enter Service name"
                                                                    value={item?.name}
                                                                    onChange={(e) =>
                                                                        handleServiceChange(key, "name", e.target.value)
                                                                    }
                                                                />

                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="return-box">
                                                                <div className="custom-frm-bx flex-column flex-grow-1">
                                                                    <label htmlFor="">Amount(₹)</label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control nw-frm-select"
                                                                        placeholder="Enter amount"
                                                                        value={item?.amount}
                                                                        onChange={(e) =>
                                                                            handleServiceChange(key, "amount", e.target.value)
                                                                        }
                                                                    />

                                                                </div>

                                                                <div className="">
                                                                    <button className="text-black" type='button' disabled={formData?.services?.length == 1}
                                                                        onClick={() => removeService(key)}><FontAwesomeIcon icon={faTrash} /></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>)}
                                        <div className="text-end">
                                            <a href="javascript:void(0)" onClick={() => addService()} className="add-employee-btn"><FaPlusSquare /> Add More</a>
                                        </div>
                                    </div>

                                    <div className="my-3">
                                        <h5 className="add-contact-title text-black mb-3">Payment</h5>
                                        <div>
                                            {formData?.payments?.map((item, key) =>
                                                <div className="education-frm-bx mb-3 py-2 bg-transparent" key={key}>
                                                    <div className="row" >
                                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Date</label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control nw-frm-select"
                                                                    placeholder="Enter Service name"
                                                                    value={item.date}
                                                                    onChange={(e) =>
                                                                        handlePaymentChange(key, "date", e.target.value)
                                                                    }
                                                                />

                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Amount Type</label>
                                                                <div class="select-wrapper">
                                                                    <select class="form-select custom-select"
                                                                        value={item.type}
                                                                        onChange={(e) =>
                                                                            handlePaymentChange(key, "type", e.target.value)
                                                                        }>
                                                                        <option>Cash</option>
                                                                        <option>Card</option>
                                                                        <option>Online</option>
                                                                    </select>
                                                                </div>

                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                                            <div className="return-box">
                                                                <div className="custom-frm-bx flex-column flex-grow-1">
                                                                    <label htmlFor="">Amount(₹)</label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control nw-frm-select"
                                                                        placeholder="Enter amount"
                                                                        value={item.amount}
                                                                        onChange={(e) =>
                                                                            handlePaymentChange(key, "amount", e.target.value)
                                                                        }
                                                                    />

                                                                </div>

                                                                <div className="">
                                                                    <button className="text-black"
                                                                        type='button' disabled={formData?.payments?.length == 1}
                                                                        onClick={() => removePayment(key)}><FontAwesomeIcon icon={faTrash} /></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>)}
                                        </div>


                                        <div className="text-end">
                                            <a href="javascript:void(0)" onClick={() => addPayment()} className="add-employee-btn"><FaPlusSquare /> Add More</a>
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Payment   Status</label>
                                            <div class="select-wrapper">
                                                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} class="form-select custom-select" required>
                                                    <option value={''}> Select</option>
                                                    <option value={'Complete'}> Complete</option>
                                                    <option value={'Pending'}>Pending</option>
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
                                            <li className="laboratory-item border-0">Total Amount <span className="laboratory-title">₹{totalAmount}</span></li>
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
                                            <li className="laboratory-item border-0">Final Amount <span className="laboratory-title">₹{finalAmount}</span></li>
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

                    <div className="d-none" >
                        <HospitalBill allotmentId={allotmentData?._id} pdfLoading={pdfLoading} endLoading={() => setPdfLoading(false)} />
                    </div>
                </div>}
        </>
    )
}

export default AllotmentPayment
