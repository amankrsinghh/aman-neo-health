import React, { useRef } from "react";
import { Row, Col, Button } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";

export default function InsurancePreAuth() {
  const ref = useRef();

  const downloadPDF = async () => {
    const canvas = await html2canvas(ref.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const w = 210;
    const h = (canvas.height * w) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save("Insurance_PreAuth.pdf");
  };

  return (
    <>
      <style>{`
        body { background:#f3f4f6; font-family: Inter, sans-serif; }

        .receipt {
          width:820px;
          margin:30px auto;
          background:#fff;
          border:1px solid #e5e7eb;
          border-radius:6px;
          overflow:hidden;
          position:relative;
        }

        .header { padding:16px 20px; border-bottom:1px solid #e5e7eb; }
        .title { font-size:20px; font-weight:700; color:#111827; }
        .subtitle { font-size:13px; color:#6b7280; }
        .tiny { font-size:11px; color:#6b7280; line-height:1.4; }

        .badge {
          border:1px solid #0ea5a4;
          color:#0ea5a4;
          font-size:11px;
          padding:3px 8px;
          border-radius:20px;
          display:inline-block;
        }

        .meta { padding:12px 20px; border-bottom:1px solid #e5e7eb; font-size:12px; }
        .meta span { display:block; color:#6b7280; font-size:11px; }

        .section { padding:16px 20px; border-bottom:1px solid #e5e7eb; }
        .section-title { font-size:11px; font-weight:600; color:#6b7280; margin-bottom:6px; }

        .name { font-size:18px; font-weight:600; margin-bottom:6px; }

        .info { font-size:13px; color:#111827; }
        .info span { color:#6b7280; }

        .qr {
          width:100px; height:100px;
          border:1px solid #e5e7eb;
          display:flex; align-items:center; justify-content:center;
          font-size:10px; color:#9ca3af;
        }

        .grid2 {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:24px;
          font-size:13px;
        }
        .grid2 span { color:#6b7280; }

        table { width:100%; border-top:1px solid #e5e7eb; }
        th {
          font-size:10px;
          text-transform:uppercase;
          color:#6b7280;
          background:#f9fafb;
          padding:8px;
        }
        td {
          font-size:13px;
          padding:10px 8px;
          border-top:1px solid #e5e7eb;
        }

        .summary {
          text-align:right;
          font-size:13px;
          margin-top:10px;
        }

        .summary strong {
          font-size:15px;
        }

        .watermark {
          position:absolute;
          top:50%;
          left:50%;
          transform:translate(-50%,-50%);
          width:220px;
          height:220px;
          background:#0ea5a4;
          border-radius:50%;
          opacity:0.05;
        }

        .docs {
          margin:16px 20px;
          border:1px solid #e5e7eb;
          border-radius:6px;
          padding:12px;
          font-size:12px;
          color:#6b7280;
        }

        .sign {
          display:flex;
          border-top:1px solid #e5e7eb;
        }

        .sign div {
          flex:1;
          text-align:center;
          padding:20px;
          font-size:13px;
          border-right:1px solid #e5e7eb;
        }

        .sign div:last-child {
          border-right:none;
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
              <div className="title">Insurance Pre-Authorisation</div>
              <div className="subtitle">Apollo Ambulance Services</div>
              <div className="tiny">
                NHC-H-2022-MH-000009 · Reg. MH-HOSP-2010-00891 · NABH Accredited
              </div>
              <div className="tiny">
                Plot 22, Andheri West, Mumbai - 400053
              </div>
            </Col>

            <Col className="text-end">
              <div className="badge">NeoHealthCard Network</div>
              <div className="tiny">Fully Automated · Ecosystem Connected</div>
              <div className="tiny">hospital@apollo.com · +91 98765 43210</div>
            </Col>
          </Row>
        </div>

        {/* META */}
        <div className="meta">
          <Row>
            <Col><span>Pre-Auth ID</span>NHC-INS-00001</Col>
            <Col><span>Date</span>10/04/2026</Col>
            <Col><span>Insurance Co.</span>Star Health</Col>
            <Col><span>Policy No.</span>SHI-2024-004</Col>
            <Col><span>Urgency</span><b style={{color:"#0ea5a4"}}>Emergency</b></Col>
          </Row>
        </div>

        {/* PATIENT */}
        <div className="section">
          <Row>
            <Col md={9}>
              <div className="section-title">PATIENT</div>
              <div className="name">Vijay Kumar</div>

              <Row className="info">
                <Col md={4}><span>Age:</span> 24 / Male</Col>
                <Col md={4}><span>Email:</span> v@gmail.com</Col>
                <Col md={4}><span>Policy:</span> SHI-004821</Col>
              </Row>

              <Row className="info mt-1">
                <Col md={4}><span>DOB:</span> 15/03/2001</Col>
                <Col md={4}><span>Address:</span> Jaipur</Col>
                <Col md={4}><span>Provider:</span> Star Health</Col>
              </Row>
            </Col>

            <Col md={3} className="text-end">
              <div className="qr">QR</div>
              <div className="tiny mt-1">Scan to verify</div>
            </Col>
          </Row>
        </div>

        {/* HOSPITAL DETAILS */}
        <div className="section">
          <div className="section-title">HOSPITALISATION DETAILS</div>

          <div className="grid2">
            <div>
              <div><span>Hospital:</span> Apollo General Hospital</div>
              <div><span>Hospital ID:</span> NHC-H-000009</div>
              <div><span>NABH:</span> Accredited</div>
              <div><span>Admission:</span> 10/04/2026</div>
              <div><span>Discharge:</span> 12/04/2026</div>
            </div>

            <div>
              <div><span>Diagnosis:</span> Viral Fever</div>
              <div><span>ICD Code:</span> A90</div>
              <div><span>Doctor:</span> Amit Mishra</div>
              <div><span>Dept:</span> Internal Medicine</div>
              <div><span>Ward:</span> General Ward</div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="section">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Estimated Cost</th>
                <th>Insurance Claimable</th>
                <th>Patient Copay</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Bed Charges</td>
                <td>₹3,000</td>
                <td>₹3,000</td>
                <td>₹0</td>
              </tr>
              <tr>
                <td>Doctor Fees</td>
                <td>₹1,000</td>
                <td>₹800</td>
                <td>₹200</td>
              </tr>
              <tr>
                <td>Nursing</td>
                <td>₹800</td>
                <td>₹800</td>
                <td>₹0</td>
              </tr>
              <tr>
                <td>Lab Tests</td>
                <td>₹500</td>
                <td>₹400</td>
                <td>₹0</td>
              </tr>
            </tbody>
          </table>

          <div className="summary">
            <div>Total Estimated Cost: ₹6,200</div>
            <div>Total Claimable: ₹5,500</div>
            <strong>Estimated: ₹700</strong>
          </div>
        </div>

        {/* DOCS */}
        <div className="docs">
          <b>Supporting Documents Attached</b>
          <ol>
            <li>Doctor certificate</li>
            <li>Admission slip</li>
            <li>Lab reports</li>
            <li>Treatment plan</li>
          </ol>
        </div>

        {/* SIGN */}
        <div className="sign">
          <div>Dr. Amit Mishra<span>Doctor</span></div>
          <div>Hospital TPA Desk<span>Hospital</span></div>
          <div>Patient<span>Guardian</span></div>
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