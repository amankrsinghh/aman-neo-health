import React, { useEffect, useRef, useState } from "react";
import { getApiData } from "../Service/api";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import { useParams } from "react-router-dom";
import { calculateAge } from "../Service/globalFunction";
import { QRCodeCanvas } from "qrcode.react";
import base_url from "../baseUrl";

const s = {
  // ── Page ──────────────────────────────────────────────────────────────────
  page: {
    backgroundColor: "#f4f6f7",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    fontFamily: "sans-serif",
  },
  card: {
    width: "880px",
    backgroundColor: "#ffffff",
    color: "#1C1C1C",
    position: "relative",
    overflow: "hidden",
  },

  // ── Watermark ─────────────────────────────────────────────────────────────
  watermarkWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    transform: "translateY(40px)",
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
    margin: 0,
  },
  headerSub: {
    fontSize: "12px",
    color: "#4A4A4A",
    margin: 0,
  },
  headerMeta: {
    fontSize: "10px",
    color: "#868686",
    margin: 0,
  },
  headerRight: {
    textAlign: "right",
  },
  badge: {
    border: "1px solid #14b8a6",
    color: "#14b8a6",
    fontSize: "10px",
    padding: "2px 12px",
    borderRadius: "9999px",
    display: "inline-block",
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
    margin: 0,
  },
  patientGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    columnGap: "20px",
    rowGap: "8px",
    marginTop: "12px",
  },
  qrCol: {
    width: "100px",
    borderLeft: "1px solid #E6E6E6",
    paddingLeft: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  qrBox: {
    width: "72px",
    height: "72px",
    backgroundColor: "#E6E6E6",
  },
  qrLabel: { fontSize: "10px", color: "#868686", marginTop: "8px" },
  qrLink: { fontSize: "10px", color: "#14b8a6" },

  // ── Consultation + Vitals ─────────────────────────────────────────────────
  detailsGrid: {
    padding: "16px 24px",
    borderBottom: "1px solid #E6E6E6",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    fontSize: "11px",
  },
  detailGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  sectionLabel: {
    fontSize: "10px",
    color: "#868686",
    letterSpacing: "0.05em",
    marginBottom: "2px",
  },

  // ── Table section ─────────────────────────────────────────────────────────
  tableSection: {
    padding: "16px 24px",
    borderBottom: "1px solid #E6E6E6",
  },
  tableTitle: {
    textAlign: "center",
    fontSize: "10px",
    color: "#868686",
    letterSpacing: "0.05em",
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
  tdSub: {
    fontSize: "10px",
    color: "#868686",
  },

  // ── Summary ───────────────────────────────────────────────────────────────
  summaryWrap: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "16px",
    fontSize: "11px",
  },
  summaryBox: {
    width: "220px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  summaryLabel: { color: "#868686" },
  summaryTotal: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 600,
    fontSize: "13px",
  },

  // ── Payment ───────────────────────────────────────────────────────────────
  paymentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
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
    marginBottom: "2px",
    margin: 0,
  },
  value: {
    fontSize: "11px",
    color: "#1C1C1C",
    fontWeight: 500,
    lineHeight: "13px",
    margin: 0,
  },
  kvWrap: { lineHeight: "1.2" },
};

// ── Small components ──────────────────────────────────────────────────────────
const Label = ({ children }) => <p style={s.label}>{children}</p>;
const Value = ({ children }) => <p style={s.value}>{children}</p>;
const KV = ({ k, v }) => (
  <div style={s.kvWrap}>
    <Label>{k}</Label>
    <Value>{v}</Value>
  </div>
);
const Meta = ({ l, v }) => (
  <div style={s.kvWrap}>
    <Label>{l}</Label>
    <Value>{v}</Value>
  </div>
);

export default function OPDReceipt({ appointmentId, pdfLoading, endLoading }) {
  const { id } = useParams()
  const [ptData, setPtData] = useState()
  const [aptData, setAptData] = useState()
  const [vital, setVitals] = useState()
  async function fetchAptPayment() {
    if(!appointmentId && !id){
      return
    }
    try {
      const res = await getApiData(`api/comman/opd-invoice/${appointmentId || id}`)

      if (res.success) {
        setAptData(res.data)
        setVitals(res?.data?.vitals)
        setPtData(res.ptData)
      } else {
        toast.error(res.message)
      }
    } catch (error) {

    }
  }
  useEffect(() => {
    fetchAptPayment()
  }, [appointmentId])
  const invoiceRef = useRef()
  const handleDownload = () => {
    try {

      const element = invoiceRef.current;
      document.body.classList.add("hide-buttons");
      const opt = {
        margin: 0,
        filename: `OPD-Receipt-${aptData?.customId}.pdf`,
        html2canvas: { scale: 2 ,useCORS: true, allowTaint: true},
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      };

      html2pdf().from(element).set(opt).save().then(() => {
        document.body.classList.remove("hide-buttons");
      });
    } catch (error) {

    } finally {
      if (pdfLoading) endLoading();
      setAptData({});
    }
  };
  useEffect(() => {
    if (ptData && aptData && pdfLoading) {
      const timer = setTimeout(() => {
        handleDownload();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [ptData, aptData, pdfLoading]);
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  return (
    <div style={s.page} ref={invoiceRef}>
      <div style={s.card}>

        {/* WATERMARK */}
        <div style={s.watermarkWrap}>
          <div style={s.watermarkCircle} />
        </div>

        {/* HEADER */}
        <div style={s.header}>
          <div className="d-flex gap-3">
            <div style={s.logo}>
              <img src={aptData?.logoFileId ?
                `${base_url}/api/file/${aptData?.logoFileId}` : "/logo.png"} alt=""
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/logo.png";
                  }} />
            </div>
            <div>
            <h1 style={s.headerTitle}>OPD Receipt</h1>
            <p style={s.headerSub}>{aptData?.orgName}</p>
            <p style={s.headerMeta}>{aptData?.orgNh12}</p>
            <p style={s.headerMeta}>{aptData?.orgAddress}</p>
            </div>
          </div>
          <div style={s.headerRight}>
            <div style={s.badge}>NeoHealthCard Network</div>
            <p style={s.headerMeta}>Fully Automated · Ecosystem Connected</p>
            <p style={s.headerMeta}> {aptData?.orgEmail} · {aptData?.orgContactNumber}</p>
          </div>
        </div>

        {/* META */}
        <div style={s.metaStrip}>
          <Meta l="OPD RECEIPT ID" v={aptData?.customId} />
          <Meta l="DATE & TIME" v={new Date(aptData?.date)?.toLocaleString('en-GB')} />
          {/* <Meta l="OPD TOKEN" v="T-042" /> */}
          <Meta
            l="STATUS"
            v={`${capitalize(aptData?.paymentStatus)} · ${capitalize(aptData?.status)}`}
          />
        </div>

        {/* PATIENT */}
        <div style={s.patientSection}>
          <div style={s.patientLeft}>
            <h2 style={s.patientName}>{ptData?.name}</h2>
            <div style={s.patientGrid}>
              <KV k="Age / Sex" v={`${calculateAge(ptData?.dob, aptData?.createdAt)} / ${ptData?.gender?.charAt(0)?.toUpperCase() + ptData?.gender?.slice(1)}`} />
              <KV k="Email Address" v={ptData?.email} />
              <KV k="Patient ID" v={ptData?.nh12} />

              <KV k="DOB" v={new Date(ptData?.dob)?.toLocaleDateString('en-GB')} />
              <KV k="Address" v={ptData?.address || '-'} />
              <KV k="" v="" />
              <KV k="Blood" v={ptData?.bloodGroup} />
              <KV k="Contact no" v={ptData?.contactNumber} />
              <KV k="" v="" />
            </div>
          </div>

          {/* QR */}
          <div style={s.qrCol}>
            <div style={s.qrBox} >
              <QRCodeCanvas
                value={`https://www.neohealthcard.com/opd-invoice/${appointmentId}`}
                size={256}
                className="qr-code"
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            <p style={s.qrLabel}>Scan to verify</p>
            <p style={s.qrLink}>verify.neohealthcard.in</p>
          </div>
        </div>

        {/* CONSULTATION + VITALS */}
        <div style={s.detailsGrid}>
          <div style={s.detailGroup}>
            <p style={s.sectionLabel}>CONSULTATION DETAILS</p>
            <KV k="Doctor" v={`${aptData?.doctorName}`} />
            {aptData?.specialization &&<KV k="Specialisation" v={aptData?.specialization || ''} />}
            {/* <KV k="Department"     v="OPD · General Medicine" /> */}
            {/* <KV k="Clinic / Room" v="OPD Room 3" /> */}
            {/* <KV k="Visit Type"     v="New Patient" /> */}
          </div>
          <div style={s.detailGroup}>
            <p style={s.sectionLabel}>COMPLAINT & VITALS</p>
            <KV k="Height" v={`${vital?.height} cm`} />
            <KV k="Temp" v={`${vital?.temperature}°F"`} />
            <KV k="BP" v={`${vital?.bloodPressure || '-'} mmHg`} />
            <KV k="Weight" v={`${vital?.weight} kg`} />
            {/* <KV k="Referred To"     v="IPD · Admitted" /> */}
          </div>
        </div>

        {/* TABLE */}
        <div style={s.tableSection}>
          <p style={s.tableTitle}>OPD CHARGES</p>
          <table style={s.table}>
            <thead style={s.thead}>
              <tr>
                <th style={s.thLeft}>DESCRIPTION</th>
                {/* <th style={s.thCenter}>SAC CODE</th>
                <th style={s.thCenter}>GST%</th> */}
                <th style={s.thRight}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr style={s.trBorder}>
                <td style={s.tdLeft}>
                  <div>OPD Consultation – {aptData?.doctorName}</div>
                  <div style={s.tdSub}>{aptData?.specialization || ''}</div>
                </td>
                <td style={s.tdRight}>₹{aptData?.fees}</td>
              </tr>
              {/* <tr style={s.trBorder}>
                <td style={s.tdLeft}>
                  <div>Registration & File Charges</div>
                  <div style={s.tdSub}>New patient file opening</div>
                </td>
                <td style={s.tdCenter}>999311</td>
                <td style={s.tdCenter}>18%</td>
                <td style={s.tdRight}>₹3,000.00</td>
              </tr> */}
            </tbody>
          </table>

          {/* SUMMARY */}
          <div style={s.summaryWrap}>
            <div style={s.summaryBox}>
              <div style={s.summaryRow}>
                <span style={s.summaryLabel}>Sub Total</span>
                <span>₹{aptData?.fees}</span>
              </div>
              <div style={s.summaryRow}>
                <span style={s.summaryLabel}>Discount</span>
                <span>{aptData?.discountType == "Fixed" && "₹"}{aptData?.discountValue} {aptData?.discountType == "Percentage" && "(%)"}</span>
              </div>
              <div style={s.summaryTotal}>
                <span>Grand Total</span>
                <span>₹{aptData?.totalAmount || aptData?.fees}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT */}
        <div style={s.paymentGrid}>
          <div style={s.paymentCell}>
            <Label>Payment Mode</Label>
            <Value>{aptData?.paymentMethod}</Value>
          </div>
          {aptData?.transactionId && <div style={s.paymentCellBorder}>
            <Label>Transaction ID</Label>
            <Value>{aptData?.transactionId}</Value>
          </div>}
          <div style={s.paymentCellBorder}>
            <Label>Status</Label>
            <Value>{capitalize(aptData?.paymentStatus)}</Value>
          </div>
        </div>

        {/* FOOTER */}
        <div style={s.footer}>
          <span>{aptData?.orgName}, {aptData?.orgAddress} · {aptData?.orgEmail} · {aptData?.orgContactNumber}</span>
          <span>Wishing you a speedy recovery</span>
        </div>

      </div>
    </div>
  );
}