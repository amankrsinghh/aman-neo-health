import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Pixel-tight layout using measured spacing (no loose flex gaps)

const styles = {
  wrapper: {
    width: "794px",
    height: "1123px",
    margin: "0 auto",
    background: "#f2f4f7",
    padding: "10px",
    fontFamily: "Inter, Arial, sans-serif",
  },
  page: {
    width: "100%",
    height: "100%",
    background: "#ffffff",
    borderRadius: "6px",
    position: "relative",
    padding: "16px 18px",
    boxShadow: "0 0 0 1px #e4e7eb",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
  },

  title: { fontSize: "18px", fontWeight: 600, color: "#1f2933", lineHeight: 1.2 },
  sub: { fontSize: "10px", color: "#7b8794", lineHeight: 1.3 },

  rightTop: {
    textAlign: "right",
    fontSize: "10px",
    color: "#7b8794",
    lineHeight: 1.3,
  },

  badge: {
    border: "1px solid #0aa7a5",
    color: "#0aa7a5",
    padding: "2px 6px",
    borderRadius: "10px",
    fontSize: "9px",
    display: "inline-block",
    marginBottom: "4px",
  },

  status: { color: "#0aa7a5", fontWeight: 600, marginTop: "4px" },

  divider: { borderTop: "1px solid #e4e7eb", margin: "10px 0" },

  row4: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    columnGap: "14px",
  },

  field: { fontSize: "10px", lineHeight: 1.25 },
  label: { color: "#9aa5b1" },
  value: { color: "#1f2933", fontWeight: 500, marginTop: "1px" },

  patientName: {
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "6px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "10px",
    marginTop: "6px",
  },

  th: {
    textAlign: "left",
    padding: "5px 3px",
    color: "#9aa5b1",
    borderBottom: "1px solid #e4e7eb",
    fontWeight: 600,
  },

  td: {
    padding: "5px 3px",
    borderBottom: "1px solid #f0f2f5",
  },

  watermark: {
    position: "absolute",
    top: "52%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "260px",
    height: "260px",
    background: "rgba(10,167,165,0.06)",
    borderRadius: "50%",
  },

  qr: {
    position: "absolute",
    top: "150px",
    right: "18px",
    width: "74px",
    height: "74px",
    border: "1px solid #d1d5db",
  },

  totals: {
    position: "absolute",
    right: "18px",
    bottom: "260px",
    textAlign: "right",
    fontSize: "10px",
    lineHeight: "1.5",
  },

  totalBig: {
    fontSize: "15px",
    fontWeight: 700,
    marginTop: "4px",
  },

  docs: {
    position: "absolute",
    left: "18px",
    right: "18px",
    bottom: "120px",
    border: "1px solid #e4e7eb",
    borderRadius: "6px",
    padding: "10px",
    fontSize: "10px",
    background: "#fafbfc",
    lineHeight: "1.6",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#0aa7a5",
    color: "#fff",
    textAlign: "center",
    fontSize: "10px",
    padding: "8px",
  },
};

export default function InsuranceClaimSummary() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.page}>

        {/* HEADER */}
        <div style={styles.headerRow}>
          <div>
            <div style={styles.title}>Insurance Claim Summary</div>
            <div style={styles.sub}>Apollo Ambulance Services</div>
            <div style={styles.sub}>Plot 22, Healthcare Ave, Andheri West, Mumbai – 400053</div>
          </div>

          <div style={styles.rightTop}>
            <div style={styles.badge}>NeoHealthCard Network</div>
            <div>Fully Automated - Ecosystem Connected</div>
            <div style={styles.status}>Submitted – Pending</div>
          </div>
        </div>

        <div style={styles.divider} />

        {/* CLAIM */}
        <div style={styles.row4}>
          <div style={styles.field}><div style={styles.label}>CLAIM ID</div><div style={styles.value}>NHC-INS-PA-2026-0410-00001</div></div>
          <div style={styles.field}><div style={styles.label}>PRE-AUTH REF</div><div style={styles.value}>NHC-INS-PA-2026-0410-00001</div></div>
          <div style={styles.field}><div style={styles.label}>CLAIM DATE</div><div style={styles.value}>12/04/2026</div></div>
          <div style={styles.field}><div style={styles.label}>INSURANCE</div><div style={styles.value}>Star Health</div></div>
        </div>

        <div style={styles.divider} />

        {/* PATIENT */}
        <div style={styles.patientName}>Vijay Kumar</div>
        <div style={styles.row4}>
          <div style={styles.field}><div style={styles.label}>Age / Sex</div><div style={styles.value}>24 / Male</div></div>
          <div style={styles.field}><div style={styles.label}>DOB</div><div style={styles.value}>15/03/2001</div></div>
          <div style={styles.field}><div style={styles.label}>Blood</div><div style={styles.value}>B+</div></div>
          <div style={styles.field}><div style={styles.label}>Contact</div><div style={styles.value}>+91 9658265898</div></div>
        </div>

        {/* TABLE */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ITEM</th>
              <th style={styles.th}>BILLED</th>
              <th style={styles.th}>CLAIMED</th>
              <th style={styles.th}>REASON IF EXCLUDED</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>Bed Charges – 2 days</td>
              <td style={styles.td}>Rs.3,000.00</td>
              <td style={styles.td}>Rs.3,000.00</td>
              <td style={styles.td}>Fully covered</td>
            </tr>
            <tr>
              <td style={styles.td}>Doctor Fees</td>
              <td style={styles.td}>Rs.1,000.00</td>
              <td style={styles.td}>Rs.800.00</td>
              <td style={styles.td}>Rs.200 copay – policy terms</td>
            </tr>
            <tr>
              <td style={styles.td}>Nursing & Care</td>
              <td style={styles.td}>Rs.800.00</td>
              <td style={styles.td}>Rs.800.00</td>
              <td style={styles.td}>Fully covered</td>
            </tr>
            <tr>
              <td style={styles.td}>Pharmacy (Medicines)</td>
              <td style={styles.td}>Rs.500.00</td>
              <td style={styles.td}>Rs.400.00</td>
              <td style={styles.td}>Fully covered</td>
            </tr>
          </tbody>
        </table>

        <div style={styles.watermark} />
        <div style={styles.qr} />

        {/* TOTALS */}
        <div style={styles.totals}>
          <div>Total Hospital Bill Rs.7,700.00</div>
          <div>Total Amount Claimed Rs.5,700.00</div>
          <div>Total Patient Copay Rs.2,000.00</div>
          <div style={styles.totalBig}>Estimated Rs.5,700.00</div>
        </div>

        {/* DOCS */}
        <div style={styles.docs}>
          <div style={{ fontWeight: 600 }}>DOCUMENTS SUBMITTED WITH CLAIM</div>
          <div>1. Final Hospital Bill – NHC-BILL-2026-0412-00001</div>
          <div>2. Discharge Summary – NHC-DS-2026-0412-00001</div>
          <div>3. All original lab reports – NHC-RPT-2026-0412-00001</div>
          <div>5. Pre-auth letter – NHC-INS-PA-2026-0410-00001</div>
        </div>

        <div style={styles.footer}>
          Apollo General Hospital, Mumbai • hospital@apollogeneral.com • +91 98765 43210 • Wishing you a speedy recovery
        </div>

      </div>
    </div>
  );
}
