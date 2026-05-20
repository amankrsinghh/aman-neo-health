import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getApiData } from "../Service/api";

const HospitalConsentLetter = ({ patientId, handleConsent }) => {
    const [data, setData] = useState(null);
    const [nh12,setNh12]=useState()
    const [isDownloaded, setIsDownloaded] = useState(false);

    const { user, hospitalAddress } = useSelector(state => state.user);
    const letterRef = useRef();

    const downloadPDF = () => {
        const element = letterRef.current;

        const opt = {
            margin: 0.5,
            filename: "Hospital_Consent_Letter.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };

        html2pdf().set(opt).from(element).save().then(() => {
            setIsDownloaded(true);
        });
    };

    async function fetchPatientData() {
        try {
            const res = await getApiData(`patient/${patientId}`);
            if (res.success) {
                setData(res.data);
                setNh12(res.customId)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }

    // ✅ Fetch data when patientId comes
    useEffect(() => {
        if (patientId) {
            fetchPatientData(); // FIXED
        }
    }, [patientId]);

    // ✅ Auto download when data is ready
    useEffect(() => {
        if (data && !isDownloaded) {
            downloadPDF();
        }
    }, [data]);

    // ✅ Call handleConsent AFTER download
    useEffect(() => {
        if (isDownloaded) {
            handleConsent(); // clear state or whatever you want
        }
    }, [isDownloaded]);
    return (
        <div className="container mt-5">

            {/* Hidden button optional */}
            <div className="text-end mb-3">
                <button className="btn btn-success" onClick={downloadPDF}>
                    Download PDF
                </button>
            </div>

            <div className="card shadow p-4" ref={letterRef}>
                <h2 className="text-center mb-4">
                    Hospital Consent Letter
                </h2>

                <p>Date: <strong>{new Date().toLocaleDateString('en-GB')}</strong></p>

                <p>To,</p>
                <p>
                    The Medical Officer <br />
                    {user?.name} <br />
                    {user?.nh12} <br/>
                    {hospitalAddress?.fullAddress}, {hospitalAddress?.city?.name}
                </p>

                <p className="mt-3">
                    Subject: <strong>Consent for Medical Treatment</strong>
                </p>

                <p className="mt-3">Dear Sir/Madam,</p>

                <p>
                    I, <strong>{data?.contact?.emergencyContactName|| data?.name}</strong>, hereby give my consent for
                    the medical treatment of <strong>{data?.name}</strong>.
                </p>

                <p>
                    I authorize the doctors to perform necessary procedures and
                    accept all associated risks.
                </p>

                <p className="mt-4">Thanking you.</p>

                <div className="mt-4">
                    <p>Yours sincerely,</p>
                    <p><strong>{data?.name}</strong></p>
                    <p>Contact No: {data?.contactNumber}</p>
                    <p>Address: {data?.address}</p>
                    <p>NHC Id: {nh12}</p>
                </div>
            </div>
        </div>
    );
};

export default HospitalConsentLetter;