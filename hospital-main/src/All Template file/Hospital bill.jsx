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
    backgroundColor: "#f4f6f7",
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
    width: 220,
    height: 220,
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
    width: "420px",
    height: "420px",
    backgroundColor: "#14b8a6",
    opacity: 0.04,
    borderRadius: "50%",
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    position: "relative",
    padding: "24px 24px 16px",
    borderBottom: "1px solid #E6E6E6",
    display: "flex",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: "24px",
    margin: 0,
  },
  headerSub: {
    fontSize: "12px",
    color: "#4A4A4A",
    marginTop: "2px",
  },
  headerMeta: {
    fontSize: "10px",
    color: "#868686",
    marginTop: "2px",
  },
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
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },

  // ── Patient ───────────────────────────────────────────────────────────────
  patientSection: {
    padding: "20px 24px",
    borderBottom: "1px solid #E6E6E6",
    display: "flex",
  },
  patientLeft: { flex: 1 },
  patientName: {
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "20px",
    margin: 0,
  },
  patientGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    columnGap: "20px",
    rowGap: "8px",
    marginTop: "12px",
    fontSize: "11px",
  },
  qrCol: {
    width: "100px",
    borderLeft: "1px solid #E6E6E6",
    paddingLeft: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  qrBox: {
    width: "72px",
    height: "72px",
    backgroundColor: "#E6E6E6",
  },
  qrLabel: { fontSize: "10px", color: "#868686", marginTop: "8px" },
  qrLink: { fontSize: "10px", color: "#14b8a6", marginTop: "2px" },

  // ── Table section ─────────────────────────────────────────────────────────
  tableSection: {
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
  thead: {
    backgroundColor: "#FAFAFA",
    color: "#868686",
  },
  thLeft: { textAlign: "left", padding: "6px 12px", fontWeight: 500 },
  thCenter: { textAlign: "center", padding: "6px 12px", fontWeight: 500 },
  thRight: { textAlign: "right", padding: "6px 12px", fontWeight: 500 },
  trBorder: { borderTop: "1px solid #E6E6E6" },
  tdLeft: { padding: "6px 12px", textAlign: "left" },
  tdCenter: { padding: "6px 12px", textAlign: "center" },
  tdRight: { padding: "6px 12px", textAlign: "right" },
  tdSub: { fontSize: "10px", color: "#868686", marginTop: "2px" },

  // ── Summary ───────────────────────────────────────────────────────────────
  summaryWrap: { display: "flex", justifyContent: "flex-end", marginTop: "12px" },
  summaryBox: { width: "220px", fontSize: "12px", lineHeight: "1.4" },
  summaryRow: { display: "flex", justifyContent: "space-between" },
  summaryLabel: { color: "#868686" },
  summaryTotal: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 600,
    fontSize: "14px",
    marginTop: "4px",
  },

  logo: {
    width: 34,
    height: 34,
  },
  // ── Payment ───────────────────────────────────────────────────────────────
  paymentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    borderBottom: "1px solid #E6E6E6",
    fontSize: "11px",
  },
  paymentCell: { padding: "12px 24px" },
  paymentCellBorder: { padding: "12px 24px", borderLeft: "1px solid #E6E6E6" },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    backgroundColor: "#0ea5a4",
    color: "#ffffff",
    fontSize: "10px",
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 24px",
  },

  // ── Typography ────────────────────────────────────────────────────────────
  label: {
    fontSize: "10px",
    color: "#868686",
    lineHeight: "12px",
    letterSpacing: "0.02em",
    marginBottom: "2px",
  },
  value: { fontSize: "11px", lineHeight: "13px", fontWeight: 500 },
  valueBold: { fontSize: "11px", lineHeight: "13px", fontWeight: 600 },
  metaBlock: { lineHeight: "1.2" },
};

// ── Small components ──────────────────────────────────────────────────────────
const Label = ({ children }) => <p style={s.label}>{children}</p>;
const Value = ({ children, bold }) => (
  <p style={bold ? s.valueBold : s.value}>{children}</p>
);
const Meta = ({ l, v }) => (
  <div style={s.metaBlock}>
    <Label>{l}</Label>
    <Value>{v}</Value>
  </div>
);
const KV = ({ k, v }) => (
  <div style={s.metaBlock}>
    <Label>{k}</Label>
    <Value>{v}</Value>
  </div>
);

const services = [
  ["Bed Charge", "General Ward · B-12 · 2 days"],
  ["Nursing Charges", "Post-operative nursing & patient care"],
  ["Doctor Consultation Fee", "2 visits · Dr. Amit Mishra"],
  ["Medical Consumables", "IV set, syringes, gloves, dressings"],
  ["Lab / Diagnostic Charges", "CBC, blood culture – ref NHC-LAB-00001"],
  ["Pharmacy", "Medicines dispensed – ref NHC-PH-00456"],
];

export default function HospitalBill({ allotmentId, pdfLoading, endLoading }) {
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
      const res = await getApiData(`api/comman/bed-invoice/${allotmentId || id}`)
      if (res.success) {
        setAllotmentData(res.allotmentData)
        setPatientData(res.patientData)
        setHospitalData(res.hospitalData)
        setPaymentData(res.paymentData)
        setDischargeData(res.dischargeData)
      } else {
        // toast.error(res.message)
      }
    } catch (error) {
      // toast.error(error?.response?.data?.message)
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
        filename: `HospitalBill-${allotmentData?.customId}.pdf`,
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
              <h1 style={s.headerTitle}>Hospital Bill</h1>
              <p style={s.headerSub} className="my-0 lh-sm">{hospitalData?.name}</p>
              <p style={s.headerMeta} className="my-0 lh-sm">{hospitalData?.nh12} · Reg. MH-HOSP-2010-00891 · NABH Accredited</p>
              <p style={s.headerMeta} className="my-0 lh-sm">{hospitalData?.fullAddress} ,{hospitalData?.city?.name},{hospitalData?.state?.name} -{hospitalData?.pinCode}</p>
            </div>
          </div>
          <div style={s.headerRight}>
            <div style={s.badge}>NeoHealthCard Network</div>
            <p style={s.headerMeta} className="my-0 lh-sm">Fully Automated · Ecosystem Connected</p>
            <p style={s.headerMeta} className="my-0 lh-sm">{hospitalData?.email} · {hospitalData?.contactNumber}</p>
          </div>
        </div>

        {/* META */}
        <div style={s.metaStrip}>
          <Meta l="BILL ID" v={paymentData?.customId} />
          <Meta l="DISCHARGE REF" v={dischargeData?.customId} />
          {paymentData?.payments?.length > 0 && (
            <Meta
              l="BILL DATE"
              v={new Date(
                Math.max(
                  ...paymentData.payments.map(p => new Date(p.date))
                )
              ).toLocaleDateString('en-GB')}
            />
          )}
          <Meta l="TOTAL STAY" v={`${new Date(allotmentData?.allotmentDate)?.toLocaleDateString('en-GB')} – ${dischargeData ? new Date(dischargeData?.createdAt)?.toLocaleDateString('en-GB') : 'Present'} · ${totalStay} Days`} />
        </div>

        {/* PATIENT */}
        <div style={s.patientSection}>
          <div style={s.patientLeft}>
            <h2 style={s.patientName}>{patientData?.name}</h2>
            <div style={s.patientGrid}>
              <KV k="Age / Sex" v={`${calculateAge(patientData?.dob, allotmentData?.createdAt)} / ${patientData?.gender || '-'}`} />
              <KV k="Email Address" v={patientData?.email} />
              <KV k="Patient ID" v={patientData?.nh12} />

              <KV k="DOB" v={new Date(patientData?.dob)?.toLocaleDateString('en-GB')} />
              <KV k="Address" v={`${patientData?.fullAddress || ''} ${patientData?.cityId?.name}`} />
              <KV k="Dr Name" v={allotmentData?.primaryDoctorId?.name} />

              <KV k="Blood" v={patientData?.bloodGroup || '-'} />
              <KV k="Contact no" v={patientData?.contactNumber} />
              <KV k="Dr ID" v={allotmentData?.primaryDoctorId?.nh12} />
            </div>
          </div>
          <div style={s.qrCol}>
            <div style={s.qrBox} >
              <QRCodeCanvas
                value={`https://www.neohealthcard.com/hospital-bill/${allotmentData?.customId}`}
                size={256}
                // className="qr-code"
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            <p style={s.qrLabel}>Scan to verify</p>
            <p style={s.qrLink}>verify.neohealthcard.in</p>
          </div>
        </div>

        {/* TABLE */}
        <div style={s.tableSection}>
          <p style={s.tableTitle}>SERVICES & CHARGES</p>
          <table style={s.table}>
            <thead style={s.thead}>
              <tr>
                <th style={s.thLeft}>SERVICE / DESCRIPTION</th>
                {/* <th style={s.thCenter}>SAC CODE</th> */}
                {/* <th style={s.thRight}>UNIT PRICE</th>
                <th style={s.thCenter}>QTY</th>
                <th style={s.thCenter}>GST%</th> */}
                <th style={s.thRight}>TOTAL</th>
              </tr>
            </thead>

            <tbody>
              {paymentData?.bedCharges?.length > 0 &&
                <tr style={s.tdBorderTop}>
                  <td style={s.tdLeft}><div>Bed Charges </div>
                    <div style={s.tdSubText}>{totalStay} Days</div>
                  </td>
                  <td style={s.tdRight}> ₹ {paymentData?.bedCharges?.reduce(
                    (sum, s) => sum + Number(s.amount || 0),
                    0
                  )}</td>
                </tr>}
              {paymentData?.ipdPayment?.length > 0 &&
                <tr style={s.tdBorderTop}>
                  <td style={s.tdLeft}><div>Nursing Charges </div>
                    <div style={s.tdSubText}>Post-operative nursing & patient care</div>
                  </td>
                  <td style={s.tdRight}> ₹ {paymentData?.ipdPayment?.reduce(
                    (sum, s) => sum + Number(s.fees || 0),
                    0
                  )}</td>
                </tr>}
              {paymentData?.services?.length > 0 &&
                <tr style={s.tdBorderTop}>
                  <td style={s.tdLeft}><div>Services </div>
                    <div style={s.tdSubText}>{paymentData?.services?.map(item => item?.name)?.join(',')}</div>
                  </td>
                  <td style={s.tdRight}>₹ {paymentData?.services?.reduce(
                    (sum, s) => sum + Number(s.amount || 0),
                    0
                  )}</td>
                </tr>}

            </tbody>
          </table>

          {/* SUMMARY */}
          <div style={s.summaryWrap}>
            <div style={s.summaryBox}>
              <div style={s.summaryRow}>
                <span style={s.summaryLabel}>Sub Total</span>
                <span>₹{paymentData?.totalAmount}</span>
              </div>
              {/* <div style={s.summaryRow}>
                <span style={s.summaryLabel}>GST Total</span>
                <span>₹1,200</span>
              </div> */}
              <div style={s.summaryRow}>
                <span style={s.summaryLabel}>Discount {`${paymentData?.discountType == "Percentage" ? '(%)' : '₹'}`}</span>
                <span>-{paymentData?.discountValue}</span>
              </div>
              <div style={s.summaryTotal}>
                <span>Grand Total</span>
                <span>₹{paymentData?.finalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT */}
        <div style={s.paymentGrid}>
          {/* <div style={s.paymentCell}>
            <Label>Payment Mode</Label>
            <Value>Cash</Value>
          </div> */}
          <div style={s.paymentCellBorder}>
            <Label>Transaction ID</Label>
            <Value>{paymentData?.customId}</Value>
          </div>
          <div style={s.paymentCellBorder}>
            <Label>Status</Label>
            <Value>{paymentData?.status}</Value>
          </div>
        </div>

        {/* FOOTER */}
        <div style={s.footer}>
          <span>{hospitalData?.name}, Mumbai · {hospitalData?.email} · {hospitalData?.contactNumber}</span>
          <span>Wishing you a speedy recovery</span>
        </div>

      </div>
    </div>
  );
}