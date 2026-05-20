import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { BsPlusCircleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApiData, securePostData } from "../../Services/api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import base_url from "../../baseUrl";


function PaymentInfo() {
    const [saving, setSaving] = useState(false)
    const { paymentInfo } = useSelector(state => state.doctor)
    const [paymentForm, setPaymentForm] = useState({
        bankName: "",
        ifscCode: "",
        accountNumber: "",
        accountHolderName: "",
        branch: "",
        qr: null
    })
    const [paymentErrors, setPaymentErrors] = useState({})
    const validatePayment = () => {
        let temp = {};

        if (!paymentForm?.bankName?.trim())
            temp.bankName = "Bank name is required.";

        if (!paymentForm?.branch?.trim())
            temp.branch = "Bank branch is required.";

        if (!paymentForm?.ifscCode?.trim())
            temp.ifscCode = "Bank IFSC code is required.";

        if (!paymentForm?.accountHolderName?.trim())
            temp.accountHolderName = "Account holder name is required.";

        if (!paymentForm?.accountNumber?.trim())
            temp.accountNumber = "Account number is required.";

        setPaymentErrors(temp);

        return Object.keys(temp).length === 0; // ✅ important
    };
    const paymentChange = (e) => {
        const { name, files, value } = e.target;

        if (name === "qr") {
            const file = files[0];

            if (file) {
                // ✅ check image type
                if (!file.type.startsWith("image/")) {
                    toast.error("Only image files are allowed");
                    return;
                }

                // ✅ optional size limit (2MB)
                if (file.size > 2 * 1024 * 1024) {
                    toast.error("Image size should be less than 2MB");
                    return;
                }

                setPaymentForm({ ...paymentForm, qr: file });
            }
        } else {
            setPaymentForm({ ...paymentForm, [name]: value })
        }
    };
    const paymentSubmit = async (e) => {
        e.preventDefault()
        if (!validatePayment()) return
        const formData = new FormData()
        for (let key in paymentForm) {
            if (key === "qr") continue; // ✅ correct check
            formData.append(key, paymentForm[key]);
        }

        // QR file add karna hai to:
        if (paymentForm.qr) {
            formData.append("qr", paymentForm.qr);
        }
        setSaving(true)
        try {
            const res = await securePostData(`api/comman/payment-info`, formData)
            if (res.success) {
                toast.success(res?.message)

            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setSaving(false)
        }
    }
    useEffect(() => {
        return () => {
            if (paymentForm?.qr instanceof File) {
                URL.revokeObjectURL(paymentForm.qr);
            }
        };
    }, [paymentForm.qr]);
    useEffect(() => {
        if (paymentInfo) {
            setPaymentForm({
                ...paymentForm,
                bankName: paymentInfo?.bankName || "",
                accountHolderName: paymentInfo?.accountHolderName || "",
                accountNumber: paymentInfo?.accountNumber || "",
                ifscCode: paymentInfo?.ifscCode || "",
                branch: paymentInfo?.branch || "",
                qr: paymentInfo?.qr || "",
            })
        }
    }, [paymentInfo])
    return (
        <>

            <div className="profile-right-card">
                <div className="profile-tp-header">
                    <h5 className="heading-grad fz-24 mb-0">Payment Info</h5>
                </div>

                <div className="all-profile-data-bx">
                    <form onSubmit={paymentSubmit}>
                        <div className="row">


                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Bank Name </label>
                                    <input type="text" name="bankName"
                                        value={paymentForm.bankName}
                                        onChange={paymentChange} className="form-control new-control-frm"
                                        placeholder="Enter Bank Name " />
                                    {paymentErrors.bankName && <small className="text-danger">{paymentErrors.bankName}</small>}

                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Account Number </label>
                                    <input type="text" name="accountNumber"
                                        value={paymentForm.accountNumber}
                                        onChange={paymentChange} className="form-control new-control-frm"
                                        placeholder="Enter account number " />
                                    {paymentErrors.accountNumber && <small className="text-danger">{paymentErrors.accountNumber}</small>}

                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Account Holder Name </label>
                                    <input type="text" name="accountHolderName"
                                        value={paymentForm.accountHolderName}
                                        onChange={paymentChange} className="form-control new-control-frm"
                                        placeholder="Enter account holder Name " />
                                    {paymentErrors.accountHolderName && <small className="text-danger">{paymentErrors.accountHolderName}</small>}

                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Branch </label>
                                    <input type="text" name="branch"
                                        value={paymentForm.branch}
                                        onChange={paymentChange} className="form-control new-control-frm"
                                        placeholder="Enter branch Name " />
                                    {paymentErrors.branch && <small className="text-danger">{paymentErrors.branch}</small>}

                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">IFSC Code </label>
                                    <input type="text" name="ifscCode"
                                        value={paymentForm.ifscCode}
                                        onChange={paymentChange} className="form-control new-control-frm"
                                        placeholder="Enter ifsc code " />
                                    {paymentErrors.ifscCode && <small className="text-danger">{paymentErrors.ifscCode}</small>}

                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">QR </label>
                                    <div className="file-upload-wrapper">
                                        <input type="file" name="qr" id="fileUpload"
                                            accept="image/*"
                                            onChange={paymentChange} className="file-input"
                                           />
                                        <label htmlFor="fileUpload" className="file-label">
                                            <span className="file-text">Choose File</span>
                                            <span className="file-btn">Browse</span>
                                        </label>
                                    </div>
                                    {paymentErrors.qr && <small className="text-danger">{paymentErrors.qr}</small>}

                                </div>
                                {paymentForm?.qr && (
                                    <img
                                        src={
                                            paymentForm.qr instanceof File
                                                ? URL.createObjectURL(paymentForm.qr)
                                                : `${base_url}/${paymentForm.qr}`
                                        }
                                        alt="QR Preview"
                                        style={{ width: "150px", marginTop: "10px" }}
                                    />
                                )}
                            </div>




                        </div>

                        <div className="d-flex align-items-center justify-content-between mt-3">
                            <div className="text-end">
                                <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                            </div>

                            <button className="nw-thm-btn" disabled={saving}>{saving ? "Submitting..." : "Submit"}</button>
                        </div>

                    </form>
                </div>

            </div>

        </>
    )
}

export default PaymentInfo