import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiData } from "../../Service/api";
import { calculateAge, stripHtml } from "../../Service/globalFunction";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import { QRCodeCanvas } from "qrcode.react";
import base_url from "../../baseUrl";
import "./followup.css";

const FollowUpPrescription = ({ allotmentId, pdfLoading, endLoading }) => {
  const { id } = useParams()
  const [allotmentData, setAllotmentData] = useState()
  const [patientData, setPatientData] = useState()
  const [hospitalData, setHospitalData] = useState()
  const [dischargeData, setDischargeData] = useState()
  const [paymentData, setPaymentData] = useState()
  async function fetchAllotmentDetail() {
    if (!allotmentId) {
      return
    }
    try {
      const res = await getApiData(`api/comman/discharge-summary/${allotmentId || id}`)
      if (res.success) {
        setAllotmentData(res.allotmentData)
        setPatientData(res.patientData)
        setHospitalData(res.hospitalData)
        setPaymentData(res.paymentData)
        setDischargeData(res.dischargeData)
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  useEffect(() => {
    if (id || allotmentId) {

      fetchAllotmentDetail()
    }
  }, [id, allotmentId])
  const getDays = (start, end) => {
    if (!start || !end) return 0;

    const d1 = new Date(start);
    const d2 = new Date(end);

    const diffTime = d2 - d1; // ms difference
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };
  const totalStay = getDays(allotmentData?.allotmentDate, dischargeData?.createdAt || new Date())
  const invoiceRef = useRef()
  const handleDownload = () => {
    try {

      const element = invoiceRef.current;
      document.body.classList.add("hide-buttons");
      const opt = {
        margin: 0,
        filename: `FollowUp-Prescriptions-${allotmentData?.customId}.pdf`,
        html2canvas: { scale: 2, useCORS: true, allowTaint: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      };

      html2pdf().from(element).set(opt).save().then(() => {
        document.body.classList.remove("hide-buttons");
      });
    } catch (error) {

    } finally {
      if (pdfLoading) endLoading();
      setAllotmentData({});
    }
  };
  const handlePrint = () => {
    document.body.classList.add("hide-buttons");

    setTimeout(() => {
      window.print();
      document.body.classList.remove("hide-buttons");

      if (pdfLoading) endLoading();
      setAllotmentData({});
    }, 500);
  };
  useEffect(() => {
    console.log("callling", allotmentData, patientData, hospitalData, pdfLoading)
    if (allotmentData && patientData && hospitalData && pdfLoading) {
      const timer = setTimeout(() => {
        handleDownload();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allotmentData, patientData, hospitalData, pdfLoading]);
  return (
    <div ref={invoiceRef} className="fp-wrapper d-flex justify-content-center bg-light py-4">
      <div className="fp-a4 bg-white">

        {/* HEADER */}
        <div className="d-flex justify-content-between p-4 border-bottom">
          <div className="d-flex gap-2">
            <div style={{ width: '34px', height: '34px' }}>
              <img src={hospitalData?.logoFileId ?
                `${base_url}/api/file/${hospitalData?.logoFileId}` : "/logo.png"} alt="" />
            </div>
            <div>
              <h5 className="fw-bold mb-1">Follow-up Prescription</h5>
              <div className="text-muted small">{hospitalData?.name}</div>
              <div className="text-muted small">
                {hospitalData?.address}
              </div>
            </div>
          </div>

          <div className="text-end">
            <span className="badge bg-teal px-3 py-2">
              NeoHealthCard Network
            </span>
            <div className="small text-muted mt-2">
              {hospitalData?.email}
            </div>
            <div className="small text-muted">{hospitalData?.contactNumber}</div>
          </div>
        </div>

        {/* META */}
        <div className="row px-4 py-3 border-bottom small text-muted">
          <Meta title="DISCHARGE ID" value={dischargeData?.customId} />
          <Meta title="Admission" value={new Date(allotmentData?.allotmentDate)?.toLocaleDateString('en-GB')} />
          <Meta title="Discharge" value={new Date(dischargeData?.createdAt)?.toLocaleDateString('en-GB')} />
          <Meta title="Total Stay" value={`${totalStay} Days`} />
          <Meta title="DISCHARGE TYPE" value={dischargeData?.dischargeType} />
        </div>

        {/* PATIENT */}
        <div className="px-4 py-3 border-bottom">
          <h6 className="fw-semibold mb-2">{patientData?.name}</h6>
          <div className="row small text-muted">
            <div className="col">Age: {calculateAge(patientData?.dob, dischargeData?.createdAt)} / {patientData?.gender || '-'}</div>
            <div className="col">DOB: {new Date(patientData?.dob)?.toLocaleDateString('en-GB')}</div>
            <div className="col">Blood: {patientData?.bloodGroup}</div>
            <div className="col">Contact: {patientData?.contactNumber}</div>
          </div>
        </div>

        {/* VITALS */}
        <div className="px-4 py-3 d-flex justify-content-between gap-2 flex-wrap">
          <Vital label="BP" value={dischargeData?.vitals?.bloodPressure} unit="mmHg" />
          <Vital label="TEMPERATURE" value={`${dischargeData?.vitals?.temperature}°F`} sub="at admission" />
          <Vital label="PULSE" value={dischargeData?.vitals?.pulse} unit="bpm" />
          <Vital label="SpO₂" value={dischargeData?.vitals?.oxygenSaturation} sub="at discharge" />
          <Vital label="WEIGHT" value={dischargeData?.vitals?.weight} unit="kg" />
        </div>

        {/* PROGRESS + LAB */}
        {/* <div className="row px-4 py-3 border-top border-bottom small">
          <div className="col">
            <h6 className="section-title">Progress Since Last Visit</h6>
            <InfoRow label="Fever" value="Not" />
            <InfoRow label="Fatigue" value="Improving" />
            <InfoRow label="Appetite" value="Fair – Improving" />
            <InfoRow label="Hemoglobin" value="9.2 (was 8.5)" />
          </div>

          <div className="col border-start">
            <h6 className="section-title">Lab Results Review</h6>
            <InfoRow label="CBC" value="Done · Hb 8.5" />
            <InfoRow label="Blood Culture" value="Negative" />
            <InfoRow label="Widal / Dengue" value="Negative" />
            <InfoRow label="Iron Studies" value="Low ferritin" />
          </div>
        </div> */}

        {/* MEDICINES */}
        <div className="px-4 py-3">
          <h6 className="text-center text-muted small mb-2">
            MEDICINES PRESCRIBED
          </h6>

          <table className="table table-borderless fp-table">
            <thead className="small text-muted border-bottom">
              <tr>
                <th>Medicine</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Refills</th>
                <th>Instruction</th>
              </tr>
            </thead>

            <tbody>

              {allotmentData?.prescriptionId?.medications.map((r, i) => (
                <MedRow name={r?.name} freq={r?.frequency} dur={r?.duration} route={r?.refills || '-'} note={r?.instructions} />
              ))}
            </tbody>
          </table>
        </div>

        {/* ADVICE */}
        <div className="px-4 py-3 small text-muted">
          <h6 className="section-title">Followup Plan</h6>
          <div
            className="about-para"
            dangerouslySetInnerHTML={{ __html: dischargeData?.followUpPlan }}
          />
        </div>

        {/* NEXT VISIT */}
        {/* <div className="px-4 py-3 small border-top">
          <h6 className="section-title">Next Follow-up Plan</h6>
          <InfoRow label="Next Visit Date" value="22/04/2026 11:00 AM" />
          <InfoRow label="Tests" value="Repeat CBC" />
        </div> */}

        {/* SIGN */}
        <div className="row border-top text-center small text-muted">
          <div className="col p-3">
            {dischargeData?.doctorSignature?.name}
          </div>
          <div className="col p-3 border-start">
            {patientData?.name}
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer-bar text-white text-center py-2 small">
          {hospitalData?.name} · Wishing you a speedy recovery
        </div>

      </div>
    </div>
  );
};

const Meta = ({ title, value }) => (
  <div className="col">
    <div className="text-secondary">{title}</div>
    <div className="fw-medium">{value}</div>
  </div>
);

const Vital = ({ label, value, unit }) => (
  <div className="vital-box text-center">
    <div className="label">{label}</div>
    <div className="value">{value}</div>
    <div className="unit">{unit}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="d-flex justify-content-between mb-1">
    <span className="text-muted">{label}</span>
    <span>{value}</span>
  </div>
);

const MedRow = ({ name, dose, freq, dur, route, note }) => (
  <tr className="border-bottom">
    <td>{name}</td>
    <td>{freq}</td>
    <td>{dur}</td>
    <td>{route}</td>
    <td>{note}</td>
  </tr>
);

export default FollowUpPrescription;