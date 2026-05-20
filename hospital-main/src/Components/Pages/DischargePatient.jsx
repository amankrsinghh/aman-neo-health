import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { getSecureApiData, securePostData } from '../../Service/api';
import API from '../../api/api';

function DischargePatient({ allotmentId, patientId, fetchData }) {
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user?.id
    const [paymentData, setPaymentData] = useState()
    const [allotmentData, setAllotmentData] = useState()
    const [loading, setLoading] = useState()
    const [dischargeData, setDischargeData] = useState({
        paymentId: "",
        allotmentId: "",
        hospitalId: userId,
        patientId: "",
        dischargeDateOnly: "",
        dischargeTimeOnly: "",
        note: "",
        dischargeDate: null,dischargeType:""
    })
    useEffect(() => {
        const modal = document.getElementById("discharge-Patient");

        const handleOpen = () => {
            if (allotmentId) {
                fetchDetails()
                fetchDischargePatient()
                fetchAllotmentPayment()
            }
        };

        modal?.addEventListener("shown.bs.modal", handleOpen);

        return () => {
            modal?.removeEventListener("shown.bs.modal", handleOpen);
        };
    }, [allotmentId]);
    const fetchDetails = async () => {
        if (!allotmentId) {
            return
        }
        try {
            const res = await API.get(`/bed/allotment/${allotmentId}`);
            const data = res.data.data
            setAllotmentData(data);
            setDischargeData({ ...dischargeData, paymentId: data?.paymentId, patientId: data?.patientId?._id, allotmentId: allotmentId })
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    async function fetchDischargePatient() {
        if (!allotmentId) return
        try {
            const res = await getSecureApiData(`api/bed/discharge-patient/${allotmentId}`);

            if (res.success) {
                const dischargeDateTime = res?.data?.dischargeDate
                    ? new Date(res.data.dischargeDate)
                    : null;

                const formattedData = {
                    ...res.data,
                    dischargeId: res?.data?._id,

                    // Combined datetime (original)
                    dischargeDate: res?.data?.dischargeDate || "",

                    // Separate fields for inputs
                    dischargeDateOnly: dischargeDateTime
                        ? dischargeDateTime.toISOString().split("T")[0]
                        : "",

                    dischargeTimeOnly: dischargeDateTime
                        ? dischargeDateTime.toTimeString().slice(0, 5)
                        : "",
                };

                setDischargeData(formattedData);
            }
        } catch (error) {
            console.error(error);
        }
    }
    async function fetchAllotmentPayment() {
        if (!allotmentId) return
        try {
            const res = await getSecureApiData(`api/bed/allotment-payment/${allotmentId}`)
            if (res.success) {
                const formattedData = {
                    ...res.data,
                    payments: res.data.payments?.map(p => ({
                        ...p,
                        date: p.date
                            ? new Date(p.date).toISOString().split("T")[0]
                            : ""
                    }))
                };

                setPaymentData(formattedData);
            }
        } catch (error) {

        }
    }
    const handleDateChange = (e) => {
        const date = e.target.value;

        setDischargeData(prev => {
            const updated = {
                ...prev,
                dischargeDateOnly: date
            };

            if (date && prev.dischargeTimeOnly) {
                const combined = new Date(`${date}T${prev.dischargeTimeOnly}`);
                updated.dischargeDate = combined.toISOString(); // ✅ ISO format
            }

            return updated;
        });
    };

    const handleTimeChange = (e) => {
        const time = e.target.value;

        setDischargeData(prev => {
            const updated = {
                ...prev,
                dischargeTimeOnly: time
            };

            if (prev.dischargeDateOnly && time) {
                const combined = new Date(`${prev.dischargeDateOnly}T${time}`);
                updated.dischargeDate = combined.toISOString(); // ✅ ISO format
            }

            return updated;
        });
    };

    // Total Service Amount
    const totalAmount = paymentData?.services?.reduce(
        (sum, item) => sum + (item.amount || 0),
        0
    );

    // Total Paid Amount
    const paidAmount = paymentData?.payments?.reduce(
        (sum, item) => sum + (item.amount || 0),
        0
    );

    // Pending Amount
    const pendingAmount = totalAmount - paidAmount;

    const dischargeSubmit = async (e) => {
        e.preventDefault();
        if (!dischargeData.paymentId) {
            return toast.error("Please enter payment data before discharge a patient")
        }
        try {
            const result = await securePostData('api/bed/discharge-patient', dischargeData)
            if (result.success) {
                document.getElementById('closeDischarge')?.click()
                toast.success("Discharge records saved")
                fetchData()

                return
            } else {
                toast.error(result?.message)
            }
        } catch (error) {

        }
        // yahan API call
    };

    return (
        <div className="modal step-modal fade" id="discharge-Patient" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content rounded-0">
                    <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                        <div>
                            <h6 className="lg_title mb-0">Discharge Patient</h6>
                        </div>
                        <div>
                            <button
                                type="button"
                                className=""
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                style={{ color: "#00000040" }}
                            >
                                <FontAwesomeIcon icon={faCircleXmark} />
                            </button>
                        </div>
                    </div>
                    <form onSubmit={dischargeSubmit} className="modal-body pb-5 px-4 pb-5">
                        <div className="row">
                            <div className="col-lg-12">
                                <p>
                                    Complete the discharge process for patient{" "}
                                    <strong style={{ color: "#4D667E" }}>{allotmentData?.patientId?.name}</strong>{" "}
                                    from Bad <strong style={{ color: "#4D667E" }}>{allotmentData?.bedId?.bedName}</strong>
                                </p>
                                <div className="laboratory-report-bx mt-3">
                                    <h5 className="add-contact-title text-black">Payment</h5>
                                    <ul className="laboratory-report-list">
                                        {paymentData?.services?.map((item, key) =>
                                            <li className="laboratory-item border-0" key={key}>
                                                {item?.name}{" "}
                                                <span className="laboratory-title">${item?.amount}</span>
                                            </li>)}
                                    </ul>
                                    <div className="lab-amount-bx mt-2">
                                        <ul className="lab-amount-list">
                                            <li className="lab-amount-item">
                                                Total<span className="price-title fw-700">${totalAmount || 0}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="laboratory-report-bx">
                                    <ul className="laboratory-report-list">
                                        <li className="laboratory-item border-0">
                                            Payment Add{" "}
                                            <span className="laboratory-title"> ${paidAmount || 0}</span>
                                        </li>
                                        <li className="laboratory-item border-0">
                                            Pending Payment{" "}
                                            <span className="laboratory-title">  ${pendingAmount > 0 ? pendingAmount : 0}</span>
                                        </li>
                                        <li className="laboratory-item border-0">
                                            Payment Status{" "}
                                            <span className="approved approved-active py-1">
                                                {paymentData?.status}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Discharge Date</label>
                                    <input
                                        type="date"
                                        value={dischargeData?.dischargeDateOnly}
                                        onChange={handleDateChange}
                                        className="form-control nw-frm-select"
                                        placeholder="Enter Service name"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Discharge Time</label>
                                    <input
                                        type="time"
                                        value={dischargeData?.dischargeTimeOnly}
                                        onChange={handleTimeChange}
                                        className="form-control nw-frm-select"
                                        placeholder="Enter Service name"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Discharge Type</label>
                                    <input name="" value={dischargeData?.dischargeType} onChange={(e) => setDischargeData({ ...dischargeData, dischargeType: e.target.value })} id="" className="form-control" />
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Note</label>
                                    <textarea name="" value={dischargeData?.note} onChange={(e) => setDischargeData({ ...dischargeData, note: e.target.value })} id="" className="form-control"></textarea>
                                </div>
                            </div>
                            <div className="d-flex gap-3 justify-content-end">
                                <button
                                    className="nw-thm-btn outline"
                                    data-bs-dismiss="modal"
                                    id="closeDischarge"
                                    aria-label="Close"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="nw-thm-btn w-auto"
                                    type="submit"
                                >
                                    Confirm Discharge
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default DischargePatient
