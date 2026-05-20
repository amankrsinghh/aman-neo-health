import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiData } from "../Service/api";
import { calculateAge, stripHtml } from "../Service/globalFunction";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import { QRCodeCanvas } from "qrcode.react";
import base_url from "../baseUrl";

const s = {
  // ── Page ──────────────────────────────────────────────────────────────────
  page: {
    // backgroundColor: "#0B0B0B",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    width: "880px",
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.28)",
    color: "#1C1C1C",
    fontSize: "12px",
    position: "relative",
    overflow: "hidden",
  },

  // ── Watermark ─────────────────────────────────────────────────────────────
  watermarkWrap: {
    position: "absolute",
    width: 320,
    height: 320,
    background: "url('/CertWatermark2.png')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    // opacity: 0.05,
    borderRadius: "50%",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  watermarkCircle: {
    width: "440px",
    height: "440px",
    borderRadius: "50%",
    backgroundColor: "#14b8a6",
    opacity: 0.05,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    position: "relative",
    padding: "24px 24px 16px",
    borderBottom: "1px solid #E6E6E6",
    display: "flex",
    justifyContent: "space-between",
  },
  logo: {
    width: 34,
    height: 34,
  },
  headerTitle: {
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: "24px",
    margin: 0,
  },
  headerSub: { fontSize: "12px", color: "#4A4A4A", margin: 0 },
  headerMeta: { fontSize: "10px", color: "#868686", marginTop: "4px", margin: 0 },
  headerMetaTop: { fontSize: "10px", color: "#868686", marginTop: "4px" },
  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "2px",
  },
  badge: {
    border: "1px solid #14b8a6",
    color: "#14b8a6",
    fontSize: "10px",
    padding: "2px 12px",
    borderRadius: "9999px",
  },

  // ── Meta strip ────────────────────────────────────────────────────────────
  metaStrip: {
    padding: "16px 24px",
    borderBottom: "1px solid #E6E6E6",
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "16px",
    fontSize: "11px",
  },
  metaBlock: { minWidth: 0 },
  metaLabel: {
    fontSize: "10px",
    color: "#868686",
    letterSpacing: "0.02em",
    margin: 0,
  },
  metaValue: { fontWeight: 500, color: "#1C1C1C", margin: 0 },
  metaValueHighlight: { fontWeight: 500, color: "#0ea5a4", margin: 0 },

  // ── Patient ───────────────────────────────────────────────────────────────
  patientSection: {
    padding: "20px 24px",
    borderBottom: "1px solid #E6E6E6",
    display: "flex",
  },
  patientLeft: { flex: 1 },
  patientName: { fontSize: "16px", fontWeight: 600, margin: 0 },
  patientGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    columnGap: "24px",
    rowGap: "12px",
    marginTop: "12px",
    fontSize: "11px",
  },
  kvWrap: { lineHeight: "1.25" },
  kvLabel: { fontSize: "10px", color: "#868686", letterSpacing: "0.02em", margin: 0 },
  kvValue: { fontSize: "11px", fontWeight: 500, margin: 0 },
  qrCol: {
    width: "120px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderLeft: "1px solid #E6E6E6",
  },
  qrBox: { width: "82px", height: "82px", backgroundColor: "#E6E6E6" },
  qrLabel: { fontSize: "10px", color: "#868686", marginTop: "8px" },
  qrLink: { fontSize: "10px", color: "#14b8a6", marginTop: "2px" },

  // ── Vitals ────────────────────────────────────────────────────────────────
  vitalsRow: {
    padding: "16px 24px",
    borderBottom: "1px solid #E6E6E6",
    display: "flex",
    gap: "12px",
  },
  vitalCard: {
    flex: 1,
    borderRadius: "6px",
    border: "1px solid #E6E6E6",
    backgroundColor: "#FAFAFA",
    padding: "12px 16px",
    textAlign: "center",
  },
  vitalLabel: { fontSize: "10px", color: "#868686", letterSpacing: "0.02em", margin: 0 },
  vitalValue: { fontSize: "14px", fontWeight: 600, lineHeight: "18px", margin: 0 },
  vitalUnit: { fontSize: "10px", color: "#868686", margin: 0 },
  vitalSub: { fontSize: "10px", color: "#868686", marginTop: "2px", margin: 0 },

  // ── Details grid ──────────────────────────────────────────────────────────
  detailsGrid: {
    padding: "16px 24px",
    borderBottom: "1px solid #E6E6E6",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    fontSize: "11px",
  },
  detailSectionLabel: {
    fontSize: "10px",
    color: "#868686",
    letterSpacing: "0.02em",
    margin: 0,
  },
  detailRows: { marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" },
  detailRow: { display: "flex", justifyContent: "space-between" },
  detailKey: { color: "#868686" },

  // ── Medicines table ───────────────────────────────────────────────────────
  medicinesSection: {
    padding: "16px 24px",
    borderBottom: "1px solid #E6E6E6",
  },
  tableTitle: {
    textAlign: "center",
    fontSize: "10px",
    color: "#868686",
    letterSpacing: "0.02em",
    marginBottom: "8px",
  },
  table: {
    width: "100%",
    fontSize: "11px",
    border: "1px solid #E6E6E6",
    borderCollapse: "collapse",
  },
  thead: { backgroundColor: "#FAFAFA", color: "#868686" },
  thLeft: { textAlign: "left", padding: "8px 12px", fontWeight: 500 },
  thCenter: { textAlign: "center", padding: "8px 12px", fontWeight: 500 },
  trBorder: { borderTop: "1px solid #E6E6E6" },
  tdLeft: { padding: "8px 12px", textAlign: "left" },
  tdCenter: { padding: "8px 12px", textAlign: "center" },

  // ── Notes ─────────────────────────────────────────────────────────────────
  notesSection: {
    padding: "16px 24px",
    borderBottom: "1px solid #E6E6E6",
  },
  notesBox: {
    marginTop: "8px",
    backgroundColor: "#FAFAFA",
    border: "1px solid #E6E6E6",
    borderRadius: "6px",
    padding: "16px",
    fontSize: "11px",
    color: "#4A4A4A",
    lineHeight: "1.6",
  },

  // ── Signatures ────────────────────────────────────────────────────────────
  sigGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    borderBottom: "1px solid #E6E6E6",
    fontSize: "11px",
  },
  sigCell: { padding: "16px", textAlign: "center" },
  sigCellBorder: { padding: "16px", textAlign: "center", borderLeft: "1px solid #E6E6E6" },
  sigName: { fontWeight: 500, margin: 0 },
  sigSub: { fontSize: "10px", color: "#868686", margin: 0 },
  sigId: { fontSize: "10px", color: "#14b8a6", margin: 0 },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    backgroundColor: "#0ea5a4",
    color: "#ffffff",
    fontSize: "11px",
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 24px",
  },
};

// ── Small components ──────────────────────────────────────────────────────────
const Label = ({ children }) => <p style={s.metaLabel}>{children}</p>;

const Meta = ({ l, v, highlight }) => (
  <div style={s.metaBlock}>
    <p style={s.metaLabel}>{l}</p>
    <p className="fz-12" style={highlight ? s.metaValueHighlight : s.metaValue}>{v}</p>
  </div>
);

const KV = ({ k, v }) => (
  <div style={s.kvWrap}>
    <p style={s.kvLabel}>{k}</p>
    <p style={s.kvValue}>{v}</p>
  </div>
);

const Vital = ({ label, value, unit, sub }) => (
  <div style={s.vitalCard}>
    <p style={s.vitalLabel}>{label}</p>
    <p style={s.vitalValue}>{value}</p>
    {unit && <p style={s.vitalUnit}>{unit}</p>}
    {sub && <p style={s.vitalSub}>{sub}</p>}
  </div>
);

const medicines = [
  ["Paracetamol 500mg", "1 Tab", "Twice daily", "5 Days", "Oral", "After food", "NHC-D-007821"],
  ["Ibuprofen 400mg", "1 Tab", "Thrice daily", "3 Days", "Oral", "Before food", "NHC-D-007821"],
  ["Amoxicillin 250mg", "1 Cap", "Once at night", "7 Days", "Oral", "Before sleep", "NHC-D-007821"],
  ["ORS Sachets", "1 Sachet", "Thrice daily", "5 Days", "Oral", "In 200ml water", "NHC-D-007821"],
];

export default function DischargeSummary({ allotmentId, pdfLoading, endLoading }) {
  const { id } = useParams()
  const [allotmentData, setAllotmentData] = useState()
  const [patientData, setPatientData] = useState()
  const [hospitalData, setHospitalData] = useState()
  const [dischargeData, setDischargeData] = useState()
  const [paymentData, setPaymentData] = useState()
  async function fetchAllotmentDetail() {
    if (!allotmentData && !id) {
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
        filename: `Discharge-Summary-${allotmentData?.customId}.pdf`,
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
    if (allotmentData && patientData && hospitalData && pdfLoading) {
      const timer = setTimeout(() => {
        handleDownload();

      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allotmentData, patientData, hospitalData, pdfLoading]);
  return (
    <div style={s.page} ref={invoiceRef}>
      <div style={s.card}>

        {/* Watermark */}
        <div style={s.watermarkWrap}>
          {/* <div style={s.watermarkCircle} /> */}
        </div>

        {/* HEADER */}
        <div style={s.header}>
          <div className="d-flex gap-3">
            <div style={s.logo}>
              <img src={hospitalData?.logoFileId ?
                `${base_url}/api/file/${hospitalData?.logoFileId}` : "/logo.png"} alt="" />
            </div>
            <div>
              <h1 style={s.headerTitle}>Discharge Summary</h1>
              <p style={s.headerSub} className="mb-0 lh-sm">{hospitalData?.name}</p>
              <p style={s.headerMetaTop} className="mb-0 lh-sm">{hospitalData?.nh12}</p>
              <p style={s.headerMeta} className="mb-0 lh-sm">{hospitalData?.address}</p>
            </div>
          </div>
          <div style={s.headerRight}>
            <div style={s.badge}>NeoHealthCard Network</div>
            <p style={s.headerMeta} className="mb-0 lh-sm">Fully Automated · Ecosystem Connected</p>
            <p style={s.headerMeta} className="mb-0 lh-sm">{hospitalData?.email} · {hospitalData?.contactNumber}</p>
          </div>
        </div>

        {/* META */}
        <div style={s.metaStrip}>
          <Meta l="DISCHARGE ID" v={dischargeData?.customId} />
          <Meta l="ADMISSION" v={new Date(allotmentData?.allotmentDate)?.toLocaleDateString('en-GB')} />
          <Meta l="DISCHARGE" v={new Date(dischargeData?.createdAt)?.toLocaleString('en-GB')} />
          <Meta l="TOTAL STAY" v={`${totalStay} Days `} />
          <Meta l="DISCHARGE TYPE" v={dischargeData?.dischargeType} />
          <Meta l="STATUS" v={allotmentData?.status} highlight />
        </div>

        {/* PATIENT */}
        <div style={s.patientSection}>
          <div style={s.patientLeft}>
            <h2 style={s.patientName}>{patientData?.name}</h2>
            <div style={s.patientGrid}>
              <KV k="Age / Sex" v={`${calculateAge(patientData?.dob, dischargeData?.createdAt)} / ${patientData?.gender || '-'}`} />
              <KV k="Email Address" v={patientData?.email} />
              <KV k="Patient ID" v={patientData?.nh12} />
              <KV k="DOB" v={new Date(patientData?.dob)?.toLocaleDateString('en-GB')} />
              <KV k="Address" v={patientData?.address} />
              <KV k="Dr Name" v={allotmentData?.primaryDoctorId?.name} />
              <KV k="Blood" v={patientData?.bloodGroup} />
              <KV k="Contact no" v={patientData?.contactNumber} />
              <KV k="Dr ID" v={allotmentData?.primaryDoctorId?.nh12} />
            </div>
          </div>
          <div style={s.qrCol}>
            <div style={s.qrBox} >
              <QRCodeCanvas
                value={`https://www.neohealthcard.com/discharge-invoice/${allotmentData?._id}`}
                size={256}
                // className="qr-code"
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            <p style={s.qrLabel}>Scan to verify</p>
            <p style={s.qrLink}>verify.neohealthcard.in</p>
          </div>
        </div>

        {/* VITALS */}
        <div style={s.vitalsRow}>
          <Vital label="BP" value={dischargeData?.vitals?.bloodPressure} unit="mmHg" />
          <Vital label="TEMPERATURE" value={`${dischargeData?.vitals?.temperature}°F`} sub="at admission" />
          <Vital label="PULSE" value={dischargeData?.vitals?.pulse} unit="bpm" />
          <Vital label="SpO₂" value={dischargeData?.vitals?.oxygenSaturation} sub="at discharge" />
          <Vital label="WEIGHT" value={dischargeData?.vitals?.weight} unit="kg" />
        </div>

        {/* DETAILS */}
        <div style={s.detailsGrid}>
          <div>
            <p style={s.detailSectionLabel}>ADMISSION DETAILS</p>
            <div style={s.detailRows}>
              {[
                ["Dept / Ward", allotmentData?.departmentId?.departmentName],
                ["Bed / Room", allotmentData?.bedId?.bedName + '-' + allotmentData?.bedId?.roomId?.roomName],
                ["Primary Diagnosis", allotmentData?.admissionReason],
                // ["Secondary Diagnosis", "Mild Anemia"],
                // ["Procedures Done", "IV Fluids · CBC · Antipyretics"],
              ].map(([k, v]) => (
                <div key={k} style={s.detailRow}>
                  <span style={s.detailKey}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={s.detailSectionLabel}>DISCHARGE STATUS</p>
            <div style={s.detailRows}>
              {[
                ["Condition at Discharge", stripHtml(dischargeData?.conditionOfDischarge)],
                ["Discharge Type", dischargeData?.dischargeType],
                ["Follow-up Plan", stripHtml(dischargeData?.followUpPlan)],
                ["Red Flag Signs", stripHtml(dischargeData?.redFlag)],
                ["Vitals at Discharge", `BP ${dischargeData?.vitals?.bloodPressure} · Temp ${dischargeData?.vitals?.temperature}°F · SpO₂ ${dischargeData?.vitals?.oxygenSaturation}`],
              ].map(([k, v]) => (
                <div key={k} style={s.detailRow}>
                  <span style={s.detailKey}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MEDICINES */}
        {allotmentData?.prescriptionId && <div style={s.medicinesSection}>
          <p style={s.tableTitle}>MEDICINES PRESCRIBED AT DISCHARGE</p>
          <table style={s.table}>
            <thead style={s.thead}>
              <tr>
                <th style={s.thLeft}>MEDICINE</th>
                <th style={s.thCenter}>FREQUENCY</th>
                <th style={s.thCenter}>DURATION</th>
                <th style={s.thCenter}>REFILLS</th>
                <th style={s.thCenter}>INSTRUCTION</th>
                <th style={s.thCenter}>PRESCRIBED BY</th>
              </tr>
            </thead>
            <tbody>
              {allotmentData?.prescriptionId?.medications.map((r, i) => (
                <tr key={i} style={s.trBorder}>
                  <td style={s.tdLeft}>{r?.name}</td>
                  <td style={s.tdCenter}>{r?.frequency}</td>
                  <td style={s.tdCenter}>{r?.duration}</td>
                  <td style={s.tdCenter}>{r?.refills || '-'}</td>
                  <td style={s.tdCenter}>{r?.instructions}</td>
                  <td style={s.tdCenter}>{allotmentData?.prescriptionId?.doctorId?.nh12}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}

        {/* NOTES */}
        <div style={s.notesSection}>
          <p style={s.detailSectionLabel}>DOCTOR'S REMARKS & DISCHARGE NOTES</p>
          <div style={s.notesBox}>
            Patient responded well to IV fluid therapy and antipyretics. Fever resolved by Day 2.
            Advised complete bed rest, adequate fluid intake (3L/day), light meals. Avoid cold drinks
            and self-medication. Return immediately if fever exceeds 102°F, breathlessness, or
            persistent vomiting develops.
          </div>
        </div>

        {/* SIGNATURES */}
        <div style={s.sigGrid}>
          <div style={s.sigCell}>
            <p style={s.sigName}>{dischargeData?.doctorSignature?.name}</p>
            <p style={s.sigSub}>{hospitalData?.doctorSpecialty} · {hospitalData?.doctorRole}</p>
            <p style={s.sigId}>{dischargeData?.doctorSignature.nh12}</p>
          </div>
          <div style={s.sigCellBorder}>
            <p style={s.sigName}>Nurse In-Charge</p>
            <p style={s.sigSub}>{dischargeData?.nurseSignature?.name}</p>
            <p style={s.sigId}>{dischargeData?.nurseSignature?.nh12}</p>
          </div>
          <div style={s.sigCellBorder}>
            <p style={s.sigName}>{patientData?.name}</p>
            <p style={s.sigSub}>Patient / Authorised Representative</p>
            <p style={s.sigId}>{patientData?.nh12}</p>
          </div>
        </div>

        {/* FOOTER */}
        <div style={s.footer}>
          <span>{hospitalData?.name}, {hospitalData?.address} · {hospitalData?.email} · {hospitalData?.contactNumber}</span>
          <span>Wishing you a speedy recovery</span>
        </div>

      </div>
    </div>
  );
}