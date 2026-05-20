import React, { useRef } from "react";
import { Row, Col, Button } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ReceiptPage() {
  const ref = useRef();

  const downloadPDF = async () => {
    const canvas = await html2canvas(ref.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const w = 210;
    const h = (canvas.height * w) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save("receipt.pdf");
  };

  return (
    <>
      <style>{`
        body {
          background:#f3f4f6;
          font-family: Inter, sans-serif;
        }

        .receipt {
          width: 820px;
          margin: 30px auto;
          background:#fff;
          border:1px solid #e5e7eb;
          border-radius:6px;
          overflow:hidden;
          position:relative;
        }

        /* HEADER */
        .header {
          padding:16px 20px;
          border-bottom:1px solid #e5e7eb;
        }

        .title {
          font-size:20px;
          font-weight:700;
          color:#111827;
        }

        .subtitle {
          font-size:13px;
          color:#6b7280;
        }

        .small-text {
          font-size:11px;
          color:#6b7280;
          line-height:1.4;
        }

        .badge-top {
          border:1px solid #0ea5a4;
          color:#0ea5a4;
          font-size:11px;
          padding:3px 8px;
          border-radius:20px;
          display:inline-block;
          margin-bottom:4px;
        }

        /* META GRID */
        .meta {
          padding:12px 20px;
          border-bottom:1px solid #e5e7eb;
          font-size:12px;
        }

        .meta div span {
          display:block;
          color:#6b7280;
          font-size:11px;
        }

        /* PATIENT */
        .section {
          padding:16px 20px;
          border-bottom:1px solid #e5e7eb;
        }

        .section-title {
          font-size:11px;
          color:#6b7280;
          font-weight:600;
          margin-bottom:6px;
        }

        .patient-name {
          font-size:18px;
          font-weight:600;
          margin-bottom:6px;
        }

        .info {
          font-size:13px;
          color:#111827;
        }

        .info span {
          color:#6b7280;
        }

        /* QR */
        .qr-box {
          width:100px;
          height:100px;
          border:1px solid #e5e7eb;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:10px;
          color:#9ca3af;
        }

        /* ADMISSION GRID */
        .grid2 {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:20px;
          font-size:13px;
        }

        .grid2 div span {
          color:#6b7280;
        }

        /* TABLE */
        table {
          width:100%;
          border-top:1px solid #e5e7eb;
        }

        th {
          font-size:10px;
          color:#6b7280;
          text-transform:uppercase;
          background:#f9fafb;
          padding:8px;
        }

        td {
          font-size:13px;
          padding:10px 8px;
          border-top:1px solid #e5e7eb;
        }

        /* SUMMARY */
        .summary {
          text-align:right;
          font-size:13px;
          margin-top:10px;
        }

        .summary strong {
          font-size:14px;
        }

        /* WATERMARK */
        .watermark {
          position:absolute;
          top:45%;
          left:50%;
          transform:translate(-50%,-50%);
          opacity:0.06;
          width:200px;
          height:200px;
          border-radius:50%;
          background:#0ea5a4;
        }

        /* TERMS */
        .terms {
          margin:16px 20px;
          border:1px solid #e5e7eb;
          border-radius:6px;
          padding:12px;
          font-size:12px;
          color:#6b7280;
        }

        /* SIGN */
        .sign {
          display:flex;
          justify-content:space-between;
          padding:20px;
          text-align:center;
        }

        .sign div {
          width:33%;
          font-size:13px;
        }

        .sign span {
          display:block;
          font-size:11px;
          color:#6b7280;
        }

        .footer {
          background:#0ea5a4;
          color:#fff;
          font-size:12px;
          padding:8px 20px;
          display:flex;
          justify-content:space-between;
        }
      `}</style>

      <div className="text-center mt-3">
        <Button onClick={downloadPDF}>Download PDF</Button>
      </div>

      <div ref={ref} className="receipt">
        <div className="watermark"></div>

        {/* HEADER */}
        <div className="header">
          <Row>
            <Col>
              <div className="title">Hospital Admission Receipt</div>
              <div className="subtitle">Apollo Ambulance Services</div>
              <div className="small-text">
                Plot 22, Andheri West, Mumbai - 400053
              </div>
            </Col>

            <Col className="text-end">
              <div className="badge-top">NeoHealthCard Network</div>
              <div className="small-text">
                Fully Automated · Ecosystem Connected
              </div>
              <div className="small-text">
                hospital@apollo.com
              </div>
            </Col>
          </Row>
        </div>

        {/* META */}
        <div className="meta">
          <Row>
            <Col><span>Admission ID</span>NHC-ADM-00001</Col>
            <Col><span>Date</span>10/04/2026</Col>
            <Col><span>Doctor</span>Dr. Amit Mishra</Col>
            <Col><span>Ward</span>B-12</Col>
            <Col><span>Status</span><b style={{color:"#0ea5a4"}}>Active · IPD</b></Col>
          </Row>
        </div>

        {/* PATIENT */}
        <div className="section">
          <Row>
            <Col md={9}>
              <div className="section-title">PATIENT</div>
              <div className="patient-name">Vijay Kumar</div>

              <Row className="info">
                <Col md={4}><span>Age:</span> 24 / Male</Col>
                <Col md={4}><span>Email:</span> v@gmail.com</Col>
                <Col md={4}><span>ID:</span> NHC-00123</Col>
              </Row>
            </Col>

            <Col md={3} className="text-end">
              <div className="qr-box">QR</div>
              <div className="small-text mt-1">Scan to verify</div>
            </Col>
          </Row>
        </div>

        {/* ADMISSION */}
        <div className="section">
          <div className="section-title">ADMISSION DETAILS</div>

          <div className="grid2">
            <div>
              <div><span>Department:</span> Internal Medicine</div>
              <div><span>Ward:</span> General Ward</div>
              <div><span>Doctor:</span> Madhusudhan</div>
            </div>

            <div>
              <div><span>Complaint:</span> Fever</div>
              <div><span>Diagnosis:</span> Viral Fever</div>
              <div><span>Stay:</span> 2–3 Days</div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="section">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Txn</th>
                <th>Collected</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>IPD Admission Deposit</td>
                <td>₹5,000</td>
                <td>Cash</td>
                <td>TXN001</td>
                <td>Front Desk</td>
              </tr>
            </tbody>
          </table>

          <div className="summary">
            <div>Deposit Collected: ₹3,713.85</div>
            <div>Estimated Bill: ₹186.15</div>
            <strong>Balance Due: To be calculated</strong>
          </div>
        </div>

        {/* TERMS */}
        <div className="terms">
          <b>Admission Terms</b>
          <ol>
            <li>Deposit adjusted at discharge</li>
            <li>Extra deposit if needed</li>
            <li>Provisional receipt</li>
            <li>Carry during stay</li>
          </ol>
        </div>

        {/* SIGN */}
        <div className="sign">
          <div>Front Desk<span>Admissions</span></div>
          <div>Dr. Payal Shah<span>Doctor</span></div>
          <div>Vijay Kumar<span>Patient</span></div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <div>Apollo General Hospital</div>
          <div>Wishing you a speedy recovery</div>
        </div>
      </div>
    </>
  );
}